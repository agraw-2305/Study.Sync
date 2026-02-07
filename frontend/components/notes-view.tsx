interface NotesViewProps {
  notes: string
}

export default function NotesView({ notes }: NotesViewProps) {
  const formatNotes = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        const trimmed = line.trim()

        // Headings (lines with # prefix)
        if (trimmed.startsWith('###')) {
          return (
            <h4
              key={index}
              className="text-lg font-bold text-pink-300 mt-6 mb-3 text-balance animate-fade-in border-l-4 border-pink-400/50 pl-4"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {trimmed.replace(/^#+\s*/, '')}
            </h4>
          )
        }
        if (trimmed.startsWith('##')) {
          return (
            <h3
              key={index}
              className="text-2xl font-bold text-purple-300 mt-8 mb-4 text-balance animate-fade-in border-l-4 border-purple-400/50 pl-4"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {trimmed.replace(/^#+\s*/, '')}
            </h3>
          )
        }
        if (trimmed.startsWith('#')) {
          return (
            <h2
              key={index}
              className="text-3xl font-bold text-white mt-10 mb-5 text-balance animate-fade-in border-l-4 border-purple-500/70 pl-4"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              {trimmed.replace(/^#+\s*/, '')}
            </h2>
          )
        }

        // Bullet points
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          return (
            <li key={index} className="ml-6 text-slate-200 leading-relaxed mb-3 list-disc animate-fade-in hover:text-purple-200 transition-colors duration-300" style={{ animationDelay: `${index * 0.03}s` }}>
              {trimmed.replace(/^[-*]\s*/, '')}
            </li>
          )
        }

        // Empty lines
        if (trimmed === '') {
          return <div key={index} className="h-3" />
        }

        // Regular paragraphs
        return (
          <p key={index} className="text-slate-300 leading-relaxed text-balance mb-4 text-sm animate-fade-in" style={{ animationDelay: `${index * 0.03}s` }}>
            {trimmed}
          </p>
        )
      })
  }

  return (
    <div className="space-y-4 h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-6 custom-scrollbar">
        <div className="prose prose-invert max-w-none space-y-6">
          {formatNotes(notes)}
        </div>
        {!notes && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No notes available</p>
          </div>
        )}
      </div>
    </div>
  )
}
