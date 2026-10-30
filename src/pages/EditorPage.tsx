import React, { useState, useEffect, useRef } from 'react';
import { CV, DEFAULT_CV, CvData } from '../types/cv.ts';
import { useAuth } from '../services/authContext.tsx';
import { api } from '../services/api.ts';
import { CvRenderer } from '../components/Templates/CvRenderer.tsx';
import { TemplateSelector } from '../components/TemplateSelector.tsx';
import { TemplateGalleryModal } from '../components/TemplateGalleryModal.tsx';
import { PersonalSection } from '../components/Editor/PersonalSection.tsx';
import { SummarySection } from '../components/Editor/SummarySection.tsx';
import { ObjectiveSection } from '../components/Editor/ObjectiveSection.tsx';
import { ExperienceSection } from '../components/Editor/ExperienceSection.tsx';
import { EducationSection } from '../components/Editor/EducationSection.tsx';
import { SkillsSection } from '../components/Editor/SkillsSection.tsx';
import { ProjectsSection } from '../components/Editor/ProjectsSection.tsx';
import { CertificationsSection } from '../components/Editor/CertificationsSection.tsx';
import { LanguagesSection } from '../components/Editor/LanguagesSection.tsx';
import { AwardsSection } from '../components/Editor/AwardsSection.tsx';
import { PublicationsSection } from '../components/Editor/PublicationsSection.tsx';
import { MembershipsSection } from '../components/Editor/MembershipsSection.tsx';
import { VolunteeringSection } from '../components/Editor/VolunteeringSection.tsx';
import { TrainingsSection } from '../components/Editor/TrainingsSection.tsx';
import { ReferencesSection } from '../components/Editor/ReferencesSection.tsx';
import { InterestsSection } from '../components/Editor/InterestsSection.tsx';
import { DrivingLicenceSection } from '../components/Editor/DrivingLicenceSection.tsx';
import { PersonalDetailsSection } from '../components/Editor/PersonalDetailsSection.tsx';
import { AdditionalInfoSection } from '../components/Editor/AdditionalInfoSection.tsx';
import { CustomSections } from '../components/Editor/CustomSections.tsx';
import { SectionManagerModal } from '../components/Editor/SectionManagerModal.tsx';
import { CountrySelector } from '../components/CountrySelector.tsx';
import { exportCvToDocx } from '../services/docxExport.ts';
import { COUNTRY_PROFILES } from '../config/countries.ts';
import { CountryId, TemplateId } from '../types/cv.ts';
import { TranslationModal } from '../components/TranslationModal.tsx';
import { AdminTemplateManagerModal } from '../components/AdminTemplateManagerModal.tsx';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  Award,
  Globe,
  Sliders,
  Save,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  Edit3,
  Loader2,
  Globe2,
  FileDown,
  LayoutTemplate,
  Languages,
  Code,
  Target,
  BookOpen,
  Users,
  HeartHandshake,
  Presentation,
  UserCheck,
  Compass,
  Car,
  FilePlus2,
  ChevronDown,
} from 'lucide-react';

export type EditorTabId =
  | 'country'
  | 'personal'
  | 'summary'
  | 'objective'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'publications'
  | 'memberships'
  | 'volunteering'
  | 'trainings'
  | 'references'
  | 'interests'
  | 'drivingLicence'
  | 'personalDetails'
  | 'additionalInfo'
  | 'customSections'
  | 'style';

interface EditorPageProps {
  initialCv?: CV;
  onOpenWritingAssistant: () => void;
  onOpenImport: () => void;
  onCvSaved?: (cv: CV) => void;
}

const LOCAL_STORAGE_DRAFT_KEY = 'cvcraft_guest_draft';

