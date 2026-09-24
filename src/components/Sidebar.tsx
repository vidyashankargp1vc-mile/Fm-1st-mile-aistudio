import { 
  Folder, 
  FileSpreadsheet, 
  LayoutGrid, 
  Code2, 
  Link2, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { ResourceItem } from '../types';
import { FlipkartLogo } from './FlipkartLogo';

export type PageView = 'workspace' | 'spreadsheets' | 'dashboards' | 'codes' | 'links';

interface SidebarProps {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  resources: ResourceItem[];
  onOpenAddModal: (defaultType?: ResourceItem['type']) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({
  activePage,
  setActivePage,
  resources,
  isCollapsed,
  setIsCollapsed
}: SidebarProps) {
  const sheetCount = resources.filter(r => r.type === 'spreadsheet').length;
  const dashCount = resources.filter(r => r.type === 'dashboard').length;
  const codeCount = resources.filter(r => r.type === 'code').length;
  const linkCount = resources.filter(r => r.type === 'link').length;

  const navItems = [
    {
      id: 'links' as PageView,
      label: 'Link center',
      icon: Link2,
      count: linkCount
    },
    {
      id: 'workspace' as PageView,
      label: 'Team workspace',
      icon: Folder,
      count: resources.length
    },
    {
      id: 'spreadsheets' as PageView,
      label: 'Spreadsheets',
      icon: FileSpreadsheet,
      count: sheetCount
    },
    {
      id: 'dashboards' as PageView,
      label: 'Dashboards',
      icon: LayoutGrid,
      count: dashCount
    },
    {
      id: 'codes' as PageView,
      label: 'Codes',
      icon: Code2,
      count: codeCount
    }
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200/80 bg-white transition-all duration-300 z-30 shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding: Official Flipkart Logo with hover effect */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <FlipkartLogo isCollapsed={isCollapsed} onClick={() => setActivePage('workspace')} />

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace Indicator Card */}
      {!isCollapsed && (
        <div className="px-4 pt-4">
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 flex items-center gap-2.5 transition-all duration-200 hover:shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0 animate-pulse" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-[11px] text-slate-500 font-medium">Workspace</span>
              <span className="text-xs font-bold text-slate-900 truncate">Operations HQ</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Group */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            WORKSPACE
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-[#2874f0] font-bold shadow-xs border border-blue-100'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:shadow-xs'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#2874f0]' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span>{item.label}</span>
                  {item.id !== 'workspace' && (
                    <span className="text-[11px] text-slate-400 font-normal">
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-2 py-1 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-slate-600">
                Operations HQ Live
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">v2.4</span>
          </div>
        ) : (
          <div className="flex justify-center p-1" title="Operations HQ Live">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  );
}
