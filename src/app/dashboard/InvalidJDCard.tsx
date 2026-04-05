export default function InvalidJDCard({ onDismiss }: { onDismiss: () => void }) {
    return (
        <div className="animate-fade-up border border-score-yellow/30 rounded-md overflow-hidden mb-8 md:mb-10">

            {/* Header */}
            <div className="flex items-start gap-4 px-5 md:px-8 py-5 md:py-6 bg-score-yellow-bg border-b border-border">
                <div className="font-display font-extrabold text-score-yellow shrink-0"
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}>
                    !
                </div>
                <div>
                    <p className="font-mono text-sm text-score-yellow tracking-widest mb-2">
                        INVALID JOB DESCRIPTION
                    </p>
                    <p className="font-mono text-sm text-muted leading-relaxed">
                        What you entered doesn't look like a job description. The analyzer needs an actual job posting to compare your resume against.
                    </p>
                </div>
            </div>

            {/* What went wrong */}
            <div className="bg-bg px-5 md:px-6 py-5 border-b border-border">
                <p className="font-mono text-sm tracking-widest mb-4">POSSIBLE REASONS</p>
                <div className="flex flex-col gap-3">
                    {[
                        'You pasted a URL instead of the actual job description text',
                        'The text is too short — a valid JD is usually 100+ words',
                        'You entered a job title only instead of the full description',
                        'The content is unrelated to a job posting',
                    ].map((reason, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <span className="font-mono text-sm text-muted pt-0.5 w-5 shrink-0">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="font-mono text-sm text-muted leading-relaxed">{reason}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* What to do */}
            <div className="bg-bg px-5 md:px-6 py-5 border-b border-border">
                <p className="font-mono text-sm tracking-widest mb-4">HOW TO FIX IT</p>
                <div className="flex flex-col gap-3">
                    {[
                        'Go to the job posting and copy the full description text',
                        'Use the ⌁ URL mode to automatically extract text from a job listing page',
                        'Make sure the description includes role responsibilities and requirements',
                    ].map((tip, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <span className="font-mono text-sm text-score-yellow pt-0.5 w-5 shrink-0">→</span>
                            <p className="font-mono text-sm text-muted leading-relaxed">{tip}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action */}
            <div className="bg-bg px-5 md:px-6 py-4 flex items-center justify-between">
                <p className="font-mono text-sm text-muted">
                    This analysis did not consume a credit from your plan.
                </p>
                <button
                    onClick={onDismiss}
                    className="font-mono text-sm bg-white text-bg px-4 py-2 rounded hover:opacity-80 transition-opacity shrink-0 ml-4"
                >
                    try again →
                </button>
            </div>
        </div>
    )
}
