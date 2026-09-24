import { useState } from 'react';
import { 
  FileSpreadsheet, 
  LayoutGrid, 
  Table as TableIcon, 
  Eye, 
  Star, 
  Copy, 
  Check, 
  Pencil, 
  Trash2,
  ArrowRight
} from 'lucide-react';
import { ResourceItem, UsageFrequency } from '../types';
import { ResourceCard } from '../components/ResourceCard';
import { ResourceIcon } from '../components/ResourceIcon';
import { useToast } from '../components/Toast';

interface SpreadsheetsViewProps {
  resources: ResourceItem[];
  searchQuery: string;
  onOpenResource: (resource: ResourceItem) => void;
  onPreviewResource: (resource: ResourceItem) => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenAddModal?: (type?: ResourceItem['type']) => void;
}

export function SpreadsheetsView({
  resources,
  searchQuery,
  onOpenResource,
  onPreviewResource,
  onEditResource,
  onDeleteResource,
  onTogglePin,
  onOpenAddModal
}: SpreadsheetsViewProps) {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [frequencyFilter, setFrequencyFilter] = useState<'all' | UsageFrequency>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter spreadsheets
  const spreadsheets = resources.filter(r => {
    if (r.type !== 'spreadsheet') return false;
    if (frequencyFilter !== 'all' && r.frequency !== frequencyFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchUrl = r.url.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchUrl;
    }
    return true;
  });

  const handleCopyLink = (item: ResourceItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    showToast(`Copied ${item.title} URL to clipboard!`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-2.5 animate-fadeIn pb-2 max-w-7xl mx-auto select-none">
      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-1.5 px-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-900">First Mile Spreadsheets</h2>
              <span className="text-[11px] font-semibold text-emerald-700">
                ({spreadsheets.length} Sheets)
              </span>
            </div>
          </div>
        </div>

        {/* View Controls & Action */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap shrink-0">
          {/* Frequency Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => setFrequencyFilter('all')}
              className={`px-2 py-0.5 rounded-md text-[11px] transition-all duration-150 cursor-pointer ${
                frequencyFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFrequencyFilter('often')}
              className={`px-2 py-0.5 rounded-md text-[11px] transition-all duration-150 cursor-pointer ${
                frequencyFilter === 'often' ? 'bg-white text-[#2874f0] shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Often
            </button>
            <button
              onClick={() => setFrequencyFilter('rare')}
              className={`px-2 py-0.5 rounded-md text-[11px] transition-all duration-150 cursor-pointer ${
                frequencyFilter === 'rare' ? 'bg-white text-[#2874f0] shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Rare
            </button>
          </div>

          {/* Grid / Table switch */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md transition-all duration-150 cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-md transition-all duration-150 cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table */}
      {spreadsheets.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {spreadsheets.map(sheet => (
              <ResourceCard
                key={sheet.id}
                resource={sheet}
                onOpen={onOpenResource}
                onPreview={onPreviewResource}
                onEdit={onEditResource}
                onDelete={onDeleteResource}
                onTogglePin={onTogglePin}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-bold">Sheet Name & Target</th>
                    <th className="py-2 px-3 font-bold">Usage</th>
                    <th className="py-2 px-3 font-bold">Last Activity</th>
                    <th className="py-2 px-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {spreadsheets.map(sheet => (
                    <tr key={sheet.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onTogglePin(sheet.id)}
                            className={`p-0.5 rounded transition-all duration-150 cursor-pointer ${
                              sheet.isPinned ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${sheet.isPinned ? 'fill-amber-500' : ''}`} />
                          </button>
                          <ResourceIcon resource={sheet} size="sm" />
                          <div className="truncate">
                            <span
                              onClick={() => onOpenResource(sheet)}
                              className="font-bold text-slate-900 hover:text-[#2874f0] cursor-pointer block text-xs truncate"
                            >
                              {sheet.title}
                            </span>
                            <span className="text-[10.5px] text-slate-400 truncate block">
                              {sheet.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2 px-3 text-[11px] text-slate-500">
                        {sheet.frequency === 'often' ? 'Often used' : 'Rarely used'}
                      </td>

                      <td className="py-2 px-3 text-slate-400 text-[11px]">
                        {sheet.lastAccessed || 'Updated today'}
                      </td>

                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onPreviewResource(sheet)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCopyLink(sheet)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                            title="Copy link"
                          >
                            {copiedId === sheet.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => onEditResource(sheet)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteResource(sheet.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenResource(sheet)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-[#2874f0] hover:bg-blue-100 font-semibold text-[11px] transition-all ml-1 cursor-pointer"
                          >
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
          No spreadsheets found for the selected filter.
        </div>
      )}
    </div>
  );
}
