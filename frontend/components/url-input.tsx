'use client';

interface UrlInputProps {
  url: string
  onUrlChange: (url: string) => void
  onGenerate: () => void
  isLoading: boolean
}

export default function UrlInput({
  url,
  onUrlChange,
  onGenerate,
  isLoading,
}: UrlInputProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Paste a YouTube lecture link here…"
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                onGenerate()
              }
            }}
            className="flex-1 px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={onGenerate}
            disabled={isLoading || !url.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Supports English, Hindi, and mixed-language videos
        </p>
      </div>
    </div>
  )
}
