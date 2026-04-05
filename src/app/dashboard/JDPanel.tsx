import { useJDPanel } from "@/hooks/useJDPanel";
type Props = ReturnType<typeof useJDPanel>

export default function JDPanel(props: Props) {
    return (
        <div className="bg-bg p-4 md:p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-muted tracking-widest">JOB DESCRIPTION</span>
                {props.jobDescription && (
                    <span className="font-mono text-sm text-muted">{props.jobDescription.length} chars</span>
                )}
            </div>

            <div className="flex border border-border rounded overflow-hidden">
                {(['paste', 'url', 'title'] as const).map((mode, i) => (
                    <button key={mode}
                        onClick={() => { props.setJdMode(mode); props.setJdMessage(''); props.setJdSearchUrl('') }}
                        className={`flex-1 py-2.5 font-mono text-sm font-medium transition-all ${i > 0 ? 'border-l border-border' : ''
                            } ${props.jdMode === mode ? 'bg-white text-bg' : 'bg-transparent text-muted hover:text-white'}`}>
                        {mode === 'paste' ? '↓ paste' : mode === 'url' ? '⌁ url' : '⊙ title'}
                    </button>
                ))}
            </div>

            {(props.jdMode === 'url' || props.jdMode === 'title') && (
                <div className="animate-slide-in flex gap-2">
                    <input
                        type={props.jdMode === 'url' ? 'url' : 'text'}
                        placeholder={props.jdMode === 'url' ? 'https://...' : 'e.g. Django Backend Developer'}
                        value={props.jdMode === 'url' ? props.jdUrl : props.jdTitle}
                        onChange={e => props.jdMode === 'url' ? props.setJdUrl(e.target.value) : props.setJdTitle(e.target.value)}
                        className="flex-1 px-3 py-2.5 bg-surface border border-border rounded text-white placeholder-muted outline-none focus:border-border-hover transition-colors"
                    />
                    <button onClick={props.handleScrapeJD}
                        disabled={props.jdLoading || (props.jdMode === 'url' ? !props.jdUrl : !props.jdTitle)}
                        className="px-4 py-2.5 bg-white text-bg rounded font-mono text-sm font-medium hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed transition-all whitespace-nowrap">
                        {props.jdLoading ? '...' : props.jdMode === 'url' ? 'fetch' : 'search'}
                    </button>
                </div>
            )}

            {props.jdMessage && (
                <div className="animate-slide-in px-3 py-2.5 bg-surface border border-border rounded">
                    <p className="font-mono text-sm text-muted">{props.jdMessage}</p>
                    {props.jdSearchUrl && (
                        <a href={props.jdSearchUrl} target="_blank" rel="noreferrer"
                            className="font-mono text-sm text-white hover:opacity-70 mt-1 block transition-opacity">
                            open search →
                        </a>
                    )}
                </div>
            )}

            <textarea
                placeholder="paste job description here..."
                value={props.jobDescription}
                onChange={e => props.setJobDescription(e.target.value)}
                rows={14}
                className="w-full px-4 py-3 bg-surface border border-border rounded text-white placeholder-muted outline-none focus:border-border-hover transition-colors resize-y leading-relaxed flex-1"
            />
        </div>
    )
}
