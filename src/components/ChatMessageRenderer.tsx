import React from 'react';
import { ChatMessage } from '../services/mockAiService';
import { ToolResultCard } from './ToolResultCard';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface ChatMessageRendererProps {
  message: ChatMessage;
  onRetry?: (messageId: string) => void;
}

export const ChatMessageRenderer: React.FC<ChatMessageRendererProps> = ({ message, onRetry }) => {
  const isUser = message.role === 'user';

  return (
    <article
      aria-label={`${isUser ? 'User' : 'Assistant'} message`}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl p-4 leading-relaxed transition-all text-xs sm:text-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
        }`}
      >
        {/* Pending State */}
        {message.status === 'pending' && (
          <div role="status" aria-label="Assistant is thinking" className="flex items-center gap-2 text-slate-400 py-1">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span className="font-mono text-xs">Reasoning over prompt...</span>
          </div>
        )}

        {/* Streaming State */}
        {message.status === 'streaming' && (
          <div role="status" aria-label="Assistant is streaming response" className="space-y-1">
            <div className="whitespace-pre-wrap">{message.content}</div>
            <span aria-hidden="true" className="inline-block w-2 h-3.5 bg-indigo-400 animate-pulse ml-0.5" />
          </div>
        )}

        {/* Error State */}
        {message.status === 'error' && (
          <div role="alert" aria-label="Error generating message" className="space-y-2.5 text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span className="font-semibold text-xs">Generation Severed</span>
            </div>
            <p className="text-xs text-rose-200/90">{message.error || 'Connection to inference route failed.'}</p>
            {onRetry && (
              <button
                type="button"
                onClick={() => onRetry(message.id)}
                aria-label="Retry generation"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-700/80 hover:bg-rose-600 text-white text-xs font-medium transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Message</span>
              </button>
            )}
          </div>
        )}

        {/* Complete State */}
        {message.status === 'complete' && (
          <div className="space-y-2">
            <div className="whitespace-pre-wrap text-slate-100">{message.content}</div>
            {message.toolResult && (
              <ToolResultCard
                toolResult={message.toolResult}
                onRetry={onRetry ? () => onRetry(message.id) : undefined}
              />
            )}
          </div>
        )}
      </div>
    </article>
  );
};
