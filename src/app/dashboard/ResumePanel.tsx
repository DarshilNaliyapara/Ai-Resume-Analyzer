import { useResumePanel } from "@/hooks/useResumePanel"

type Props = ReturnType<typeof useResumePanel>

export default function ResumePanel(prop: Props) {
    return (
        <div className="bg-bg p-4 md:p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-border">
            <span className="font-mono text-sm text-muted tracking-widest">RESUME</span>

            {!prop.resumeFileName ? (
                <div
                    onClick={() => prop.fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-border hover:border-border-hover rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-64 md:min-h-96 group"
                >
                    <input ref={prop.fileInputRef} type="file" accept=".pdf" onChange={prop.handlePDFUpload} className="hidden" />
                    {prop.pdfLoading ? (
                        <>
                            <div className="animate-spin-sm w-6 h-6 border border-border border-t-white rounded-full" />
                            <p className="font-mono text-sm text-muted">extracting text...</p>
                        </>
                    ) : (
                        <>
                            <div className="w-14 h-16 border border-border rounded-sm flex flex-col items-center justify-center gap-1 group-hover:border-border-hover transition-colors">
                                <span className="font-mono text-sm text-muted">PDF</span>
                                <div className="w-5 h-px bg-border" />
                                <div className="w-5 h-px bg-border" />
                                <div className="w-3 h-px bg-border" />
                            </div>
                            <div className="text-center">
                                <p className="font-mono text-sm text-white">upload resume</p>
                                <p className="font-mono text-sm text-muted mt-1">PDF only · click to browse</p>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-4 px-4 py-3 bg-surface border border-border rounded">
                        <div className="w-10 h-12 bg-surface2 border border-border rounded-sm flex flex-col items-center justify-center gap-0.5 shrink-0">
                            <span className="font-mono text-muted" style={{ fontSize: '0.6rem' }}>PDF</span>
                            <div className="w-5 h-px bg-border" />
                            <div className="w-5 h-px bg-border" />
                            <div className="w-3 h-px bg-border" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-mono text-sm text-white truncate">{prop.resumeFileName}</p>
                            <p className="font-mono text-sm text-muted mt-0.5">
                                ~{prop.resumePageCount} page{prop.resumePageCount !== 1 ? 's' : ''} · {(prop.resumeText.length / 1000).toFixed(1)}k chars extracted
                            </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-score-green shrink-0 animate-pulse-dot" />
                    </div>

                    {prop.pdfUrl && (
                        <div className="flex-1 border border-border rounded overflow-hidden bg-[#1a1a1a]" style={{ minHeight: '420px' }}>
                            <div className="relative w-full h-full overflow-hidden" style={{ marginTop: '-34px', height: 'calc(100% + 36px)' }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`${prop.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                    className="w-full h-full border-none"
                                    title="Resume preview"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={() => prop.replaceRef.current?.click()}
                            className="flex-1 font-mono text-sm text-muted border border-border px-3 py-2 rounded hover:border-border-hover hover:text-white transition-all text-center cursor-pointer"
                        >
                            replace pdf
                        </button>
                        <button
                            onClick={prop.handleRemovePDF}
                            className="flex-1 font-mono text-sm text-muted border border-border px-3 py-2 rounded hover:border-border-hover hover:text-score-red transition-all text-center cursor-pointer"
                        >
                            remove
                        </button>
                        <input ref={prop.replaceRef} type="file" accept=".pdf" onChange={prop.handlePDFUpload} className="hidden" />
                    </div>
                </div>
            )}
        </div>
    )
}
