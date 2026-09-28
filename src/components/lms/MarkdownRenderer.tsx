"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';

/**
 * Transforma las alertas de GitHub-style ([!NOTE], [!TIP], etc.)
 * en divs con clases CSS que globals.css estiliza.
 */
function preprocessAlerts(markdown: string): string {
  return markdown.replace(
    /> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:>.*\n?)*)/gi,
    (_match, type: string, body: string) => {
      const cleanBody = body
        .split('\n')
        .map((line: string) => line.replace(/^>\s?/, ''))
        .join('\n')
        .trim();
      const alertType = type.toLowerCase();
      const icons: Record<string, string> = {
        note: 'ℹ️',
        tip: '💡',
        important: '🔑',
        warning: '⚠️',
        caution: '🚨',
      };
      const labels: Record<string, string> = {
        note: 'Nota',
        tip: 'Consejo',
        important: 'Importante',
        warning: 'Advertencia',
        caution: 'Precaución',
      };
      return `<div class="alert-${alertType}"><strong>${icons[alertType] || ''} ${labels[alertType] || type}</strong><br/>${cleanBody}</div>\n\n`;
    }
  );
}

const customComponents: Components = {
  // Todas las tablas reciben scroll horizontal en mobile
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto mb-6 rounded-xl border border-slate-200 dark:border-white/10">
      <table {...props}>{children}</table>
    </div>
  ),
};

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processed = preprocessAlerts(content);

  return (
    <div className="prose-lms max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={customComponents}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
