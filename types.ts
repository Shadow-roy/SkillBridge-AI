export interface SkillMetric {
  name: string;
  currentLevel: number; // 0-100
  requiredLevel: number; // 0-100
  category: 'Technical' | 'Soft Skill' | 'Tool';
  status: 'Proficient' | 'Gap' | 'Missing';
}

export interface LearningResource {
  title: string;
  type: 'Course' | 'Article' | 'Project' | 'Documentation';
  url?: string;
  description: string;
}

export interface RoadmapStep {
  weekRange: string;
  phaseTitle: string;
  description: string;
  focusSkills: string[];
  resources: LearningResource[];
}

export interface ProjectIdea {
  title: string;
  description: string;
  technologies: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AnalysisResult {
  jobRole: string;
  overallMatchScore: number;
  summary: string;
  skillsAnalysis: SkillMetric[];
  roadmap: RoadmapStep[];
  recommendedProjects: ProjectIdea[];
}

export interface UserInput {
  resumeText: string;
  targetRole: string;
}