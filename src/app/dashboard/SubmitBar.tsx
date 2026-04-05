type Prop = {
    error: string
    isAnalyzing: boolean
    handleSubmit: () => void
}
export default function SubmitBar({ error, isAnalyzing, handleSubmit }: Prop) {
    return (
        <div className="animate-fade-up delay-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 md:px-6 py-4 bg-surface border border-border border-t-0 rounded-b-md mb-8 md:mb-10">
            <div className="min-h-5 flex items-center">
                {error && (
                    <span className="animate-slide-in font-mono text-sm text-score-red">✕ {error}</span>
                )}
                {isAnalyzing && !error && (
                    <div className="flex items-center gap-2">
                        <div className="animate-pulse-dot w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                        <span className="font-mono text-sm text-muted">
                            analyzing — result will be emailed to you
                        </span>
                    </div>
                )}
            </div>
            <button onClick={handleSubmit} disabled={isAnalyzing}
                className={`w-full sm:w-auto font-mono text-sm font-medium px-6 py-2.5 rounded transition-all ${isAnalyzing || error
                    ? 'bg-surface2 text-muted border border-border cursor-not-allowed'
                    : 'bg-white text-bg hover:opacity-80'
                    }`}>
                {isAnalyzing ? 'analyzing...' : 'analyze resume →'}
            </button>
        </div>
    )
}
