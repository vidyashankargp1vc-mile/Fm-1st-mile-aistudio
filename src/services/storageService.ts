import { ResourceItem, FirebaseCustomConfig, ActivityEvent } from '../types';
import { INITIAL_RESOURCES } from '../data/initialData';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  doc, 
  Firestore,
  onSnapshot
} from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'flipkart_fm_ops_resources_v3';
const LOCAL_CONFIG_KEY = 'flipkart_fm_firebase_config_v3';
const LOCAL_ACTIVITY_KEY = 'flipkart_fm_activity_v3';

let firestoreInstance: Firestore | null = null;
let firebaseAppInstance: FirebaseApp | null = null;

export const DEFAULT_FIREBASE_CONFIG: FirebaseCustomConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  enabled: false,
};

// --- Firebase Initialization ---
export function initFirebaseService(config: FirebaseCustomConfig): { success: boolean; message: string } {
  try {
    if (!config.apiKey || !config.projectId) {
      firestoreInstance = null;
      return { success: false, message: 'API Key and Project ID are required.' };
    }

    if (getApps().length > 0) {
      firebaseAppInstance = getApp();
    } else {
      firebaseAppInstance = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain || `${config.projectId}.firebaseapp.com`,
        projectId: config.projectId,
        storageBucket: config.storageBucket || `${config.projectId}.appspot.com`,
        messagingSenderId: config.messagingSenderId || '100000000000',
        appId: config.appId || '1:100000000000:web:opsnexus',
      });
    }

    firestoreInstance = getFirestore(firebaseAppInstance);
    return { success: true, message: `Connected to Firebase project: ${config.projectId}` };
  } catch (err: unknown) {
    const error = err as Error;
    firestoreInstance = null;
    return { success: false, message: error.message || 'Firebase initialization failed' };
  }
}

// Test live connection to Firestore
export async function testFirestoreConnection(config: FirebaseCustomConfig): Promise<{ success: boolean; latencyMs?: number; message: string }> {
  const startTime = Date.now();
  try {
    const initRes = initFirebaseService(config);
    if (!initRes.success || !firestoreInstance) {
      return { success: false, message: initRes.message };
    }

    // Try a test write and read in a health-check document
    const testDocRef = doc(firestoreInstance, 'ops_system_meta', 'health_check');
    await setDoc(testDocRef, { 
      ping: 'pong', 
      testedAt: new Date().toISOString(),
      client: 'Nexus Operations Portal'
    });

    const elapsed = Date.now() - startTime;
    return {
      success: true,
      latencyMs: elapsed,
      message: `Successfully connected to Firestore in ${elapsed}ms. Cloud sync is active.`
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      message: `Connection failed: ${error.message || 'Firestore access denied or network error'}`
    };
  }
}

// --- Configuration Management ---
export function loadSavedFirebaseConfig(): FirebaseCustomConfig {
  try {
    const raw = localStorage.getItem(LOCAL_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.enabled && parsed.projectId) {
        initFirebaseService(parsed);
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_FIREBASE_CONFIG;
}

export function saveFirebaseConfig(config: FirebaseCustomConfig): void {
  localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(config));
  if (config.enabled && config.projectId) {
    initFirebaseService(config);
  } else {
    firestoreInstance = null;
  }
}

// --- Activity Logging ---
export function getSavedActivity(): ActivityEvent[] {
  try {
    const raw = localStorage.getItem(LOCAL_ACTIVITY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [
    {
      id: 'act-1',
      action: 'opened',
      resourceTitle: 'Daily Fulfillment & Order Dispatch Tracker',
      resourceType: 'spreadsheet',
      user: 'Vidyashankar GP',
      timestamp: '10 mins ago'
    },
    {
      id: 'act-2',
      action: 'updated',
      resourceTitle: 'Real-Time Order Ingestion & Routing Stream',
      resourceType: 'dashboard',
      user: 'Operations Lead',
      timestamp: '25 mins ago'
    },
    {
      id: 'act-3',
      action: 'created',
      resourceTitle: 'Warehouse SKU Velocity & Aging Inventory Audit',
      resourceType: 'spreadsheet',
      user: 'Inventory Control',
      timestamp: '2 hours ago'
    }
  ];
}

export function logActivity(action: ActivityEvent['action'], resourceTitle: string, resourceType: ResourceItem['type'], user: string = 'Current User'): void {
  const events = getSavedActivity();
  const newEvent: ActivityEvent = {
    id: 'act-' + Date.now(),
    action,
    resourceTitle,
    resourceType,
    user,
    timestamp: 'Just now'
  };
  const updated = [newEvent, ...events.slice(0, 19)];
  localStorage.setItem(LOCAL_ACTIVITY_KEY, JSON.stringify(updated));
}

// --- Resources Persistence (Dual Mode: Firestore + LocalStorage) ---
export async function loadResources(): Promise<ResourceItem[]> {
  // If Firestore is active, try to fetch from Firestore
  if (firestoreInstance) {
    try {
      const colRef = collection(firestoreInstance, 'ops_resources');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const items: ResourceItem[] = [];
        snap.forEach(docSnap => {
          items.push({ id: docSnap.id, ...(docSnap.data() as Omit<ResourceItem, 'id'>) });
        });
        // Cache to local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
        return items;
      } else {
        // If Firestore collection is empty, seed it with INITIAL_RESOURCES
        const items = getInitialOrLocalResources();
        await syncAllToFirestore(items);
        return items;
      }
    } catch (err) {
      console.warn('Firestore load failed, falling back to localStorage:', err);
    }
  }

  return getInitialOrLocalResources();
}

function getInitialOrLocalResources(): ResourceItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      let parsed = JSON.parse(raw) as ResourceItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out pincode auto cluster & route dispatch
        parsed = parsed.filter(r => !r.id.includes('pincode-auto') && !r.title.toLowerCase().includes('pincode auto-cluster'));

        // Strip existing categories and tags across all resources
        parsed = parsed.map(r => ({
          ...r,
          tags: [],
          category: undefined
        }));

        // Ensure CODES Folder is renamed and placed at index 0 as requested
        const driveItemIndex = parsed.findIndex(r => r.id === 'link-drive-folder' || r.url.includes('1LYTD8FkEtW2oZnjgrIYd1FUp7WjWrVqx'));
        if (driveItemIndex >= 0) {
          const driveItem: ResourceItem = {
            ...parsed[driveItemIndex],
            title: 'CODES Folder',
            description: 'Google Drive codes folder containing First Mile operational scripts, BigQuery automations, and runbooks',
            type: 'code'
          };
          parsed.splice(driveItemIndex, 1);
          parsed.unshift(driveItem);
        } else {
          parsed.unshift(INITIAL_RESOURCES[0]);
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  // Seed default
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_RESOURCES));
  return INITIAL_RESOURCES;
}

