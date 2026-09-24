import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  LayoutGrid, 
  Code2, 
  Link2
} from 'lucide-react';
import { ResourceItem } from '../types';
import { useState } from 'react';
import { useToast } from './Toast';

interface PreviewModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
  onOpenExternal: (resource: ResourceItem) => void;
}

export function PreviewModal({
  resource,
  onClose,
  onOpenExternal
}: PreviewModalProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!resource) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(resource.url);
    setCopied(true);
    showToast('Resource URL copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch (resource.type) {
      case 'spreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'dashboard':
        return <LayoutGrid className="w-5 h-5 text-orange-600" />;
      case 'code':
        return <Code2 className="w-5 h-5 text-[#2874f0]" />;
      default:
        return <Link2 className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
              {getIcon()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                  {resource.title}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  resource.frequency === 'often'
                    ? 'bg-blue-50 text-[#2874f0] border border-blue-200'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {resource.frequency === 'often' ? 'Often used' : 'Rarely used'}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Operations HQ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Copy URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onOpenExternal(resource)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2874f0] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span>Launch</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold text-slate-700">Target System Link</span>
              <span className="font-mono text-[11px] text-slate-400">{resource.type}</span>
            </div>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block font-mono text-[11px] text-[#2874f0] break-all hover:underline"
            >
              {resource.url}
            </a>
          </div>

          {resource.description && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Description</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {resource.description}
              </p>
            </div>
          )}

          {/* If Code: Show Formatted Code */}
          {resource.type === 'code' && resource.codeSnippet && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-700">Runbook Executable ({resource.language || 'SQL'})</span>
                <span>{resource.codeSnippet.split('\n').length} lines</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-96">
                <code>{resource.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Embedded Viewer (if embedUrl is provided) */}
          {resource.embedUrl && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-700">Embedded Live Workspace</span>
                <span className="text-[11px] text-slate-400">Direct Viewer</span>
              </div>
              <div className="w-full h-96 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 relative">
                <iframe
                  src={resource.embedUrl}
                  title={resource.title}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
