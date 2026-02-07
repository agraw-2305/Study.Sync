'use client'

import { useState } from 'react'

interface FlashCard {
  question: string
  answer: string
}

interface FlashcardsViewProps {
  flashcards: FlashCard[]
}

export default function FlashcardsView({ flashcards }: FlashcardsViewProps) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})

  const toggleFlip = (index: number) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No flashcards available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          Click cards to reveal answers
        </p>
        <p className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
          {flashcards.length} cards
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 flex-1 overflow-y-auto pr-4 custom-scrollbar">
        {flashcards.map((card, index) => (
          <div
            key={index}
            onClick={() => toggleFlip(index)}
            className="group cursor-pointer h-60 perspective animate-fade-in"
            style={{
              perspective: '1000px',
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div
              className="relative w-full h-full transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front - Question */}
              <div
                className="absolute inset-0 rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-600/20 to-purple-700/10 p-8 flex flex-col justify-center items-center hover:border-purple-500/80 hover:from-purple-600/30 hover:to-purple-700/20 transition-all duration-300"
                style={{
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="text-center space-y-4 w-full">
                  <div className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300 uppercase tracking-wider font-semibold">
                    Question
                  </div>
                  <p className="text-lg font-semibold text-white leading-relaxed line-clamp-5">
                    {card.question}
                  </p>
                  <p className="text-xs text-slate-400 pt-2">Click to reveal answer</p>
                </div>
              </div>

              {/* Back - Answer */}
              <div
                className="absolute inset-0 rounded-2xl border border-pink-500/40 bg-gradient-to-br from-pink-600/20 to-rose-700/10 p-8 flex flex-col justify-center items-center hover:border-pink-500/80 hover:from-pink-600/30 hover:to-rose-700/20 transition-all duration-300"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="text-center space-y-4 w-full">
                  <div className="inline-block px-3 py-1 bg-pink-500/20 rounded-full text-xs text-pink-300 uppercase tracking-wider font-semibold">
                    Answer
                  </div>
                  <p className="text-base text-white leading-relaxed line-clamp-6">
                    {card.answer}
                  </p>
                  <p className="text-xs text-slate-400 pt-2">Click to flip back</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