export async function saveResource(resource: ResourceItem): Promise<ResourceItem[]> {
  const current = getInitialOrLocalResources();
  const index = current.findIndex(r => r.id === resource.id);
  let updatedList: ResourceItem[];

  if (index >= 0) {
    updatedList = current.map(item => item.id === resource.id ? { ...resource, updatedAt: new Date().toISOString() } : item);
    logActivity('updated', resource.title, resource.type);
  } else {
    const newResource = {
      ...resource,
      id: resource.id || 'res-' + Date.now(),
      createdAt: resource.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clickCount: resource.clickCount || 0
    };
    updatedList = [newResource, ...current];
    logActivity('created', newResource.title, newResource.type);
  }

  // Save to localStorage immediately
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

  // Sync to Firestore in background if available
  if (firestoreInstance) {
    try {
      const docRef = doc(firestoreInstance, 'ops_resources', resource.id);
      await setDoc(docRef, resource, { merge: true });
    } catch (err) {
      console.warn('Could not sync doc to Firestore:', err);
    }
  }

  return updatedList;
}

export async function deleteResource(id: string): Promise<ResourceItem[]> {
  const current = getInitialOrLocalResources();
  const target = current.find(r => r.id === id);
  const updatedList = current.filter(r => r.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

  if (target) {
    logActivity('deleted', target.title, target.type);
  }

  if (firestoreInstance) {
    try {
      const docRef = doc(firestoreInstance, 'ops_resources', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Could not delete doc from Firestore:', err);
    }
  }

  return updatedList;
}

export async function togglePinResource(id: string): Promise<ResourceItem[]> {
  const current = getInitialOrLocalResources();
  const updatedList = current.map(item => {
    if (item.id === id) {
      const nextPinned = !item.isPinned;
      return { ...item, isPinned: nextPinned };
    }
    return item;
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

  const changed = updatedList.find(r => r.id === id);
  if (changed && firestoreInstance) {
    try {
      const docRef = doc(firestoreInstance, 'ops_resources', id);
      await setDoc(docRef, { isPinned: changed.isPinned }, { merge: true });
    } catch (err) {
      console.warn('Could not update pin in Firestore:', err);
    }
  }

  return updatedList;
}

export async function incrementClickCount(id: string): Promise<void> {
  const current = getInitialOrLocalResources();
  const item = current.find(r => r.id === id);
  if (!item) return;

  item.clickCount = (item.clickCount || 0) + 1;
  item.lastAccessed = 'Just now';
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(current));

  logActivity('opened', item.title, item.type);

  if (firestoreInstance) {
    try {
      const docRef = doc(firestoreInstance, 'ops_resources', id);
      await setDoc(docRef, { clickCount: item.clickCount, lastAccessed: item.lastAccessed }, { merge: true });
    } catch (err) {
      // non-blocking
    }
  }
}

export async function resetToDefaultData(): Promise<ResourceItem[]> {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_RESOURCES));
  if (firestoreInstance) {
    await syncAllToFirestore(INITIAL_RESOURCES);
  }
  return INITIAL_RESOURCES;
}

export async function syncAllToFirestore(items: ResourceItem[]): Promise<void> {
  if (!firestoreInstance) return;
  for (const item of items) {
    const docRef = doc(firestoreInstance, 'ops_resources', item.id);
    await setDoc(docRef, item, { merge: true });
  }
}

export function subscribeToFirestore(callback: (items: ResourceItem[]) => void): (() => void) | null {
  if (!firestoreInstance) return null;
  try {
    const colRef = collection(firestoreInstance, 'ops_resources');
    const unsubscribe = onSnapshot(colRef, (snap) => {
      const items: ResourceItem[] = [];
      snap.forEach(docSnap => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<ResourceItem, 'id'>) });
      });
      if (items.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
        callback(items);
      }
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Realtime subscription failed:', err);
    return null;
  }
}

export function exportBackupJSON(items: ResourceItem[]): string {
  return JSON.stringify({
    appName: 'Nexus Operations Workspace',
    exportedAt: new Date().toISOString(),
    version: '2.0',
    resourceCount: items.length,
    resources: items
  }, null, 2);
}

export function importBackupJSON(jsonString: string): ResourceItem[] {
  const parsed = JSON.parse(jsonString);
  const items = Array.isArray(parsed) ? parsed : parsed.resources;
  if (!Array.isArray(items)) {
    throw new Error('Invalid JSON backup format. Must contain a resources array.');
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  if (firestoreInstance) {
    syncAllToFirestore(items).catch(console.error);
  }
  return items;
}
