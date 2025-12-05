
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Info, XCircle, ExternalLink } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: ChatMessage[];
  isLoading: boolean;
}

// Helper component to render simple Markdown (Bold and Links)
const MarkdownText: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  const lines = content.split('\n');

  return (
    <div className={`space-y-1 ${isUser ? 'text-right' : 'text-left'}`}>
      {lines.map((line, idx) => {
        // Skip empty lines at start/end if you want compact, but keeping them allows paragraphs
        if (line.trim() === '') return <div key={idx} className="h-2"></div>;

        // Regex to split by:
        // 1. **bold**
        // 2. [text](url)
        const parts = line.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

        return (
          <div key={idx} className="break-words leading-relaxed min-h-[1.5em]">
            {parts.map((part, pIdx) => {
              // Match Bold: **text**
              if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                return (
                  <strong key={pIdx} className={`${isUser ? 'font-bold' : 'font-bold text-slate-900'}`}>
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              // Match Link: [text](url)
              const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
              if (linkMatch) {
                return (
                  <a
                    key={pIdx}
                    href={linkMatch[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${isUser ? 'text-blue-200 hover:text-white' : 'text-brand-600 hover:text-brand-800'} underline decoration-1 underline-offset-2 inline-flex items-center gap-0.5 transition-colors`}
                  >
                    {linkMatch[1]}
                    <ExternalLink size={12} className="inline opacity-80" />
                  </a>
                );
              }
              // Return regular text
              return <span key={pIdx}>{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage, messages, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const msg = input;
    setInput('');
    await onSendMessage(msg);
    // Keep focus for continuous chatting
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
            <div className="relative group">
                <div className="bg-gradient-to-br from-brand-600 to-brand-400 p-2.5 rounded-2xl shadow-lg shadow-brand-200 group-hover:shadow-brand-300 transition-all duration-300 transform group-hover:scale-105">
                    <Bot size={24} className="text-white" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
            </div>
            <div>
                <h3 className="font-extrabold text-slate-800 text-lg tracking-tight">智能查证助手</h3>
                <div className="flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-xs text-slate-500 font-medium">Gemini 2.5 在线</span>
                </div>
            </div>
        </div>
        <button className="text-slate-400 hover:bg-slate-50 hover:text-slate-600 p-2 rounded-xl transition-all" title="关于">
             <Info size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth z-10">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-brand-50/50">
                <Sparkles className="text-brand-500 w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">我是您的谣言粉碎机</h3>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
              输入您看到的网络消息，我将为您核实真伪，并分析传播路径。
            </p>
            
            <div className="grid gap-3 w-full max-w-sm">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left pl-2">热门搜索</p>
                {[
                  "吃大蒜能预防流感吗？", 
                  "网传某地出现不明飞行物", 
                  "长期喝咖啡对心脏不好？"
                ].map((suggestion, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setInput(suggestion)}
                        className="group relative flex items-center justify-between px-5 py-3.5 bg-white border border-slate-200 hover:border-brand-300 hover:shadow-md hover:shadow-brand-100/50 rounded-xl transition-all text-slate-600 text-left overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-brand-50 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 origin-left"></div>
                        <span className="relative z-10 text-sm font-medium group-hover:text-brand-700">{suggestion}</span>
                        <Send size={14} className="relative z-10 text-slate-300 group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
                    </button>
                ))}
            </div>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[90%] sm:max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-auto transition-transform group-hover:scale-110 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-slate-700 to-slate-900 text-white' 
                  : 'bg-white border border-brand-100 text-brand-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
              </div>
              
              <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`px-5 py-3.5 text-[15px] shadow-sm transition-all relative ${
                      msg.role === 'user'
                        ? 'bg-slate-800 text-white rounded-2xl rounded-tr-sm'
                        : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    <MarkdownText content={msg.content} isUser={msg.role === 'user'} />
                  </div>
                  {/* Timestamp/Label */}
                   <span className="text-[10px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                      {msg.role === 'user' ? 'You' : 'AI Analysis'}
                  </span>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start w-full">
             <div className="flex max-w-[85%] gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-full bg-white border border-slate-100 text-brand-600 flex items-center justify-center flex-shrink-0 mt-auto shadow-sm">
                    <Bot size={18} />
                </div>
                <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center gap-3">
                    <Loader2 size={18} className="animate-spin text-brand-500" />
                    <span className="text-sm text-slate-500 font-medium">正在检索全网数据...</span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-white border-t border-slate-100 z-20">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-slate-50 p-2 pl-4 rounded-3xl border border-slate-200 focus-within:ring-4 focus-within:ring-brand-500/10 focus-within:border-brand-400 transition-all shadow-inner">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                }
            }}
            placeholder="输入信息内容..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400 min-h-[44px] max-h-[120px] py-2.5 text-sm font-medium resize-none overflow-hidden"
            style={{ height: 'auto', lineHeight: '1.5' }}
            onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
            }}
          />
          {input.trim() && (
               <button
               type="button"
               onClick={() => setInput('')}
               className="text-slate-400 hover:text-slate-600 p-2 self-center"
             >
               <XCircle size={16} />
             </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-slate-900 hover:bg-brand-600 disabled:bg-slate-300 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex-shrink-0 self-end mb-0.5"
          >
            <Send size={18} className={isLoading ? 'opacity-0' : 'ml-0.5'} />
            {isLoading && <Loader2 size={18} className="animate-spin absolute" />}
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-2">
            AI 生成内容仅供参考，请以官方发布为准
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
