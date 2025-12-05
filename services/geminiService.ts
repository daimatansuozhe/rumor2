
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    message: {
      type: Type.STRING,
      description: "The formatted text response in Markdown. Use **bold** for key results and [Title](URL) for links.",
    },
    isRumor: {
      type: Type.BOOLEAN,
      description: "True if the input is identified as a rumor or misinformation.",
    },
    graphData: {
      type: Type.OBJECT,
      nullable: true,
      description: "Propagation path data. REQUIRED for rumors or events with a timeline.",
      properties: {
        nodes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              label: { type: Type.STRING, description: "Name of the platform, user, or entity (e.g. 'Weibo User A', 'Local News')." },
              group: { type: Type.INTEGER, description: "1 for source (Red), 2 for spreader (Orange), 3 for endpoint/debunker (Blue)." },
              time: { type: Type.STRING, description: "Precise timestamp for this node's event. MUST be in format 'MM-DD HH:mm' (e.g. '05-20 14:30')." }
            },
            required: ["id", "label", "group", "time"],
          }
        },
        links: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING, description: "ID of source node" },
              target: { type: Type.STRING, description: "ID of target node" },
              value: { type: Type.INTEGER, description: "Strength of link (1-5)" }
            },
            required: ["source", "target", "value"]
          }
        }
      },
      required: ["nodes", "links"]
    }
  },
  required: ["message", "isRumor"]
};

export const checkRumorWithGemini = async (query: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `请对以下信息进行谣言诊断：${query}

要求：
1. 请给出详细的文字诊断报告（Markdown格式）。
2. **必须生成传播路径图数据 (graphData)**：
   - 如果是谣言：请根据该谣言的历史传播轨迹，生成 4-8 个关键节点。包括源头（如某网友/某自媒体）、关键传播节点（如营销号/转发大V）、以及最终的辟谣方（如官方通报/权威媒体）。
   - 如果是真实新闻：请生成其发酵传播的过程。
   - 如果无法获取确切数据：请基于谣言传播的典型规律构建一个合理的模拟传播路径，以便用户理解。
   - **时间字段 (time)**：所有节点必须包含具体的时间点，格式严格为 'MM-DD HH:mm'（例如 06-15 10:30）。时间应体现传播的先后顺序。

请严格遵守 JSON Schema 输出。` }]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        systemInstruction: `你是一个专业的智慧谣言诊断系统。你的任务是分析用户输入的信息，判断其真伪，并可视化其传播路径。

回复原则：
1. **中文回复**：文字内容必须通俗易懂，逻辑严密。
2. **必须提供图谱数据**：除非用户输入完全无意义的字符，否则你应当尽力构建一个 'graphData' 对象来展示该信息（或类似谣言）是如何传播的。图谱对于用户的体验至关重要。
3. **图谱结构**：
   - Group 1: 谣言源头/最早发布者 (红色节点)
   - Group 2: 传播者/转发媒体/营销号 (橙色节点)
   - Group 3: 辟谣官方/权威媒体/查证结果 (蓝色节点)
4. **Markdown 优化**：在 'message' 字段中，使用加粗、列表和超链接来美化排版。`
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text) as AnalysisResult;
      // Ensure graphData is structurally valid even if AI returns partial
      if (!result.graphData || !result.graphData.nodes || result.graphData.nodes.length === 0) {
          result.graphData = null;
      }
      return result;
    }
    
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      message: "系统繁忙，无法获取分析结果，请稍后重试。",
      isRumor: false,
      graphData: null
    };
  }
};
