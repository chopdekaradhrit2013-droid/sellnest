"use client";

import React, { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, Copy, Check, Terminal, ExternalLink } from "lucide-react";

export function SupabaseConfigAlert() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const envSnippet = `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key`;

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(envSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 rounded-2xl bg-amber-50/90 border border-amber-200/80 p-4 text-xs text-amber-900 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-amber-950">
              Supabase Configuration Notice
            </div>
            <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
              Live authentication requires your Supabase Project URL and Anon Key in <code className="font-mono bg-amber-100 px-1 py-0.2 rounded text-amber-900">.env.local</code>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-100/70 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors shrink-0"
        >
          <span>{isOpen ? "Hide Setup" : "Setup Instructions"}</span>
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3.5 pt-3.5 border-t border-amber-200/80 space-y-3 text-[11px] text-amber-900">
          <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
            <li>
              Go to your{" "}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="font-bold underline inline-flex items-center gap-0.5 text-amber-950"
              >
                Supabase Dashboard <ExternalLink className="w-2.5 h-2.5" />
              </a>{" "}
              and select your project.
            </li>
            <li>
              Navigate to <strong>Project Settings → API</strong> to copy your <strong>Project URL</strong> and <strong>anon public key</strong>.
            </li>
            <li>
              Create a file named <code className="font-mono bg-amber-100 px-1 py-0.2 rounded font-bold">.env.local</code> in the project root with:
            </li>
          </ol>

          <div className="relative rounded-xl bg-stone-900 text-stone-200 p-3 font-mono text-[11px] overflow-x-auto">
            <button
              type="button"
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1 text-[10px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <pre className="pr-16">{envSnippet}</pre>
          </div>

          <p className="text-[11px] text-amber-800 leading-relaxed">
            4. In the Supabase Dashboard, open <strong>SQL Editor → New Query</strong>, paste the contents of <code className="font-mono bg-amber-100 px-1 py-0.2 rounded font-bold">supabase/schema.sql</code>, and click <strong>Run</strong>.
          </p>
        </div>
      )}
    </div>
  );
}

