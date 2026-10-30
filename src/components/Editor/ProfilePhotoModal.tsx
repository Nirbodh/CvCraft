import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Check,
  AlertCircle,
  Crop,
  Move,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { PhotoAspectRatio } from '../../types/cv.ts';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string;
  onSavePhoto: (photoDataUrl: string, config: { aspectRatio: PhotoAspectRatio; zoom: number; rotate: number }) => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  onSavePhoto,
}) => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<PhotoAspectRatio>('1:1');
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load existing photo or reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      if (currentPhotoUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          setSourceImage(img);
          setZoom(1.0);
          setRotation(0);
          setPanOffset({ x: 0, y: 0 });
        };
        img.onerror = () => {
          setSourceImage(null);
        };
        img.src = currentPhotoUrl;
      } else {
        setSourceImage(null);
        setZoom(1.0);
        setRotation(0);
        setPanOffset({ x: 0, y: 0 });
      }
    }
  }, [isOpen, currentPhotoUrl]);

  // File validation and load
  const processFile = (file: File) => {
    setErrorMessage(null);

    // MIME validation
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage('Invalid file format. Please upload a JPG, JPEG, PNG, or WebP photo.');
      return;
    }

    // Size validation (< 5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const mbSize = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMessage(`File is too large (${mbSize} MB). Maximum allowed size is 5.0 MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const img = new Image();
        img.onload = () => {
          setSourceImage(img);
          setZoom(1.0);
          setRotation(0);
          setPanOffset({ x: 0, y: 0 });
        };
        img.src = result;
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Render to canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sourceImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Viewport dimensions based on aspect ratio
    const width = 360;
    const height = aspectRatio === '3:4' ? 480 : aspectRatio === '4:5' ? 450 : 360;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Save state
    ctx.save();

    // Translate to center of canvas
    ctx.translate(width / 2 + panOffset.x, height / 2 + panOffset.y);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Calculate base scale to cover viewport
    const scaleFactor = Math.max(width / sourceImage.width, height / sourceImage.height) * zoom;
    ctx.scale(scaleFactor, scaleFactor);

    // Draw source image centered
    ctx.drawImage(sourceImage, -sourceImage.width / 2, -sourceImage.height / 2);

    ctx.restore();
  }, [sourceImage, aspectRatio, zoom, rotation, panOffset]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Pan / Drag handling
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Quick rotation buttons
  const rotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const rotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  const resetAdjustments = () => {
    setZoom(1.0);
    setRotation(0);
    setPanOffset({ x: 0, y: 0 });
  };

  // Export cropped canvas to optimized data URL
  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas || !sourceImage) return;

    // High resolution output canvas for maximum print quality
    const outWidth = 400;
    const outHeight = aspectRatio === '3:4' ? 533 : aspectRatio === '4:5' ? 500 : 400;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = outWidth;
    exportCanvas.height = outHeight;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Scale ratio from preview canvas to export canvas
    const scaleRatio = outWidth / canvas.width;

    ctx.save();
    ctx.translate(outWidth / 2 + panOffset.x * scaleRatio, outHeight / 2 + panOffset.y * scaleRatio);
    ctx.rotate((rotation * Math.PI) / 180);

    const baseScale = Math.max(canvas.width / sourceImage.width, canvas.height / sourceImage.height) * zoom;
    const finalScale = baseScale * scaleRatio;
    ctx.scale(finalScale, finalScale);
    ctx.drawImage(sourceImage, -sourceImage.width / 2, -sourceImage.height / 2);
    ctx.restore();

    // Export as clean JPEG/WebP dataUrl (0.92 quality for balance of crispness and compact size)
    const dataUrl = exportCanvas.toDataURL('image/jpeg', 0.92);
    onSavePhoto(dataUrl, { aspectRatio, zoom, rotate: rotation });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Crop className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              Profile Photo Studio &amp; Crop
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!sourceImage ? (
            /* Upload Dropzone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all text-center space-y-3"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  Click to select or drag and drop your photo
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  Supports JPG, JPEG, PNG, or WebP · Maximum file size 5 MB
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>
          ) : (
            /* Interactive Canvas Editor */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/* Canvas Viewport */}
                <div className="relative flex flex-col items-center">
                  <div className="relative border-2 border-slate-300 rounded-xl overflow-hidden shadow-inner bg-slate-900/10 cursor-grab active:cursor-grabbing">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      style={{
                        width: '260px',
                        height: aspectRatio === '3:4' ? '346px' : aspectRatio === '4:5' ? '325px' : '260px',
                        display: 'block',
                      }}
                    />
                    {/* Crosshair guide overlay */}
                    <div className="absolute inset-0 pointer-events-none border border-white/40 grid grid-cols-3 grid-rows-3 opacity-30" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Move className="w-3 h-3" /> Click &amp; drag to reposition
                  </span>
                </div>

                {/* Adjustment Controls Panel */}
                <div className="flex-1 w-full space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  {/* Aspect Ratio Selector */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      Frame Aspect Ratio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAspectRatio('1:1')}
                        className={`px-3 py-2 rounded-lg font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          aspectRatio === '1:1'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Crop className="w-3.5 h-3.5" />
                        <span>1:1 Square (Universal)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAspectRatio('3:4')}
                        className={`px-3 py-2 rounded-lg font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          aspectRatio === '3:4'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>3:4 Portrait (EU / JIS)</span>
                      </button>
                    </div>
                  </div>

                  {/* Zoom Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
                        <span>Zoom</span>
                      </span>
                      <span className="font-mono text-slate-500 font-semibold">
                        {Math.round(zoom * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
                        className="p-1.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                        title="Zoom out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.05"
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => setZoom((prev) => Math.min(3.0, prev + 0.1))}
                        className="p-1.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                        title="Zoom in"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Rotation Controls */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Rotation</span>
                      </span>
                      <span className="font-mono text-slate-500 font-semibold">{rotation}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={rotateCounterClockwise}
                        className="px-2.5 py-1.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center gap-1 cursor-pointer"
                        title="Rotate 90 degrees counter-clockwise"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>-90°</span>
                      </button>
                      <button
                        type="button"
                        onClick={rotateClockwise}
                        className="px-2.5 py-1.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center gap-1 cursor-pointer"
                        title="Rotate 90 degrees clockwise"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>+90°</span>
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="5"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* Action buttons inside panel */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                    <button
                      type="button"
                      onClick={resetAdjustments}
                      className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Position</span>
                    </button>
                    <label className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">
                      <span>Choose Different Photo</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileInputChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {sourceImage && (
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply &amp; Save Photo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
