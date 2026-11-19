"use client";

import { useState } from "react";

// Placeholder button. Wire to POST /api/chat/sessions/ when the chatbot is built.
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 z-30">
      {open && (
        <div className="mb-3 w-72 rounded-xl border border-[#E8DCD1] bg-white p-4 text-sm text-[#171313] shadow-lg">
          Chat is coming soon. For now, use “Request a quote” and we will reply by email.
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open chat"
        className="h-14 w-14 rounded-full border-2 border-[#F2C38F] bg-[#701512] text-xl text-white hover:bg-[#4A2522]"
      >
        💬
      </button>
    </div>
  );
}
