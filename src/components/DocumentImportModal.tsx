import React, { useState } from 'react';
import { parseUploadedFile } from '../services/documentParser.ts';
import { ExtractedCvData } from '../../server/services/documentExtractor.ts';
import { CvData } from '../types/cv.ts';
import { Upload, FileText, AlertTriangle, Check, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

interface DocumentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (importedData: Partial<CvData>) => void;
}

export const DocumentImportModal: React.FC<DocumentImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedCvData | null>(null);
  const [step, setStep] = useState<'upload' | 'review'>('upload');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrorMsg(null);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setErrorMsg('Please select a file to import.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const res = await parseUploadedFile(file);
      setExtractedData(res.extracted);
      setStep('review');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract text from document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (!extractedData) return;

    // Convert ExtractedCvData to CvData shape
    const converted: Partial<CvData> = {
      personalInfo: {
        fullName: extractedData.personalInfo.fullName || '',
        jobTitle: extractedData.personalInfo.jobTitle || '',
        email: extractedData.personalInfo.email || '',
        phone: extractedData.personalInfo.phone || '',
        location: extractedData.personalInfo.location || '',
        linkedin: extractedData.personalInfo.linkedin || '',
        github: extractedData.personalInfo.github || '',
        website: extractedData.personalInfo.website || '',
      },
      summary: extractedData.summary || '',
      experience: extractedData.experience || [],
      education: extractedData.education || [],
      skills: extractedData.skills || [],
      projects: extractedData.projects || [],
      certifications: (extractedData.certifications || []).map((c) => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        issueDate: c.issueDate,
      })),
      languages: extractedData.languages || [],
    };

    onImportComplete(converted);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {step === 'upload' ? 'Import Existing CV / Resume' : 'Review Extracted Information'}
              </h3>
              <p className="text-xs text-slate-500">
                {step === 'upload'
                  ? 'Extract information from PDF, DOCX, or TXT documents locally'
                  : 'Verify and adjust extracted credentials before generating your CV'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'upload' ? (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/20 rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                onClick={() => document.getElementById('cv-file-upload-input')?.click()}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Click to browse or drag and drop your document
                </p>
                <p className="text-xs text-slate-500">
                  Supports <b>PDF</b> (text-based), <b>DOCX</b> (Word), and <b>TXT</b> (up to 5MB)
                </p>

                {file && (
                  <div className="mt-3 px-3 py-1.5 bg-white border border-blue-200 rounded-md text-xs font-medium text-blue-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>{file.name}</span>
                    <span className="text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}

                <input
                  id="cv-file-upload-input"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Privacy badge */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <b>100% Free &amp; Private:</b> Documents are processed without third-party generative AI subscriptions or external data harvesting.
                </span>
              </div>
            </div>
          ) : (
            /* Review Step */
            <div className="space-y-4">
              {extractedData?.isScanned && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Scanned Document Detected</p>
                    <p className="mt-0.5 text-amber-800 leading-relaxed">
                      {extractedData.scannedWarning}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-600">
                Review the parsed information below. You can refine any value right now or continue editing inside the CV editor:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Candidate Name</label>
                  <input
                    type="text"
                    value={extractedData?.personalInfo.fullName || ''}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData!,
                        personalInfo: { ...extractedData!.personalInfo, fullName: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-blue-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Job Title</label>
                  <input
                    type="text"
                    value={extractedData?.personalInfo.jobTitle || ''}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData!,
                        personalInfo: { ...extractedData!.personalInfo, jobTitle: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-blue-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={extractedData?.personalInfo.email || ''}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData!,
                        personalInfo: { ...extractedData!.personalInfo, email: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-blue-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={extractedData?.personalInfo.phone || ''}
                    onChange={(e) =>
                      setExtractedData({
                        ...extractedData!,
                        personalInfo: { ...extractedData!.personalInfo, phone: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:ring-1 focus:ring-blue-600 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 text-xs">Summary</label>
                <textarea
                  rows={3}
                  value={extractedData?.summary || ''}
                  onChange={(e) =>
                    setExtractedData({ ...extractedData!, summary: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-blue-600 text-slate-900"
                />
              </div>

              {/* Extraction summary badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900">{extractedData?.experience?.length || 0}</span>
                  <span className="block text-slate-500 text-[11px]">Work Positions</span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900">{extractedData?.education?.length || 0}</span>
                  <span className="block text-slate-500 text-[11px]">Degrees</span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-900">
                    {extractedData?.skills?.reduce((acc, cat) => acc + cat.items.length, 0) || 0}
                  </span>
                  <span className="block text-slate-500 text-[11px]">Skills Extracted</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          {step === 'review' ? (
            <button
              type="button"
              onClick={() => setStep('upload')}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← Choose another file
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step === 'upload' ? (
            <button
              type="button"
              disabled={!file || isProcessing}
              onClick={handleProcess}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting Document...</span>
                </>
              ) : (
                <>
                  <span>Extract Information</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Extracted Information to CV</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
