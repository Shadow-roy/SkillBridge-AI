import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import Dashboard from './components/Dashboard';
import CursorFollower from './components/CursorFollower';
import { AnalysisResult } from './types';
import { analyzeCareerPath } from './services/geminiService';
import { getReport } from './services/storageService';
import { MapIcon, XIcon, MagicWandIcon } from './components/Icons';

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  // Load shared report on mount
  useEffect(() => {
    const loadSharedReport = async () => {
      const params = new URLSearchParams(window.location.search);
      const reportId = params.get('reportId');
      
      if (reportId) {
        setRestoring(true);
        try {
          const savedData = await getReport(reportId);
          if (savedData) {
            setResult(savedData);
          } else {
             setError("Shared report not found. It may have expired or was created on a different device.");
          }
        } catch (e) {
          console.error("Failed to load report", e);
          setError("Failed to retrieve the shared report.");
        } finally {
          setRestoring(false);
        }
      }
    };

    loadSharedReport();
  }, []);

  const handleAnalysis = async (resume: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeCareerPath(resume, role);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
    // Clear URL params without refreshing
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col cursor-auto lg:cursor-none relative">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <MapIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">SkillBridge AI</span>
          </div>
          <button 
            onClick={() => setShowAbout(true)}
            className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors focus:outline-none lg:cursor-pointer"
          >
            About
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {restoring ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
             <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-500 font-medium">Retrieving shared report...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="max-w-3xl mx-auto mt-6 px-4 animate-fade-in">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              </div>
            )}

            {!result ? (
              <InputSection onAnalyze={handleAnalysis} isLoading={loading} />
            ) : (
              <Dashboard data={result} onReset={resetAnalysis} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} SkillBridge AI. Powered by Sagar.</p>
        </div>
      </footer>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowAbout(false)}>
           <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative scale-100 transition-transform cursor-auto" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowAbout(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                  <MagicWandIcon className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">About SkillBridge AI</h2>
              </div>
              
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
                <p>
                  SkillBridge AI helps you bridge the gap between your current skills and your dream job.
                </p>
                <p>
                  Powered by <strong>Sagar</strong>, our system performs a real-time gap analysis of your resume against the specific requirements of your target role.
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700 font-medium">
                   <li>Identify critical skill gaps</li>
                   <li>Generate a weekly learning roadmap</li>
                   <li>Suggest portfolio-ready projects</li>
                </ul>
                <p className="text-xs text-slate-500 pt-6 border-t border-slate-100">
                  <strong>Privacy Note:</strong> Your resume is analyzed securely in real-time. We do not store your personal documents on our servers.
                </p>
              </div>
           </div>
        </div>
      )}

      {/* Cursor Follower placed at the end to ensure it overlays everything */}
      <CursorFollower />
    </div>
  );
}

export default App;