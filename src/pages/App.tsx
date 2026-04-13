import { useState } from 'react';
import ActiveWorkspace from '../components/ActiveWorkspace'
import Workspaces from '../components/Workspaces'
import '../styles/App.css'
import type { Workspace } from '../types/types';
import Header from '../components/Header';
import { authService } from '../services/auth';

const getWorkspaces = async (): Promise<Workspace[]> => {
  const token = authService.getToken();
  const response = await fetch("https://notenest-22y7.onrender.com/api/Board/", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  return await response.json();
}; 

function App() {
  const [activeWork, setActiveWork] = useState<Workspace | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleWorkspaceDelete = (id: number) => {
    if (activeWork?.id === id) {
      setActiveWork(null);
    }
  };
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleWorkspaceSelect = (workspace: Workspace) => {
    setActiveWork(workspace);
    setIsSidebarOpen(false);
  };

  return (
    <div className='app'>
      <div className="header">
        <Header></Header>
      </div>
      <div className="main-layout">
        <div className="scroll">
          <div className="bg-pattern"></div>
        </div>
        <button className="mobile-menu-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? '✕' : '☰'}
        </button>

        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <Workspaces onSelect={handleWorkspaceSelect} onDelete={handleWorkspaceDelete} />
          <div className="creds">
            <p>Made by <a href="https://github.com/LogiTECH0">delured</a></p>
          </div>
        </aside>

        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        <main className="content">
          {activeWork ? (
            <ActiveWorkspace
              workspace={activeWork}
              onRefresh={getWorkspaces}
            />
          ) : (
            <div className="empty-state">Оберіть воркспейс зліва</div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App