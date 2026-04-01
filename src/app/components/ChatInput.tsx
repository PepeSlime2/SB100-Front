import { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-5">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="w-full rounded-full border border-slate-300 bg-slate-50 px-5 py-3 pr-24 text-sm text-slate-900 shadow-sm transition-colors focus:border-slate-500 focus:bg-white focus:outline-none"
            disabled={disabled}
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#4b633d] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3f5230] disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
