'use client'

interface ErrorAlertProps {
  message: string
}

export default function ErrorAlert({ message }: ErrorAlertProps) {
  const isBandwidthError = message.toLowerCase().includes('youtube blocked transcript requests')

  return (
    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <span className="text-xl">⚠️</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-red-400 mb-1">Error</p>
          <p className="text-sm text-red-300/90 mb-3">{message}</p>
          {isBandwidthError && (
            <p className="text-xs text-red-300/70 bg-red-500/5 p-2 rounded border border-red-500/20">
              💡 YouTube is temporarily blocking transcript requests. Try again in a few moments or try a different video.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
