import { useEffect, useState } from "react";
import type { Workspace, Column } from "../types/types";

interface Props {
  onSelect?: (workspace: Workspace) => void;
}

export default function Workspaces({ onSelect }: Props) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newWorkName, setNewWorkName] = useState("");
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [isModalOpened, setModalOpened] = useState(false);
    const [renameId, setRenameId] = useState<number | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzIiwidW5pcXVlX25hbWUiOiJkZWx1cmVkMWFkbWluIiwibmJmIjoxNzc1OTgwNjY1LCJleHAiOjE3NzcyNzY2NjUsImlhdCI6MTc3NTk4MDY2NX0.hpIM0kEQSRVekkH_IuXkPC-v03Z6l02EMG1_E0jGKzg"
    const getWorkspaces = async () => {
        const response = await fetch("https://notenest-22y7.onrender.com/api/Board/", {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        const data = await response.json();
        const workspacesWithData = await Promise.all(data.map(async (ws: Workspace) => {
            const columnsRes = await fetch(`https://notenest-22y7.onrender.com/api/Column/boards/${ws.id}/columns`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const columns = await columnsRes.json();
            ws.columns = columns;
            ws.columns = await Promise.all(columns.map(async (col: Column) => {
                const notesRes = await fetch(`https://notenest-22y7.onrender.com/api/Note/boards/${ws.id}/columns/${col.id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                col.notes = await notesRes.json();
                return col;
            }));
            return ws;
        }));
        setWorkspaces(workspacesWithData);
        return workspacesWithData;
    };
    const postWorkspace = async (name: string) => {
        if (name === null) return;
        const response = await fetch("https://notenest-22y7.onrender.com/api/Board/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: `${name}`
            }),
        })
        const data = await response.json();
        return data;
    }
    const putWorkspace = async (id: number, newName: string) => {
        const response = await fetch(`https://notenest-22y7.onrender.com/api/Board/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: `${newName}`
            }),
        })
        const data = await response.json();
        return data;
    }
    const deleteWorkspace = async (id: number) => {
        const response = await fetch(`https://notenest-22y7.onrender.com/api/Board/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        })
        return response.ok;
    }
    const handleRename = async () => {
        if (renameId === null) return;

        await putWorkspace(renameId, renameValue);
        await getWorkspaces();

        setRenameId(null);
        setRenameValue("");
    };
    const handleDeleteWork = async (id: number) => {
        await deleteWorkspace(id);
        await getWorkspaces();
    }
    const handleCreateWork = async () => {
        await postWorkspace(newWorkName);
        await getWorkspaces();
        setNewWorkName("");
        setIsCreateOpen(false);
    };
    useEffect(() => {
        const load = async () => {
            await getWorkspaces();
        };

        load();
    }, [])
    return (
        <div className="workspaces">
            <div className="create-work">
                <button onClick={() => setIsCreateOpen(true)}>Create Workspace</button>
            </div>
            <div className="list-workspace">
                {workspaces.map((workspace: Workspace) => (
                    <div key={workspace.id} className="workspace-item">
                        <p onClick={() => onSelect?.(workspace)}>{workspace.name}</p>

                        <button onClick={() => {
                            setOpenMenuId(workspace.id ? workspace.id : 0)
                            setModalOpened(prev => !prev)
                            }}>
                            ⋯
                        </button>

                        {openMenuId === workspace.id && isModalOpened ? (
                            <div className="menu">
                                <button onClick={() => {
                                    setRenameId(workspace.id);
                                    setRenameValue(workspace.name);
                                    setOpenMenuId(null);
                                }}>
                                    Rename Workspace
                                </button>

                                <button onClick={() => handleDeleteWork(workspace.id)}>
                                    Delete Workspace
                                </button>
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
            {renameId !== null && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Rename Workspace</h3>

                        <input
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                        />

                        <button onClick={handleRename}>
                            Save
                        </button>

                        <button onClick={() => setRenameId(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {isCreateOpen && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Create Workspace</h3>

                        <input
                            type="text"
                            value={newWorkName}
                            onChange={(e) => setNewWorkName(e.target.value)}
                            placeholder="Workspace name..."
                        />

                        <div>
                            <button onClick={handleCreateWork}>
                                Save
                            </button>

                            <button onClick={() => setIsCreateOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}