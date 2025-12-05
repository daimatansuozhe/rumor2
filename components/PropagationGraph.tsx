
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphData, GraphNode, GraphLink } from '../types';
import { Share2 } from 'lucide-react';

interface PropagationGraphProps {
  data: GraphData | null;
}

const PropagationGraph: React.FC<PropagationGraphProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Init

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draw Graph
  useEffect(() => {
    if (!data || !data.nodes || data.nodes.length === 0 || !dimensions.width) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const width = dimensions.width;
    const height = dimensions.height;

    // Deep copy data to avoid mutating props with d3 internal props
    const nodes: GraphNode[] = data.nodes.map(d => ({ ...d }));
    const links: GraphLink[] = data.links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(140))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60));

    // Arrow markers
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .enter().append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 28) // Shift arrow head slightly more
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#cbd5e1");

    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");

    const nodeGroup = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Node circles
    nodeGroup.append("circle")
      .attr("r", 20)
      .attr("fill", (d) => {
        if (d.group === 1) return "#ef4444"; // Source: Red
        if (d.group === 2) return "#f59e0b"; // Spreader: Orange
        return "#3b82f6"; // End/Debunk: Blue
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .attr("class", "shadow-lg cursor-grab transition-all hover:brightness-110");

    // Background for text (for readability)
    nodeGroup.append("rect")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("x", -60)
      .attr("y", 25)
      .attr("width", 120)
      .attr("height", 30)
      .attr("fill", "rgba(255, 255, 255, 0.75)")
      .style("pointer-events", "none");

    // Node labels (Name)
    nodeGroup.append("text")
      .text(d => d.label)
      .attr("x", 0)
      .attr("y", 38)
      .attr("text-anchor", "middle")
      .attr("fill", "#334155")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .style("pointer-events", "none")
      .style("text-shadow", "0 0 2px white");
    
    // Time labels (Explicit)
    nodeGroup.append("text")
      .text(d => d.time || '')
      .attr("x", 0)
      .attr("y", 50) // Shifted down
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b") // Lighter slate
      .attr("font-size", "9px")
      .attr("font-family", "monospace")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };

  }, [data, dimensions]);

  if (!data || !data.nodes.length) {
    return (
        <div ref={containerRef} className="w-full h-full min-h-[400px] bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8">
            <Share2 size={48} className="mb-4 opacity-50 text-slate-300" />
            <h3 className="text-xl font-semibold mb-2 text-slate-500">等待传播路径分析</h3>
            <p className="text-center text-slate-400 max-w-sm">在左侧对话框输入需要核实的信息，AI 将自动分析并在此处绘制传播路径图。</p>
            
            <div className="mt-8 flex gap-4 text-xs">
                <div className="flex flex-col items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span>谣言源头</span>
                </div>
                <div className="w-8 border-t border-slate-200 mt-1.5 border-dashed"></div>
                <div className="flex flex-col items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                    <span>传播节点</span>
                </div>
                <div className="w-8 border-t border-slate-200 mt-1.5 border-dashed"></div>
                <div className="flex flex-col items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                    <span>辟谣/查证</span>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] bg-white rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-100 text-xs text-slate-600">
            <h4 className="font-bold mb-2 text-slate-800">图例说明</h4>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-100"></span>
                <span>谣言源头 (Origin)</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-orange-500 ring-2 ring-orange-100"></span>
                <span>传播节点 (Spreader)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-100"></span>
                <span>官方/辟谣 (Debunk)</span>
            </div>
        </div>
        <div className="absolute bottom-4 right-4 z-10 text-[10px] text-slate-300 pointer-events-none">
            Drag nodes to rearrange
        </div>
      <svg ref={svgRef} width="100%" height="100%" className="cursor-grab active:cursor-grabbing"></svg>
    </div>
  );
};

export default PropagationGraph;
