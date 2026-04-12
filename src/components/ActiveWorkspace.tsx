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
    const [columns, setColumns] = useState<Column[]>([]);
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzIiwidW5pcXVlX25hbWUiOiJkZWx1cmVkMWFkbWluIiwibmJmIjoxNzc1OTgwNjY1LCJleHAiOjE3NzcyNzY2NjUsImlhdCI6MTc3NTk4MDY2NX0.hpIM0kEQSRVekkH_IuXkPC-v03Z6l02EMG1_E0jGKzg";

    const loadColumns = async () => {
        const res = await fetch(`https://notenest-22y7.onrender.com/api/Column/boards/${workspace.id}/columns`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const cols = await res.json();
        const colsWithNotes = await Promise.all(cols.map(async (col: Column) => {
            const notesRes = await fetch(`https://notenest-22y7.onrender.com/api/Note/boards/${workspace.id}/columns/${col.id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            col.notes = await notesRes.json();
            return col;
        }));
        setColumns(colsWithNotes);
    };

    useEffect(() => {
        (async () => {
            await loadColumns();
        })();
    }, [workspace.id]);

    const addColumn = async () => {
        const name = prompt("Enter column name:");
        if (!name) return;

        await fetch(`https://notenest-22y7.onrender.com/api/Column/boards/${workspace.id}/columns`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                boardId: workspace.id
            })
        });
        loadColumns();
        onRefresh();
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
            <button onClick={addColumn}>+ Add another list</button>

{selectedNote && (
                <NoteModal note={selectedNote} boardId={workspace.id} columnId={selectedNote.columnId} onClose={() => setSelectedNote(null)} onRefresh={() => {
                    loadColumns();
                    onRefresh();
                }}
                />
            )}
        </div>
    );
}
