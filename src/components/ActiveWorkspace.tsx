import { useState, useEffect } from "react";
import type { Workspace, Note, Column } from "../types/types";
import ColumnComponent from "./Column";
import NoteModal from "./NoteModal";

interface Props {
    workspace: Workspace;
    onRefresh: () => void;
}

export default function ActiveWorkspace({ workspace, onRefresh }: Props) {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [columns, setColumns] = useState<Column[]>([]);
    const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
    const [columnName, setColumnName] = useState("");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzIiwidW5pcXVlX25hbWUiOiJkZWx1cmVkMWFkbWluIiwibmJmIjoxNzc1OTgwNjY1LCJleHAiOjE3NzcyNzY2NjUsImlhdCI6MTc3NTk4MDY2NX0.hpIM0kEQSRVekkH_IuXkPC-v03Z6l02EMG1_E0jGKzg";

    const loadColumns = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `https://notenest-22y7.onrender.com/api/Column/boards/${workspace.id}/columns`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (!res.ok) {
                throw new Error("Failed to load columns");
            }

            const cols = await res.json();

            const colsWithNotes = await Promise.all(
                cols.map(async (col: Column) => {
                    const notesRes = await fetch(
                        `https://notenest-22y7.onrender.com/api/Note/boards/${workspace.id}/columns/${col.id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    col.notes = await notesRes.json();
                    return col;
                })
            );
            if (selectedNote) {
                const freshNote = colsWithNotes
                    .flatMap(col => col.notes)
                    .find(n => n.id === selectedNote.id);

                if (freshNote) {
                    setSelectedNote(freshNote); 
                }
            }
            setColumns(colsWithNotes);
        } catch {
            setError("Server is waking up... try again");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadColumns();
    }, [workspace.id]);
    if (loading) {
        return (
            <div className="loading">
                ⏳ Loading workspace...
                <p>Завантажуємо колонки та нотатки</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                ⚠️ {error}
                <button onClick={loadColumns}>Retry</button>
            </div>
        );
    }
    const addColumn = async () => {
        try {
            const res = await fetch(
                `https://notenest-22y7.onrender.com/api/Column/boards/${workspace.id}/columns`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: columnName,
                        boardId: workspace.id,
                    }),
                }
            );

            if (res.ok) {
                setColumnName("");
                setIsCreateColumnOpen(false);
                loadColumns();
                onRefresh();
            }
        } catch (err) {
            console.error("Create column error:", err);
        }
    };

    return (
        <div className="active-workspace">
            {columns.length !== 0 ? columns.map((column) => (
                <ColumnComponent
                    key={column.id}
                    column={column}
                    boardId={workspace.id}
                    onRefresh={loadColumns}
                    onNoteClick={setSelectedNote}
                />
            )) : <p>No columns in this board!</p>}
            <button onClick={() => setIsCreateColumnOpen(true)}>+ Add another list</button>

            {selectedNote && (
                <NoteModal key={`${selectedNote.id}-${selectedNote.isDone}-${selectedNote.name}`} note={selectedNote} boardId={workspace.id} columnId={selectedNote.columnId} onClose={() => setSelectedNote(null)} onRefresh={() => {
                    loadColumns();
                    onRefresh();
                }}
                />
            )}
            {isCreateColumnOpen && (
                <div className="modal-backdrop" onClick={() => setIsCreateColumnOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>

                        <h3>Create Column</h3>

                        <input
                            placeholder="Column name..."
                            value={columnName}
                            onChange={(e) => setColumnName(e.target.value)}
                        />

                        <div style={{ marginTop: 12 }}>
                            <button onClick={addColumn}>Save</button>
                            <button onClick={() => setIsCreateColumnOpen(false)}>
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
