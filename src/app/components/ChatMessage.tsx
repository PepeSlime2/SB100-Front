interface Chunk {
  id: string;
  title: string;
  content: string;
  relevance: number;
}

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  chunks?: Chunk[];
  onViewChunks?: () => void;
}

export function ChatMessage({ message, isUser, chunks, onViewChunks }: ChatMessageProps) {
  if (isUser) {
    return (
      <div className="flex justify-end mb-8">
        <div className="max-w-2xl">
          <div className="bg-[#059669] text-white px-6 py-4 rounded-3xl rounded-tr-md">
            <p className="leading-relaxed">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-8">
      <div className="max-w-2xl">
        <div className="bg-white border border-gray-200 px-6 py-4 rounded-3xl rounded-tl-md shadow-sm">
          <p className="leading-relaxed text-gray-800">{message}</p>
        </div>
        {chunks && chunks.length > 0 && (
          <button
            onClick={onViewChunks}
            className="mt-3 ml-6 px-4 py-1.5 text-sm bg-[#059669] text-white rounded-full hover:bg-[#047857] transition-colors"
          >
            Referências
          </button>
        )}
      </div>
    </div>
  );
}
