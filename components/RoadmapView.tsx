import React from 'react';
import { RoadmapStep, ProjectIdea } from '../types';
import { BookOpenIcon, CheckCircleIcon, ArrowRightIcon } from './Icons';
import SpotlightCard from './SpotlightCard';

interface RoadmapViewProps {
  steps: RoadmapStep[];
  projects: ProjectIdea[];
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ steps, projects }) => {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Learning Path */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5 text-blue-600" />
            Your Personalized Learning Path
          </h3>
          <p className="text-slate-500 text-sm mt-1">A step-by-step guide to bridging your skill gaps.</p>
        </div>
        
        <div className="p-6">
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-12 pb-2">
            {steps.map((step, index) => (
              <div key={index} className="relative pl-8 group">
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-200 group-hover:border-blue-500 transition-colors shadow-sm"></div>
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-1 rounded-md self-start">
                    {step.weekRange}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900">{step.phaseTitle}</h4>
                </div>
                
                <p className="text-slate-600 mb-5 leading-relaxed">{step.description}</p>
                
                {/* Focus Skills */}
                <div className="mb-5">
                   <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Key Skills</h5>
                   <div className="flex flex-wrap gap-2">
                    {step.focusSkills.map((skill, i) => (
                      <span key={i} className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resources Card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-blue-200 transition-colors">
                  <h5 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Recommended Actions
                  </h5>
                  <ul className="space-y-3">
                    {step.resources.map((res, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                        <div className="mt-0.5">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                          res.type === 'Course' ? 'bg-purple-100 text-purple-700' :
                          res.type === 'Project' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {res.type}
                        </span>
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-slate-800 block mb-0.5">{res.title}</span>
                          <span className="text-slate-500 text-xs leading-relaxed block">{res.description}</span>
                          {res.url && (
                            <a href="#" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs mt-1 font-medium">
                               View Resource <ArrowRightIcon className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Projects with Spotlight Animation */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            Recommended Portfolio Projects
          </h3>
          <p className="text-slate-500 text-sm mt-1">Practical ways to demonstrate your new skills to employers.</p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <SpotlightCard key={index} className="flex flex-col h-full bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all duration-300">
              <div className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{project.title}</h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                    project.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    project.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {project.difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4 flex-grow relative z-10">{project.description}</p>
                <div className="pt-4 border-t border-slate-100 mt-auto relative z-10">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-[10px] font-medium px-2 py-1 bg-slate-50 text-slate-600 rounded-full border border-slate-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;