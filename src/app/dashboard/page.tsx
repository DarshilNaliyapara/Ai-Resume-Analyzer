'use client'
import { getAccessToken } from '@/lib/api'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/api'
import InvalidJDCard from './InvalidJDCard'
import ResultCard from './ResultCard'
import HistoryList, { type Job, type JobsPage } from './HistoryList'
import ResumePanel from './ResumePanel'
import JDPanel from './JDPanel'
import { useJDPanel } from '@/hooks/useJDPanel'
import { useResumePanel } from '@/hooks/useResumePanel'
import SubmitBar from './SubmitBar'
import Navbar from './Navbar'
import { Plan } from './Navbar'

function DashboardInner() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [checking, setChecking] = useState(() => {
        if (typeof window !== 'undefined' && !getAccessToken()) {
            return false
        }
        return true
    })

    const jd = useJDPanel()
    const resume = useResumePanel()

    const [user, setUser] = useState<{ display_name: string } | null>(null)
    const [plan, setPlan] = useState<Plan | null>(null)

    const [jobsPage, setJobsPage] = useState<JobsPage>({ results: [], next: null, previous: null })
    const [pageStack, setPageStack] = useState<string[]>([])
    const [currentCursor, setCurrentCursor] = useState<string | null>(null)

    const [submitting, setSubmitting] = useState(false)
    const [pollingId, setPollingId] = useState<number | null>(null)
    const [activeJob, setActiveJob] = useState<Job | null>(null)
    const [error, setError] = useState('')

    const fetchJobs = useCallback(async (cursor: string | null = null) => {
        const url = cursor ? `/jobs/?cursor=${cursor}` : '/jobs/'
        const res = await api.get(url)
        setJobsPage(res.data)
    }, [])

    const fetchData = useCallback(async () => {
        try {
            const [u, p] = await Promise.all([
                api.get('/auth/me/'),
                api.get('/auth/plan/'),
            ])
            setUser(u.data)
            setPlan(p.data)
            await fetchJobs(null)
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                router.push('/login')
            }
        } finally {
            setChecking(false)
        }
    }, [router, fetchJobs])

    useEffect(() => {
        if (!getAccessToken()) {
            router.replace('/login')
            return
        }
        fetchData()
    }, [router, fetchData])

    useEffect(() => {
        const jobId = searchParams.get('job')
        if (!jobId || jobsPage.results.length === 0) return
        const job = jobsPage.results.find(j => j.id === parseInt(jobId))
        if (job?.result) setActiveJob(job)
    }, [jobsPage.results, searchParams])

    useEffect(() => {
        if (!pollingId) return
        const iv = setInterval(async () => {
            const res = await api.get(`/jobs/${pollingId}/`)
            if (res.data.status === 'done' || res.data.status === 'failed') {
                setActiveJob(res.data)
                setPollingId(null)
                setCurrentCursor(null)
                setPageStack([])

                if (res.data.error_message === 'invalid_jd') {
                    await fetchJobs(null)
                } else {
                    const [planRes] = await Promise.all([
                        api.get('/auth/plan/'),
                        fetchJobs(null),
                    ])
                    setPlan(planRes.data)
                }
                clearInterval(iv)
            }
        }, 2000)
        return () => clearInterval(iv)
    }, [pollingId, fetchJobs])

    const handleSubmit = async () => {
        if (!resume.resumeText) { setError('Please upload your resume PDF.'); return }
        if (!jd.jobDescription.trim()) { setError('Job description is required.'); return }
        setError(''); setSubmitting(true); setActiveJob(null)
        try {
            const res = await api.post('/analyze/', {
                resume_text: resume.resumeText,
                job_description: jd.jobDescription,
            })
            setPollingId(res.data.job_id)
            const planRes = await api.get('/auth/plan/')
            setPlan(planRes.data)
        } catch (err: any) {
            setError(err.response?.status === 403
                ? 'Free plan limit reached. Upgrade to Pro.'
                : err.response?.data?.error || 'Something went wrong.')
        } finally { setSubmitting(false) }
    }

    const handleNextPage = async () => {
        if (!jobsPage.next) return
        const cursor = new URL(jobsPage.next).searchParams.get('cursor')!
        setPageStack(prev => [...prev, currentCursor ?? ''])
        setCurrentCursor(cursor)
        await fetchJobs(cursor)
    }

    const handlePrevPage = async () => {
        const stack = [...pageStack]
        const prev = stack.pop() || null
        setPageStack(stack)
        setCurrentCursor(prev)
        await fetchJobs(prev)
    }

    const isAnalyzing = submitting || !!pollingId

    if (!getAccessToken() && !checking) return null

    if (checking) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-bg">
                <div className="animate-fade-up text-center">
                    <div className="animate-spin-sm w-6 h-6 border border-border border-t-white rounded-full mx-auto mb-5" />
                    <p className="font-display font-bold text-white text-lg tracking-tight mb-1">
                        Checking authorization
                    </p>
                    <p className="font-mono text-sm text-muted">verifying your session...</p>
                </div>
            </main>
        )
    }

    return (
        <div className="min-h-screen bg-bg text-text">
            <Navbar plan={plan} user={user} fetchData={fetchData} />
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
                <div className="animate-fade-up grid grid-cols-1 md:grid-cols-2 border border-border rounded-md overflow-hidden mb-px">
                    <ResumePanel
                        {...resume}
                    />
                    <JDPanel
                        {...jd}
                    />
                </div>

                <SubmitBar error={error} isAnalyzing={isAnalyzing} handleSubmit={handleSubmit} />

                {activeJob && (
                    activeJob.status === 'failed' && activeJob.error_message === 'invalid_jd'
                        ? <InvalidJDCard onDismiss={() => setActiveJob(null)} />
                        : activeJob.result
                            ? <ResultCard result={activeJob.result} />
                            : null
                )}

                {(jobsPage.results.length > 0 || pageStack.length > 0) && (
                    <HistoryList
                        jobsPage={jobsPage}
                        pageStack={pageStack}
                        handlePrevPage={handlePrevPage}
                        handleNextPage={handleNextPage}
                        setActiveJob={setActiveJob}
                        activeJob={activeJob}
                    />
                )}
            </div>
        </div>
    )
}

export default function Dashboard() {
    return <Suspense><DashboardInner /></Suspense>
}
