import { AIChat } from "@/components/web/ai-chat"

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Chat com Assistente de Presentes
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Converse com nossa IA para encontrar o presente perfeito. 
            Tire dúvidas, peça sugestões e receba recomendações personalizadas.
          </p>
        </div>

        {/* Chat Component */}
        <AIChat />
      </div>
    </div>
  )
}
