interface ChatHeaderProps {
  isLoading: boolean;
}

export function ChatHeader({ isLoading }: ChatHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-1 rounded-full bg-emerald-600" />
            <div>
              <h1 className="text-2xl tracking-tight text-slate-900">Agente SB100</h1>
              <p className="text-sm text-slate-500 mt-0.5">Assistente Científico</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            {isLoading ? 'Agente SB100 pensando...' : 'Pronto para responder sua pergunta.'}
          </div>
        </div>
      </div>
    </header>
  );
}
