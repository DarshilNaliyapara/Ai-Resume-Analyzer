type Job = { id: number; status: string; created_at: string; result: Result | null; error_message: string }
type JobsPage = { results: Job[]; next: string | null; previous: string | null }
type Result = { fit_score: number; matched_skills: string[]; missing_skills: string[]; suggestions: string[]; summary: string }

type Props = {
    jobsPage: JobsPage
    pageStack: string[]
    handlePrevPage: () => void
    handleNextPage: () => void
    setActiveJob: (job: Job) => void
    activeJob: Job | null
}

export type { Job, JobsPage }

export default function HistoryList({
    jobsPage,
    pageStack,
    handlePrevPage,
    handleNextPage,
    setActiveJob,
    activeJob,
}: Props) {
    const currentPage = pageStack.length + 1

    return (
        <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm text-muted tracking-widest">HISTORY</span>
                <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex flex-col border border-border rounded-md overflow-hidden"
                style={{ gap: '1px', background: 'var(--color-border)' }}>
                {jobsPage.results.map(job => (
                    <div key={job.id}
                        onClick={() => job.result && setActiveJob(job)}
                        className={`bg-bg flex justify-between items-center px-4 md:px-5 py-4 transition-colors ${activeJob?.id === job.id ? 'bg-surface2' : ''
                            } ${job.result ? 'cursor-pointer hover:bg-surface' : ''}`}
                    >
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                            <span className="font-mono text-sm text-muted w-16 md:w-20 shrink-0">
                                {new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                            <span className={`font-mono text-sm px-2 py-0.5 rounded-sm shrink-0 ${job.status === 'done' ? 'bg-score-green-bg text-score-green' :
                                job.status === 'failed' ? 'bg-score-red-bg text-score-red' :
                                    'bg-score-yellow-bg text-score-yellow'
                                }`}>
                                {job.status}
                            </span>
                            {job.status === 'failed' && job.error_message && (
                                <span className="font-mono text-sm text-score-yellow hidden md:inline truncate max-w-xs">
                                    {job.error_message === 'invalid_jd' ? 'invalid job description' : job.error_message}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 shrink-0">
                            {job.result && (
                                <span className={`font-display font-bold text-lg ${job.result.fit_score >= 80 ? 'text-score-green' :
                                    job.result.fit_score >= 60 ? 'text-score-yellow' : 'text-score-red'
                                    }`}>
                                    {job.result.fit_score}
                                </span>
                            )}
                            {job.result && activeJob?.id !== job.id && (
                                <span className="hidden sm:inline font-mono text-sm text-muted">view →</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {(jobsPage.next || pageStack.length > 0) && (
                <div className="flex items-center justify-between mt-3">
                    <span className="font-mono text-sm text-muted">
                        page {currentPage}
                    </span>
                    <div className="flex gap-2">
                        <button onClick={handlePrevPage} disabled={pageStack.length === 0}
                            className="font-mono text-sm text-muted border border-border px-3 py-1.5 rounded-sm hover:border-border-hover hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            ← prev
                        </button>
                        <button onClick={handleNextPage} disabled={!jobsPage.next}
                            className="font-mono text-sm text-muted border border-border px-3 py-1.5 rounded-sm hover:border-border-hover hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
