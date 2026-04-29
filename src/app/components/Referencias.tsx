import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReferenciasProps {
  referencias: string[];
}

export function Referencias({ referencias }: ReferenciasProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedRefs = showAll ? referencias : referencias.slice(0, 2);
  const hiddenCount = Math.max(0, referencias.length - 2);

  return (
    <div className="mt-6 ml-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50 px-5 py-4">
        <h3 className="text-base font-semibold text-gray-800">Referências Principais</h3>
        <span className="ml-auto inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
          {referencias.length}
        </span>
      </div>

      {/* References List */}
      <div className="space-y-0 divide-y divide-gray-100 p-4">
        {displayedRefs.map((ref, index) => (
          <div
            key={index}
            className="group py-3 first:pt-0 last:pb-0 transition-all duration-200 hover:bg-gray-50 px-3 -mx-3 rounded-lg"
          >
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600 group-hover:bg-gray-300">
                {index + 1}
              </div>
              <p className="text-sm leading-relaxed text-gray-700 group-hover:text-gray-900">{ref}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with Button */}
      {referencias.length > 2 && (
        <div className="border-t border-gray-200 bg-white px-5 py-3">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-300 active:scale-95"
          >
            <span>
              {showAll ? `Ver menos (${referencias.length - hiddenCount})` : `Ver mais (${hiddenCount} ocultas)`}
            </span>
            {showAll ? (
              <ChevronUp className="h-4 w-4 transition-transform" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}