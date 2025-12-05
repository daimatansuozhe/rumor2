
import React, { useState } from 'react';
import NewsCarousel from './components/NewsCarousel';
import ChatInterface from './components/ChatInterface';
import PropagationGraph from './components/PropagationGraph';
import { MOCK_NEWS } from './constants';
import { checkRumorWithGemini } from './services/geminiService';
import { ChatMessage, GraphData } from './types';
import { Activity, Search, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setGraphData(null); // Clear previous graph to indicate new search is in progress

    try {
      const result = await checkRumorWithGemini(text);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: result.message
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setGraphData(result.graphData);

    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "抱歉，分析过程中出现了错误，请稍后重试。"
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <Activity size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500">
              TruthSeeker AI 智慧谣言诊断
            </h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-brand-600 transition-colors">首页</a>
            <a href="#" className="hover:text-brand-600 transition-colors">辟谣数据库</a>
            <a href="#" className="hover:text-brand-600 transition-colors">关于我们</a>
          </nav>
        </div>
      </header>

      {/* Feature 1: News Carousel */}
      <section className="relative z-40">
        <NewsCarousel news={MOCK_NEWS} />
      </section>

      {/* Main Content Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Feature 2: Chat Interface */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-700 mb-2">
            <Search size={20} className="text-brand-500" />
            <h2 className="text-lg font-bold">智能查证对话</h2>
          </div>
          <ChatInterface 
            onSendMessage={handleSendMessage} 
            messages={messages} 
            isLoading={isLoading} 
          />
        </div>

        {/* Feature 3: Rumor Propagation Graph */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-700 mb-2">
            <Share2 size={20} className="text-brand-500" />
            <h2 className="text-lg font-bold">谣言传播路径可视化</h2>
          </div>
          <div className="flex-1 h-[600px]">
             <PropagationGraph data={graphData} />
          </div>
        </div>

      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 TruthSeeker AI. 数据仅供参考，请以官方通报为准。</p>
          <p className="mt-1">Powered by Google Gemini 2.5 Flash</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
