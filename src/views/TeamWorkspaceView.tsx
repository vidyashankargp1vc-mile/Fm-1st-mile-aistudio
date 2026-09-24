import { 
  FileSpreadsheet, 
  LayoutGrid, 
  ArrowRight,
  ExternalLink,
  MapPin,
  Layers
} from 'lucide-react';
import { ResourceItem } from '../types';
import { PageView } from '../components/Sidebar';

interface TeamWorkspaceViewProps {
  resources: ResourceItem[];
  onOpenResource: (resource: ResourceItem) => void;
  onPreviewResource: (resource: ResourceItem) => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenAddModal: () => void;
  onNavigateTo: (page: PageView) => void;
}

export function TeamWorkspaceView({
  resources,
  onNavigateTo
}: TeamWorkspaceViewProps) {
  const sheetCount = resources.filter(r => r.type === 'spreadsheet').length;
  const dashCount = resources.filter(r => r.type === 'dashboard').length;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn pb-3 max-w-4xl mx-auto select-none pt-1 sm:pt-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
            <h1 className="font-serif-title text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Team Workspace
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Flipkart First Mile Operations Central Shelf
          </p>
        </div>

        {/* Find Nearest Hub Button */}
        <a
          href="https://script.google.com/a/macros/flipkart.com/s/AKfycbzzn2Cgz9wP7yeIlVeAY3N6ag-m6NKeMpl2vQQb-XnX9v5mq9fGA4Yw2aPlNyNJVbQP/exec"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-2xs transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer self-start sm:self-auto"
          title="Open Nearest Hub Locator"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Find Nearest Hub</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-80" />
        </a>
      </div>

      {/* Exactly 2 Buttons: Spreadsheets or Dashboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
        {/* BUTTON 1: Spreadsheets */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTo('spreadsheets')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigateTo('spreadsheets');
          }}
          className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-emerald-500/80 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {sheetCount} Sheets
              </span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Spreadsheets
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Access master FM-2026 reports, REPO dispatch logs, daily breakdown trackers, and data sheets.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
            <span>Open Spreadsheets Center</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* BUTTON 2: Dashboards */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTo('dashboards')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigateTo('dashboards');
          }}
          className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-orange-500/80 shadow-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                {dashCount} Feeds
              </span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                Dashboards
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Access live Looker Studio monitors, reliability feeds, hub capacity, picked count, and near real-time operational views.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:text-orange-700">
            <span>Open Dashboards Center</span>
            <div className="w-7 h-7 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Info Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 text-xs text-slate-500">
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2874f0] flex items-center justify-center shrink-0">
          <Layers className="w-3.5 h-3.5" />
        </div>
        <div className="leading-snug">
          Choose <strong>Spreadsheets</strong> or <strong>Dashboards</strong> above to open the respective shelf. To add new resources, visit the <strong>Link Center</strong>.
        </div>
      </div>
    </div>
  );
}
