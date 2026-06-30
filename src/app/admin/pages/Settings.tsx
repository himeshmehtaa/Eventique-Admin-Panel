import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import {
  Save, RefreshCcw, Upload, RotateCcw, AlertTriangle,
  Image, Video, FileText, Archive, Copy, Trash2, Check,
  Search, Download, Database, ShieldAlert, Package, ShoppingCart,
  Activity, ClipboardList, HardDrive, Wrench, UploadCloud,
  Sliders, Settings as SettingsIcon, Terminal, Shield, CheckCircle2, ChevronRight, FileJson, Play, Info, X
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FileUploadZone } from '../components/FileUploadZone';
import type { AppSettings, MediaFile, ActivityLog } from '../types';

type SettingsTab = 'brand' | 'seo' | 'contact' | 'payment' | 'downloads' | 'shipping' | 'notifications' | 'security';
type TabKey = 'media' | 'logs' | 'backup' | 'support';

const TABS: { key: SettingsTab; label: string; emoji: string }[] = [
  { key: 'brand',         label: 'Brand',             emoji: '🎨' },
  { key: 'seo',           label: 'Website & SEO',     emoji: '🌐' },
  { key: 'contact',       label: 'Contact & Social',  emoji: '📞' },
  { key: 'payment',       label: 'Payment',           emoji: '💳' },
  { key: 'downloads',     label: 'Downloads',         emoji: '📥' },
  { key: 'shipping',      label: 'Shipping',          emoji: '📦' },
  { key: 'notifications', label: 'Notifications',     emoji: '🔔' },
  { key: 'security',      label: 'Security',          emoji: '🔒' },
];

const UTILITY_TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'media',   label: 'Media Library',       icon: <Image size={15} /> },
  { key: 'logs',    label: 'Activity Logs',       icon: <Activity size={15} /> },
  { key: 'backup',  label: 'Backup & Restore',    icon: <Database size={15} /> },
  { key: 'support', label: 'Support Diagnostics', icon: <Wrench size={15} /> },
];

type MediaFilterType = 'all' | 'image' | 'video' | 'pdf' | 'zip';
type MediaSortType = 'date-desc' | 'date-asc' | 'size-desc' | 'size-asc' | 'name-asc';
type LogFilterType = 'all' | 'orders' | 'media' | 'products' | 'system';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`admin-toggle ${value ? 'active' : ''}`}
    />
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="admin-label">{label}</label>
      {children}
    </div>
  );
}

function fileIcon(type: MediaFile['type']) {
  const cls = 'flex-shrink-0';
  if (type === 'image') return <Image size={20} className={cls} style={{ color: '#8B4949' }} />;
  if (type === 'video') return <Video size={20} className={cls} style={{ color: '#6366F1' }} />;
  if (type === 'pdf')   return <FileText size={20} className={cls} style={{ color: '#D4AF37' }} />;
  return                       <Archive size={20} className={cls} style={{ color: '#4A7C59' }} />;
}

function logDotColor(action: string) {
  const a = action.toLowerCase();
  if (a.includes('upload') || a.includes('file') || a.includes('media')) return '#3B82F6';
  if (a.includes('order') || a.includes('payment')) return '#D4AF37';
  if (a.includes('product') || a.includes('added') || a.includes('approved') || a.includes('review')) return '#4A7C59';
  return '#8B4949';
}

function parseSizeToBytes(sizeStr: string): number {
  const match = sizeStr.match(/^([\d.]+)\s*(KB|MB|GB|B)$/i);
  if (!match) return 0;
  const num = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === 'MB') return num * 1024 * 1024;
  if (unit === 'KB') return num * 1024;
  if (unit === 'GB') return num * 1024 * 1024 * 1024;
  return num;
}