export const EditorPage: React.FC<EditorPageProps> = ({
  initialCv,
  onOpenWritingAssistant,
  onOpenImport,
  onCvSaved,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // Load from props or local guest draft or defaults
  const [cv, setCv] = useState<CV>(() => {
    if (initialCv) return initialCv;
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse draft from localStorage:', e);
    }
    return DEFAULT_CV;
  });

  const [activeTab, setActiveTab] = useState<EditorTabId>('personal');
  const [isSectionManagerOpen, setIsSectionManagerOpen] = useState(false);
  const [moreSectionsDropdownOpen, setMoreSectionsDropdownOpen] = useState(false);

  const [mobileMode, setMobileMode] = useState<'edit' | 'preview'>('edit');
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [isSaving, setIsSaving] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isAdminTemplateManagerOpen, setIsAdminTemplateManagerOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  type SyncStatus = 'idle' | 'unsaved' | 'saving' | 'saved' | 'error' | 'guest-saved';

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => {
    if (initialCv && (initialCv._id || initialCv.id)) return 'saved';
    return 'idle';
  });
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(() => {
    if (initialCv && (initialCv.updatedAt || initialCv.createdAt)) {
      return new Date(initialCv.updatedAt || initialCv.createdAt || '');
    }
    return null;
  });

  const lastSavedJsonRef = useRef<string>(
    initialCv && (initialCv._id || initialCv.id) ? JSON.stringify(initialCv) : ''
  );
  const isFirstMountRef = useRef<boolean>(true);

  // Auto-sync effect: auto-saves to localStorage for guests, and debounced sync with backend for authenticated users with a saved CV
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(cv));
    } catch (e) {
      console.warn('Auto-save to localStorage failed:', e);
    }

    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }

    if (!isAuthenticated) {
      setSyncStatus('guest-saved');
      return;
    }

    const cvId = cv._id || cv.id;
    if (!cvId) {
      setSyncStatus('unsaved');
      return;
    }

    const currentJson = JSON.stringify(cv);
    if (currentJson === lastSavedJsonRef.current) {
      return;
    }

    setSyncStatus('unsaved');

    const debounceTimer = setTimeout(async () => {
      setSyncStatus('saving');
      try {
        const result = await api.updateCv(cvId, cv);
        lastSavedJsonRef.current = JSON.stringify(result.cv);
        setSyncStatus('saved');
        setLastSavedTime(new Date());
        if (onCvSaved) onCvSaved(result.cv);
      } catch (err: any) {
        console.warn('Auto-synchronization error:', err?.message || err);
        setSyncStatus('error');
      }
    }, 1500);

    return () => clearTimeout(debounceTimer);
  }, [cv, isAuthenticated]);

  // Sync if initialCv changes
  useEffect(() => {
    if (initialCv) {
      setCv(initialCv);
      if (initialCv._id || initialCv.id) {
        lastSavedJsonRef.current = JSON.stringify(initialCv);
        setSyncStatus('saved');
        if (initialCv.updatedAt || initialCv.createdAt) {
          setLastSavedTime(new Date(initialCv.updatedAt || initialCv.createdAt || ''));
        }
      }
    }
  }, [initialCv]);

  const updateCvMeta = (updates: Partial<CV>) => {
    setCv((prev) => ({ ...prev, ...updates }));
  };

  const updateCvData = (updates: Partial<CvData>) => {
    setCv((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        ...updates,
      },
    }));
  };

  const handleSaveToCloud = async () => {
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    if (!isAuthenticated) {
      openAuthModal('register');
      return;
    }

    setIsSaving(true);
    setSyncStatus('saving');
    try {
      const cvId = cv._id || cv.id;
      let result;
      if (cvId) {
        result = await api.updateCv(cvId, cv);
      } else {
        result = await api.createCv(cv);
      }
      lastSavedJsonRef.current = JSON.stringify(result.cv);
      setCv(result.cv);
      setSyncStatus('saved');
      setLastSavedTime(new Date());
      if (onCvSaved) onCvSaved(result.cv);
      setSaveSuccessMsg('CV synchronized with your cloud account!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      setSyncStatus('error');
      setSaveErrorMsg(err.message || 'Failed to save CV.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatSavedTime = (date: Date) => {
    try {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset CV to default sample content? Your current changes will be overwritten.')) {
      setCv(DEFAULT_CV);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCountrySelect = (countryId: CountryId, applyRecommendedDefaults = false) => {
    const profile = COUNTRY_PROFILES[countryId];
    if (applyRecommendedDefaults && profile) {
      setCv((prev) => ({
        ...prev,
        countryId,
        templateId: profile.recommendedTemplates[0] || prev.templateId,
        sectionOrder: profile.defaultSectionOrder || prev.sectionOrder,
        data: {
          ...prev.data,
          personalInfo: {
            ...prev.data.personalInfo,
            showPhoto: profile.photoConvention !== 'discouraged',
          },
        },
      }));
      setSaveSuccessMsg(`Applied ${profile.name} CV structure, recommended template & photo guidelines.`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } else {
      updateCvMeta({ countryId });
    }
  };

  const handleDocxExport = async () => {
    setIsExportingDocx(true);
    try {
      await exportCvToDocx(cv);
      setSaveSuccessMsg('DOCX document generated and downloaded successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`DOCX export failed: ${err?.message || err}`);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleTemplateSelectFromGallery = (templateId: TemplateId, optionalColor?: string) => {
    setCv((prev) => ({
      ...prev,
      templateId,
      themeColor: optionalColor || prev.themeColor,
      isCustomTemplate: false,
    }));
    setSyncStatus('unsaved');
    setSaveSuccessMsg(`Switched to ${templateId.toUpperCase()} template! All your CV content is preserved.`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const handleApplyTranslation = (translatedData: CvData, targetLang: string) => {
    setCv((prev) => {
      const original = prev.originalData || JSON.parse(JSON.stringify(prev.data));
      const updatedTranslations = {
        ...(prev.translations || {}),
        [targetLang]: translatedData,
      };
      return {
        ...prev,
        data: translatedData,
        originalData: original,
        activeLanguage: targetLang,
        translations: updatedTranslations,
      };
    });
    setSyncStatus('unsaved');
    setSaveSuccessMsg(`CV localized into ${targetLang.toUpperCase()}! You can toggle back anytime.`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleToggleOriginalLanguage = () => {
    if (!cv.originalData) return;
    const isShowingOriginal = cv.activeLanguage === 'en';
    if (isShowingOriginal && cv.translations && Object.keys(cv.translations).length > 0) {
      const targetLang = Object.keys(cv.translations)[0];
      setCv((prev) => ({
        ...prev,
        data: prev.translations![targetLang],
        activeLanguage: targetLang,
      }));
    } else {
      setCv((prev) => ({
        ...prev,
        data: prev.originalData!,
        activeLanguage: 'en',
      }));
    }
  };

  const handleSelectTemplateFromAdmin = (templateId: string, customHtml?: string, customCss?: string) => {
    setCv((prev) => ({
      ...prev,
      templateId,
      isCustomTemplate: Boolean(customHtml),
      customTemplateHtml: customHtml || '',
      customTemplateCss: customCss || '',
    }));
    setSyncStatus('unsaved');
    setSaveSuccessMsg(`Applied template "${templateId}". All your CV content is preserved.`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const currentCountry = COUNTRY_PROFILES[cv.countryId || 'usa'] || COUNTRY_PROFILES.usa;

  // Compile context input for the deterministic summary generator
  const summaryContext = {
    jobTitle: cv.data.personalInfo.jobTitle,
    skills: cv.data.skills.flatMap((s) => s.items),
    yearsExperience: cv.data.experience.length * 2,
    topCompanies: cv.data.experience.map((e) => e.company).filter(Boolean),
    degree: cv.data.education[0]?.degree,
    field: cv.data.education[0]?.field,
  };

  return (
    <div className="bg-slate-100 min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Top Editor Sub-header */}
      <div className="no-print bg-white border-b border-slate-200 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Title input and subtle Saved indicator */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={cv.title || ''}
                onChange={(e) => updateCvMeta({ title: e.target.value })}
                placeholder="CV Title (e.g. Senior Software Engineer CV)"
                className="text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5 w-48 sm:w-60"
              />
            </div>

            {/* Interactive Template Style Badge */}
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2 py-0.5 rounded-md cursor-pointer capitalize flex items-center gap-1 transition-colors shadow-2xs"
              title="Click to open Template Gallery"
            >
              <LayoutTemplate className="w-3 h-3 text-purple-600" />
              <span>{cv.templateId} Style</span>
              <span className="text-purple-400 font-normal">· Change</span>
            </button>

            {/* Subtle Saved / Syncing indicator */}
            <div className="flex items-center text-[11px] font-medium text-slate-500 pl-0.5">
              <span aria-hidden="true" className="text-slate-300 mr-2">·</span>
              {syncStatus === 'saving' && (
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600 shrink-0" />
                  <span>Saving...</span>
                </span>
              )}
              {syncStatus === 'saved' && (
                <span className="text-slate-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Saved{lastSavedTime ? ` · ${formatSavedTime(lastSavedTime)}` : ''}</span>
                </span>
              )}
              {syncStatus === 'unsaved' && (
                <span className="text-amber-600/90 flex items-center gap-1.5" title="Changes pending synchronization">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Unsaved changes</span>
                </span>
              )}
              {syncStatus === 'error' && (
                <button
                  type="button"
                  onClick={handleSaveToCloud}
                  className="text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
                  title="Click to retry saving"
                >
                  <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>Sync failed · Retry</span>
                </button>
              )}
              {syncStatus === 'guest-saved' && (
                <span className="text-slate-400 flex items-center gap-1" title="Draft saved locally in this browser">
                  <Check className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Draft saved locally</span>
                </span>
              )}
              {syncStatus === 'idle' && (
                <span className="text-slate-400">Ready</span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mobile preview toggle */}
            <div className="flex sm:hidden bg-slate-100 p-0.5 rounded border border-slate-200">
              <button
                type="button"
                onClick={() => setMobileMode('edit')}
                className={`px-2.5 py-1 text-xs font-medium rounded ${
                  mobileMode === 'edit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setMobileMode('preview')}
                className={`px-2.5 py-1 text-xs font-medium rounded ${
                  mobileMode === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Template Gallery Modal Trigger Button */}
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Open Template Gallery to switch CV styles"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-purple-600" />
              <span>Gallery</span>
            </button>

            {/* Translation Engine Button */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsTranslateOpen(true)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Translate CV into Japanese, German, French, Spanish, Bengali, etc."
              >
                <Languages className="w-3.5 h-3.5 text-indigo-600" />
                <span>Translate</span>
                {cv.activeLanguage && cv.activeLanguage !== 'en' && (
                  <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded text-[10px] uppercase font-mono">
                    {cv.activeLanguage}
                  </span>
                )}
              </button>

              {/* Toggle back to Original Draft if translated */}
              {cv.originalData && (
                <button
                  type="button"
                  onClick={handleToggleOriginalLanguage}
                  className="px-2 py-1.5 text-[11px] font-medium rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                  title="Switch between translated version and original English draft"
                >
                  {cv.activeLanguage === 'en' ? 'Show Translated' : 'Show Original (EN)'}
                </button>
              )}
            </div>

            {/* Manage Sections Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsSectionManagerOpen(true)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Organize, reorder, rename, or toggle visibility of all CV sections"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Sections</span>
            </button>

            {/* Admin Template Studio Trigger */}
            <button
              type="button"
              onClick={() => setIsAdminTemplateManagerOpen(true)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded border border-slate-300 bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Admin: Create, edit, and duplicate custom HTML/CSS templates"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Template Studio</span>
              <span className="lg:hidden">Studio</span>
            </button>

            {/* Country Selector Trigger */}
            <button
              type="button"
              onClick={() => setActiveTab('country')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'country'
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Target Country Recruitment Profile"
            >
              <span>{currentCountry.flag}</span>
              <span className="hidden sm:inline">{currentCountry.name}</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded transition-colors cursor-pointer"
              title="Reset to default sample"
            >
              <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Save to Account' : 'Save (Sign Up)'}</span>
            </button>

            {/* DOCX Export Button */}
            <button
              type="button"
              disabled={isExportingDocx}
              onClick={handleDocxExport}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Download Microsoft Word .docx format"
            >
              {isExportingDocx ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-blue-600" />
              )}
              <span>Download DOCX</span>
            </button>

            {/* A4 PDF Download Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download A4 PDF</span>
            </button>
          </div>
        </div>

        {/* Guest Warning / Save Status Bar */}
        <div className="max-w-7xl mx-auto pt-2">
          {saveSuccessMsg && (
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}
          {saveErrorMsg && (
            <div className="p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{saveErrorMsg}</span>
            </div>
          )}
          {!isAuthenticated && !saveSuccessMsg && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
              <span>
                💡 <b>Guest Mode:</b> Your CV is auto-saved locally in this browser. Register a free account to access it on any device.
              </span>
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="text-blue-600 font-semibold hover:underline cursor-pointer ml-2 shrink-0"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN: Section Editor (Width: 50% on large screens) */}
        <div
          className={`w-full lg:w-1/2 flex flex-col bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden ${
            mobileMode === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Section Tabs (Segmented anti-slop style with More dropdown) */}
          <div className="p-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-1 text-xs font-medium">
            <div className="flex flex-wrap items-center gap-1 flex-1">
              {[
                { id: 'country', label: 'Country', icon: Globe2 },
                { id: 'personal', label: 'Personal & Photo', icon: User },
                { id: 'summary', label: 'Summary', icon: FileText },
                { id: 'objective', label: 'Objective', icon: Target },
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'skills', label: 'Skills', icon: Layers },
                { id: 'projects', label: 'Projects', icon: Sliders },
                { id: 'certifications', label: 'Certs', icon: Award },
                { id: 'languages', label: 'Languages', icon: Languages },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id as EditorTabId)}
                  className={`px-2 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer text-xs ${
                    activeTab === id
                      ? 'bg-white text-blue-600 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}

              {/* Extended Sections Popover Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreSectionsDropdownOpen(!moreSectionsDropdownOpen)}
                  className={`px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer text-xs font-semibold ${
                    [
                      'awards',
                      'publications',
                      'memberships',
                      'volunteering',
                      'trainings',
                      'references',
                      'interests',
                      'drivingLicence',
                      'personalDetails',
                      'additionalInfo',
                      'customSections',
                    ].includes(activeTab)
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <span>More Sections</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {moreSectionsDropdownOpen && (
                  <div
                    className="absolute left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-xs animate-in fade-in zoom-in-95"
                    onClick={() => setMoreSectionsDropdownOpen(false)}
                  >
                    {[
                      { id: 'awards', label: 'Awards & Achievements', icon: Award },
                      { id: 'publications', label: 'Publications & Research', icon: BookOpen },
                      { id: 'memberships', label: 'Memberships & Affiliations', icon: Users },
                      { id: 'volunteering', label: 'Volunteer Experience', icon: HeartHandshake },
                      { id: 'trainings', label: 'Training & Workshops', icon: Presentation },
                      { id: 'references', label: 'References', icon: UserCheck },
                      { id: 'interests', label: 'Interests & Hobbies', icon: Compass },
                      { id: 'drivingLicence', label: 'Driving Licence', icon: Car },
                      { id: 'personalDetails', label: 'Personal Details / Biodata', icon: UserCheck },
                      { id: 'additionalInfo', label: 'Additional Information', icon: FilePlus2 },
                      { id: 'customSections', label: 'Custom Sections', icon: Sparkles },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveTab(id as EditorTabId)}
                        className={`w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 cursor-pointer ${
                          activeTab === id ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Template Style */}
              <button
                type="button"
                onClick={() => setActiveTab('style')}
                className={`px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer text-xs ${
                  activeTab === 'style'
                    ? 'bg-white text-blue-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Style</span>
              </button>
            </div>

            {/* Quick Section Manager Button */}
            <button
              type="button"
              onClick={() => setIsSectionManagerOpen(true)}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md cursor-pointer transition-colors"
              title="Organize Section Order & Visibility"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          {/* Active Tab Form Body */}
          <div className="p-5 flex-1 overflow-y-auto max-h-[700px]">
            {activeTab === 'country' && (
              <CountrySelector
                currentCountryId={cv.countryId || 'usa'}
                cv={cv}
                onSelectCountry={handleCountrySelect}
              />
            )}

            {activeTab === 'personal' && (
              <PersonalSection
                data={cv.data.personalInfo}
                countryId={cv.countryId || 'usa'}
                themeColor={cv.themeColor || '#2563eb'}
                onChange={(personalInfo) => updateCvData({ personalInfo })}
              />
            )}

            {activeTab === 'summary' && (
              <SummarySection
                summary={cv.data.summary}
                contextInput={summaryContext}
                onChange={(summary) => updateCvData({ summary })}
              />
            )}

            {activeTab === 'objective' && (
              <ObjectiveSection
                objective={cv.data.careerObjective || ''}
                onChange={(careerObjective) => updateCvData({ careerObjective })}
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceSection
                items={cv.data.experience}
                onChange={(experience) => updateCvData({ experience })}
              />
            )}

            {activeTab === 'education' && (
              <EducationSection
                items={cv.data.education}
                onChange={(education) => updateCvData({ education })}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsSection
                items={cv.data.skills}
                onChange={(skills) => updateCvData({ skills })}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsSection
                items={cv.data.projects}
                onChange={(projects) => updateCvData({ projects })}
              />
            )}

            {activeTab === 'certifications' && (
              <CertificationsSection
                items={cv.data.certifications}
                onChange={(certifications) => updateCvData({ certifications })}
              />
            )}

            {activeTab === 'languages' && (
              <LanguagesSection
                items={cv.data.languages}
                onChange={(languages) => updateCvData({ languages })}
              />
            )}

            {activeTab === 'awards' && (
              <AwardsSection
                items={cv.data.awards || []}
                onChange={(awards) => updateCvData({ awards })}
              />
            )}

            {activeTab === 'publications' && (
              <PublicationsSection
                items={cv.data.publications || []}
                onChange={(publications) => updateCvData({ publications })}
              />
            )}

            {activeTab === 'memberships' && (
              <MembershipsSection
                items={cv.data.memberships || []}
                onChange={(memberships) => updateCvData({ memberships })}
              />
            )}

            {activeTab === 'volunteering' && (
              <VolunteeringSection
                items={cv.data.volunteering || []}
                onChange={(volunteering) => updateCvData({ volunteering })}
              />
            )}

            {activeTab === 'trainings' && (
              <TrainingsSection
                items={cv.data.trainings || []}
                onChange={(trainings) => updateCvData({ trainings })}
              />
            )}

            {activeTab === 'references' && (
              <ReferencesSection
                items={cv.data.references || []}
                onChange={(references) => updateCvData({ references })}
              />
            )}

            {activeTab === 'interests' && (
              <InterestsSection
                items={cv.data.interests || []}
                onChange={(interests) => updateCvData({ interests })}
              />
            )}

            {activeTab === 'drivingLicence' && (
              <DrivingLicenceSection
                items={cv.data.drivingLicence || []}
                onChange={(drivingLicence) => updateCvData({ drivingLicence })}
              />
            )}

            {activeTab === 'personalDetails' && (
              <PersonalDetailsSection
                data={cv.data.personalDetails || {}}
                onChange={(personalDetails) => updateCvData({ personalDetails })}
              />
            )}

            {activeTab === 'additionalInfo' && (
              <AdditionalInfoSection
                items={cv.data.additionalInfo || []}
                onChange={(additionalInfo) => updateCvData({ additionalInfo })}
              />
            )}

            {activeTab === 'customSections' && (
              <CustomSections
                items={cv.data.customSections || []}
                onChange={(customSections) => updateCvData({ customSections })}
              />
            )}

            {activeTab === 'style' && (
              <TemplateSelector
                cv={cv}
                onChange={updateCvMeta}
                onOpenGallery={() => setIsGalleryOpen(true)}
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Live A4 Preview */}
        <div
          className={`w-full lg:w-1/2 flex flex-col items-center ${
            mobileMode === 'edit' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Preview controls */}
          <div className="no-print w-full flex items-center justify-between pb-2 text-xs text-slate-500 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 font-medium">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Live A4 Preview (210mm × 297mm)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(true)}
                className="px-2 py-0.5 text-[10px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded flex items-center gap-1 cursor-pointer transition-colors"
                title="Change CV template style in Template Gallery"
              >
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span className="capitalize">{cv.templateId} Style</span>
                <span className="text-purple-400 font-normal">· Change</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.max(0.5, prev - 0.1))}
                className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px]">{Math.round(zoomScale * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.min(1.2, prev + 0.1))}
                className="p-1 hover:bg-slate-200 rounded cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scaled A4 Container */}
          <div className="w-full overflow-x-auto flex justify-center py-2">
            <CvRenderer cv={cv} scale={zoomScale} />
          </div>
        </div>
      </div>

      {/* Template Gallery Modal */}
      <TemplateGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        cv={cv}
        onSelectTemplate={handleTemplateSelectFromGallery}
      />

      {/* Translation Modal */}
      <TranslationModal
        isOpen={isTranslateOpen}
        onClose={() => setIsTranslateOpen(false)}
        cv={cv}
        onApplyTranslation={handleApplyTranslation}
      />

      {/* Admin Template Studio Modal */}
      <AdminTemplateManagerModal
        isOpen={isAdminTemplateManagerOpen}
        onClose={() => setIsAdminTemplateManagerOpen(false)}
        cv={cv}
        onSelectTemplate={handleSelectTemplateFromAdmin}
      />

      {/* Section Manager Modal */}
      <SectionManagerModal
        isOpen={isSectionManagerOpen}
        onClose={() => setIsSectionManagerOpen(false)}
        cv={cv}
        onUpdateSectionOrder={(sectionOrder) => {
          updateCvMeta({ sectionOrder });
        }}
        onUpdateSectionVisibility={(sectionVisibility) => {
          updateCvMeta({ sectionVisibility });
        }}
        onUpdateCustomHeadings={(customHeadings) => {
          updateCvMeta({ customHeadings });
        }}
      />
    </div>
  );
};
