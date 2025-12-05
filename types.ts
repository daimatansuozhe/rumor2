
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  status: 'verified' | 'debunked' | 'uncertain';
  timestamp: string;
  imageUrl?: string;
  url?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  group: number;
  time?: string;
  // d3 simulation properties
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  isStreaming?: boolean;
}

export interface AnalysisResult {
  message: string;
  isRumor: boolean;
  graphData: GraphData | null;
}
