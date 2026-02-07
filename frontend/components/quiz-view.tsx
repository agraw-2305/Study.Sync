'use client'

import { useState } from 'react'

interface QuizQuestion {
  question: string
  options: string[]
  correct_answer: string
}

interface QuizViewProps {
  quiz: QuizQuestion[]
}

export default function QuizView({ quiz }: QuizViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)

  if (!quiz || quiz.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No quiz available</p>
      </div>
    )
  }

  const question = quiz[currentQuestion]

  const resolvedCorrectAnswer = (() => {
    const raw = (question.correct_answer || '').trim()
    if (/^[A-D]$/i.test(raw)) {
      const idx = raw.toUpperCase().charCodeAt(0) - 65
      return question.options?.[idx] ?? raw.toUpperCase()
    }
    return raw
  })()

  const isAnswered = answered
  const isCorrect = selectedAnswer === resolvedCorrectAnswer
  const isCompleted = currentQuestion === quiz.length - 1

  const handleSelectAnswer = (option: string) => {
    if (!answered) {
      setSelectedAnswer(option)
      setAnswered(true)
      if (option === resolvedCorrectAnswer) {
        setScore(score + 1)
      }
    }
  }

  const handleNext = () => {
    if (isCompleted) {
      // Quiz completed
      setCurrentQuestion(0)
      setSelectedAnswer(null)
      setAnswered(false)
      setScore(0)
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    }
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      {/* Progress Bar */}
      <div className="space-y-2 animate-fade-in">
        <div className="flex flex-wrap gap-3 justify-between items-center mb-2">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {quiz.length}
          </p>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              Score: {score}/{quiz.length}
            </p>
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all shadow-lg ${
                isAnswered
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 shadow-purple-600/30 hover:shadow-purple-600/50'
                  : 'bg-slate-800/60 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isCompleted ? 'Restart' : 'Next'}
            </button>
          </div>
        </div>
        <div className="w-full bg-secondary/30 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-500 rounded-full shadow-lg shadow-purple-600/50"
            style={{
              width: `${((currentQuestion + 1) / quiz.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="space-y-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-white text-balance leading-relaxed animate-fade-in">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrectOption = option === resolvedCorrectAnswer
            let buttonStyle = 'bg-slate-800/40 border-slate-700/50 hover:border-purple-500/50 hover:bg-purple-500/10'

            if (isAnswered) {
              if (isCorrectOption) {
                buttonStyle = 'bg-green-500/15 border-green-500/60 text-green-300 shadow-lg shadow-green-500/20'
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'bg-red-500/15 border-red-500/60 text-red-300 shadow-lg shadow-red-500/20'
              } else if (isSelected) {
                buttonStyle = 'bg-green-500/15 border-green-500/60 text-green-300 shadow-lg shadow-green-500/20'
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                disabled={isAnswered}
                className={`w-full p-4 text-left border rounded-xl transition-all font-medium animate-fade-in ${
                  isSelected ? 'ring-2 ring-purple-500' : ''
                } ${buttonStyle} ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="font-bold text-purple-400 mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {isAnswered && isCorrectOption && (
                  <span className="float-right text-green-400 text-lg">✓</span>
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <span className="float-right text-red-400 text-lg">✗</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Next Button */}
      <div className="pt-6 border-t border-slate-700/50 animate-fade-in">
        <button
          onClick={handleNext}
          disabled={!isAnswered}
          className={`w-full py-4 px-4 font-semibold rounded-xl transition-all shadow-lg ${
            isAnswered
              ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 shadow-purple-600/30 hover:shadow-purple-600/50'
              : 'bg-slate-800/60 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isCompleted ? 'Restart Quiz' : 'Next Question'}
        </button>

        {isCompleted && isAnswered && (
          <div className="mt-6 p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/40 rounded-2xl text-center animate-slide-up">
            <p className="text-lg font-bold text-white mb-2">Quiz Completed!</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {score}/{quiz.length} ({Math.round((score / quiz.length) * 100)}%)
            </p>
            <p className="text-sm text-slate-400 mt-2">
              {Math.round((score / quiz.length) * 100) >= 80
                ? 'Excellent performance! 🎉'
                : Math.round((score / quiz.length) * 100) >= 60
                  ? 'Good job! Keep practicing. 👍'
                  : 'Review the material and try again! 📚'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
