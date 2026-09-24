import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  LayoutGrid, 
  Code2, 
  Link2
} from 'lucide-react';
import { 
  ResourceItem, 
  ResourceType, 
  PriorityLevel, 
  StatusType,
  UsageFrequency 
} from '../types';

interface AddEditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resource: ResourceItem) => void;
  editingResource: ResourceItem | null;
  defaultType?: ResourceType;
}

export function AddEditResourceModal({
  isOpen,
  onClose,
  onSave,
  editingResource,
  defaultType = 'spreadsheet'
}: AddEditResourceModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ResourceType>(defaultType);
  const [frequency, setFrequency] = useState<UsageFrequency>('often');
  const [url, setUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [owner, setOwner] = useState('Operations HQ');
  const [priority, setPriority] = useState<PriorityLevel>('high');
  const [status, setStatus] = useState<StatusType>('active');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState<'sql' | 'python' | 'bash'>('sql');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingResource) {
      setTitle(editingResource.title);
      setDescription(editingResource.description || '');
      setType(editingResource.type);
      setFrequency(editingResource.frequency || 'often');
      setUrl(editingResource.url);
      setEmbedUrl(editingResource.embedUrl || '');
      setOwner(editingResource.owner || 'Operations HQ');
      setPriority(editingResource.priority || 'high');
      setStatus(editingResource.status || 'active');
      setCodeSnippet(editingResource.codeSnippet || '');
      setLanguage((editingResource.language as any) || 'sql');
      setNotes(editingResource.notes || '');
    } else {
      setTitle('');
      setDescription('');
      setType(defaultType);
      setFrequency('often');
      setUrl('');
      setEmbedUrl('');
      setOwner('Operations HQ');
      setPriority('high');
      setStatus('active');
      setCodeSnippet('');
      setLanguage('sql');
      setNotes('');
    }
    setError('');
  }, [editingResource, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!url.trim()) {
      setError('Valid URL is required');
      return;
    }

    const item: ResourceItem = {
      id: editingResource ? editingResource.id : `res-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || `${type.charAt(0).toUpperCase() + type.slice(1)} resource`,
      type,
      frequency,
      url: url.trim(),
      embedUrl: embedUrl.trim() || undefined,
      owner: owner.trim() || 'Operations HQ',
      priority,
      status,
      tags: [],
      codeSnippet: type === 'code' ? codeSnippet : undefined,
      language: type === 'code' ? language : undefined,
      notes: notes.trim() || undefined,
      isPinned: editingResource?.isPinned || false,
      clickCount: editingResource?.clickCount || 0,
      lastAccessed: editingResource?.lastAccessed || 'Updated today',
      createdAt: editingResource?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white border border-slate-200/90 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#fb641b] flex items-center justify-center font-bold text-sm">
              {editingResource ? '✎' : '+'}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {editingResource ? 'Edit Resource' : 'Add Team Resource'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Save spreadsheets, dashboards, runbooks, or links to the team shelf.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Resource Type Selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Resource Type</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'spreadsheet', label: 'Sheet', icon: FileSpreadsheet },
                { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
                { id: 'code', label: 'Code', icon: Code2 },
                { id: 'link', label: 'Link', icon: Link2 }
              ].map(t => {
                const Icon = t.icon;
                const isSel = type === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as ResourceType)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                      isSel 
                        ? 'bg-blue-50 border-[#2874f0] text-[#2874f0] shadow-xs' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FM-2026 Report or Hourly Reliability"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2874f0]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this operational resource and its usage..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2874f0] resize-none"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Target URL *</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2874f0] font-mono text-[11px]"
            />
          </div>

          {/* Usage Frequency */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Shelf Usage Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as UsageFrequency)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#2874f0] cursor-pointer"
            >
              <option value="often">Often used</option>
              <option value="rare">Rarely used</option>
            </select>
          </div>

          {/* If Code: Code Editor Snippet */}
          {type === 'code' && (
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-slate-700 font-semibold">Code / Runbook Snippet</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-slate-100 text-slate-700 rounded-lg px-2 py-1 text-[11px] cursor-pointer"
                >
                  <option value="sql">SQL Query</option>
                  <option value="python">Python Script</option>
                  <option value="bash">Bash Script</option>
                </select>
              </div>
              <textarea
                rows={5}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="-- Enter SQL query or automation code..."
                className="w-full bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl p-3 border border-slate-800 focus:outline-none"
              />
            </div>
          )}

          {/* Optional Embed Link */}
          {(type === 'spreadsheet' || type === 'dashboard') && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Direct Embed URL (Optional)</label>
              <input
                type="url"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="https://.../htmlembed or /embed"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2874f0] font-mono text-[11px]"
              />
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold rounded-xl shadow-xs hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {editingResource ? 'Save Changes' : 'Add to Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
