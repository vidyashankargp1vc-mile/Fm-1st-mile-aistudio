import { useState } from 'react';
import { 
  Mail, 
  Copy, 
  Check, 
  FileSpreadsheet,
  LayoutGrid,
  Code2,
  Link2,
  Info
} from 'lucide-react';
import { ResourceItem } from '../types';
import { PageView } from '../components/Sidebar';
import { useToast } from '../components/Toast';

interface LinkCenterViewProps {
  resources: ResourceItem[];
  searchQuery: string;
  onOpenResource: (resource: ResourceItem) => void;
  onPreviewResource: (resource: ResourceItem) => void;
  onEditResource: (resource: ResourceItem) => void;
  onDeleteResource: (id: string) => void;
  onTogglePin: (id: string) => void;
  onOpenAddModal: (type?: ResourceItem['type']) => void;
  onSaveResource?: (resource: any) => void;
  onNavigateTo?: (page: PageView) => void;
}

export function LinkCenterView({}: LinkCenterViewProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const contactEmail = 'vidyashankargp1.vc@flipkart.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    showToast('Copied email: ' + contactEmail, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 animate-fadeIn pb-3 max-w-3xl mx-auto select-none">
      {/* Header Banner */}
      <div className="py-2 px-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-50 text-[#2874f0] border border-blue-100 flex items-center justify-center shrink-0">
            <Link2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900">
              Link Center & Resource Additions
            </h1>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Central point of contact for onboarding operational tools & links
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2874f0] border border-blue-200">
          Admin Managed
        </span>
      </div>

      {/* Main Reach Out Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-white via-blue-50/20 to-slate-50 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200/70">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2874f0] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2874f0]">
                Resource Additions & Updates
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                Reach out to Vidyashankar GP
              </h2>
              <p className="text-xs text-slate-600 font-mono mt-0.5 select-text font-semibold">
                {contactEmail}
              </p>
            </div>
          </div>

          {/* Action Button: Copy Email */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Email Address' : 'Copy Email Address'}</span>
            </button>
          </div>
        </div>

        {/* Instructions / Guidance */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Info className="w-3.5 h-3.5 text-[#2874f0]" />
            <span>Please include the following details in your email to Vidyashankar:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-800 block text-[11px]">1. Resource Name & URL</span>
                <span className="text-[10.5px] text-slate-500 truncate block">Official title and link (Sheets, Looker, Script)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <LayoutGrid className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-800 block text-[11px]">2. Resource Type</span>
                <span className="text-[10.5px] text-slate-500 truncate block">Spreadsheet, Dashboard, or Code / Runbook</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Code2 className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-800 block text-[11px]">3. Usage Frequency</span>
                <span className="text-[10.5px] text-slate-500 truncate block">Often used (daily cutoff) or Rarely used</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Link2 className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-800 block text-[11px]">4. Team Context</span>
                <span className="text-[10.5px] text-slate-500 truncate block">Brief description for Flipkart First Mile team</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notice banner */}
        <div className="py-2 px-3 rounded-xl bg-slate-100/90 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
          <span>
            Requests are verified and updated on the shared workspace within business hours.
          </span>
          <span className="font-semibold text-slate-700 shrink-0">
            Flipkart Operations HQ
          </span>
        </div>
      </div>
    </div>
  );
}
