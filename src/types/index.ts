export type ResourceType = 'spreadsheet' | 'dashboard' | 'code' | 'link' | 'workspace';

export type DepartmentCategory = 
  | 'Operations HQ'
  | 'First Mile'
  | 'Supply Chain'
  | 'Logistics'
  | 'Engineering'
  | 'Analytics'
  | 'General';

export type UsageFrequency = 'often' | 'rare';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type StatusType = 'active' | 'in-review' | 'maintenance' | 'archived';

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category?: DepartmentCategory | string;
  url: string;
  owner: string;
  frequency: UsageFrequency;
  priority: PriorityLevel;
  status: StatusType;
  tags?: string[];
  isPinned?: boolean;
  codeSnippet?: string;
  language?: 'sql' | 'python' | 'bash' | 'json' | 'yaml' | 'javascript';
  embedUrl?: string;
  clickCount?: number;
  lastAccessed?: string;
  updatedAt: string;
  createdAt: string;
  notes?: string;
}

export interface TeamAnnouncement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  priority: 'critical' | 'high' | 'normal';
  timestamp: string;
  category: string;
}

export interface ShiftRoster {
  id: string;
  shiftName: string;
  leadName: string;
  role: string;
  hours: string;
  status: 'on-duty' | 'upcoming' | 'handover';
  contact: string;
  activeIncidentsCount: number;
}

export interface FlipkartUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isFlipkartEmployee: boolean;
  department?: string;
}

export interface ActivityEvent {

  id: string;
  action: 'created' | 'updated' | 'deleted' | 'opened' | 'pinned';
  resourceTitle: string;
  resourceType: ResourceType;
  user: string;
  timestamp: string;
}

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  enabled: boolean;
}
