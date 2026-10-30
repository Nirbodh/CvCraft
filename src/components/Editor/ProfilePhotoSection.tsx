import React, { useState } from 'react';
import {
  Camera,
  Trash2,
  Crop,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  Check,
  Circle,
  Square,
  RectangleHorizontal,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
} from 'lucide-react';
import { PersonalInfo, PhotoConfig, PhotoShape, PhotoPosition, PhotoSize, PhotoAspectRatio } from '../../types/cv.ts';
import { ProfilePhotoModal } from './ProfilePhotoModal.tsx';
import { COUNTRY_PROFILES } from '../../config/countries.ts';

interface ProfilePhotoSectionProps {
  personalInfo: PersonalInfo;
  countryId?: string;
  themeColor?: string;
  onChange: (updatedInfo: PersonalInfo) => void;
}

export const ProfilePhotoSection: React.FC<ProfilePhotoSectionProps> = ({
  personalInfo,
  countryId = 'usa',
  themeColor = '#2563eb',
  onChange,
}) => {
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  // Active photo config with default fallbacks
  const photoConfig: PhotoConfig = personalInfo.photoConfig || {
    url: personalInfo.photo,
    visible: personalInfo.showPhoto !== false && Boolean(personalInfo.photo),
    shape: personalInfo.photoShape || 'circle',
    size: 'medium',
    position: 'left',
    border: true,
    borderColor: themeColor,
    borderWidth: 2,
    zoom: 1.0,
    rotate: 0,
    aspectRatio: '1:1',
  };

  const currentCountry = COUNTRY_PROFILES[countryId] || COUNTRY_PROFILES.usa;

  const updateConfig = (updates: Partial<PhotoConfig>) => {
    const updated: PhotoConfig = {
      ...photoConfig,
      ...updates,
    };
    onChange({
      ...personalInfo,
      photo: updated.url,
      showPhoto: updated.visible,
      photoShape: updated.shape,
      photoConfig: updated,
    });
  };

  const handleSaveFromModal = (
    dataUrl: string,
    options: { aspectRatio: PhotoAspectRatio; zoom: number; rotate: number }
  ) => {
    updateConfig({
      url: dataUrl,
      visible: true,
      aspectRatio: options.aspectRatio,
      zoom: options.zoom,
      rotate: options.rotate,
    });
  };

  const handleRemovePhoto = () => {
    if (window.confirm('Remove profile photo from your CV?')) {
      onChange({
        ...personalInfo,
        photo: undefined,
        showPhoto: false,
        photoConfig: {
          ...photoConfig,
          url: undefined,
          visible: false,
        },
      });
    }
  };

  const toggleVisibility = () => {
    updateConfig({ visible: !photoConfig.visible });
  };

  // Helper for photo shape preview class
  const getShapeClass = (shape: PhotoShape) => {
    switch (shape) {
      case 'square':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-xl';
      case 'circle':
      default:
        return 'rounded-full';
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4">
      {/* 1. Country Recruitment Advice Callout */}
      <div
        className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5 ${
          currentCountry.photoConvention === 'discouraged'
            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
            : currentCountry.photoConvention === 'standard'
            ? 'bg-blue-50/70 border-blue-200 text-blue-900'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}
      >
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-current opacity-80" />
        <div className="space-y-0.5">
          <span className="font-bold block">
            {currentCountry.name} Photo Convention:{' '}
            <span className="capitalize">{currentCountry.photoConvention}</span>
          </span>
          <p className="text-[11px] opacity-90">
            {currentCountry.photoExplanation ||
              'You can optionally include or omit a professional photo depending on your preference.'}
          </p>
        </div>
      </div>

      {/* 2. Photo Preview and Main Action Controls */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        {/* Photo avatar & quick actions */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            {photoConfig.url ? (
              <div
                className={`overflow-hidden transition-all duration-150 ${getShapeClass(
                  photoConfig.shape
                )}`}
                style={{
                  width:
                    photoConfig.size === 'small'
                      ? '60px'
                      : photoConfig.size === 'large'
                      ? '92px'
                      : '76px',
                  height:
                    photoConfig.aspectRatio === '3:4'
                      ? photoConfig.size === 'small'
                        ? '80px'
                        : photoConfig.size === 'large'
                        ? '122px'
                        : '101px'
                      : photoConfig.size === 'small'
                      ? '60px'
                      : photoConfig.size === 'large'
                      ? '92px'
                      : '76px',
                  borderWidth: photoConfig.border ? `${photoConfig.borderWidth || 2}px` : '0px',
                  borderColor: photoConfig.borderColor || themeColor,
                  borderStyle: 'solid',
                }}
              >
                <img
                  src={photoConfig.url}
                  alt={personalInfo.fullName || 'Profile Preview'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 text-slate-400 flex flex-col items-center justify-center">
                <Camera className="w-6 h-6 mb-1 text-slate-400" />
                <span className="text-[10px] font-medium">No Photo</span>
              </div>
            )}

            {photoConfig.url && !photoConfig.visible && (
              <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                Hidden
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {photoConfig.url ? 'Profile Photo' : 'Add Professional Photo'}
              </span>
              {photoConfig.url && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    photoConfig.visible
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {photoConfig.visible ? 'Visible in CV' : 'Hidden from CV'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Crop, rotate, adjust frame shape, border styling, and position.
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => setIsCropModalOpen(true)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Crop className="w-3.5 h-3.5" />
                <span>{photoConfig.url ? 'Edit & Crop' : 'Upload Photo'}</span>
              </button>

              {photoConfig.url && (
                <>
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="px-2.5 py-1 text-xs font-medium rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    title={photoConfig.visible ? 'Hide photo from CV print and preview' : 'Show photo on CV'}
                  >
                    {photoConfig.visible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Show</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-2 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Delete uploaded photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Photo Styling Controls (Only shown if photo is uploaded) */}
      {photoConfig.url && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3.5 text-xs">
          <span className="font-bold text-slate-800 block text-xs">
            Photo Display &amp; Layout Settings
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Shape Control */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Shape
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { shape: 'circle' as PhotoShape, label: 'Circle', icon: Circle },
                  { shape: 'rounded' as PhotoShape, label: 'Rounded', icon: RectangleHorizontal },
                  { shape: 'square' as PhotoShape, label: 'Square', icon: Square },
                ].map(({ shape, label, icon: Icon }) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => updateConfig({ shape })}
                    className={`py-1 rounded text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      photoConfig.shape === shape
                        ? 'bg-white text-blue-600 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Control */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Size
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { size: 'small' as PhotoSize, label: 'Small' },
                  { size: 'medium' as PhotoSize, label: 'Medium' },
                  { size: 'large' as PhotoSize, label: 'Large' },
                ].map(({ size, label }) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateConfig({ size })}
                    className={`py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                      photoConfig.size === size
                        ? 'bg-white text-blue-600 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Position Alignment */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                Header Position
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                {[
                  { pos: 'left' as PhotoPosition, label: 'Left', icon: AlignLeft },
                  { pos: 'center' as PhotoPosition, label: 'Center', icon: AlignCenter },
                  { pos: 'right' as PhotoPosition, label: 'Right', icon: AlignRight },
                ].map(({ pos, label, icon: Icon }) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => updateConfig({ position: pos })}
                    className={`py-1 rounded text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      photoConfig.position === pos
                        ? 'bg-white text-blue-600 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Border controls row */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={photoConfig.border !== false}
                onChange={(e) => updateConfig({ border: e.target.checked })}
                className="rounded text-blue-600"
              />
              <span>Border Outline</span>
            </label>

            {photoConfig.border !== false && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 font-medium">Border Width:</span>
                  <select
                    value={photoConfig.borderWidth || 2}
                    onChange={(e) => updateConfig({ borderWidth: parseInt(e.target.value, 10) })}
                    className="px-2 py-0.5 border border-slate-200 rounded text-[11px] bg-white text-slate-800"
                  >
                    <option value="1">1px (Subtle)</option>
                    <option value="2">2px (Standard)</option>
                    <option value="3">3px (Bold)</option>
                    <option value="4">4px (Heavy)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 font-medium">Border Color:</span>
                  <input
                    type="color"
                    value={photoConfig.borderColor || themeColor}
                    onChange={(e) => updateConfig({ borderColor: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer border border-slate-200 p-0"
                    title="Change photo border color"
                  />
                  <button
                    type="button"
                    onClick={() => updateConfig({ borderColor: themeColor })}
                    className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Theme Match
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      <ProfilePhotoModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        currentPhotoUrl={photoConfig.url}
        onSavePhoto={handleSaveFromModal}
      />
    </div>
  );
};
