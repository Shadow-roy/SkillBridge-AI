import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { SkillMetric } from '../types';

interface SkillChartProps {
  skills: SkillMetric[];
}

const SkillChart: React.FC<SkillChartProps> = ({ skills }) => {
  // Filter to top 6-8 most critical skills to keep chart readable
  const chartData = skills.slice(0, 7).map(skill => ({
    subject: skill.name,
    Current: skill.currentLevel,
    Required: skill.requiredLevel,
    fullMark: 100,
  }));

  if (skills.length === 0) return null;

  return (
    <div className="w-full h-[350px] bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Skill Proficiency vs. Requirement</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar
            name="Your Proficiency"
            dataKey="Current"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.5}
          />
          <Radar
            name="Market Standard"
            dataKey="Required"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.2}
          />
          <Legend />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillChart;