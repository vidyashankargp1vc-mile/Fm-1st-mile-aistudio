import { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Plus, 
  Pencil, 
  Trash2, 
  Star,
  FolderGit2
} from 'lucide-react';
import { ResourceItem } from '../types';
import { useToast } from '../components/Toast';

interface CodesViewProps {
  resources: ResourceItem[];
  searchQuery: string;
  onOpenResource: (resource: ResourceItem) => void;
  onPreviewResource: (resource: ResourceItem) => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenAddModal: (type?: ResourceItem['type']) => void;
}

export function CodesView({
  resources,
  searchQuery,
  onOpenResource,
  onPreviewResource,
  onEditResource,
  onDeleteResource,
  onTogglePin,
  onOpenAddModal
}: CodesViewProps) {
  const { showToast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const codeItems = resources.filter(r => {
    if (r.type !== 'code') return false;
    if (selectedLanguage !== 'All' && r.language !== selectedLanguage) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchSnippet = r.codeSnippet?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchSnippet;
    }
    return true;
  });

  const handleCopySnippet = (item: ResourceItem) => {
    if (!item.codeSnippet) {
      navigator.clipboard.writeText(item.url);
    } else {
      navigator.clipboard.writeText(item.codeSnippet);
    }
    setCopiedId(item.id);
    showToast(`Copied ${item.title} code snippet!`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-2.5 animate-fadeIn pb-2 max-w-7xl mx-auto select-none">
      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-1.5 px-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#2874f0] border border-blue-100 flex items-center justify-center shrink-0">
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-900">First Mile Codes & Runbooks</h2>
              <span className="text-[11px] font-semibold text-[#2874f0]">
                ({codeItems.length} Scripts)
              </span>
            </div>
          </div>
        </div>

        {/* Language Filter & Add Code Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap shrink-0">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            {['All', 'sql', 'python'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2 py-0.5 rounded-md uppercase transition-all duration-150 cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-white text-[#2874f0] shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={() => onOpenAddModal('code')}
            className="flex items-center gap-1 bg-[#2874f0] hover:bg-blue-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-2xs transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Add Script</span>
          </button>
        </div>
      </div>

      {/* Featured CODES Folder Banner */}
      <div className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-50/90 via-white to-amber-50/50 border border-blue-100 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#2874f0] flex items-center justify-center shrink-0">
            <FolderGit2 className="w-3.5 h-3.5" />
          </div>
          <div className="truncate flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-[#2874f0] shrink-0">
              Repository:
            </span>
            <h3 className="text-xs font-bold text-slate-900 truncate">
              CODES Folder
            </h3>
            <span className="text-[11px] text-slate-400 hidden md:inline truncate">
              • Google Drive shared folder for production BigQuery scripts & runbooks
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              navigator.clipboard.writeText('https://drive.google.com/drive/folders/1LYTD8FkEtW2oZnjgrIYd1FUp7WjWrVqx?usp=sharing');
              showToast('Copied CODES Folder URL!', 'success');
            }}
            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-50 transition-all cursor-pointer"
          >
            Copy Link
          </button>

          <a
            href="https://drive.google.com/drive/folders/1LYTD8FkEtW2oZnjgrIYd1FUp7WjWrVqx?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#2874f0] hover:bg-blue-700 text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer"
          >
            <span>Open Folder</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Code Snippets List */}
      {codeItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {codeItems.map(item => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xs transition-all duration-150 group"
            >
              {/* Header */}
              <div className="p-3 bg-white border-b border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#ea580c]">
                      {item.language || 'SQL'}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-400">
                      Operations HQ
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTogglePin(item.id)}
                      className={`p-1 rounded transition-all cursor-pointer ${
                        item.isPinned ? 'text-amber-500' : 'text-slate-300 hover:text-slate-600'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.isPinned ? 'fill-amber-500' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleCopySnippet(item)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
                    >
                      {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3
                    onClick={() => onPreviewResource(item)}
                    className="font-bold text-xs text-slate-900 group-hover:text-[#2874f0] cursor-pointer transition-colors truncate"
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Code Snippet Box */}
              <div
                onClick={() => onPreviewResource(item)}
                className="relative bg-slate-900 p-2.5 font-mono text-[11px] text-slate-200 overflow-x-auto max-h-28 cursor-pointer"
              >
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-[9.5px] text-slate-400">
                  <span className="flex items-center gap-1 text-orange-400">
                    <Terminal className="w-2.5 h-2.5" />
                    Terminal Executable
                  </span>
                  <span>{item.codeSnippet?.split('\n').length || 1} lines</span>
                </div>
                <pre className="leading-tight text-slate-300">
                  <code>{item.codeSnippet || `// Target URL: ${item.url}`}</code>
                </pre>
              </div>

              {/* Footer */}
              <div className="py-1.5 px-3 bg-slate-50 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                <span className="text-[10px] text-slate-400">
                  Updated today
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditResource(item)}
                    className="p-1 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onDeleteResource(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onOpenResource(item)}
                    className="flex items-center gap-1 text-[#2874f0] hover:text-blue-700 font-semibold text-[11px] transition-all cursor-pointer ml-1"
                  >
                    <span>View Script</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
          No runbooks found matching the criteria.
        </div>
      )}
    </div>
  );
}
