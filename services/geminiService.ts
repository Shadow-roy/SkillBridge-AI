import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for structured JSON output
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    jobRole: { type: Type.STRING, description: "The target job role analyzed." },
    overallMatchScore: { type: Type.INTEGER, description: "A score from 0 to 100 indicating fit based on skills and experience." },
    summary: { type: Type.STRING, description: "A brief, encouraging executive summary of the candidate's fit (max 3 sentences)." },
    skillsAnalysis: {
      type: Type.ARRAY,
      description: "List of 6-10 key skills required for the role.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          currentLevel: { type: Type.INTEGER, description: "Estimated proficiency 0-100 based on resume evidence." },
          requiredLevel: { type: Type.INTEGER, description: "Industry standard proficiency 0-100 for this role." },
          category: { type: Type.STRING, enum: ["Technical", "Soft Skill", "Tool"] },
          status: { type: Type.STRING, enum: ["Proficient", "Gap", "Missing"] }
        },
        required: ["name", "currentLevel", "requiredLevel", "category", "status"]
      }
    },
    roadmap: {
      type: Type.ARRAY,
      description: "A 4-6 step phased learning path.",
      items: {
        type: Type.OBJECT,
        properties: {
          weekRange: { type: Type.STRING, description: "e.g., 'Weeks 1-2'" },
          phaseTitle: { type: Type.STRING },
          description: { type: Type.STRING },
          focusSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["Course", "Article", "Project", "Documentation"] },
                description: { type: Type.STRING },
                url: { type: Type.STRING, description: "A specific, real URL to a high-quality resource if known, or a search query." }
              },
              required: ["title", "type", "description"]
            }
          }
        },
        required: ["weekRange", "phaseTitle", "description", "focusSkills", "resources"]
      }
    },
    recommendedProjects: {
      type: Type.ARRAY,
      description: "2-3 practical portfolio projects.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
          difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] }
        },
        required: ["title", "description", "technologies", "difficulty"]
      }
    }
  },
  required: ["jobRole", "overallMatchScore", "summary", "skillsAnalysis", "roadmap", "recommendedProjects"]
};

const cleanJsonOutput = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  
  // Extract just the JSON object if there's extra text
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  
  return cleaned;
};

export const analyzeCareerPath = async (resumeText: string, targetRole: string): Promise<AnalysisResult> => {
  try {
    const systemInstruction = `
      You are an expert Career Coach and Technical Recruiter. 
      Your goal is to analyze a candidate's resume against a target job role and provide a strict, data-driven gap analysis.
      
      Rules for Analysis:
      1. **Be Objective**: Do not overestimate skills. If a skill is mentioned but not demonstrated with depth, score it lower (20-40).
      2. **Identify Gaps**: Focus on what is missing for the ${targetRole}. 
      3. **Actionable Roadmap**: Create a learning path that is realistic. Break it down into 4-6 phases.
      4. **Project Based**: Suggest projects that solve real-world problems relevant to the role.
    `;

    const userPrompt = `
      Target Job Role: ${targetRole}
      
      Candidate Resume:
      "${resumeText.slice(0, 20000)}"
      
      Please generate the career analysis JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2, // Low temperature for consistent output
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Empty response from AI");
    }

    const cleanedJson = cleanJsonOutput(jsonText);
    return JSON.parse(cleanedJson) as AnalysisResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze career path. Please try again.");
  }
};
