interface Chunk {
  id: string;
  score: number;
  file: string;
  chunk_index: number;
  preview: string;
}

interface ChunksModalProps {
  isOpen: boolean;
  onClose: () => void;
  chunks: Chunk[];
}

export function ChunksModal({ isOpen, onClose, chunks }: ChunksModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Referências</h2>
            <p className="text-sm text-slate-500">Veja os documentos e pontuações usados na resposta.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 transition hover:text-slate-700"
          >
            ×
          </button>
        </div>

        <div className="max-h-[calc(80vh-100px)] overflow-y-auto px-8 py-6">
          <div className="space-y-4">
            {chunks.map((chunk) => (
              <div
                key={chunk.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 hover:border-slate-400 transition-colors"
              >
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{chunk.file}</h3>
                    <p className="text-sm text-slate-500">Chunk index: {chunk.chunk_index}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700">Score: {chunk.score.toFixed(2)}</span>
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-[#375235]" style={{ width: `${Math.min(Math.max(chunk.score, 0), 1) * 100}%` }} />
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">{chunk.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
