import { useEffect, useState } from "react";
import type { Workspace, Column } from "../types/types";
import { authService } from "../services/auth";

interface Props {
    onSelect?: (workspace: Workspace) => void;
    onDelete?: (id: number) => void;
}

export default function Workspaces({ onSelect, onDelete }: Props) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newWorkName, setNewWorkName] = useState("");
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [isModalOpened, setModalOpened] = useState(false);
    const [renameId, setRenameId] = useState<number | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = authService.getToken();
    const getWorkspaces = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch("https://notenest-22y7.onrender.com/api/Board/", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Server not ready");
            }

            const data = await response.json();

            const workspacesWithData = await Promise.all(
                data.map(async (ws: Workspace) => {
                    const columnsRes = await fetch(
                        `https://notenest-22y7.onrender.com/api/Column/boards/${ws.id}/columns`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    const columns = await columnsRes.json();

                    ws.columns = await Promise.all(
                        columns.map(async (col: Column) => {
                            const notesRes = await fetch(
                                `https://notenest-22y7.onrender.com/api/Note/boards/${ws.id}/columns/${col.id}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );

                            col.notes = await notesRes.json();
                            return col;
                        })
                    );

                    return ws;
                })
            );

            setWorkspaces(workspacesWithData);
        } catch {
            setError("Server is loading... please wait");
        } finally {
            setLoading(false);
        }
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
        onDelete?.(id);
    }
    const handleCreateWork = async () => {
        await postWorkspace(newWorkName);
        await getWorkspaces();
        setNewWorkName("");
        setIsCreateOpen(false);
    };
    const truncateContent = (text: string, limit: number) => {
        if (!text) return "No description";
        return text.length > limit ? text.substring(0, limit) + "..." : text;
    };
    useEffect(() => {
        let attempts = 0;

        const load = async () => {
            attempts++;

            try {
                await getWorkspaces();
            } catch {
                if (attempts < 5) {
                    setTimeout(load, 3000);
                }
            }
        };

        load();
    }, []);
    if (loading) {
        return (
            <div className="loading-screen">
                <p> Server is loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-screen">
                <p>⚠️ {error}</p>
                <button onClick={getWorkspaces}>Retry</button>
            </div>
        );
    }
    return (
        <div className="workspaces">
            <div className="create-work">
                <button onClick={() => setIsCreateOpen(true)}>Create Workspace</button>
            </div>
            <div className="list-workspace">
                {workspaces.map((workspace: Workspace) => (
                    <div key={workspace.id} className="workspace-item">
                        <p onClick={() => onSelect?.(workspace)}>{truncateContent(workspace.name, 19)}</p>

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