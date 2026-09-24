import { 
  Menu, 
  LogOut
} from 'lucide-react';
import { PageView } from './Sidebar';
import { FlipkartUser } from '../types';
import { FlipkartLogo } from './FlipkartLogo';

interface HeaderProps {
  activePage: PageView;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onOpenAddModal?: () => void;
  user: FlipkartUser | null;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
  onNavigateTo?: (page: PageView) => void;
}

export function Header({
  activePage,
  user,
  onLogout,
  onToggleMobileSidebar,
  onNavigateTo
}: HeaderProps) {
  const getPageTitle = () => {
    switch (activePage) {
      case 'workspace':
        return 'Team Workspace';
      case 'spreadsheets':
        return 'Spreadsheets Center';
      case 'dashboards':
        return 'Dashboards Center';
      case 'codes':
        return 'Codes & Runbooks';
      case 'links':
        return 'Link Center';
      default:
        return 'Operations Shelf';
    }
  };

  return (
    <header className="h-12 sm:h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo: Clicking goes to Team Workspace */}
        <div className="md:hidden flex items-center">
          <FlipkartLogo isCollapsed={true} onClick={() => onNavigateTo?.('workspace')} />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
          <button
            onClick={() => onNavigateTo?.('workspace')}
            className="font-bold text-slate-600 hover:text-[#2874f0] transition-colors cursor-pointer hidden sm:inline"
            title="Go to Team Workspace"
          >
            Flipkart First Mile
          </button>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="font-bold text-slate-900 text-xs sm:text-sm">{getPageTitle()}</span>
        </div>
      </div>

      {/* Right: User profile & Sign Out */}
      <div className="flex items-center gap-2 sm:gap-3">
        {user ? (
          <div className="flex items-center gap-1.5 sm:gap-2.5 pl-1.5 sm:pl-2">
            <div 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-tr from-[#2874f0] to-[#1d63d8] text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0"
              title={`${user.displayName} (${user.email})`}
            >
              {user.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                  {user.displayName}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold" title="Verified Flipkart Employee">
                  ✓
                </span>
              </div>
              <span className="text-[10px] text-slate-400 truncate max-w-[140px] font-mono">
                {user.email}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
              title="Sign Out / Switch Flipkart Account"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
