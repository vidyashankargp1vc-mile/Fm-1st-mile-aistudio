import React from 'react';
import {
  FileSpreadsheet,
  LayoutGrid,
  Truck,
  AlertTriangle,
  CalendarDays,
  Database,
  Clock,
  Target,
  MapPin,
  Globe,
  Compass,
  Boxes,
  PackageCheck,
  Zap,
  Warehouse,
  FolderGit2,
  Code2,
  Terminal,
  Activity,
  Layers,
  Radio,
  BarChart3,
  Link2
} from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourceIconProps {
  resource: ResourceItem;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface IconConfig {
  icon: React.ComponentType<{ className?: string }>;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export function getResourceIconConfig(resource: ResourceItem): IconConfig {
  const id = resource.id.toLowerCase();
  const title = resource.title.toLowerCase();

  // 1. Specific known resources mapping
  if (id.includes('drive-folder') || title.includes('codes folder')) {
    return {
      icon: FolderGit2,
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-600',
      borderClass: 'border-blue-200'
    };
  }

  if (id.includes('fm-2026') || title.includes('fm-2026')) {
    return {
      icon: BarChart3,
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-600',
      borderClass: 'border-emerald-200'
    };
  }

  if (id.includes('repo-do') || title.includes('repo_do') || title.includes('dispatch')) {
    return {
      icon: Truck,
      bgClass: 'bg-sky-50',
      textClass: 'text-sky-600',
      borderClass: 'border-sky-200'
    };
  }

  if (id.includes('repo-dbd') || title.includes('repo_dbd') || title.includes('breakdown')) {
    return {
      icon: AlertTriangle,
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-600',
      borderClass: 'border-amber-200'
    };
  }

  if (id.includes('holiday') || title.includes('holiday')) {
    return {
      icon: CalendarDays,
      bgClass: 'bg-indigo-50',
      textClass: 'text-indigo-600',
      borderClass: 'border-indigo-200'
    };
  }

  if (id.includes('raw-data') || title.includes('raw_data') || title.includes('database')) {
    return {
      icon: Database,
      bgClass: 'bg-violet-50',
      textClass: 'text-violet-600',
      borderClass: 'border-violet-200'
    };
  }

  if (id.includes('fm-reliability') || title.includes('reliability')) {
    return {
      icon: Clock,
      bgClass: 'bg-rose-50',
      textClass: 'text-rose-600',
      borderClass: 'border-rose-200'
    };
  }

  if (id.includes('low-drr') || title.includes('drr')) {
    return {
      icon: Target,
      bgClass: 'bg-orange-50',
      textClass: 'text-orange-600',
      borderClass: 'border-orange-200'
    };
  }

  if (id.includes('pincode') || title.includes('pincode') || title.includes('serviceability')) {
    return {
      icon: MapPin,
      bgClass: 'bg-teal-50',
      textClass: 'text-teal-600',
      borderClass: 'border-teal-200'
    };
  }

  if (id.includes('mye') || title.includes('mye')) {
    return {
      icon: Globe,
      bgClass: 'bg-cyan-50',
      textClass: 'text-cyan-600',
      borderClass: 'border-cyan-200'
    };
  }

  if (id.includes('mys') || title.includes('mys')) {
    return {
      icon: Compass,
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-600',
      borderClass: 'border-blue-200'
    };
  }

  if (id.includes('hub-cap') || title.includes('capacity') || title.includes('infra')) {
    return {
      icon: Boxes,
      bgClass: 'bg-purple-50',
      textClass: 'text-purple-600',
      borderClass: 'border-purple-200'
    };
  }

  if (id.includes('picked-count') || title.includes('picked count')) {
    return {
      icon: PackageCheck,
      bgClass: 'bg-green-50',
      textClass: 'text-green-600',
      borderClass: 'border-green-200'
    };
  }

  if (id.includes('operational-nrt') || title.includes('nrt')) {
    return {
      icon: Zap,
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-500',
      borderClass: 'border-amber-200'
    };
  }

  if (id.includes('wms') || title.includes('wms') || title.includes('hub portal')) {
    return {
      icon: Warehouse,
      bgClass: 'bg-orange-50',
      textClass: 'text-orange-600',
      borderClass: 'border-orange-200'
    };
  }

  // 2. Hash-based fallback for dynamic or other resources
  const palettes: IconConfig[] = [
    { icon: FileSpreadsheet, bgClass: 'bg-emerald-50', textClass: 'text-emerald-600', borderClass: 'border-emerald-200' },
    { icon: LayoutGrid, bgClass: 'bg-orange-50', textClass: 'text-orange-600', borderClass: 'border-orange-200' },
    { icon: Activity, bgClass: 'bg-rose-50', textClass: 'text-rose-600', borderClass: 'border-rose-200' },
    { icon: Layers, bgClass: 'bg-indigo-50', textClass: 'text-indigo-600', borderClass: 'border-indigo-200' },
    { icon: Radio, bgClass: 'bg-sky-50', textClass: 'text-sky-600', borderClass: 'border-sky-200' },
    { icon: Terminal, bgClass: 'bg-slate-100', textClass: 'text-slate-700', borderClass: 'border-slate-300' },
    { icon: Code2, bgClass: 'bg-blue-50', textClass: 'text-blue-600', borderClass: 'border-blue-200' },
    { icon: Link2, bgClass: 'bg-teal-50', textClass: 'text-teal-600', borderClass: 'border-teal-200' }
  ];

  let hash = 0;
  const str = resource.id + resource.title;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % palettes.length;
  return palettes[index];
}

export function ResourceIcon({ resource, className = '', size = 'md' }: ResourceIconProps) {
  const config = getResourceIconConfig(resource);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-7 h-7 text-sm'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <div
      className={`rounded-lg flex items-center justify-center shrink-0 border ${config.bgClass} ${config.textClass} ${config.borderClass} ${sizeClasses[size]} ${className}`}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
}
