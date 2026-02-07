export default function Header() {
  return (
    <header className="border-b border-border bg-gradient-to-r from-background via-background to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-2 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-11 h-11 rounded-2xl bg-background/80 ring-2 ring-purple-400/60 shadow-[0_0_24px_rgba(124,58,237,0.45)] flex items-center justify-center">
              <span className="text-lg font-bold text-foreground">S</span>
            </div>
          </div>
          <div className="leading-none">
            <h1 className="text-4xl font-bold text-balance">Study.Sync</h1>
            <p className="text-xs tracking-[0.12em] text-muted-foreground mt-2">
              Watch less, understand more - with AI.
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-lg mt-2">
          Synthesize knowledge from YouTube with AI
        </p>
      </div>
    </header>
  )
}
