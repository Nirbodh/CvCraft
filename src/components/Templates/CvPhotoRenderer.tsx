import React from 'react';
import { PersonalInfo, PhotoConfig } from '../../types/cv.ts';

interface CvPhotoRendererProps {
  personalInfo: PersonalInfo;
  themeColor?: string;
  className?: string;
}

export const CvPhotoRenderer: React.FC<CvPhotoRendererProps> = ({
  personalInfo,
  themeColor = '#2563eb',
  className = '',
}) => {
  const photoUrl = personalInfo.photoConfig?.url || personalInfo.photo;
  const isVisible =
    personalInfo.photoConfig?.visible ??
    (personalInfo.showPhoto !== false && Boolean(photoUrl));

  if (!photoUrl || !isVisible) {
    return null;
  }

  const config: PhotoConfig = personalInfo.photoConfig || {
    url: photoUrl,
    visible: true,
    shape: personalInfo.photoShape || 'circle',
    size: 'medium',
    position: 'left',
    border: true,
    borderColor: themeColor,
    borderWidth: 2,
    zoom: 1,
    rotate: 0,
    aspectRatio: '1:1',
  };

  // Dimensions
  const getDimensions = () => {
    const isPortrait = config.aspectRatio === '3:4';
    switch (config.size) {
      case 'small':
        return isPortrait
          ? { width: '56px', height: '75px' }
          : { width: '56px', height: '56px' };
      case 'large':
        return isPortrait
          ? { width: '100px', height: '133px' }
          : { width: '100px', height: '100px' };
      case 'medium':
      default:
        return isPortrait
          ? { width: '76px', height: '101px' }
          : { width: '76px', height: '76px' };
    }
  };

  // Shape class
  const getShapeClass = () => {
    switch (config.shape) {
      case 'square':
        return 'rounded-none';
      case 'rounded':
        return 'rounded-xl';
      case 'circle':
      default:
        return 'rounded-full';
    }
  };

  const dims = getDimensions();

  return (
    <div
      className={`overflow-hidden shrink-0 shadow-xs transition-all ${getShapeClass()} ${className}`}
      style={{
        width: dims.width,
        height: dims.height,
        borderWidth: config.border !== false ? `${config.borderWidth || 2}px` : '0px',
        borderColor: config.borderColor || themeColor,
        borderStyle: 'solid',
      }}
    >
      <img
        src={photoUrl}
        alt={personalInfo.fullName || 'Candidate Photo'}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
