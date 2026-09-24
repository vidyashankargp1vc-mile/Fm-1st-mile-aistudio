import { 
  LayoutGrid, 
  Radio, 
  Eye, 
  ExternalLink
} from 'lucide-react';
import { ResourceItem } from '../types';
import { ResourceCard } from '../components/ResourceCard';

interface DashboardsViewProps {
  resources: ResourceItem[];
  searchQuery: string;
  onOpenResource: (resource: ResourceItem) => void;
  onPreviewResource: (resource: ResourceItem) => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenAddModal?: (type?: ResourceItem['type']) => void;
}

export function DashboardsView({
  resources,
  searchQuery,
  onOpenResource,
  onPreviewResource,
  onEditResource,
  onDeleteResource,
  onTogglePin
}: DashboardsViewProps) {
  const dashboards = resources.filter(r => {
    if (r.type !== 'dashboard') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchUrl = r.url.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchUrl;
    }
    return true;
  });

  return (
    <div className="space-y-2.5 animate-fadeIn pb-2 max-w-7xl mx-auto select-none">
      {/* Overview Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-1.5 px-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center shrink-0">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-900">First Mile Live Dashboards</h2>
              <span className="text-[11px] font-semibold text-orange-600">
                ({dashboards.length} Active Feeds)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Primary Monitor (Compact Strip) */}
      {dashboards.length > 0 && (
        <div className="py-2 px-3 rounded-xl bg-gradient-to-r from-blue-50/80 via-white to-orange-50/50 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-orange-100/80 text-orange-600 flex items-center justify-center shrink-0">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="truncate flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-orange-600 shrink-0">
                Primary Monitor:
              </span>
              <h3 className="text-xs font-bold text-slate-900 truncate">
                {dashboards[0].title}
              </h3>
              <span className="text-[10px] text-emerald-600 font-semibold items-center gap-1 hidden md:flex shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Ingest
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <button
              onClick={() => onPreviewResource(dashboards[0])}
              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Eye className="w-3 h-3 inline mr-1 text-slate-400" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => onOpenResource(dashboards[0])}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#2874f0] hover:bg-blue-700 text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer"
            >
              <span>Launch</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      )}

      {/* Grid of Dashboards */}
      {dashboards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {dashboards.map(dash => (
            <ResourceCard
              key={dash.id}
              resource={dash}
              onOpen={onOpenResource}
              onPreview={onPreviewResource}
              onEdit={onEditResource}
              onDelete={onDeleteResource}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
          No dashboards found matching your search.
        </div>
      )}
    </div>
  );
}