// ── Tab 1: Media Library ──
function MediaLibraryTab() {
  const { state, addMediaFile, updateMediaFile, deleteMediaFile, addActivityLog } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<MediaFilterType>('all');
  const [tagFilter, setTagFilter] = useState<'all' | 'Logos' | 'Sliders' | 'Products' | 'Drafts' | 'Other'>('all');
  const [sort, setSort] = useState<MediaSortType>('date-desc');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadTag, setUploadTag] = useState<'Logos' | 'Sliders' | 'Products' | 'Drafts' | 'Other'>('Other');

  // Lightbox Modal state
  const [activeFile, setActiveFile] = useState<MediaFile | null>(null);
  const [activeFileName, setActiveFileName] = useState('');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Sync filename input when activeFile changes
  useEffect(() => {
    if (activeFile) {
      setActiveFileName(activeFile.name);
    }
  }, [activeFile]);

  // Keep activeFile in sync with state updates (e.g. tag or name changes)
  const currentActiveFile = activeFile 
    ? state.mediaFiles.find(f => f.id === activeFile.id) || null
    : null;

  let processedFiles = state.mediaFiles.filter((f) => {
    const matchesFilter = filter === 'all' || f.type === filter;
    const matchesTag = tagFilter === 'all' || f.tag === tagFilter;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesTag && matchesSearch;
  });

  processedFiles.sort((a, b) => {
    if (sort === 'date-desc') return b.id.localeCompare(a.id);
    if (sort === 'date-asc') return a.id.localeCompare(b.id);
    if (sort === 'size-desc') return parseSizeToBytes(b.size) - parseSizeToBytes(a.size);
    if (sort === 'size-asc') return parseSizeToBytes(a.size) - parseSizeToBytes(b.size);
    if (sort === 'name-asc') return a.name.localeCompare(b.name);
    return 0;
  });

  const handleFilesUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      const type: MediaFile['type'] =
        file.type.startsWith('image/') ? 'image' :
        file.type.startsWith('video/') ? 'video' :
        ext === 'pdf' ? 'pdf' : 'zip';
      const url = URL.createObjectURL(file);
      const sizeKB = (file.size / 1024).toFixed(0);
      const size = file.size > 1048576
        ? `${(file.size / 1048576).toFixed(1)} MB`
        : `${sizeKB} KB`;

      addMediaFile({
        id: `med-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        type,
        url,
        size,
        uploadedAt: new Date().toLocaleDateString('en-IN'),
        tag: uploadTag,
      });
      addActivityLog('File Uploaded', `Uploaded ${file.name} to Media Library under tag ${uploadTag}`, 'success');
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFilesUpload(e.target.files);
    e.target.value = '';
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    });
  };

  const handleQuickCopy = (e: React.MouseEvent, f: MediaFile) => {
    e.stopPropagation();
    navigator.clipboard.writeText(f.url).then(() => {
      setCopiedId(f.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const confirmDelete = () => {
    if (deleteId) {
      const file = state.mediaFiles.find(f => f.id === deleteId);
      deleteMediaFile(deleteId);
      if (file) {
        addActivityLog('File Deleted', `Deleted file ${file.name} from Media Library`, 'warning');
      }
      setDeleteId(null);
      setActiveFile(null); // Close lightbox if open
    }
  };

  const handleSaveName = () => {
    if (currentActiveFile && activeFileName.trim()) {
      updateMediaFile(currentActiveFile.id, { name: activeFileName });
      addActivityLog('Media Renamed', `Renamed media asset from ${currentActiveFile.name} to ${activeFileName}`, 'info');
    }
  };

  const handleTagChangeInPlace = (tag: MediaFile['tag']) => {
    if (currentActiveFile) {
      updateMediaFile(currentActiveFile.id, { tag });
      addActivityLog('Media Tagged', `Changed tag of ${currentActiveFile.name} to ${tag}`, 'info');
    }
  };

  const FILTER_TABS: { key: MediaFilterType; label: string }[] = [
    { key: 'all',   label: 'All Files' },
    { key: 'image', label: 'Images' },
    { key: 'video', label: 'Videos' },
    { key: 'pdf',   label: 'PDFs' },
    { key: 'zip',   label: 'ZIPs' },
  ];

  const TAGS: ('Logos' | 'Sliders' | 'Products' | 'Drafts' | 'Other')[] = [
    'Logos', 'Sliders', 'Products', 'Drafts', 'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-[#e5e5e5] shadow-sm">
        {/* First Row: Search, Sort, Upload Category selection */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="admin-input !pl-10 bg-[#faf8f5]"
              placeholder="Search media files by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <select
              className="admin-select bg-[#faf8f5]"
              value={sort}
              onChange={(e) => setSort(e.target.value as MediaSortType)}
            >
              <option value="date-desc">Newest Uploaded</option>
              <option value="date-asc">Oldest Uploaded</option>
              <option value="size-desc">Size: Largest</option>
              <option value="size-asc">Size: Smallest</option>
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>
          <div className="md:col-span-4 flex items-center justify-end gap-2">
            <span className="text-xs font-bold text-gray-400 whitespace-nowrap">Upload Tag:</span>
            <select
              className="admin-select bg-[#faf8f5] text-xs font-bold max-w-[130px]"
              value={uploadTag}
              onChange={(e) => setUploadTag(e.target.value as any)}
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Dual Filter pill groups */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-[#f0f0f0]">
          {/* File Types */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">File Type</p>
            <div className="flex gap-1.5 overflow-x-auto">
              {FILTER_TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border-none cursor-pointer transition-all whitespace-nowrap"
                  style={{
                    background: filter === key ? '#8B4949' : '#f5f0e8',
                    color: filter === key ? '#fff' : '#4a4a4a',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tags */}
          <div className="space-y-1.5 md:text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category Tag</p>
            <div className="flex gap-1.5 overflow-x-auto md:justify-end">
              {['all', ...TAGS].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTagFilter(tag as any)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border-none cursor-pointer transition-all whitespace-nowrap"
                  style={{
                    background: tagFilter === tag ? '#8B4949' : '#f5f0e8',
                    color: tagFilter === tag ? '#fff' : '#4a4a4a',
                  }}
                >
                  {tag === 'all' ? 'All Tags' : tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesUpload(e.dataTransfer.files);
          }
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
          isDragOver
            ? 'border-[#8B4949] bg-orange-50/25 scale-[1.01] shadow-md'
            : 'border-gray-200 bg-[#fcfbf9] hover:border-[#8B4949] hover:bg-orange-50/10'
        }`}
      >
        <div className="w-14 h-14 rounded-full bg-orange-100/30 flex items-center justify-center text-[#8B4949]">
          <UploadCloud size={26} />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1a1410]">Drag &amp; drop files here, or click to upload</p>
          <p className="text-xs text-gray-400 mt-1">Supports image files, video invites, PDFs, and ZIP templates up to 50MB (will be tagged as <span className="font-bold text-[#8B4949]">{uploadTag}</span>)</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.zip"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {processedFiles.length > 0 ? (
        <div className="space-y-6">
          {processedFiles.some((f) => f.type === 'image') && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Images Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {processedFiles
                  .filter((f) => f.type === 'image')
                  .map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setActiveFile(f)}
                      className="group relative bg-white border border-[#e5e5e5] rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                      style={{ aspectRatio: '1' }}
                    >
                      <img
                        src={f.url}
                        alt={f.name}
                        className="w-full h-full object-cover display-block"
                      />
                      {f.tag && (
                        <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded bg-[#8B4949] text-white text-[9px] font-bold uppercase tracking-wider shadow">
                          {f.tag}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                        <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleQuickCopy(e, f)}
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-none cursor-pointer backdrop-blur-sm transition-all"
                            title="Copy File Link"
                          >
                            {copiedId === f.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                          </button>
                          <a
                            href={f.url}
                            download={f.name}
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-none cursor-pointer backdrop-blur-sm transition-all"
                            title="Download file"
                          >
                            <Download size={14} />
                          </a>
                          <button
                            onClick={(e) => { setDeleteId(f.id); }}
                            className="w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500 text-white flex items-center justify-center border-none cursor-pointer backdrop-blur-sm transition-all"
                            title="Delete file"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="text-white text-center">
                          <p className="text-[10px] font-bold truncate" title={f.name}>{f.name}</p>
                          <p className="text-[8px] text-gray-300 mt-0.5">{f.size} · {f.uploadedAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {processedFiles.some((f) => f.type !== 'image') && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Documents &amp; Media Templates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {processedFiles
                  .filter((f) => f.type !== 'image')
                  .map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setActiveFile(f)}
                      className="bg-white border border-[#e5e5e5] rounded-xl p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#faf8f5] border border-[#e5e5e5]/50 flex items-center justify-center relative">
                        {fileIcon(f.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#1a1410] truncate" title={f.name}>
                            {f.name}
                          </p>
                          {f.tag && (
                            <span className="px-1.5 py-0.5 rounded bg-[#8B4949]/10 text-[8px] font-bold text-[#8B4949] uppercase tracking-wider">
                              {f.tag}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded bg-[#f5f0e8] text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                            {f.type}
                          </span>
                          <span className="text-[11px] text-gray-400">{f.size}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[11px] text-gray-400">{f.uploadedAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleQuickCopy(e, f)}
                          className="w-8 h-8 rounded-lg border border-[#e5e5e5] hover:border-[#8B4949]/30 hover:bg-[#8B4949]/5 flex items-center justify-center cursor-pointer transition-all bg-white"
                          title="Copy Link"
                        >
                          {copiedId === f.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-[#8B4949]" />}
                        </button>
                        <a
                          href={f.url}
                          download={f.name}
                          className="w-8 h-8 rounded-lg border border-[#e5e5e5] hover:border-[#8B4949]/30 hover:bg-[#8B4949]/5 flex items-center justify-center cursor-pointer transition-all bg-white text-gray-500 hover:text-[#8B4949]"
                          title="Download"
                        >
                          <Download size={14} />
                        </a>
                        <button
                          onClick={() => setDeleteId(f.id)}
                          className="w-8 h-8 rounded-lg border border-red-200 hover:bg-red-50 flex items-center justify-center cursor-pointer transition-all bg-white text-red-500 hover:text-white"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="admin-empty card bg-white border border-[#e5e5e5] py-14">
          <Upload size={38} className="text-gray-300 mx-auto" />
          <p className="mt-3 font-semibold text-gray-500 text-sm">No files found matching the search criteria</p>
          <button
            onClick={() => { setSearch(''); setFilter('all'); setTagFilter('all'); }}
            className="admin-btn admin-btn-outline admin-btn-sm mt-3"
          >
            Reset Filters
          </button>
        </div>
      )}

      {copiedId && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold z-50">
          <Check size={14} /> Link copied to clipboard!
        </div>
      )}

      {/* Lightbox Details Modal */}
      {currentActiveFile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveFile(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 admin-scale-in">
            <button
              onClick={() => setActiveFile(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Left Column: Media Preview */}
            <div className="md:w-1/2 flex flex-col justify-center items-center bg-[#faf8f5] rounded-2xl border border-[#e5e5e5]/50 p-6 min-h-[300px]">
              {currentActiveFile.type === 'image' ? (
                <img
                  src={currentActiveFile.url}
                  alt={currentActiveFile.name}
                  className="max-h-[320px] max-w-full object-contain rounded-xl shadow-sm"
                />
              ) : currentActiveFile.type === 'video' ? (
                <video
                  src={currentActiveFile.url}
                  controls
                  className="max-h-[320px] max-w-full rounded-xl shadow-sm"
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-[#e5e5e5] flex items-center justify-center shadow-sm">
                    {fileIcon(currentActiveFile.type)}
                  </div>
                  <span className="px-3 py-1 rounded bg-[#f5f0e8] text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                    {currentActiveFile.type}
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: File Details & Copy Code */}
            <div className="md:w-1/2 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#1a1410] border-b border-[#f0f0f0] pb-2 mb-4">
                  Media Asset Details
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="admin-label">Edit File Name</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="admin-input bg-[#faf8f5]"
                        value={activeFileName}
                        onChange={(e) => setActiveFileName(e.target.value)}
                      />
                      <button
                        onClick={handleSaveName}
                        className="admin-btn admin-btn-outline px-4 flex items-center gap-1.5"
                      >
                        <Save size={13} /> Save
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="admin-label">Category / Tag</label>
                      <select
                        className="admin-select bg-[#faf8f5]"
                        value={currentActiveFile.tag || 'Other'}
                        onChange={(e) => handleTagChangeInPlace(e.target.value as any)}
                      >
                        {TAGS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="admin-label">File Size</label>
                      <div className="px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-gray-200/50 text-xs font-medium text-gray-500">
                        {currentActiveFile.size}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="admin-label">Type</label>
                      <div className="px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-gray-200/50 text-xs font-bold text-gray-500 uppercase">
                        {currentActiveFile.type}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="admin-label">Uploaded At</label>
                      <div className="px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-gray-200/50 text-xs font-medium text-gray-500">
                        {currentActiveFile.uploadedAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Copy-Code Helpers */}
              <div className="space-y-3 bg-[#faf8f5] p-4 rounded-2xl border border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Copy-Code Helpers</p>
                
                <div className="space-y-2">
                  {/* Raw URL */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-gray-500 min-w-[80px]">Raw URL:</span>
                    <code className="bg-white border border-[#e5e5e5] px-2 py-1 rounded flex-1 truncate font-mono text-[10px]">
                      {currentActiveFile.url}
                    </code>
                    <button
                      onClick={() => handleCopy(currentActiveFile.url, 'url')}
                      className="p-1.5 rounded-lg border border-[#e5e5e5] hover:border-[#8B4949] hover:bg-orange-50/10 cursor-pointer bg-white"
                    >
                      {copiedType === 'url' ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-[#8B4949]" />}
                    </button>
                  </div>

                  {/* HTML Image Tag */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-gray-500 min-w-[80px]">HTML Tag:</span>
                    <code className="bg-white border border-[#e5e5e5] px-2 py-1 rounded flex-1 truncate font-mono text-[10px]">
                      {`<img src="${currentActiveFile.url}" alt="${currentActiveFile.name}" />`}
                    </code>
                    <button
                      onClick={() => handleCopy(`<img src="${currentActiveFile.url}" alt="${currentActiveFile.name}" />`, 'html')}
                      className="p-1.5 rounded-lg border border-[#e5e5e5] hover:border-[#8B4949] hover:bg-orange-50/10 cursor-pointer bg-white"
                    >
                      {copiedType === 'html' ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-[#8B4949]" />}
                    </button>
                  </div>

                  {/* CSS background-image */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-gray-500 min-w-[80px]">CSS Link:</span>
                    <code className="bg-white border border-[#e5e5e5] px-2 py-1 rounded flex-1 truncate font-mono text-[10px]">
                      {`background-image: url('${currentActiveFile.url}');`}
                    </code>
                    <button
                      onClick={() => handleCopy(`background-image: url('${currentActiveFile.url}');`, 'css')}
                      className="p-1.5 rounded-lg border border-[#e5e5e5] hover:border-[#8B4949] hover:bg-orange-50/10 cursor-pointer bg-white"
                    >
                      {copiedType === 'css' ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-[#8B4949]" />}
                    </button>
                  </div>

                  {/* Markdown Link */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-gray-500 min-w-[80px]">Markdown:</span>
                    <code className="bg-white border border-[#e5e5e5] px-2 py-1 rounded flex-1 truncate font-mono text-[10px]">
                      {`![${currentActiveFile.name}](${currentActiveFile.url})`}
                    </code>
                    <button
                      onClick={() => handleCopy(`![${currentActiveFile.name}](${currentActiveFile.url})`, 'markdown')}
                      className="p-1.5 rounded-lg border border-[#e5e5e5] hover:border-[#8B4949] hover:bg-orange-50/10 cursor-pointer bg-white"
                    >
                      {copiedType === 'markdown' ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-[#8B4949]" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 justify-end border-t border-[#f0f0f0] pt-4">
                <button
                  onClick={() => setDeleteId(currentActiveFile.id)}
                  className="admin-btn admin-btn-danger flex items-center gap-1.5"
                >
                  <Trash2 size={13} /> Delete Asset
                </button>
                <a
                  href={currentActiveFile.url}
                  download={currentActiveFile.name}
                  className="admin-btn admin-btn-outline flex items-center gap-1.5 text-gray-500 hover:text-[#8B4949]"
                >
                  <Download size={13} /> Download File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Media Asset"
        message="This will permanently delete this asset and break any links referencing this file. Continue?"
        confirmLabel="Yes, Delete File"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        danger
      />
    </div>
  );
}

// ── Tab 2: Activity Logs ──
function ActivityLogsTab() {
  const { state, purgeActivityLogs, addActivityLog } = useAdmin();
  const [search, setSearch] = useState('');
  const [logFilter, setLogFilter] = useState<LogFilterType>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'danger'>('all');
  const [purgeDialog, setPurgeDialog] = useState(false);

  const logs = state.activityLogs
    .filter((l) => {
      const matchesSearch =
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.detail.toLowerCase().includes(search.toLowerCase());
      
      const a = l.action.toLowerCase();
      let matchesCategory = true;
      if (logFilter === 'orders') matchesCategory = a.includes('order') || a.includes('payment');
      if (logFilter === 'media')  matchesCategory = a.includes('file') || a.includes('upload') || a.includes('media');
      if (logFilter === 'products') matchesCategory = a.includes('product') || a.includes('added') || a.includes('review');
      if (logFilter === 'system') matchesCategory = !a.includes('order') && !a.includes('payment') && !a.includes('file') && !a.includes('upload') && !a.includes('product') && !a.includes('review');

      const sev = l.severity || (a.includes('delete') || a.includes('remove') || a.includes('cancel') ? 'danger' : a.includes('added') || a.includes('create') || a.includes('upload') || a.includes('success') ? 'success' : 'info');
      const matchesSeverity = severityFilter === 'all' || sev === severityFilter;

      return matchesSearch && matchesCategory && matchesSeverity;
    })
    .slice(0, 100);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,Timestamp,User,Action,Severity,Details\n';
    logs.forEach((log) => {
      const a = log.action.toLowerCase();
      const sev = log.severity || (a.includes('delete') || a.includes('remove') || a.includes('cancel') ? 'danger' : a.includes('added') || a.includes('create') || a.includes('upload') || a.includes('success') ? 'success' : 'info');
      const row = `"${log.id}","${log.timestamp}","${log.user}","${log.action}","${sev}","${log.detail.replace(/"/g, '""')}"`;
      csvContent += row + '\n';
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eventique-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePurge = () => {
    purgeActivityLogs();
    addActivityLog('Logs Purged', 'All activity logs history has been cleared', 'warning');
    setPurgeDialog(false);
  };

  const severityColor = (sev?: string) => {
    if (sev === 'success') return '#10B981';
    if (sev === 'warning') return '#F59E0B';
    if (sev === 'danger') return '#EF4444';
    return '#3B82F6';
  };

  const severityBg = (sev?: string) => {
    if (sev === 'success') return '#10B98115';
    if (sev === 'warning') return '#F59E0B15';
    if (sev === 'danger') return '#EF444415';
    return '#3B82F615';
  };

  const totalCount = state.activityLogs.length;
  const infoCount = state.activityLogs.filter(l => {
    const a = l.action.toLowerCase();
    const sev = l.severity || (a.includes('delete') || a.includes('remove') || a.includes('cancel') ? 'danger' : a.includes('added') || a.includes('create') || a.includes('upload') || a.includes('success') ? 'success' : 'info');
    return sev === 'info';
  }).length;
  const successCount = state.activityLogs.filter(l => {
    const a = l.action.toLowerCase();
    const sev = l.severity || (a.includes('delete') || a.includes('remove') || a.includes('cancel') ? 'danger' : a.includes('added') || a.includes('create') || a.includes('upload') || a.includes('success') ? 'success' : 'info');
    return sev === 'success';
  }).length;
  const warningDangerCount = state.activityLogs.filter(l => {
    const a = l.action.toLowerCase();
    const sev = l.severity || (a.includes('delete') || a.includes('remove') || a.includes('cancel') ? 'danger' : a.includes('added') || a.includes('create') || a.includes('upload') || a.includes('success') ? 'success' : 'info');
    return sev === 'warning' || sev === 'danger';
  }).length;

  const LOG_FILTERS: { key: LogFilterType; label: string }[] = [
    { key: 'all',      label: 'All Logs' },
    { key: 'orders',   label: 'Orders & Payments' },
    { key: 'media',    label: 'Media Uploads' },
    { key: 'products', label: 'Products & Reviews' },
    { key: 'system',   label: 'System Operations' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e5e5e5] p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#1a1410] flex items-center justify-center flex-shrink-0">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Logs</p>
            <p className="text-lg font-bold text-[#1a1410] mt-0.5">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center flex-shrink-0">
            <Info size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Info Events</p>
            <p className="text-lg font-bold text-[#1a1410] mt-0.5">{infoCount}</p>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Success Events</p>
            <p className="text-lg font-bold text-[#1a1410] mt-0.5">{successCount}</p>
          </div>
        </div>

        <div className="bg-white border border-[#e5e5e5] p-4 rounded-2xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Alerts &amp; Warnings</p>
            <p className="text-lg font-bold text-[#1a1410] mt-0.5">{warningDangerCount}</p>
          </div>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-2xl border border-[#e5e5e5] shadow-sm items-center">
        <div className="md:col-span-4 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="admin-input !pl-10 bg-[#faf8f5]"
            placeholder="Search action logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-5 flex gap-1.5 overflow-x-auto">
          {LOG_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setLogFilter(key)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border-none cursor-pointer transition-all whitespace-nowrap"
              style={{
                background: logFilter === key ? '#8B4949' : '#f5f0e8',
                color: logFilter === key ? '#fff' : '#4a4a4a',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 flex gap-2 justify-end">
          <select
            className="admin-select bg-[#faf8f5] text-xs font-bold"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
          >
            <option value="all">All Severities</option>
            <option value="info">Info Only</option>
            <option value="success">Success Only</option>
            <option value="warning">Warning Only</option>
            <option value="danger">Danger Only</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="admin-btn admin-btn-outline admin-btn-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
            title="Export to CSV"
          >
            <Download size={13} /> CSV
          </button>

          <button
            onClick={() => setPurgeDialog(true)}
            className="admin-btn admin-btn-danger admin-btn-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
            style={{ background: '#d4183d', color: '#fff', border: 'none' }}
            title="Clear Log History"
          >
            <Trash2 size={13} /> Clear
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-3xl p-6 shadow-sm">
        {logs.length > 0 ? (
          <div className="space-y-4">
            {logs.map((log) => {
              const a = log.action.toLowerCase();
              const sev = log.severity || (a.includes('delete') || a.includes('remove') || a.includes('cancel') ? 'danger' : a.includes('added') || a.includes('create') || a.includes('upload') || a.includes('success') ? 'success' : 'info');
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200"
                  style={{
                    borderColor: `${severityColor(sev)}30`,
                    borderLeftWidth: '5px',
                    borderLeftColor: severityColor(sev),
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: severityBg(sev),
                      color: severityColor(sev),
                    }}
                  >
                    {sev === 'success' ? <CheckCircle2 size={15} /> :
                     sev === 'warning' || sev === 'danger' ? <AlertTriangle size={15} /> :
                     <Info size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#1a1410]">{log.action}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-[#8B4949]/5 text-[#8B4949] uppercase tracking-wider">
                        {log.user}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider"
                        style={{
                          background: severityBg(sev),
                          color: severityColor(sev)
                        }}
                      >
                        {sev}
                      </span>
                      <span className="text-[11px] text-gray-400 ml-auto font-medium">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {log.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty py-10">
            <Activity size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">No activity logs match the filters</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={purgeDialog}
        title="Purge Activity History"
        message="This will permanently delete all activity log history. This action cannot be undone. Continue?"
        confirmLabel="Yes, Clear History"
        onConfirm={handlePurge}
        onCancel={() => setPurgeDialog(false)}
        danger
      />
    </div>
  );
}

// ── Tab 3: Backup & Restore ──
interface Checkpoint {
  id: string;
  timestamp: string;
  name: string;
  metadata: {
    productsCount: number;
    ordersCount: number;
    categoriesCount: number;
    promotionsCount: number;
    sizeKB: string;
  };
  stateData: string;
}

function BackupExportTab() {
  const { state, resetToDefaults, addActivityLog } = useAdmin();
  const [resetDialog, setResetDialog] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: '' });
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('eventique-restore-checkpoints');
      if (raw) {
        setCheckpoints(JSON.parse(raw));
      }
    } catch (_) {}
  }, []);

  const handleExport = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventique-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addActivityLog('System Backup', 'Exported database backup JSON file', 'success');
  };

  const handleImportSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result as string;
        const parsed = JSON.parse(raw);

        const requiredKeys = ['products', 'orders', 'contentBlocks', 'settings'];
        const missing = requiredKeys.filter((k) => !(k in parsed));

        if (missing.length > 0) {
          setImportStatus({
            type: 'error',
            msg: `Invalid backup file. Missing properties: ${missing.join(', ')}`,
          });
          return;
        }

        localStorage.setItem('eventique-admin-v2', raw);
        setImportStatus({
          type: 'success',
          msg: 'Database restored successfully! Reloading system...',
        });

        try {
          const parsedLogs = parsed.activityLogs || [];
          parsedLogs.unshift({
            id: `log-${Date.now()}`,
            action: 'Backup Restored',
            user: 'Admin',
            detail: 'Database successfully imported from backup file',
            timestamp: new Date().toLocaleString('en-IN'),
            severity: 'success'
          });
          parsed.activityLogs = parsedLogs;
          localStorage.setItem('eventique-admin-v2', JSON.stringify(parsed));
        } catch (_) {}

        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } catch (err) {
        setImportStatus({
          type: 'error',
          msg: 'Failed to parse JSON file. Ensure it is a valid backup export.',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCreateCheckpoint = () => {
    try {
      const stateStr = JSON.stringify(state);
      const size = (new Blob([stateStr]).size / 1024).toFixed(1);
      const now = new Date();
      const newCp: Checkpoint = {
        id: `cp-${Date.now()}`,
        timestamp: now.toLocaleString('en-IN'),
        name: `Checkpoint - ${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN')}`,
        metadata: {
          productsCount: state.products.length,
          ordersCount: state.orders.length,
          categoriesCount: state.categories.length,
          promotionsCount: state.promotions.length,
          sizeKB: `${size} KB`
        },
        stateData: stateStr
      };
      
      const updated = [newCp, ...checkpoints];
      setCheckpoints(updated);
      localStorage.setItem('eventique-restore-checkpoints', JSON.stringify(updated));
      addActivityLog('System Backup', `Created local restore point checkpoint: ${newCp.name}`, 'success');
    } catch (_) {
      alert('Failed to save checkpoint. Browser storage quota might be full.');
    }
  };

  const handleRestoreCheckpoint = (cp: Checkpoint) => {
    if (confirm(`Are you sure you want to rollback to restore point: "${cp.name}"? Current unsaved state will be overwritten.`)) {
      try {
        localStorage.setItem('eventique-admin-v2', cp.stateData);
        const parsed = JSON.parse(cp.stateData);
        const parsedLogs = parsed.activityLogs || [];
        parsedLogs.unshift({
          id: `log-${Date.now()}`,
          action: 'Rollback Restored',
          user: 'Admin',
          detail: `Database rolled back successfully to checkpoint: "${cp.name}"`,
          timestamp: new Date().toLocaleString('en-IN'),
          severity: 'success'
        });
        parsed.activityLogs = parsedLogs;
        localStorage.setItem('eventique-admin-v2', JSON.stringify(parsed));
        
        setImportStatus({
          type: 'success',
          msg: `Restored point "${cp.name}" successfully! Reloading system...`
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        setImportStatus({
          type: 'error',
          msg: 'Failed to restore checkpoint. Data format is incorrect.'
        });
      }
    }
  };

  const handleDeleteCheckpoint = (id: string) => {
    const cp = checkpoints.find(c => c.id === id);
    const updated = checkpoints.filter(c => c.id !== id);
    setCheckpoints(updated);
    localStorage.setItem('eventique-restore-checkpoints', JSON.stringify(updated));
    if (cp) {
      addActivityLog('System Backup', `Deleted local restore point checkpoint: ${cp.name}`, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {importStatus.type && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3.5 admin-animate-in ${
            importStatus.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <Info size={18} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold">{importStatus.type === 'success' ? 'Restored' : 'Import Error'}</p>
            <p className="text-xs mt-0.5 opacity-90">{importStatus.msg}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="admin-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100/30 text-[#8B4949] flex items-center justify-center shadow-inner">
            <Download size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1a1410]">Export Database</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Downloads a complete JSON package of your administration system. This holds products, categories, orders, content configurations, analytics states, and settings.
            </p>
          </div>
          <button onClick={handleExport} className="admin-btn admin-btn-primary admin-btn-sm w-full justify-center">
            <Download size={14} /> Export Backup JSON
          </button>
        </div>

        <div className="admin-card space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#6366f1]/10 text-[#6366f1] flex items-center justify-center shadow-inner">
            <FileJson size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1a1410]">Import / Restore Database</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Upload a previously downloaded `.json` backup file to restore your entire database. **Warning: This will overwrite your current settings, products, and order data.**
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="admin-btn admin-btn-outline admin-btn-sm w-full justify-center"
          >
            <Upload size={14} /> Upload &amp; Restore Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportSelect}
          />
        </div>
      </div>

      {/* Local Checkpoints Section */}
      <div className="admin-card space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-3.5 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#1a1410] flex items-center gap-2">
              <RotateCcw size={16} className="text-[#8B4949]" />
              Local Restore Points (Auto-Checkpoints)
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Save instant rollback checkpoints directly in your browser local storage.</p>
          </div>
          <button
            onClick={handleCreateCheckpoint}
            className="admin-btn admin-btn-primary admin-btn-sm flex items-center gap-1.5"
          >
            <Save size={13} /> Create Checkpoint
          </button>
        </div>

        {checkpoints.length > 0 ? (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {checkpoints.map((cp) => (
              <div
                key={cp.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-[#e5e5e5] bg-[#faf8f5]/40 hover:bg-[#faf8f5] transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1a1410]">{cp.name}</span>
                    <span className="text-[10px] text-gray-400 font-medium">({cp.metadata.sizeKB})</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
                    <span>Products: <strong>{cp.metadata.productsCount}</strong></span>
                    <span className="text-gray-300">•</span>
                    <span>Orders: <strong>{cp.metadata.ordersCount}</strong></span>
                    <span className="text-gray-300">•</span>
                    <span>Categories: <strong>{cp.metadata.categoriesCount}</strong></span>
                    <span className="text-gray-300">•</span>
                    <span>Promotions: <strong>{cp.metadata.promotionsCount}</strong></span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleRestoreCheckpoint(cp)}
                    className="px-3 py-1.5 rounded-lg border border-[#8B4949] text-[#8B4949] hover:bg-[#8B4949]/5 text-[11px] font-bold cursor-pointer transition-all bg-white flex items-center gap-1"
                  >
                    <RotateCcw size={11} /> Rollback
                  </button>
                  <button
                    onClick={() => handleDeleteCheckpoint(cp.id)}
                    className="p-1.5 rounded-lg border border-red-250 text-red-500 hover:bg-red-50 cursor-pointer bg-white transition-all"
                    title="Delete Checkpoint"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-[#faf8f5]/50 rounded-2xl border border-dashed border-gray-200">
            <RotateCcw size={28} className="text-gray-300 mx-auto" />
            <p className="text-xs font-semibold text-gray-400 mt-2">No local restore points created yet.</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Click "Create Checkpoint" to snapshot your current configuration.</p>
          </div>
        )}
      </div>

      <div className="admin-card border-red-100 bg-red-50/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100/20 text-red-500 flex items-center justify-center">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-600">Danger Zone: Reset to Factory Defaults</h3>
            <p className="text-xs text-gray-400 mt-0.5">Wipes all custom catalog uploads, orders index, and custom sections.</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
          <p className="text-xs text-gray-400 max-w-lg leading-normal">
            Restoring deletes all products, promotions, templates, and order lists added to the mock context database, resetting them back to original source values.
          </p>
          <button
            onClick={() => setResetDialog(true)}
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <RotateCcw size={14} /> Reset Database
          </button>
        </div>
      </div>

      {resetDialog && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setResetDialog(false); setResetPassword(''); setPasswordError(false); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 admin-scale-in">
            <button
              onClick={() => { setResetDialog(false); setResetPassword(''); setPasswordError(false); }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors border-none bg-transparent cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-red-50 text-red-500">
                <ShieldAlert size={22} />
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="text-lg font-semibold text-[#1a1410] mb-1">Reset to Factory Defaults</h3>
                <p className="text-sm text-gray-500 mb-4">
                  This operation is irreversible and will instantly delete all products, invoices, content changes, and settings blocks.
                </p>
                <div className="space-y-1.5">
                  <label className="admin-label">Admin Security Password *</label>
                  <input
                     type="password"
                     className={`admin-input bg-[#faf8f5] ${passwordError ? 'border-red-500 focus:border-red-500' : ''}`}
                     placeholder="Enter security password..."
                     value={resetPassword}
                     onChange={(e) => {
                       setResetPassword(e.target.value);
                       setPasswordError(false);
                     }}
                  />
                  {passwordError && (
                    <p className="text-[11px] font-bold text-red-500">Incorrect admin password. Please try again.</p>
                  )}
                  <p className="text-[10px] text-gray-400">Hint: Enter the system admin password (<code className="bg-gray-100 px-1 py-0.5 rounded font-mono">eventique123</code>)</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => { setResetDialog(false); setResetPassword(''); setPasswordError(false); }}
                className="admin-btn admin-btn-ghost border border-[#e5e5e5]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (resetPassword === 'eventique123') {
                    resetToDefaults();
                    addActivityLog('System Reset', 'Restored system database to factory default properties', 'warning');
                    setResetDialog(false);
                    setResetPassword('');
                    setPasswordError(false);
                    alert('Database reset successful! Reloading...');
                    window.location.reload();
                  } else {
                    setPasswordError(true);
                  }
                }}
                className="admin-btn admin-btn-danger"
                style={{ background: '#d4183d', color: '#fff', border: 'none' }}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab 4: Support & Diagnostics ──
function SupportToolsTab() {
  const { state, addActivityLog } = useAdmin();
  const [lsSize, setLsSize] = useState('0.0');
  const [consoleLines, setConsoleLines] = useState<string[]>([
    'Welcome to Eventique Admin Diagnostic Shell v2.4',
    'Type "help" to view available diagnostic commands.',
    ''
  ]);
  const [shellInput, setShellInput] = useState('');
  const [scanInProgress, setScanInProgress] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const val = localStorage.getItem('eventique-admin-v2') ?? '';
      setLsSize((new Blob([val]).size / 1024).toFixed(1));
    } catch {
      setLsSize('—');
    }
  }, [state]);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLines]);

  const handleClearCache = () => {
    alert('Browser image cache flushed successfully!');
    addActivityLog('Cache Cleared', 'Flushed browser application image cache', 'info');
  };

  const handleClearLocalStorage = () => {
    if (confirm('Permanently wipe all browser local storage index keys? This will log you out and reset mock state.')) {
      localStorage.removeItem('eventique-admin-v2');
      alert('Local storage cleared. Reloading...');
      window.location.reload();
    }
  };

  const runDiagnosticSequence = () => {
    if (scanInProgress) return;
    setScanInProgress(true);
    setConsoleLines(['[system] Initializing diagnostics scan...']);
    addActivityLog('Integrity Check', 'Ran system integrity scan diagnostics', 'info');

    const steps = [
      '[info] Connecting to local mock databases...',
      '[ok] Established mock index bindings successfully.',
      '[info] Auditing localStorage pointer sizes...',
      `[ok] localStorage quota: ${lsSize} KB / 5120 KB used.`,
      '[info] Analyzing Catalog Schema indices...',
      `[ok] Verified ${state.products.length} products in catalog.`,
      `[ok] Verified ${state.orders.length} order registry records.`,
      `[ok] Verified ${state.customers.length} customer profiles.`,
      `[ok] Verified ${state.reviews.length} product reviews.`,
      '[info] Validating structural router settings...',
      '[ok] All active navigation routes verified.',
      '[success] System check complete: 0 errors, 0 corrupted nodes found.'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setConsoleLines(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setScanInProgress(false);
        }
      }, (idx + 1) * 200);
    });
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = shellInput.trim().toLowerCase();
    if (!cmd) return;

    const newLines = [...consoleLines, `admin@eventique:~$ ${shellInput}`];
    setConsoleLines(newLines);
    setShellInput('');

    if (scanInProgress) {
      setConsoleLines(prev => [...prev, '[error] System is currently running diagnostics. Please wait.']);
      return;
    }

    setTimeout(() => {
      if (cmd === 'help') {
        setConsoleLines(prev => [
          ...prev,
          'Available commands:',
          '  help          - Display this help message',
          '  ping          - Test shell latency',
          '  stats         - Print system database metrics',
          '  check-links   - Scan product catalog images link status',
          '  flush-cache   - Clear browser cache indices',
          '  clear         - Wipes terminal console logs'
        ]);
      } else if (cmd === 'ping') {
        setConsoleLines(prev => [
          ...prev,
          '64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.74 ms',
          '64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.92 ms',
          '2 packets transmitted, 2 received, 0% packet loss, time 1004ms'
        ]);
      } else if (cmd === 'clear') {
        setConsoleLines([]);
      } else if (cmd === 'stats') {
        const checkpointsRaw = localStorage.getItem('eventique-restore-checkpoints');
        const cpCount = checkpointsRaw ? JSON.parse(checkpointsRaw).length : 0;
        setConsoleLines(prev => [
          ...prev,
          '--- System Database Statistics ---',
          `  Catalog Inventory : ${state.products.length} products`,
          `  Sales Orders      : ${state.orders.length} orders`,
          `  Registered Users  : ${state.customers.length} customers`,
          `  Active Promos     : ${state.promotions.length} coupons`,
          `  Local Checkpoints : ${cpCount} restore points`,
          `  Storage Allocation: ${lsSize} KB / 5.0 MB`
        ]);
      } else if (cmd === 'flush-cache') {
        handleClearCache();
        setConsoleLines(prev => [
          ...prev,
          '[info] Flushing browser memory cache indices...',
          '[success] Cache flushed successfully!'
        ]);
      } else if (cmd === 'check-links') {
        setConsoleLines(prev => [...prev, '[info] Scanning catalog images link headers...']);
        setTimeout(() => {
          const brokenProducts = state.products.filter(p => !p.image || p.image === '#');
          const output = [];
          output.push(`[info] Checked ${state.products.length} products.`);
          if (brokenProducts.length > 0) {
            brokenProducts.forEach(p => {
              output.push(`[warning] Missing image URL for product: "${p.name}" (ID: ${p.id})`);
            });
            output.push(`[warning] Found ${brokenProducts.length} warnings. Please update missing images.`);
          } else {
            output.push('[success] Image link check complete. All product images are valid.');
          }
          setConsoleLines(prev => [...prev, ...output]);
        }, 300);
      } else {
        setConsoleLines(prev => [...prev, `Command not found: "${cmd}". Type "help" for options.`]);
      }
    }, 100);
  };

  const lsPercent = Math.min(Math.round((parseFloat(lsSize) / 5120) * 100), 100) || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Monospace Terminal Panel */}
        <div className="md:col-span-8 admin-card flex flex-col justify-between !p-0 overflow-hidden bg-[#1e1e1e] border-none shadow-lg rounded-2xl min-h-[400px]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3d3d3d]">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-[#8B4949]" />
              <span className="text-xs font-mono font-bold text-gray-300">diagnostic_console_sh</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            </div>
          </div>
          
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto max-h-[300px] space-y-1.5 text-gray-200">
            {consoleLines.map((line, idx) => {
              let color = 'text-gray-300';
              if (line.startsWith('[ok]')) {
                color = 'text-green-400';
              } else if (line.startsWith('[success]')) {
                color = 'text-emerald-400 font-bold';
              } else if (line.startsWith('[info]')) {
                color = 'text-blue-400';
              } else if (line.startsWith('[warning]')) {
                color = 'text-yellow-400';
              } else if (line.startsWith('[error]')) {
                color = 'text-red-400 font-bold';
              } else if (line.startsWith('admin@eventique')) {
                color = 'text-orange-400';
              }
              return (
                <div key={idx} className={`${color} leading-relaxed whitespace-pre-wrap`}>
                  {line}
                </div>
              );
            })}
            <div ref={consoleEndRef} />
          </div>

          <form onSubmit={handleCommandSubmit} className="flex items-center px-4 py-2.5 bg-[#121212] border-t border-[#2d2d2d]">
            <span className="font-mono text-xs text-orange-400 mr-2 flex-shrink-0">admin@eventique:~$</span>
            <input
              type="text"
              value={shellInput}
              onChange={(e) => setShellInput(e.target.value)}
              disabled={scanInProgress}
              className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white p-0 focus:ring-0 focus:border-none"
              placeholder={scanInProgress ? 'Diagnostics running...' : 'Type command (e.g. help)...'}
              autoFocus
            />
          </form>
        </div>

        {/* Right side stats & controls */}
        <div className="md:col-span-4 flex flex-col justify-between gap-6">
          {/* Storage Quota Card */}
          <div className="admin-card flex-1 flex flex-col justify-between space-y-4">
            <div className="admin-card-header !mb-0 pb-1">
              <h3 className="text-sm font-bold text-[#1a1410] flex items-center gap-2">
                <HardDrive size={16} className="text-[#8B4949]" />
                Storage Quota Details
              </h3>
            </div>
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-semibold">LocalStorage Allocation</span>
                  <span className="font-bold text-[#1a1410]">{lsSize} KB / 5.0 MB ({lsPercent}%)</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#8B4949] transition-all duration-500"
                    style={{ width: `${lsPercent}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#faf8f5] p-3 rounded-xl border border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Orders</p>
                  <p className="text-lg font-bold text-[#8B4949] mt-0.5">{state.orders.length}</p>
                </div>
                <div className="bg-[#faf8f5] p-3 rounded-xl border border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Products</p>
                  <p className="text-lg font-bold text-[#8B4949] mt-0.5">{state.products.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="admin-card space-y-4">
            <div className="admin-card-header !mb-0 pb-1">
              <h3 className="text-sm font-bold text-[#1a1410] flex items-center gap-2">
                <Wrench size={16} className="text-[#8B4949]" />
                Utility Commands
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={runDiagnosticSequence}
                disabled={scanInProgress}
                className="admin-btn admin-btn-primary admin-btn-sm w-full justify-center flex items-center gap-1.5"
              >
                <Play size={13} /> Run Full Scan
              </button>
              <button
                onClick={handleClearCache}
                className="admin-btn admin-btn-outline admin-btn-sm w-full justify-center flex items-center gap-1.5"
              >
                <RotateCcw size={13} /> Flush Image Cache
              </button>
              <button
                onClick={handleClearLocalStorage}
                className="admin-btn admin-btn-danger admin-btn-sm w-full justify-center flex items-center gap-1.5"
              >
                <Trash2 size={13} /> Wipe LocalStorage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Settings Component ──
export default function Settings() {
  const { state, updateSettings, resetToDefaults } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const subParam = searchParams.get('sub');

  const [mainTab, setMainTab] = useState<'settings' | 'utilities'>(
    tabParam === 'utilities' ? 'utilities' : 'settings'
  );

  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>(
    (tabParam === 'settings' && subParam as SettingsTab) || 'brand'
  );

  const [activeUtilitiesTab, setActiveUtilitiesTab] = useState<TabKey>(
    (tabParam === 'utilities' && subParam as TabKey) || 'media'
  );

  const [form, setForm] = useState<AppSettings>(state.settings);
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);

  // Synchronize state when searchParams changes (browser back/forward or direct link)
  useEffect(() => {
    const tab = searchParams.get('tab');
    const sub = searchParams.get('sub');
    if (tab === 'utilities') {
      setMainTab('utilities');
      if (sub) setActiveUtilitiesTab(sub as TabKey);
    } else if (tab === 'settings') {
      setMainTab('settings');
      if (sub) setActiveSettingsTab(sub as SettingsTab);
    }
  }, [searchParams]);

  // Synchronize form when default settings state changes
  useEffect(() => {
    setForm(state.settings);
  }, [state.settings]);

  const set = <K extends keyof AppSettings>(section: K, updates: Partial<AppSettings[K]>) => {
    setForm(prev => ({ ...prev, [section]: { ...(prev[section] as object), ...updates } }));
  };

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetToDefaults();
    setShowReset(false);
  };

  const handleMainTabChange = (tab: 'settings' | 'utilities') => {
    setMainTab(tab);
    setSearchParams({ tab, sub: tab === 'settings' ? activeSettingsTab : activeUtilitiesTab });
  };

  const handleSettingsTabChange = (sub: SettingsTab) => {
    setActiveSettingsTab(sub);
    setSearchParams({ tab: 'settings', sub });
  };

  const handleUtilitiesTabChange = (sub: TabKey) => {
    setActiveUtilitiesTab(sub);
    setSearchParams({ tab: 'utilities', sub });
  };

  return (
    <div className="space-y-6">
      {/* ── Main Tab Switcher (Settings vs Utilities) ── */}
      <div className="flex bg-[#f5f0e8] p-1.5 rounded-2xl w-fit shadow-inner flex-wrap gap-1 border border-gray-200/50 self-start">
        <button
          onClick={() => handleMainTabChange('settings')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-none cursor-pointer text-xs font-bold transition-all duration-300"
          style={{
            fontFamily: "'Bricolage Grotesque', 'Inter', system-ui, sans-serif",
            background: mainTab === 'settings' ? '#8B4949' : 'transparent',
            color: mainTab === 'settings' ? '#fff' : '#4a4a4a',
            boxShadow: mainTab === 'settings' ? '0 4px 12px rgba(139, 73, 73, 0.2)' : 'none',
          }}
        >
          <SettingsIcon size={16} />
          App Preferences
        </button>
        <button
          onClick={() => handleMainTabChange('utilities')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-none cursor-pointer text-xs font-bold transition-all duration-300"
          style={{
            fontFamily: "'Bricolage Grotesque', 'Inter', system-ui, sans-serif",
            background: mainTab === 'utilities' ? '#8B4949' : 'transparent',
            color: mainTab === 'utilities' ? '#fff' : '#4a4a4a',
            boxShadow: mainTab === 'utilities' ? '0 4px 12px rgba(139, 73, 73, 0.2)' : 'none',
          }}
        >
          <Sliders size={16} />
          System Utilities
        </button>
      </div>

      <div className="admin-animate-in" key={mainTab}>
        {mainTab === 'settings' ? (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {TABS.map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => handleSettingsTabChange(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeSettingsTab === key
                      ? 'bg-[#8B4949] text-white shadow-md'
                      : 'bg-white border border-[#e5e5e5] text-[#4a4a4a] hover:border-[#8B4949]/40'
                  }`}
                >
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>

            <div className="admin-card">
              {/* Brand Settings */}
              {activeSettingsTab === 'brand' && (
                <div className="space-y-5">
                  <h3 className="font-bold text-[#1a1410] text-base border-b border-[#f0f0f0] pb-3">Brand Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUploadZone label="Brand Logo" value={form.brand.logoUrl} onChange={(url) => set('brand', { logoUrl: url })} hint="Recommended: 200×60px transparent PNG" />
                    <FileUploadZone label="Favicon (32x32)" value={form.brand.faviconUrl || ''} onChange={(url) => set('brand', { faviconUrl: url })} hint="Recommended: 32×32px PNG or ICO" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Brand Name">
                      <input type="text" value={form.brand.name} onChange={(e) => set('brand', { name: e.target.value })} className="admin-input" />
                    </Field>
                    <Field label="Tagline">
                      <input type="text" value={form.brand.tagline} onChange={(e) => set('brand', { tagline: e.target.value })} className="admin-input" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Primary Font (Headings)">
                      <select value={form.brand.primaryFont || 'Bricolage Grotesque'} onChange={(e) => set('brand', { primaryFont: e.target.value })} className="admin-select">
                        <option value="Bricolage Grotesque">Bricolage Grotesque</option>
                        <option value="Playfair Display">Playfair Display</option>
                        <option value="Cormorant Garamond">Cormorant Garamond</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Cinzel">Cinzel</option>
                      </select>
                    </Field>
                    <Field label="Secondary Font (Body Text)">
                      <select value={form.brand.secondaryFont || 'Inter'} onChange={(e) => set('brand', { secondaryFont: e.target.value })} className="admin-select">
                        <option value="Inter">Inter</option>
                        <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                        <option value="DM Sans">DM Sans</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Outfit">Outfit</option>
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <Field label="Theme Color">
                      <div className="flex items-center gap-3">
                        <input type="color" value={form.brand.themeColor} onChange={(e) => set('brand', { themeColor: e.target.value })} className="w-10 h-10 rounded-lg border border-[#e5e5e5] cursor-pointer" />
                        <input type="text" value={form.brand.themeColor} onChange={(e) => set('brand', { themeColor: e.target.value })} className="admin-input max-w-[120px]" />
                      </div>
                    </Field>
                    <div>
                      <label className="admin-label block mb-2">Color Palette Presets</label>
                      <div className="flex gap-2 flex-wrap">
                        {[
                          { name: 'Vintage Wine', hex: '#8B4949' },
                          { name: 'Royal Gold', hex: '#D4AF37' },
                          { name: 'Forest Green', hex: '#2D5A27' },
                          { name: 'Royal Navy', hex: '#1E3A8A' },
                          { name: 'Obsidian', hex: '#1C1917' }
                        ].map(preset => (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => set('brand', { themeColor: preset.hex })}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#e5e5e5] bg-white hover:border-[#8B4949] transition-all text-xs font-semibold"
                          >
                            <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.hex }} />
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Settings */}
              {activeSettingsTab === 'seo' && (
                <div className="space-y-5">
                  <h3 className="font-bold text-[#1a1410] text-base border-b border-[#f0f0f0] pb-3">Website &amp; SEO</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Live Site URL">
                      <input type="url" value={form.seo.siteUrl} onChange={(e) => set('seo', { siteUrl: e.target.value })} className="admin-input" />
                    </Field>
                    <Field label="SEO Site Title">
                      <input type="text" value={form.seo.seoTitle} onChange={(e) => set('seo', { seoTitle: e.target.value })} className="admin-input" />
                    </Field>
                  </div>
                  <FileUploadZone label="Social Share Image (OG Image)" value={form.seo.socialShareImgUrl || ''} onChange={(url) => set('seo', { socialShareImgUrl: url })} hint="Recommended: 1200×630px JPG/PNG for social share link previews" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Google Analytics Measurement ID">
                      <input type="text" value={form.seo.googleAnalyticsId || ''} onChange={(e) => set('seo', { googleAnalyticsId: e.target.value })} className="admin-input" placeholder="e.g. G-XXXXXXXXXX" />
                    </Field>
                    <Field label="Facebook Pixel ID">
                      <input type="text" value={form.seo.facebookPixelId || ''} onChange={(e) => set('seo', { facebookPixelId: e.target.value })} className="admin-input" placeholder="e.g. 15-digit Pixel ID" />
                    </Field>
                  </div>
                  <Field label="Meta Description">
                    <textarea value={form.seo.metaDescription} onChange={(e) => set('seo', { metaDescription: e.target.value })} rows={2} className="admin-textarea" />
                  </Field>
                  <Field label="Keywords (comma-separated)">
                    <input type="text" value={form.seo.keywords} onChange={(e) => set('seo', { keywords: e.target.value })} className="admin-input" placeholder="wedding invitation, e-invite, websites..." />
                  </Field>
                  <Field label="Custom Robots.txt rules">
                    <textarea value={form.seo.robotsTxt || 'User-agent: *\nAllow: /'} onChange={(e) => set('seo', { robotsTxt: e.target.value })} rows={3} className="admin-textarea font-mono text-xs" />
                  </Field>
                </div>
              )}

              {/* Contact Settings */}
              {activeSettingsTab === 'contact' && (
                <div className="space-y-5">
                  <h3 className="font-bold text-[#1a1410] text-base border-b border-[#f0f0f0] pb-3">Contact &amp; Social</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Email Address"><input type="email" value={form.contact.email} onChange={(e) => set('contact', { email: e.target.value })} className="admin-input" /></Field>
                    <Field label="Phone/Mobile Number"><input type="text" value={form.contact.phone} onChange={(e) => set('contact', { phone: e.target.value })} className="admin-input" /></Field>
                    <Field label="WhatsApp Business Number"><input type="text" value={form.contact.whatsapp} onChange={(e) => set('contact', { whatsapp: e.target.value })} className="admin-input" placeholder="e.g. 919876543210" /></Field>
                    <Field label="Instagram Handle"><input type="text" value={form.contact.instagram} onChange={(e) => set('contact', { instagram: e.target.value })} className="admin-input" placeholder="e.g. eventique.in" /></Field>
                    <Field label="Facebook Page URL"><input type="text" value={form.contact.facebook} onChange={(e) => set('contact', { facebook: e.target.value })} className="admin-input" /></Field>
                    <Field label="Pinterest Profile URL"><input type="text" value={form.contact.pinterest} onChange={(e) => set('contact', { pinterest: e.target.value })} className="admin-input" /></Field>
                    <Field label="YouTube Channel Link"><input type="url" value={form.contact.youtube || ''} onChange={(e) => set('contact', { youtube: e.target.value })} className="admin-input" placeholder="YouTube channel URL" /></Field>
                    <Field label="Studio Operating Hours"><input type="text" value={form.contact.operatingHours || ''} onChange={(e) => set('contact', { operatingHours: e.target.value })} className="admin-input" placeholder="e.g. Mon - Sat: 9:00 AM - 6:00 PM" /></Field>
                  </div>
                  <Field label="Physical Design Studio Address">
                    <textarea value={form.contact.address} onChange={(e) => set('contact', { address: e.target.value })} rows={2} className="admin-textarea" />
                  </Field>
                  <Field label="Google Maps Embed Link (Iframe src)">
                    <input type="text" value={form.contact.googleMapsEmbed || ''} onChange={(e) => set('contact', { googleMapsEmbed: e.target.value })} className="admin-input" placeholder="Paste only the src attribute of Google Map iframe embed" />
                  </Field>
                </div>
              )}

              {/* Payment Settings */}
              {activeSettingsTab === 'payment' && (
                <div className="space-y-5">
                  <h3 className="font-bold text-[#1a1410] text-base border-b border-[#f0f0f0] pb-3">Payment Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Razorpay Key ID">
                      <input type="text" value={form.payment.razorpayKey} onChange={(e) => set('payment', { razorpayKey: e.target.value })} className="admin-input" placeholder="rzp_live_..." />
                    </Field>
                    <Field label="Razorpay Key Secret">
                      <input type="password" value={form.payment.razorpaySecret || ''} onChange={(e) => set('payment', { razorpaySecret: e.target.value })} className="admin-input" placeholder="Razorpay secret token" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="GST / CGST / SGST Tax %">
                      <input type="number" value={form.payment.gstPercent} onChange={(e) => set('payment', { gstPercent: Number(e.target.value) })} className="admin-input" min={0} max={100} />
                    </Field>
                    <Field label="Invoice Prefix">
                      <input type="text" value={form.payment.invoicePrefix} onChange={(e) => set('payment', { invoicePrefix: e.target.value })} className="admin-input" />
                    </Field>
                    <Field label="Store Default Currency">
                      <select value={form.payment.currency || 'INR'} onChange={(e) => set('payment', { currency: e.target.value })} className="admin-select">
                        <option value="INR">INR (₹) Rupee</option>
                        <option value="USD">USD ($) Dollar</option>
                        <option value="EUR">EUR (€) Euro</option>
                        <option value="GBP">GBP (£) Pound</option>
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="QR Payment UPI ID (For Manual Orders)">
                      <input type="text" value={form.payment.upiId || ''} onChange={(e) => set('payment', { upiId: e.target.value })} className="admin-input" placeholder="e.g. eventique@okaxis" />
                    </Field>
                    <Field label="Company GSTIN Number">
                      <input type="text" value={form.payment.gstinNumber || ''} onChange={(e) => set('payment', { gstinNumber: e.target.value })} className="admin-input" placeholder="e.g. 27AAAAA0000A1Z5" />
                    </Field>
                  </div>
                  <Field label="Bank Transfer Details (Printed on Invoices)">
                    <textarea value={form.payment.bankAccountDetails || ''} onChange={(e) => set('payment', { bankAccountDetails: e.target.value })} rows={3} className="admin-textarea font-mono text-xs" placeholder="Bank Name, Account Name, IFSC, Account Number" />
                  </Field>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-[#f0f0f0]">
                      <div><p className="font-medium text-sm text-[#1a1410]">Auto-generate Invoice PDF</p><p className="text-xs text-gray-400">Generate invoice PDF after successful payment verification</p></div>
                      <Toggle value={form.payment.autoInvoice} onChange={(v) => set('payment', { autoInvoice: v })} />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div><p className="font-medium text-sm text-[#1a1410]">Allow Installment/Partial Payments</p><p className="text-xs text-gray-400">Accept booking advance (e.g. 50%) for custom stationery printing</p></div>
                      <Toggle value={form.payment.partialPayment} onChange={(v) => set('payment', { partialPayment: v })} />
                    </div>
                  </div>
                </div>
              )}

              {/* Downloads Settings */}
              {activeSettingsTab === 'downloads' && (
                <div className="space-y-5">
                  <h3 className="font-bold text-[#1a1410] text-base border-b border-[#f0f0f0] pb-3">Customer Download Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="File Link Expiry (days)">
                      <input type="number" value={form.downloads.fileExpiry} onChange={(e) => set('downloads', { fileExpiry: Number(e.target.value) })} className="admin-input" />
                    </Field>
                    <Field label="Max Downloads per Link">
                      <input type="number" value={form.downloads.maxDownloads} onChange={(e) => set('downloads', { maxDownloads: Number(e.target.value) })} className="admin-input" />
                    </Field>
                    <Field label="Allowed File Extensions">
                      <input type="text" value={form.downloads.allowedTypes} onChange={(e) => set('downloads', { allowedTypes: e.target.value })} className="admin-input" placeholder="pdf,mp4,zip" />
                    </Field>
                    <Field label="Max Sourcing File Size limit (MB)">
                      <input type="number" value={form.downloads.maxUploadSizeMb} onChange={(e) => set('downloads', { maxUploadSizeMb: Number(e.target.value) })} className="admin-input" />
                    </Field>
                  </div>
                  <Field label="Custom Download Portal Headline">
                    <input type="text" value={form.downloads.downloadHeadline || ''} onChange={(e) => set('downloads', { downloadHeadline: e.target.value })} className="admin-input" placeholder="e.g. Your Custom Invitation is Ready!" />
                  </Field>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-[#f0f0f0]">
                      <div><p className="font-medium text-sm text-[#1a1410]">Notify Customer After Upload</p><p className="text-xs text-gray-400">Send direct email alert once designer uploads invitation assets</p></div>
                      <Toggle value={form.downloads.notifyAfterUpload} onChange={(v) => set('downloads', { notifyAfterUpload: v })} />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-[#f0f0f0]">
                      <div><p className="font-medium text-sm text-[#1a1410]">Require Login to Download</p><p className="text-xs text-gray-400">Customers must authenticate to download high-res vectors/PDFs</p></div>
                      <Toggle value={form.downloads.requireLogin} onChange={(v) => set('downloads', { requireLogin: v })} />
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div><p className="font-medium text-sm text-[#1a1410]">Watermark Draft Previews</p><p className="text-xs text-gray-400">Apply a diagonal overlay watermark on invite file previews until order is fully marked paid</p></div>
                      <Toggle value={form.downloads.watermarkPreviews || false} onChange={(v) => set('downloads', { watermarkPreviews: v })} />
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Settings */}
              {activeSettingsTab === 'shipping' && (
                <div className="space-y-5">
                  <h3 className="font-bold text-[#1a1410] text-base border-b border-[#f0f0f0] pb-3">Shipping Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Default Sourcing Courier"><input type="text" value={form.shipping.defaultCourier} onChange={(e) => set('shipping', { defaultCourier: e.target.value })} className="admin-input" /></Field>
                    <Field label="Average Dispatch Time (days)"><input type="number" value={form.shipping.dispatchDays} onChange={(e) => set('shipping', { dispatchDays: Number(e.target.value) })} className="admin-input" /></Field>
                    <Field label="Domestic Shipping Charge (₹)"><input type="number" value={form.shipping.shippingCharge} onChange={(e) => set('shipping', { shippingCharge: Number(e.target.value) })} className="admin-input" /></Field>
                    <Field label="Free Domestic Shipping threshold (₹)"><input type="number" value={form.shipping.freeShippingAbove} onChange={(e) => set('shipping', { freeShippingAbove: Number(e.target.value) })} className="admin-input" /></Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Shiprocket API Username">
                      <input type="text" value={form.shipping.shiprocketUsername || ''} onChange={(e) => set('shipping', { shiprocketUsername: e.target.value })} className="admin-input" placeholder="e.g. API client username" />
                    </Field>
                    <Field label="Shiprocket API Password">
                      <input type="password" value={form.shipping.shiprocketPassword || ''} onChange={(e) => set('shipping', { shiprocketPassword: e.target.value })} className="admin-input" placeholder="API access password" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between py-3">
                      <div><p className="font-medium text-sm text-[#1a1410]">Enable International Shipping</p><p className="text-xs text-gray-400">Accept and calculate custom overseas rates</p></div>
                      <Toggle value={form.shipping.enableIntlShipping || false} onChange={(v) => set('shipping', { enableIntlShipping: v })} />
                    </div>
                    {form.shipping.enableIntlShipping && (
                      <Field label="Flat International Shipping Rate (₹)">
                        <input type="number" value={form.shipping.intlShippingCharge || 0} onChange={(e) => set('shipping', { intlShippingCharge: Number(e.target.value) })} className="admin-input" />
                      </Field>
                    )}
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#f0f0f0]">
                    <div><p className="font-medium text-sm text-[#1a1410]">Allow Studio Self-Pickup</p><p className="text-xs text-gray-400">Allow customers to choose self-pickup from studio to skip shipping charges</p></div>
                    <Toggle value={form.shipping.localPickup || false} onChange={(v) => set('shipping', { localPickup: v })} />
                  </div>
                  <Field label="Shipping &amp; Delivery Policy Description">
                    <textarea value={form.shipping.shippingPolicy} onChange={(e) => set('shipping', { shippingPolicy: e.target.value })} rows={2} className="admin-textarea" />
                  </Field>
                </div>
              )}

              {/* Notifications Settings */}
              {activeSettingsTab === 'notifications' && (
                <div className="space-y-5">
                  <h3 className="font-bold text-[#1a1410] text-base border-b border-[#f0f0f0] pb-3">Notification Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Admin Alert Emails (comma-separated)">
                      <input type="text" value={form.notifications.alertEmails || ''} onChange={(e) => set('notifications', { alertEmails: e.target.value })} className="admin-input" placeholder="admin@eventique.in" />
                    </Field>
                    <Field label="WhatsApp API Gateway Token/Key">
                      <input type="password" value={form.notifications.whatsappApiKey || ''} onChange={(e) => set('notifications', { whatsappApiKey: e.target.value })} className="admin-input" placeholder="Twilio/Wati Token" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end border-b border-[#f0f0f0] pb-4">
                    <div className="flex items-center justify-between py-3 flex-1">
                      <div><p className="font-medium text-sm text-[#1a1410]">Low Stock Alerts</p><p className="text-xs text-gray-400">Receive alert when printed items inventory falls low</p></div>
                      <Toggle value={form.notifications.lowStockAlert || false} onChange={(v) => set('notifications', { lowStockAlert: v })} />
                    </div>
                    {form.notifications.lowStockAlert && (
                      <Field label="Alert Threshold Count">
                        <input type="number" value={form.notifications.lowStockThreshold || 0} onChange={(e) => set('notifications', { lowStockThreshold: Number(e.target.value) })} className="admin-input" min={1} />
                      </Field>
                    )}
                  </div>
                  <div className="space-y-0">
                    {[
                      { key: 'newOrderAlert', label: 'New Order Admin Alert', desc: 'Email admin when new order is placed' },
                      { key: 'paymentSuccessEmail', label: 'Payment Success Email', desc: 'Send customer payment confirmation' },
                      { key: 'fileUploadedEmail', label: 'File Uploaded Email', desc: 'Notify customer when file is ready' },
                      { key: 'shippedWhatsapp', label: 'Shipped Order WhatsApp', desc: 'WhatsApp alert when order is shipped' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-4 border-b border-[#f0f0f0] last:border-0">
                        <div>
                          <p className="font-medium text-sm text-[#1a1410]">{label}</p>
                          <p className="text-xs text-gray-400">{desc}</p>
                        </div>
                        <Toggle
                          value={form.notifications[key as keyof typeof form.notifications]}
                          onChange={(v) => set('notifications', { [key]: v } as Partial<typeof form.notifications>)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSettingsTab === 'security' && (
                <div className="space-y-5">
                  <h3 className="font-bold text-[#1a1410] text-base border-b border-[#f0f0f0] pb-3">Security &amp; Encryption</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Admin Session Inactivity Timeout (minutes)">
                      <input type="number" value={form.security.sessionTimeout || 30} onChange={(e) => set('security', { sessionTimeout: Number(e.target.value) })} className="admin-input" min={5} />
                    </Field>
                    <Field label="Allowed IP Whitelist (For Admin Access)">
                      <input type="text" value={form.security.ipWhitelist || ''} onChange={(e) => set('security', { ipWhitelist: e.target.value })} className="admin-input" placeholder="e.g. 192.168.1.1 (leave blank for all)" />
                    </Field>
                  </div>
                  <div className="space-y-0">
                    {[
                      { key: 'twoFactor', label: 'Two-Factor Login', desc: 'Require 2FA for admin login access' },
                      { key: 'activityLogs', label: 'Activity Logs', desc: 'Track all admin actions in logs database' },
                      { key: 'autoBackup', label: 'Auto Backup', desc: 'Automatic daily data backups to browser local cache' },
                      { key: 'enforceStrongPassword', label: 'Enforce Strong Passwords', desc: 'Require customer passwords to use numbers, symbols and capitalization' },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-4 border-b border-[#f0f0f0] last:border-0">
                        <div>
                          <p className="font-medium text-sm text-[#1a1410]">{label}</p>
                          <p className="text-xs text-gray-400">{desc}</p>
                        </div>
                        <Toggle
                          value={form.security[key as keyof typeof form.security]}
                          onChange={(v) => set('security', { [key]: v } as Partial<typeof form.security>)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="pt-2">
                    <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-700 text-sm">Reset All Data</p>
                        <p className="text-xs text-red-500 mt-1">Restore all content to original defaults. All changes will be lost.</p>
                        <button onClick={() => setShowReset(true)} className="admin-btn admin-btn-sm mt-3 text-red-600 border border-red-400 hover:bg-red-50">
                          <RotateCcw size={13} /> Reset to Defaults
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Bar */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#f0f0f0]">
                <p className="text-xs text-gray-400">Changes are saved to localStorage</p>
                <button onClick={handleSave} className="admin-btn admin-btn-primary">
                  {saved ? '✓ Saved!' : <><Save size={15} /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex bg-[#f5f0e8] p-1.5 rounded-2xl w-fit shadow-inner flex-wrap gap-1 border border-gray-200/50">
              {UTILITY_TABS.map(({ key, label, icon }) => {
                const isActive = activeUtilitiesTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleUtilitiesTabChange(key)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-none cursor-pointer text-xs font-semibold transition-all duration-300"
                    style={{
                      fontFamily: "'Bricolage Grotesque', 'Inter', system-ui, sans-serif",
                      background: isActive ? '#8B4949' : 'transparent',
                      color: isActive ? '#fff' : '#4a4a4a',
                      boxShadow: isActive ? '0 4px 12px rgba(139, 73, 73, 0.2)' : 'none',
                    }}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="admin-animate-in" key={activeUtilitiesTab}>
              {activeUtilitiesTab === 'media'   && <MediaLibraryTab />}
              {activeUtilitiesTab === 'logs'    && <ActivityLogsTab />}
              {activeUtilitiesTab === 'backup'  && <BackupExportTab />}
              {activeUtilitiesTab === 'support' && <SupportToolsTab />}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={showReset}
        title="Reset All Data"
        message="This will permanently reset all admin data to defaults. Your edits will be lost."
        confirmLabel="Yes, Reset"
        onConfirm={handleReset}
        onCancel={() => setShowReset(false)}
        danger
      />
    </div>
  );
}
