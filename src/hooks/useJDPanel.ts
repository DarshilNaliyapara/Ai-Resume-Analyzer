import { useState } from 'react'

export type JDMode = 'paste' | 'url' | 'title'

export function useJDPanel() {
    const [jobDescription, setJobDescription] = useState('')
    const [jdMode, setJdMode] = useState<JDMode>('paste')
    const [jdUrl, setJdUrl] = useState('')
    const [jdTitle, setJdTitle] = useState('')
    const [jdMessage, setJdMessage] = useState('')
    const [jdSearchUrl, setJdSearchUrl] = useState('')
    const [jdLoading, setJdLoading] = useState(false)

    const handleScrapeJD = async () => {
        setJdLoading(true); setJdMessage(''); setJdSearchUrl('')
        try {
            const res = await fetch('/api/scrape-job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jdMode === 'url' ? { url: jdUrl } : { title: jdTitle }),
            })
            const data = await res.json()
            if (data.blocked) { setJdMessage(data.message); setJdMode('paste') }
            else if (data.error) { setJdMessage(data.error) }
            else if (data.text) { setJobDescription(data.text); setJdMessage('Extracted successfully.') }
            else if (data.searchUrl) { setJdSearchUrl(data.searchUrl); setJdMessage(data.message) }
        } catch { setJdMessage('Failed. Please paste manually.'); setJdMode('paste') }
        finally { setJdLoading(false) }
    }

    return {
        jobDescription, setJobDescription,
        jdMode, setJdMode,
        jdUrl, setJdUrl,
        jdTitle, setJdTitle,
        jdMessage, setJdMessage,
        jdSearchUrl, setJdSearchUrl,
        jdLoading,
        handleScrapeJD,
    }
}
