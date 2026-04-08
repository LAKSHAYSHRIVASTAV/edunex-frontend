import React, { useState } from "react";
import useConceptMapStore from "../hooks/useConceptMap";
import type { ConceptNode } from "../utils/layout";

type GeneratePanelProps = {
  concepts: ConceptNode[];
  onGenerated?: (map: any) => void;
  onConceptSelect?: (node: ConceptNode) => void;
};

export default function GeneratePanel({ concepts, onGenerated, onConceptSelect }: GeneratePanelProps) {
  const [text, setText] = useState("");
  const { generating, generateMap } = useConceptMapStore();

  const handleGenerate = async () => {
    if (!text.trim()) return;

    const result = await generateMap({
      text: text.trim(),
      userId: localStorage.getItem("userId") || "guest",
    });

    onGenerated?.(result);
    setText("");
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Study material
        </label>
        <textarea
          className="min-h-[220px] w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          placeholder="Paste notes, a chapter summary, or any text you want converted into a concept map."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <p className="mt-2 text-xs text-slate-500">{text.length} characters</p>
      </div>

      <button
        className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        onClick={handleGenerate}
        disabled={generating || !text.trim()}
      >
        {generating ? "Generating..." : "Generate Concept Map"}
      </button>

      <div className="min-h-0 flex-1">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Concepts ({concepts.length})
        </h3>
        {concepts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            Generated concepts will appear here.
          </div>
        ) : (
          <div className="flex max-h-full flex-col gap-2 overflow-auto pr-1">
            {concepts.map((concept) => (
              <button
                key={concept.id}
                className="rounded-lg border border-slate-200 bg-white p-3 text-left text-sm transition hover:border-blue-300 hover:bg-blue-50"
                onClick={() => onConceptSelect?.(concept)}
              >
                <span className="block font-semibold text-slate-800">{concept.label}</span>
                <span className="text-xs capitalize text-slate-500">{concept.type || "concept"}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
