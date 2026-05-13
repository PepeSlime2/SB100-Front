import React, { useState } from 'react';
import { Referencias } from './Referencias';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog';
import { Badge } from './ui/badge';

interface Chunk {
  id: string;
  file: string;
  score: number;
  chunk_index: number;
  preview: string;
}

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  chunks?: Chunk[];
  referencias_principais?: string[];
  hallucination_flag?: number;
}

const truncatePreview = (preview: string, maxLength = 120) => {
  return preview.length > maxLength ? `${preview.slice(0, maxLength).trim()}...` : preview;
};

export function ChatMessage({ message, isUser, chunks, referencias_principais, hallucination_flag }: ChatMessageProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
          {hallucination_flag !== undefined && (
            <div className="mt-3">
              <Badge
                className={hallucination_flag === 0 ? 'bg-emerald-100 text-emerald-900 border-emerald-200' : 'bg-rose-100 text-rose-900 border-rose-200'}
              >
                {hallucination_flag === 0 ? 'Sem possível alucinação' : 'Possível alucinação'}
              </Badge>
            </div>
          )}
        </div>
        {referencias_principais && referencias_principais.length > 0 && (
          <Referencias referencias={referencias_principais} />
        )}
        {chunks && chunks.length > 0 && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                className="mt-3 ml-6 px-4 py-1.5 text-sm bg-[#059669] text-white rounded-full hover:bg-[#047857] transition-colors"
              >
                Referências
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[80vh] flex flex-col bg-white border border-slate-200 shadow-lg">
              <DialogHeader className="text-left flex-shrink-0">
                <DialogTitle className="text-emerald-900">Referências</DialogTitle>
                <DialogDescription className="text-slate-500">Trechos usados na resposta.</DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto mt-6">
                <div className="space-y-4 pr-2">
                  {chunks.map((chunk, index) => (
                    <div key={chunk.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-600">Chunk index: {chunk.chunk_index}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-900">Score: {chunk.score.toFixed(2)}</span>
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-600 rounded-full transition-all"
                              style={{ width: `${Math.min(chunk.score * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {truncatePreview(chunk.preview, 250)}
                      </p>
                      <p className="text-xs text-slate-500 mt-3">{chunk.file}</p>
                    </div>
                  ))}
                </div>
              </div>

              <DialogClose asChild>
                <button className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 flex-shrink-0">
                  Fechar
                </button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
