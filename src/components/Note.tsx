import { useState } from "react";
import type { Note } from "../types/types";

interface Props {
  note: Note;
  boardId: number;
  columnId: number;
  onRefresh: () => void;
  onClick: () => void;
  onDoneToggle?: () => void;
}


export default function NoteComponent({ note, boardId, columnId, onRefresh, onClick }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: note.id, columnId: columnId }));
  };

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzIiwidW5pcXVlX25hbWUiOiJkZWx1cmVkMWFkbWluIiwibmJmIjoxNzc1OTgwNjY1LCJleHAiOjE3NzcyNzY2NjUsImlhdCI6MTc3NTk4MDY2NX0.hpIM0kEQSRVekkH_IuXkPC-v03Z6l02EMG1_E0jGKzg";

  const toggleDone = async (e: React.MouseEvent | React.ChangeEvent) => {
    e.stopPropagation();
    await fetch(`https://notenest-22y7.onrender.com/api/Note/boards/${boardId}/columns/${columnId}/notes/${note.id}`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: note.name,
        content: note.content,
        isDone: !note.isDone,
        date: note.date,
        columnId: columnId
      })
    });
    onRefresh();
  };

  const deleteNote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!note.isDone) return;
    if (!confirm("Delete this note?")) alert("Note is not checked!");

    await fetch(`https://notenest-22y7.onrender.com/api/Note/boards/${boardId}/columns/${columnId}/notes/${note.id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    onRefresh();
  };
  const truncateContent = (text: string, limit: number) => {
    if (!text) return "No description";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="note-container" style={{ position: "relative" }}>
      <div
        className="note-card"
        draggable
        onDragStart={handleDragStart}
        onClick={onClick}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={note.isDone}
              onChange={toggleDone}
              onClick={(e) => e.stopPropagation()}
            />
            <span>{note.name}</span>
          </div>
          <button
            className="menu-trigger"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(prev => !prev);
            }}
          >
            ⋯
          </button>
        </div>

        <p>{truncateContent(note.content, 50)}</p>
      </div>
      {modalOpen && (
        <div className="note-context-menu" onClick={(e) => e.stopPropagation()}>
          <button onClick={(e) => { deleteNote(e); setModalOpen(false); }}>
            Delete Note
          </button>
          <button onClick={() => { onClick(); setModalOpen(false); }}>
            Open Note
          </button>
        </div>
      )}
    </div>
  );
}