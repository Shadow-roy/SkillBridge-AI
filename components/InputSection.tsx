import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon, BriefcaseIcon, ArrowRightIcon, FileTextIcon, MagicWandIcon, AlertCircleIcon } from './Icons';

interface InputSectionProps {
  onAnalyze: (resume: string, role: string) => void;
  isLoading: boolean;
}

const SAMPLE_RESUME = `
John Doe
Software Developer
Summary: Junior web developer with 1 year of experience building React applications. Passionate about UI/UX.
Skills: HTML, CSS, JavaScript, React, Git, Basic Node.js
Experience:
- Frontend Developer Intern at TechCorp (2023-Present): Built landing pages, fixed bugs in React codebase.
- Freelance Web Designer (2022-2023): Created WordPress sites for local businesses.
Education: BS Computer Science, State University (2023)
`;

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [role, setRole] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = async (file: File) => {
    // Check file type
    if (file.type === "text/plain" || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
      const text = await file.text();
      setResumeText(text);
      setFileName(file.name);
      setActiveTab('upload');
    } else if (file.type === "application/pdf") {
      alert("Note: PDF parsing is limited in the browser. For 100% accuracy, please Open your PDF, Select All (Ctrl+A), Copy, and Paste into the text area.");
    } else {
      alert("Please upload a .txt or .md file, or paste your text directly.");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const useSampleData = () => {
    setRole("Senior Frontend Engineer");
    setResumeText(SAMPLE_RESUME);
    setActiveTab('paste');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role.trim() && resumeText.trim()) {
      onAnalyze(resumeText, role);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
          <MagicWandIcon className="w-3 h-3" /> AI Career Architect
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
          Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Career Roadmap</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Don't guess your next move. Let AI analyze your resume against real-world job requirements to reveal your skill gaps and build a custom learning path.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden relative">
        {/* Decorative top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Job Role Input */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
              <BriefcaseIcon className="w-4 h-4 text-blue-600" />
              Target Job Role
            </label>
            <div className="relative group">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Full Stack Developer, Product Manager, Data Scientist"
                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium text-slate-800 placeholder-slate-400 cursor-text"
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-slate-400 font-medium">Desired Role</span>
              </div>
            </div>
          </div>

          {/* Resume Input Section */}
          <div className="space-y-3">
             <div className="flex justify-between items-end">
                <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4 text-blue-600" />
                  Your Resume / CV
                </label>
                
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveTab('paste')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all lg:cursor-pointer ${activeTab === 'paste' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all lg:cursor-pointer ${activeTab === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Upload File
                  </button>
                </div>
             </div>
            
            {activeTab === 'paste' ? (
              <div className="relative">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your full resume content here... (Ctrl+V)"
                  className="w-full h-64 px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none font-mono text-sm leading-relaxed cursor-text"
                />
                {resumeText.length < 50 && (
                   <div className="absolute bottom-4 right-4">
                      <button 
                        type="button" 
                        onClick={useSampleData}
                        className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors lg:cursor-pointer"
                      >
                        <MagicWandIcon className="w-3 h-3" /> Try Sample Data
                      </button>
                   </div>
                )}
              </div>
            ) : (
              <div 
                className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all bg-slate-50 lg:cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-100'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {fileName ? (
                  <div className="text-center animate-fade-in">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileTextIcon className="w-8 h-8" />
                    </div>
                    <p className="text-slate-900 font-medium">{fileName}</p>
                    <p className="text-slate-500 text-sm mt-1">Click to change file</p>
                  </div>
                ) : (
                  <div className="text-center px-4">
                    <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <UploadIcon className="w-6 h-6" />
                    </div>
                    <p className="text-slate-900 font-medium">Click to upload or drag & drop</p>
                    <p className="text-slate-500 text-xs mt-2 max-w-xs mx-auto">
                      Supports .txt, .md. <br/>
                      <span className="text-amber-600 flex items-center justify-center gap-1 mt-1">
                         <AlertCircleIcon className="w-3 h-3" /> For PDFs: Please Copy & Paste text for best results.
                      </span>
                    </p>
                  </div>
                )}
                <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   className="hidden" 
                   accept=".txt,.md"
                 />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !role || resumeText.length < 20}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] lg:cursor-pointer ${
              isLoading || !role || resumeText.length < 20
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/30'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing Profile...
              </>
            ) : (
              <>
                Generate Career Roadmap <ArrowRightIcon className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* Footer hint */}
      <div className="mt-8 text-center text-slate-400 text-sm">
        <p>🔒 Privacy-First: Your resume is analyzed in real-time and never stored on our servers.</p>
      </div>
    </div>
  );
};

export default InputSection;