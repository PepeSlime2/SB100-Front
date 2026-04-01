import { useState } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ChunksModal } from './components/ChunksModal';

interface Chunk {
  id: string;
  score: number;
  file: string;
  chunk_index: number;
  preview: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  chunks?: Chunk[];
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Olá! Sou o Agente SB100, seu assistente científico. Como posso ajudá-lo hoje?',
    isUser: false
  }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedChunks, setSelectedChunks] = useState<Chunk[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true
    };

    setMessages((prev) => [...prev, userMessage]);
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8000';
      const apiUrl = `${apiBaseUrl.replace(/\/$/, '')}/perguntar`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pergunta: text })
      });

      if (!response.ok) {
        const textBody = await response.text();
        throw new Error(`API retornou ${response.status}: ${textBody}`);
      }

      const data = await response.json();
      const chunks: Chunk[] = Array.isArray(data.chunks)
        ? data.chunks.map((chunk: any) => ({
            id: String(chunk.id ?? `${Date.now()}-${Math.random()}`),
            score: Number(chunk.score ?? 0),
            file: String(chunk.file ?? 'Desconhecido'),
            chunk_index: Number(chunk.chunk_index ?? 0),
            preview: String(chunk.preview ?? '')
          }))
        : [];

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: String(data.resposta ?? 'Sem resposta disponível.'),
        isUser: false,
        chunks: chunks.length > 0 ? chunks : undefined
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error: any) {
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Erro ao conectar: ${error?.message ?? 'Erro desconhecido'}`,
        isUser: false
      };
      setMessages((prev) => [...prev, fallbackMessage]);
      setErrorMessage('Não foi possível obter resposta da API. Verifique se o backend está rodando em http://localhost:8000.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewChunks = (chunks: Chunk[]) => {
    setSelectedChunks(chunks);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <ChatHeader isLoading={isLoading} />

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          {errorMessage && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 shadow-sm">
              {errorMessage}
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              chunks={message.chunks}
              onViewChunks={message.chunks ? () => handleViewChunks(message.chunks) : undefined}
            />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-8">
              <div className="max-w-2xl">
                <div className="bg-slate-100 border border-slate-200 px-6 py-4 rounded-3xl rounded-tl-md shadow-sm animate-pulse">
                  <p className="leading-relaxed text-slate-500">Agente SB100 está pensando...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />

      <ChunksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} chunks={selectedChunks} />
    </div>
  );
}
