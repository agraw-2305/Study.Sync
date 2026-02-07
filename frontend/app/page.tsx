'use client'

import type { CSSProperties } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Tabs from '@/components/tabs'
import NotesView from '@/components/notes-view'
import FlashcardsView from '@/components/flashcards-view'
import QuizView from '@/components/quiz-view'
import Loader from '@/components/loader'
import ErrorAlert from '@/components/error-alert'
// import Footer from '@/components/footer'

interface FlashCard {
  question: string
  answer: string
}

interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: string
}

export default function App() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [activeTab, setActiveTab] = useState('notes')
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const [flashcards, setFlashcards] = useState<FlashCard[]>([])
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [error, setError] = useState('')
  const [contentGenerated, setContentGenerated] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [flashcardsCount, setFlashcardsCount] = useState(10)
  const [quizCount, setQuizCount] = useState(5)
  const [transcriptText, setTranscriptText] = useState('')

  const handleStartNow = () => {
    setContentGenerated(false)
    setUrl('')
    setTranscriptText('')
    setNotes('')
    setFlashcards([])
    setQuiz([])
    setError('')
    setActiveTab('notes')
    setIsFullscreen(false)
    router.replace('/')
    router.refresh()
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim() && !transcriptText.trim()) {
      setError('Please enter a YouTube URL or paste/upload a transcript')
      return
    }

    setLoading(true)
    setError('')

    try {
      const [notesRes, flashcardsRes, quizRes] = await Promise.all([
        fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url.trim() || undefined, transcript: transcriptText.trim() || undefined }),
        }),
        fetch('/api/flashcards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url.trim() || undefined, transcript: transcriptText.trim() || undefined, count: flashcardsCount }),
        }),
        fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url.trim() || undefined, transcript: transcriptText.trim() || undefined, count: quizCount }),
        }),
      ])

      if (!notesRes.ok) {
        const errorData = await notesRes.json()
        throw new Error(errorData.detail || 'Failed to generate notes')
      }
      if (!flashcardsRes.ok) {
        const errorData = await flashcardsRes.json()
        throw new Error(errorData.detail || 'Failed to generate flashcards')
      }
      if (!quizRes.ok) {
        const errorData = await quizRes.json()
        throw new Error(errorData.detail || 'Failed to generate quiz')
      }

      const notesData = await notesRes.json()
      const flashcardsData = await flashcardsRes.json()
      const quizData = await quizRes.json()

      setNotes(notesData.notes || '')
      setFlashcards(flashcardsData.flashcards || [])
      setQuiz(quizData.quiz || [])
      setContentGenerated(true)
      setActiveTab('notes')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (contentGenerated) {
    if (isFullscreen) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-glow"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-glow" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Fullscreen Header */}
          <header className="relative z-20 px-2 sm:px-4 lg:px-6 py-6 border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-11 h-11 rounded-2xl bg-slate-950/80 ring-2 ring-purple-400/60 shadow-[0_0_24px_rgba(124,58,237,0.5)] flex items-center justify-center">
                    <span className="text-lg font-bold text-white">S</span>
                  </div>
                </div>
                <div className="leading-none">
                  <span className="text-white font-bold text-xl tracking-tight">Study.Sync</span>
                  <span className="block text-[10px] tracking-[0.12em] text-purple-200/70 mt-2">Watch less, understand more - with AI.</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all duration-300"
                >
                  Exit Fullscreen
                </button>
              </div>
                {/* <Footer /> */}
            </div>
          </header>

          {/* Fullscreen Content */}
          <main className="relative z-10 h-[calc(100vh-80px)] flex px-8 py-8">
            <div className="w-full flex flex-col bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 overflow-hidden relative">
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06] bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: "url('/85.jpg')" }}
              />
              <div className="flex-1 overflow-hidden">
                {activeTab === 'notes' && <NotesView notes={notes} />}
                {activeTab === 'flashcards' && <FlashcardsView flashcards={flashcards} />}
                {activeTab === 'quiz' && <QuizView quiz={quiz} />}
              </div>
            </div>
          </main>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-glow"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-glow" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <header className="relative z-20 px-8 py-6 border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-11 h-11 rounded-2xl bg-slate-950/80 ring-2 ring-purple-400/60 shadow-[0_0_24px_rgba(124,58,237,0.5)] flex items-center justify-center">
                  <span className="text-lg font-bold text-white">S</span>
                </div>
              </div>
              <div className="leading-none">
                <span className="text-white font-bold text-xl tracking-tight">Study.Sync</span>
                <span className="block text-[10px] tracking-[0.12em] text-purple-200/70 mt-2">Watch less, understand more - with AI.</span>
              </div>
            </div>
            <button
              onClick={handleStartNow}
              className="px-7 py-2.5 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
            >
              Start now
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 h-[calc(100vh-80px)] flex px-8 py-8">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch relative">
            <div
              className="absolute inset-y-0 left-0 w-1/2 pointer-events-none opacity-[0.14] bg-left bg-no-repeat bg-contain"
              style={{ backgroundImage: "url('/85.jpg')" }}
            />
            {/* Left side - Tabs and Navigation */}
            <div className="flex flex-col space-y-6">
              <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* Right side - Content Display Card */}
            <div className="flex flex-col bg-gradient-to-br from-purple-600/20 to-purple-700/10 backdrop-blur-sm border border-purple-500/40 rounded-3xl p-8 overflow-hidden hover:border-purple-500/60 transition-all duration-500 shadow-2xl shadow-purple-500/10 relative">
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06] bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: "url('/85.jpg')" }}
              />
              {/* Content header */}
              <div className="mb-6 pb-4 border-b border-purple-500/30 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white capitalize">
                    {activeTab === 'notes' && 'Study Notes'}
                    {activeTab === 'flashcards' && 'Interactive Flashcards'}
                    {activeTab === 'quiz' && 'Practice Quiz'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {activeTab === 'notes' && 'Comprehensive notes extracted from the video'}
                    {activeTab === 'flashcards' && 'Click cards to reveal answers'}
                    {activeTab === 'quiz' && 'Test your understanding'}
                  </p>
                </div>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="px-3 py-2 text-xs bg-purple-500/20 border border-purple-500/40 text-purple-300 font-semibold rounded-lg hover:bg-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
                  title="View in fullscreen"
                >
                  ⛶ Fullscreen
                </button>
              </div>

              {/* Content area with full scrolling */}
              <div className="flex-1 overflow-hidden">
                {activeTab === 'notes' && <NotesView notes={notes} />}
                {activeTab === 'flashcards' && <FlashcardsView flashcards={flashcards} />}
                {activeTab === 'quiz' && <QuizView quiz={quiz} />}
              </div>

              {/* Footer actions */}
              <div className="mt-6 pt-4 border-t border-purple-500/30 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  {activeTab === 'notes' && `${notes.split('\n').length} sections`}
                  {activeTab === 'flashcards' && `${flashcards.length} cards total`}
                  {activeTab === 'quiz' && `${quiz.length} questions`}
                </p>
                <button
                  onClick={() => {
                    setContentGenerated(false)
                    setUrl('')
                    setNotes('')
                    setFlashcards([])
                    setQuiz([])
                    setError('')
                  }}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all duration-300"
                >
                  Generate New Content
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Background animation layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 -left-96 w-full h-full bg-purple-600/10 rounded-full blur-3xl animate-glow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-glow" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating particles */}
        {[
          { left: 10, delay: 0 },
          { left: 20, delay: 1 },
          { left: 30, delay: 2 },
          { left: 40, delay: 3 },
          { left: 60, delay: 1.5 },
          { left: 70, delay: 0.5 },
          { left: 80, delay: 2.5 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/60 rounded-full animate-particle"
            style={{
              left: `${p.left}%`,
              top: '-5%',
              animationDelay: `${p.delay}s`,
              animationDuration: '25s',
            } as CSSProperties}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-20 px-8 py-6 border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 rounded-2xl bg-slate-950/80 ring-2 ring-purple-400/60 shadow-[0_0_24px_rgba(124,58,237,0.5)] flex items-center justify-center">
                <span className="text-lg font-bold text-white">S</span>
              </div>
            </div>
            <div className="leading-none">
              <span className="text-white font-bold text-xl tracking-tight">Study.Sync</span>
              <span className="block text-[10px] tracking-[0.12em] text-purple-200/70 mt-2">Watch less, understand more - with AI.</span>
            </div>
          </div>
          <button
            onClick={handleStartNow}
            className="px-7 py-2.5 bg-white text-slate-900 font-semibold rounded-full hover:bg-slate-100 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
          >
            Start now
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <main className="relative z-10 min-h-[calc(100vh-80px)] flex px-8 py-16">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Hero */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <p className="text-purple-400 text-sm font-medium tracking-widest uppercase">AI-Powered Learning</p>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Master Content,
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">Not Videos</span>
              </h1>
              <p className="text-lg text-slate-200 leading-relaxed font-medium">
                Transform YouTube lectures into structured notes, flashcards, and quizzes instantly.
              </p>
              <p className="text-base text-slate-400 leading-relaxed">
                Let AI do the studying for you, extract key concepts and create effective study materials.
              </p>
            </div>

            {/* Input Section */}
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value)
                    if (error) {
                      setError('')
                    }
                  }}
                  placeholder="Paste YouTube URL..."
                  className="w-full px-4 py-2 bg-input text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                />
              </div>
              <div className="rounded-lg border border-slate-700/60 bg-slate-900/30 px-4 py-3 space-y-3">
                <p className="text-xs text-slate-300">
                  If the YouTube URL fails, paste or upload captions. We will use the transcript directly.
                </p>
                <textarea
                  value={transcriptText}
                  onChange={(e) => {
                    setTranscriptText(e.target.value)
                    if (error) {
                      setError('')
                    }
                  }}
                  placeholder="Paste transcript or captions here..."
                  rows={4}
                  className="w-full resize-none rounded-md bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none ring-1 ring-slate-800/70 focus:ring-2 focus:ring-purple-500/60"
                  disabled={loading}
                />
                <input
                  type="file"
                  accept=".txt,.vtt,.srt"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) {
                      return
                    }
                    const reader = new FileReader()
                    reader.onload = () => {
                      const result = typeof reader.result === 'string' ? reader.result : ''
                      setTranscriptText(result)
                      if (error) {
                        setError('')
                      }
                    }
                    reader.readAsText(file)
                  }}
                  className="block w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-purple-500/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-purple-200 hover:file:bg-purple-500/30"
                  disabled={loading}
                />
              </div>
              {error && (
                <p className="text-sm text-red-400">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-5 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/40 hover:scale-105"
              >
                {loading ? 'Analyzing video...' : 'Generate Materials'}
              </button>
              <p className="text-slate-400 text-xs text-center">
                Supports English captions. Transcript upload works for any video.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-900/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Flashcards</p>
                    <p className="text-xs text-slate-400">Default 10, max 20</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[10, 20].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setFlashcardsCount(count)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          flashcardsCount === count
                            ? 'bg-purple-500/30 border-purple-400/60 text-white'
                            : 'border-slate-600/60 text-slate-300 hover:border-purple-400/60'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-900/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Quiz</p>
                    <p className="text-xs text-slate-400">Default 5, max 10</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[5, 10].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setQuizCount(count)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          quizCount === count
                            ? 'bg-purple-500/30 border-purple-400/60 text-white'
                            : 'border-slate-600/60 text-slate-300 hover:border-purple-400/60'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </form>

            {/* Enhanced Feature Showcase Section */}
            <div className="space-y-6 pt-8">
              <div>
                <p className="text-xs font-semibold text-purple-300 uppercase tracking-widest mb-1">What You'll Get</p>
                <p className="text-sm text-slate-400">AI-powered study materials generated in seconds</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {/* Animated Flashcards Preview */}
                <div className="group relative h-48 cursor-pointer overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-600/15 to-purple-700/10 p-5 transition-all duration-500 hover:border-purple-500/80 hover:from-purple-600/25 hover:to-purple-700/20 hover:shadow-2xl hover:shadow-purple-500/30 hover:-translate-y-2">
                  {/* Animated flip effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🃏</div>
                    <div className="text-center space-y-2 w-full">
                      <p className="text-sm font-semibold text-purple-200">Interactive Flashcards</p>
                      <p className="text-xs text-slate-400">Q&A pairs for active recall learning</p>
                    </div>
                    <div className="mt-auto pt-3 w-full space-y-1">
                      <div className="h-2 bg-purple-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-3/4 group-hover:w-full transition-all duration-1000"></div>
                      </div>
                      <p className="text-xs text-purple-300">75% comprehension boost</p>
                    </div>
                  </div>
                </div>

                {/* Animated Notes Preview */}
                <div className="group relative h-48 cursor-pointer overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/15 to-cyan-700/10 p-5 transition-all duration-500 hover:border-blue-500/80 hover:from-blue-600/25 hover:to-cyan-700/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2">
                  {/* Animated glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">📝</div>
                    <div className="text-center space-y-2 w-full">
                      <p className="text-sm font-semibold text-blue-200">Structured Notes</p>
                      <p className="text-xs text-slate-400">Organized summaries & key points</p>
                    </div>
                    <div className="mt-auto pt-3 w-full space-y-1">
                      <div className="h-2 bg-blue-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-3/4 group-hover:w-full transition-all duration-1000"></div>
                      </div>
                      <p className="text-xs text-blue-300">Save 80% study time</p>
                    </div>
                  </div>
                </div>

                {/* Animated Quiz Preview */}
                <div className="group relative h-48 cursor-pointer overflow-hidden rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-600/15 to-rose-700/10 p-5 transition-all duration-500 hover:border-pink-500/80 hover:from-pink-600/25 hover:to-rose-700/20 hover:shadow-2xl hover:shadow-pink-500/30 hover:-translate-y-2">
                  {/* Animated glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-pink-500/0 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">❓</div>
                    <div className="text-center space-y-2 w-full">
                      <p className="text-sm font-semibold text-pink-200">Practice Quizzes</p>
                      <p className="text-xs text-slate-400">Multiple choice questions</p>
                    </div>
                    <div className="mt-auto pt-3 w-full space-y-1">
                      <div className="h-2 bg-pink-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-3/4 group-hover:w-full transition-all duration-1000"></div>
                      </div>
                      <p className="text-xs text-pink-300">Test your knowledge</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && !error.toLowerCase().includes('url') && (
            <div className="pt-2">
              <ErrorAlert message={error} />
            </div>
          )}

          {/* Right side - AI Study Materials Card */}
          <div className="hidden lg:flex items-center justify-center">
            {loading ? (
              <Loader />
            ) : (
              <div className="relative w-full max-w-md flex items-center justify-center">
                {/* Animated corner glows */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-glow"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1.5s' }}></div>
                
                {/* Main card background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-purple-900/20 rounded-3xl border border-purple-500/50 backdrop-blur-xl shadow-2xl shadow-purple-500/20"></div>
                
                {/* Content */}
                <div className="relative z-10 p-8 space-y-6 text-center flex flex-col items-center h-full justify-between py-10">
                  {/* Top section - Icon and title */}
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="relative inline-flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-glow"></div>
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/30 border border-purple-400/60 flex items-center justify-center text-4xl">
                          ✨
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold text-white">AI Study Materials</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Transform any YouTube lecture into comprehensive study resources with advanced AI
                      </p>
                    </div>
                  </div>

                  {/* Middle section - Feature cards */}
                  <div className="grid grid-cols-3 gap-3 w-full">
                    {/* Notes feature */}
                    <div className="group relative p-3 rounded-xl bg-slate-900/40 border border-slate-700/50 hover:border-blue-400/60 hover:bg-blue-500/15 transition-all duration-300 cursor-pointer">
                      <div className="space-y-1 text-center">
                        <p className="text-2xl">📄</p>
                        <p className="text-blue-300 font-semibold text-xs">Notes</p>
                        <p className="text-xs text-slate-400">Summaries</p>
                      </div>
                    </div>

                    {/* Flashcards feature */}
                    <div className="group relative p-3 rounded-xl bg-slate-900/40 border border-slate-700/50 hover:border-purple-400/60 hover:bg-purple-500/15 transition-all duration-300 cursor-pointer">
                      <div className="space-y-1 text-center">
                        <p className="text-2xl">🃏</p>
                        <p className="text-purple-300 font-semibold text-xs">Cards</p>
                        <p className="text-xs text-slate-400">Q&A Pairs</p>
                      </div>
                    </div>

                    {/* Quiz feature */}
                    <div className="group relative p-3 rounded-xl bg-slate-900/40 border border-slate-700/50 hover:border-pink-400/60 hover:bg-pink-500/15 transition-all duration-300 cursor-pointer">
                      <div className="space-y-1 text-center">
                        <p className="text-2xl">❓</p>
                        <p className="text-pink-300 font-semibold text-xs">Quiz</p>
                        <p className="text-xs text-slate-400">Practice</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom section - Info */}
                  <div className="space-y-2 w-full text-center">
                    <p className="text-xs text-slate-300 font-medium">Paste a YouTube URL to begin</p>
                    <div className="flex justify-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">⚡ 15s processing</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">🤖 AI-powered</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      </div>
      {/* <Footer /> */}
    </>
  )
}
