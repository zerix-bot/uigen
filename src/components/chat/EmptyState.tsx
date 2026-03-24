"use client";

import { Bot } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 mb-4 shadow-sm">
        <Bot className="h-7 w-7 text-blue-600" />
      </div>
      <p className="text-neutral-900 font-semibold text-lg mb-2">Inicie uma conversa para gerar componentes React</p>
      <p className="text-neutral-500 text-sm max-w-sm">Posso te ajudar a criar botões, formulários, cards e muito mais</p>
    </div>
  );
}
