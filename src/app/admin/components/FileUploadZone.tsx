import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, Image, X, Link as LinkIcon } from 'lucide-react';

interface FileUploadZoneProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  className?: string;
}

export function FileUploadZone({ value, onChange, label = 'Image', hint, className = '' }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState(value?.startsWith('data:') ? '' : (value || ''));
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, GIF, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    setError('');
    onChange(urlInput.trim());
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="admin-label">{label}</label>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-[#f5f0e8] rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
            mode === 'upload' ? 'bg-white text-[#8B4949] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload size={12} /> Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
            mode === 'url' ? 'bg-white text-[#8B4949] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LinkIcon size={12} /> Image URL
        </button>
      </div>

      {/* Current preview */}
      {value && (
        <div className="relative w-full max-w-xs">
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover rounded-xl border border-[#e5e5e5]"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image'; }}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {mode === 'upload' ? (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`upload-zone ${isDragging ? 'active' : ''} ${value ? 'has-file' : ''}`}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-[#8B4949]/10' : 'bg-[#f5f0e8]'}`}>
              <Image size={22} className={isDragging ? 'text-[#8B4949]' : 'text-gray-400'} />
            </div>
            <div>
              <p className="text-sm font-medium text-[#4a4a4a]">
                {isDragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{hint || 'JPG, PNG, GIF, WebP — max 5MB'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
            placeholder="https://example.com/image.jpg"
            className="admin-input flex-1"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="admin-btn admin-btn-primary admin-btn-sm whitespace-nowrap"
          >
            Use URL
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
