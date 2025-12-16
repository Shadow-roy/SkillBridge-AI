import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import SkillChart from './SkillChart';
import RoadmapView from './RoadmapView';
import { saveReport } from '../services/storageService';
import { TargetIcon, AlertCircleIcon, RefreshIcon, CheckCircleIcon, ShareIcon, LinkIcon } from './Icons';

interface DashboardProps {
  data: AnalysisResult;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Sort skills to show gaps first for the list
  const gapSkills = data.skillsAnalysis.filter(s => s.status !== 'Proficient');
  
  // Categorize skills for better display
  const technicalGaps = gapSkills.filter(s => s.category === 'Technical');
  const softGaps = gapSkills.filter(s => s.category === 'Soft Skill');

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // Save data via service (Cloud or Local)
      const reportId = await saveReport(data);
      
      // Create link
      const url = new URL(window.location.href);
      url.searchParams.set('reportId', reportId);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url.toString());
      
      // Show tooltip
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2500);
    } catch (e) {
      console.error("Failed to share report", e);
      alert("Could not generate share link. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Top Navigation / Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Analysis Report</h2>
          <p className="text-slate-500 mt-1">Target Role: <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{data.jobRole}</span></p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Share Button */}
          <div className="relative">
             <button 
              onClick={handleShare}
              disabled={isSharing}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSharing ? (
                <div className="w-4 h-4 border-2 border-blue-700/30 border-t-blue-700 rounded-full animate-spin"></div>
              ) : (
                <ShareIcon className="w-4 h-4" />
              )}
              {isSharing ? 'Saving...' : 'Share Report'}
            </button>
            
            {/* Tooltip */}
            {showShareTooltip && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 bg-slate-800 text-white text-xs py-2 px-3 rounded-lg shadow-xl z-50 flex items-center justify-center gap-2 animate-fade-in">
                <LinkIcon className="w-3 h-3 text-green-400" /> Link copied to clipboard!
              </div>
            )}
          </div>

          <button 
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <RefreshIcon className="w-4 h-4" />
            New Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stats & Charts (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Executive Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all duration-700 group-hover:bg-white/20"></div>
             <h3 className="text-sm font-bold text-blue-200 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <TargetIcon className="w-4 h-4" /> AI Verdict
             </h3>
             <p className="text-slate-100 leading-relaxed text-sm opacity-90">
               {data.summary}
             </p>
             <div className="mt-6 flex items-end justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Match Score</span>
                  <div className="text-4xl font-bold mt-1 text-white">{data.overallMatchScore}%</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                   data.overallMatchScore >= 75 ? 'bg-green-500/20 text-green-300' : 
                   data.overallMatchScore >= 50 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'
                }`}>
                   {data.overallMatchScore >= 75 ? 'Job Ready' : data.overallMatchScore >= 50 ? 'Getting Close' : 'High Gap'}
                </div>
             </div>
             {/* Progress Bar */}
             <div className="w-full bg-white/10 rounded-full h-1.5 mt-4">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-1000 ${data.overallMatchScore > 75 ? 'bg-green-400' : data.overallMatchScore > 50 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                  style={{ width: `${data.overallMatchScore}%` }}
                ></div>
              </div>
          </div>

          {/* Radar Chart */}
          <SkillChart skills={data.skillsAnalysis} />

          {/* Skill Gaps Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircleIcon className="w-4 h-4 text-amber-500" />
              Priority Focus Areas
            </h3>
            
            {technicalGaps.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Technical Skills</span>
                <div className="space-y-2">
                  {technicalGaps.slice(0, 4).map((skill, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="text-slate-700 font-medium">{skill.name}</span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{skill.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {softGaps.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Soft Skills</span>
                <div className="flex flex-wrap gap-2">
                  {softGaps.map((skill, idx) => (
                    <span key={idx} className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-100">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {gapSkills.length === 0 && (
               <div className="text-center py-6 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-700">Exceptional Match!</p>
                  <p className="text-xs text-green-600">No critical gaps detected.</p>
               </div>
            )}
          </div>
        </div>

        {/* Right Column: Roadmap & Projects (8 cols) */}
        <div className="lg:col-span-8">
           <RoadmapView steps={data.roadmap} projects={data.recommendedProjects} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;