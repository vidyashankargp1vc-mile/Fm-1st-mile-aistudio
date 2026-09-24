import { 
  Pencil, 
  ArrowRight
} from 'lucide-react';
import { ResourceItem } from '../types';
import { ResourceIcon } from './ResourceIcon';

interface ResourceCardProps {
  resource: ResourceItem;
  onOpen: (resource: ResourceItem) => void;
  onPreview: (resource: ResourceItem) => void;
  onEdit: (resource: ResourceItem) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function ResourceCard({
  resource,
  onOpen,
  onEdit
}: ResourceCardProps) {
  return (
    <div 
      onClick={() => onOpen(resource)}
      className="group relative flex flex-col justify-between p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-[#2874f0]/40 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer select-none"
    >
      <div>
        {/* Top Header: Unique Icon + Title + Edit */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ResourceIcon resource={resource} size="md" />
            <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#2874f0] transition-colors truncate">
              {resource.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(resource);
            }}
            className="p-1 rounded-md text-slate-300 hover:text-slate-700 hover:bg-slate-100 transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            title="Edit Resource"
          >
            <Pencil className="w-3 h-3" />
          </button>
        </div>

        {/* Description */}
        {resource.description && (
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 leading-snug">
            {resource.description}
          </p>
        )}
      </div>

      {/* Footer Details */}
      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span className="truncate">
          {resource.lastAccessed || 'Updated today'}
        </span>

        <span className="text-[#2874f0] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-bold shrink-0">
          <span>Open</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </span>
      </div>
    </div>
  );
}
