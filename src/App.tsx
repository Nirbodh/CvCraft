/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CV, DEFAULT_CV, TemplateId, CvData } from './types/cv.ts';
import { AuthProvider, useAuth } from './services/authContext.tsx';
import { api } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { DocumentImportModal } from './components/DocumentImportModal.tsx';
import { WritingAssistantDrawer } from './components/WritingAssistantDrawer.tsx';
import { DatabaseStatusModal } from './components/DatabaseStatusModal.tsx';
import { GeminiChatDrawer } from './components/GeminiChatbot/GeminiChatDrawer.tsx';
import { GeminiFloatingButton } from './components/GeminiChatbot/GeminiFloatingButton.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { EditorPage } from './pages/EditorPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'editor' | 'dashboard' | 'admin'>('landing');
  const [activeCv, setActiveCv] = useState<CV>(DEFAULT_CV);
  const [savedCount, setSavedCount] = useState<number>(0);

  // Modals & Chat state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isWritingAssistantOpen, setIsWritingAssistantOpen] = useState(false);
  const [isDbStatusOpen, setIsDbStatusOpen] = useState(false);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState(false);

  // Fetch saved CVs count if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api
        .getCvs()
        .then((res) => setSavedCount(res.count || 0))
        .catch(() => {});
    } else {
      setSavedCount(0);
    }
  }, [isAuthenticated, currentView]);

  const handleStartBuilding = (templateId?: TemplateId) => {
    if (templateId) {
      setActiveCv((prev) => ({ ...prev, templateId }));
    }
    setCurrentView('editor');
  };

  const handleImportComplete = (extractedData: Partial<CvData>) => {
    setActiveCv((prev) => ({
      ...prev,
      title: `${extractedData.personalInfo?.fullName || 'Imported'} Resume`,
      data: {
        ...prev.data,
        ...extractedData,
      },
    }));
    setCurrentView('editor');
  };

  const handleOpenCv = (cv: CV) => {
    setActiveCv(cv);
    setCurrentView('editor');
  };

  const handleCreateNew = () => {
    setActiveCv({
      ...DEFAULT_CV,
      _id: undefined,
      id: undefined,
      title: 'New Resume',
    });
    setCurrentView('editor');
  };

  const handleInsertAssistantText = (text: string) => {
    // Append enhanced text to first experience bullet or summary
    setActiveCv((prev) => {
      const exp = [...prev.data.experience];
      if (exp.length > 0) {
        const highlights = [...(exp[0].highlights || []), text];
        exp[0] = { ...exp[0], highlights };
        return {
          ...prev,
          data: {
            ...prev.data,
            experience: exp,
          },
        };
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          summary: prev.data.summary ? `${prev.data.summary} ${text}` : text,
        },
      };
    });
    setIsWritingAssistantOpen(false);
  };

  const handleApplySummaryFromChat = (summaryText: string) => {
    setActiveCv((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        summary: summaryText,
      },
    }));
  };

  const handleInsertHighlightFromChat = (bulletText: string) => {
    setActiveCv((prev) => {
      const exp = [...prev.data.experience];
      if (exp.length > 0) {
        const highlights = [...(exp[0].highlights || []), bulletText];
        exp[0] = { ...exp[0], highlights };
        return {
          ...prev,
          data: {
            ...prev.data,
            experience: exp,
          },
        };
      }
      return prev;
    });
  };

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-slate-100">
        <AdminDashboardPage onReturnToApp={() => setCurrentView('landing')} />
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenImport={() => setIsImportModalOpen(true)}
        onOpenWritingAssistant={() => setIsWritingAssistantOpen(true)}
        onOpenGeminiChat={() => setIsGeminiChatOpen(true)}
        onOpenDbStatus={() => setIsDbStatusOpen(true)}
        onDownloadPdf={() => window.print()}
        savedCount={savedCount}
      />
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartBuilding={handleStartBuilding}
            onOpenImport={() => setIsImportModalOpen(true)}
            onOpenWritingAssistant={() => setIsWritingAssistantOpen(true)}
          />
        )}
        {currentView === 'editor' && (
          <EditorPage
            initialCv={activeCv}
            onOpenWritingAssistant={() => setIsWritingAssistantOpen(true)}
            onOpenImport={() => setIsImportModalOpen(true)}
            onCvSaved={(saved) => {
              setActiveCv(saved);
              setSavedCount((prev) => prev + 1);
            }}
          />
        )}
        {currentView === 'dashboard' && (
          <DashboardPage
            onOpenCv={handleOpenCv}
            onCreateNew={handleCreateNew}
          />
        )}
      </main>
      <Footer
        onNavigate={setCurrentView}
        onOpenDbStatus={() => setIsDbStatusOpen(true)}
      />

      {/* Global Interactive Modals */}
      <AuthModal />
      <DocumentImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />
      <WritingAssistantDrawer
        isOpen={isWritingAssistantOpen}
        onClose={() => setIsWritingAssistantOpen(false)}
        onInsertText={handleInsertAssistantText}
      />
      <DatabaseStatusModal
        isOpen={isDbStatusOpen}
        onClose={() => setIsDbStatusOpen(false)}
      />

      {/* Gemini AI Chatbot Drawer & Floating Action Button */}
      <GeminiChatDrawer
        isOpen={isGeminiChatOpen}
        onClose={() => setIsGeminiChatOpen(false)}
        activeCv={activeCv}
        onApplySummary={handleApplySummaryFromChat}
        onInsertHighlight={handleInsertHighlightFromChat}
      />
      <GeminiFloatingButton
        isOpen={isGeminiChatOpen}
        onClick={() => setIsGeminiChatOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
