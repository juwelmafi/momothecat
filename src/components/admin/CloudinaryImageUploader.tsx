'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Check,
  AlertCircle,
  ExternalLink,
  Copy,
  RotateCcw,
  Sparkles,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

interface CloudinaryImageUploaderProps {
  label: string;
  description?: string;
  value: string;
  onChange: (url: string) => void;
  defaultValue?: string;
  folder?: string;
  recommendedSize?: string;
}

export default function CloudinaryImageUploader({
  label,
  description,
  value,
  onChange,
  defaultValue,
  folder = 'momothecat/website',
  recommendedSize,
}: CloudinaryImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setError(err.message || 'Failed to upload image to Cloudinary');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs hover:border-[#FFC312] transition-colors space-y-3">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900">{label}</h4>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
        {recommendedSize && (
          <span className="shrink-0 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
            {recommendedSize}
          </span>
        )}
      </div>

      {/* Main Preview & Upload Box */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Thumbnail Preview */}
        <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group shadow-inner">
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={label}
                className="w-full h-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-xs"
                  title="Open full image"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300">
              <ImageIcon className="w-8 h-8 stroke-1" />
              <span className="text-[10px] text-slate-400 mt-1 font-medium">No Image</span>
            </div>
          )}
        </div>

        {/* Drag-and-Drop / Upload Area & Inputs */}
        <div className="flex-1 w-full space-y-2.5">
          {/* Dropzone / Upload Trigger */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-3 sm:p-4 text-center transition-all ${
              dragActive
                ? 'border-[#FF6B35] bg-[#FFF5F2]'
                : 'border-slate-200 hover:border-[#FFC312] bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#232121] hover:bg-black text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50 hover:scale-102 active:scale-98"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFC312]" />
                    <span>Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-[#FFC312]" />
                    <span>Upload to Cloudinary</span>
                  </>
                )}
              </button>
              <span className="text-[11px] text-slate-400">or drop image here</span>
            </div>
          </div>

          {/* Direct URL text field */}
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://res.cloudinary.com/... or paste image URL"
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35]/20 font-mono"
            />
            {value && (
              <button
                type="button"
                onClick={copyToClipboard}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors shrink-0"
                title="Copy URL"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
            {defaultValue && value !== defaultValue && (
              <button
                type="button"
                onClick={() => onChange(defaultValue)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-[#FF6B35] transition-colors shrink-0"
                title="Reset to default image"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            <p className="text-[11px] text-rose-600/90 mt-0.5">
              Make sure Cloudinary credentials are set in the &quot;Cloudinary Settings&quot; card below or in .env.local.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
