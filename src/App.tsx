import { useState, useEffect, useCallback } from 'react';
import { ToastProvider, useToast } from './components/Toast';
import { Sidebar, PageView } from './components/Sidebar';
import { Header } from './components/Header';
import { AddEditResourceModal } from './components/AddEditResourceModal';
import { PreviewModal } from './components/PreviewModal';
import { FlipkartAuthGate } from './components/FlipkartAuthGate';
import { TeamWorkspaceView } from './views/TeamWorkspaceView';
import { SpreadsheetsView } from './views/SpreadsheetsView';
import { DashboardsView } from './views/DashboardsView';
import { CodesView } from './views/CodesView';
import { LinkCenterView } from './views/LinkCenterView';
import { 
  ResourceItem, 
  FlipkartUser
} from './types';
import { 
  loadResources, 
  saveResource, 
  deleteResource, 
  togglePinResource, 
  incrementClickCount
} from './services/storageService';

const USER_STORAGE_KEY = 'flipkart_fm_user_session';

function AppContent() {
  const { showToast } = useToast();
  const [activePage, setActivePage] = useState<PageView>('workspace');
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Authentication State: Enforce @flipkart.com
  const [currentUser, setCurrentUser] = useState<FlipkartUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FlipkartUser;
        if (parsed?.email?.endsWith('@flipkart.com')) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return null;
  });

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [defaultAddType, setDefaultAddType] = useState<ResourceItem['type']>('spreadsheet');
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [previewResource, setPreviewResource] = useState<ResourceItem | null>(null);

  // Initial Load of Resources
  useEffect(() => {
    const initData = async () => {
      const items = await loadResources();
      setResources(items);
    };
    initData();
  }, []);

  // Handle Login
  const handleLogin = (user: FlipkartUser) => {
    setCurrentUser(user);
    setActivePage('workspace');
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
    showToast(`Welcome ${user.displayName} to Flipkart First Mile Operations!`, 'success');
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('Signed out of Flipkart account', 'info');
  };

  // Open external resource
  const handleOpenResource = useCallback((resource: ResourceItem) => {
    incrementClickCount(resource.id);
    setResources(prev => prev.map(r => r.id === resource.id ? { ...r, clickCount: (r.clickCount || 0) + 1, lastAccessed: 'Updated today' } : r));
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  }, []);

  // Preview resource
  const handlePreviewResource = useCallback((resource: ResourceItem) => {
    setPreviewResource(resource);
  }, []);

  // Edit resource
  const handleEditResource = useCallback((resource: ResourceItem) => {
    setEditingResource(resource);
    setAddModalOpen(true);
  }, []);

  // Delete resource
  const handleDeleteResource = useCallback(async (id: string) => {
    const updated = await deleteResource(id);
    setResources(updated);
    showToast('Resource removed successfully', 'info');
  }, [showToast]);

  // Toggle Pin
  const handleTogglePin = useCallback(async (id: string) => {
    const updated = await togglePinResource(id);
    setResources(updated);
    const item = updated.find(r => r.id === id);
    if (item?.isPinned) {
      showToast(`Pinned "${item.title}" to top of shelf`, 'success');
    } else {
      showToast('Unpinned from shelf', 'info');
    }
  }, [showToast]);

  // Save / Add Resource
  const handleSaveResource = useCallback(async (resource: ResourceItem) => {
    const updated = await saveResource(resource);
    setResources(updated);
    showToast(`Saved "${resource.title}" successfully`, 'success');
    setAddModalOpen(false);
    setEditingResource(null);
  }, [showToast]);

  const handleOpenAddModal = (type: ResourceItem['type'] = 'spreadsheet') => {
    setDefaultAddType(type);
    setEditingResource(null);
    setAddModalOpen(true);
  };

  // If user is not authenticated with @flipkart.com account, show the Google sign-in gate
  if (!currentUser) {
    return <FlipkartAuthGate user={currentUser} onLogin={handleLogin} onLogout={handleLogout} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900 font-sans antialiased">
      {/* Desktop Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        resources={resources}
        onOpenAddModal={handleOpenAddModal}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-white flex flex-col shadow-2xl">
            <Sidebar
              activePage={activePage}
              setActivePage={(page) => {
                setActivePage(page);
                setMobileSidebarOpen(false);
              }}
              resources={resources}
              onOpenAddModal={() => {
                handleOpenAddModal();
                setMobileSidebarOpen(false);
              }}
              isCollapsed={false}
              setIsCollapsed={() => {}}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          activePage={activePage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddModal={() => handleOpenAddModal()}
          user={currentUser}
          onLogout={handleLogout}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onNavigateTo={setActivePage}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-2.5 sm:p-3.5 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">
            {activePage === 'workspace' && (
              <TeamWorkspaceView
                resources={resources}
                onOpenResource={handleOpenResource}
                onPreviewResource={handlePreviewResource}
                onEditResource={handleEditResource}
                onDeleteResource={handleDeleteResource}
                onTogglePin={handleTogglePin}
                onOpenAddModal={() => handleOpenAddModal()}
                onNavigateTo={setActivePage}
              />
            )}

            {activePage === 'spreadsheets' && (
              <SpreadsheetsView
                resources={resources}
                searchQuery={searchQuery}
                onOpenResource={handleOpenResource}
                onPreviewResource={handlePreviewResource}
                onEditResource={handleEditResource}
                onDeleteResource={handleDeleteResource}
                onTogglePin={handleTogglePin}
                onOpenAddModal={handleOpenAddModal}
              />
            )}

            {activePage === 'dashboards' && (
              <DashboardsView
                resources={resources}
                searchQuery={searchQuery}
                onOpenResource={handleOpenResource}
                onPreviewResource={handlePreviewResource}
                onEditResource={handleEditResource}
                onDeleteResource={handleDeleteResource}
                onTogglePin={handleTogglePin}
                onOpenAddModal={handleOpenAddModal}
              />
            )}

            {activePage === 'codes' && (
              <CodesView
                resources={resources}
                searchQuery={searchQuery}
                onOpenResource={handleOpenResource}
                onPreviewResource={handlePreviewResource}
                onEditResource={handleEditResource}
                onDeleteResource={handleDeleteResource}
                onTogglePin={handleTogglePin}
                onOpenAddModal={handleOpenAddModal}
              />
            )}

            {activePage === 'links' && (
              <LinkCenterView
                resources={resources}
                searchQuery={searchQuery}
                onOpenResource={handleOpenResource}
                onPreviewResource={handlePreviewResource}
                onEditResource={handleEditResource}
                onDeleteResource={handleDeleteResource}
                onTogglePin={handleTogglePin}
                onOpenAddModal={handleOpenAddModal}
                onSaveResource={handleSaveResource}
                onNavigateTo={setActivePage}
              />
            )}
          </div>
        </main>
      </div>

      {/* Add / Edit Resource Modal */}
      <AddEditResourceModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingResource(null);
        }}
        onSave={handleSaveResource}
        editingResource={editingResource}
        defaultType={defaultAddType}
      />

      {/* Preview Modal */}
      <PreviewModal
        resource={previewResource}
        onClose={() => setPreviewResource(null)}
        onOpenExternal={handleOpenResource}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
