import { useState } from 'react';
import ActiveWorkspace from '../components/ActiveWorkspace'
import Workspaces from '../components/Workspaces'
import '../styles/App.css'
import type { Workspace } from '../types/types';

const getWorkspaces = async (): Promise<Workspace[]> => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzIiwidW5pcXVlX25hbWUiOiJkZWx1cmVkMWFkbWluIiwibmJmIjoxNzc1OTgwNjY1LCJleHAiOjE3NzcyNzY2NjUsImlhdCI6MTc3NTk4MDY2NX0.hpIM0kEQSRVekkH_IuXkPC-v03Z6l02EMG1_E0jGKzg";
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleWorkspaceSelect = (workspace: Workspace) => {
    setActiveWork(workspace);
    setIsSidebarOpen(false); 
  };

  return (
    <div className="main-layout">
      <button className="mobile-menu-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <Workspaces onSelect={handleWorkspaceSelect} />
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
  )
}

export default App