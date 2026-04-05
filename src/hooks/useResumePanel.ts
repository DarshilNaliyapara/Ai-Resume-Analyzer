// src/hooks/useResumePanel.ts
import { useRef, useState } from "react"
import { extractTextFromPDF } from '@/lib/pdf'

export function useResumePanel() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const replaceRef = useRef<HTMLInputElement>(null)
    const [resumeText, setResumeText] = useState('')
    const [resumeFileName, setResumeFileName] = useState('')
    const [resumePageCount, setResumePageCount] = useState(0)
    const [pdfLoading, setPdfLoading] = useState(false)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [error, setError] = useState('')

    const processPDF = async (file: File) => {
        if (file.type !== 'application/pdf') { setError('Only PDF supported.'); return }
        setPdfLoading(true); setError('')
        if (pdfUrl) URL.revokeObjectURL(pdfUrl)
        try {
            const text = await extractTextFromPDF(file)
            if (text.length < 100) { setError('Could not extract text. Try another PDF.'); return }
            const url = URL.createObjectURL(file)
            setPdfUrl(url)
            setResumeText(text)
            setResumeFileName(file.name)
            setResumePageCount(Math.max(1, Math.round(text.length / 3000)))
        } catch { setError('Failed to read PDF.') }
        finally { setPdfLoading(false) }
    }
    const handlePDFUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) processPDF(f) }
    const handleRemovePDF = () => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl)
        setPdfUrl(null); setResumeText(''); setResumeFileName(''); setResumePageCount(0)
        if (fileInputRef.current) fileInputRef.current.value = ''
        if (replaceRef.current) replaceRef.current.value = ''
    }

    return {
        fileInputRef, replaceRef,
        resumeText, resumeFileName, resumePageCount,
        pdfLoading, pdfUrl,
        handlePDFUpload, handleRemovePDF,
    }
}
