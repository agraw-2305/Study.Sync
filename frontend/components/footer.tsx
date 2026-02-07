export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-slate-800 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 py-3 px-2">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="text-left md:text-left">
          <p className="text-xs text-slate-200 font-medium">
            © {currentYear} Study.Sync &mdash; <span className="text-blue-300 font-bold">AI</span> Intelligence for the next generation of learners.
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-blue-200">Made with</span>
          <span className="animate-pulse text-pink-400 text-base">❤️</span>
          <span className="text-blue-200">for learners</span>
        </div>
      </div>
    </footer>
  )
}
