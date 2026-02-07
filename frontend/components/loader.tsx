export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-16 h-16 mb-6">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-primary border-r-primary rounded-full animate-spin"></div>

        {/* Inner static ring */}
        <div className="absolute inset-2 border-4 border-secondary rounded-full"></div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
        </div>
      </div>

      <p className="text-lg font-semibold text-foreground text-balance text-center">
        Analyzing video and generating content…
      </p>
      <p className="text-sm text-muted-foreground mt-3 text-center">
        This may take a moment
      </p>
    </div>
  )
}
