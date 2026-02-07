'use client';

interface TabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  const tabs = [
    { id: 'notes', label: 'Notes' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'quiz', label: 'Quiz' },
  ]

  return (
    <div className="flex gap-2 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-3 px-6 font-semibold transition-all rounded-lg ${
            activeTab === tab.id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
