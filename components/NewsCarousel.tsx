
import React, { useRef, useEffect } from 'react';
import { NewsItem } from '../types';
import { ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';

interface NewsCarouselProps {
  news: NewsItem[];
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ news }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationId: number;
    let scrollAmount = 0;
    const speed = 0.5; // pixels per frame

    const step = () => {
      scrollAmount += speed;
      if (el) {
        // If scrolled past half (since we doubled content), reset to 0
        if (scrollAmount >= el.scrollWidth / 2) {
            scrollAmount = 0; 
        }
        el.scrollLeft = scrollAmount;
      }
      animationId = requestAnimationFrame(step);
    };

    animationId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationId);
  }, [news]);

  // Duplicate news to create seamless loop
  const displayNews = [...news, ...news];

  return (
    <div className="w-full bg-white shadow-sm border-b border-slate-100 overflow-hidden py-4">
      <div className="max-w-7xl mx-auto px-4 mb-3 flex justify-between items-center">
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          实时辟谣监控 / Real-time Monitor
        </h2>
        <span className="text-xs text-slate-400">数据来源: 联合辟谣平台 · 今日头条 · 微博</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden whitespace-nowrap px-4 py-2"
        style={{ scrollBehavior: 'auto' }} // Disable smooth scroll for JS animation
      >
        {displayNews.map((item, index) => (
          <a
            key={`${item.id}-${index}`}
            href={item.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-80 flex-shrink-0 group cursor-pointer bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
          >
            <div className="h-32 bg-slate-200 relative overflow-hidden">
               <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
               <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 shadow-sm backdrop-blur-sm"
                    style={{ backgroundColor: item.status === 'verified' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)' }}>
                 {item.status === 'verified' ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
                 {item.status === 'verified' ? '已证实' : '已辟谣'}
               </div>
               
               {/* Hover Overlay Icon */}
               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <ExternalLink size={20} />
                  </span>
               </div>
            </div>
            <div className="p-3 whitespace-normal">
              <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 h-10 mb-2 leading-snug group-hover:text-brand-600 transition-colors">
                {item.title}
              </h3>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-slate-600 group-hover:border-brand-200 group-hover:text-brand-600 transition-colors">{item.source}</span>
                <span>{item.timestamp}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsCarousel;
