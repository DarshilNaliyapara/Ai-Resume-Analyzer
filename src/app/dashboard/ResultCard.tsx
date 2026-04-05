export type Result = { fit_score: number; matched_skills: string[]; missing_skills: string[]; suggestions: string[]; summary: string }

export default function ResultCard({ result }: { result: Result }) {
    const scoreCls = result.fit_score >= 80 ? 'text-score-green' : result.fit_score >= 60 ? 'text-score-yellow' : 'text-score-red'
    const bgCls = result.fit_score >= 80 ? 'bg-score-green-bg' : result.fit_score >= 60 ? 'bg-score-yellow-bg' : 'bg-score-red-bg'

    return (
        <div className="animate-fade-up border border-border rounded-md overflow-hidden mb-8 md:mb-10">

            {/* Score header */}
            <div className={`flex items-start gap-4 md:gap-5 px-5 md:px-8 py-5 md:py-6 ${bgCls} border-b border-border`}>
                <div className={`animate-score font-display font-extrabold ${scoreCls} shrink-0`}
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}>
                    {result.fit_score}
                </div>
                <div>
                    <p className={`font-mono text-xs tracking-widest mb-2 ${scoreCls}`}>FIT SCORE / 100</p>
                    <p className="font-mono text-xs text-muted leading-relaxed">{result.summary}</p>
                </div>
            </div>

            {/* Skills — stacks on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-border"
                style={{ gap: '1px', background: 'var(--color-border)' }}>
                <div className="bg-bg px-5 md:px-6 py-5">
                    <p className="font-mono text-sm text-score-green tracking-widest mb-4">MATCHED SKILLS</p>
                    <div className="flex flex-wrap gap-2">
                        {result.matched_skills.map((s, i) => (
                            <span key={i} className="animate-fade-in font-mono text-xs px-3 py-1 bg-score-green-bg text-score-green rounded-sm border border-score-green/15"
                                style={{ animationDelay: `${i * 0.05}s` }}>
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="bg-bg px-5 md:px-6 py-5">
                    <p className="font-mono text-sm text-score-red tracking-widest mb-4">MISSING SKILLS</p>
                    <div className="flex flex-wrap gap-2">
                        {result.missing_skills.map((s, i) => (
                            <span key={i} className="animate-fade-in font-mono text-xs px-3 py-1 bg-score-red-bg text-score-red rounded-sm border border-score-red/15"
                                style={{ animationDelay: `${i * 0.05}s` }}>
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Suggestions */}
            <div className="bg-bg px-5 md:px-6 py-5">
                <p className="font-mono text-sm text-muted tracking-widest mb-4">SUGGESTIONS</p>
                <div className="flex flex-col gap-4">
                    {result.suggestions.map((s, i) => (
                        <div key={i} className="animate-fade-up flex gap-4 items-start"
                            style={{ animationDelay: `${i * 0.08}s` }}>
                            <span className="font-mono text-sm pt-0.5 w-6 shrink-0">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="font-mono text-sm leading-relaxed">{s}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
