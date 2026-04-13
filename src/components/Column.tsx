import { useState } from "react";
import type { Column, Note } from "../types/types";
import NoteComponent from "./Note";
import { authService } from "../services/auth";

interface Props {
  column: Column;
  boardId: number;
  onRefresh: () => void;
  onNoteClick: (note: Note) => void;
}

export default function ColumnComponent({ column, boardId, onRefresh, onNoteClick }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [noteName, setNoteName] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const BASE_URL = "https://notenest-22y7.onrender.com";
  const token = authService.getToken();

  const addNote = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/Note/boards/${boardId}/columns/${column.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: noteName,
            content: noteContent,
            isDone: false,
            date: new Date().toISOString().split("T")[0],
            columnId: column.id,
          }),
        }
      );

      if (res.ok) {
        setIsCreateOpen(false);
        setNoteName("");
        setNoteContent("");
        onRefresh();
      }
    } catch (err) {
      console.error("Create note error:", err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();

    try {
      const data = e.dataTransfer.getData('text/plain');
      const dragged = JSON.parse(data);
      const url = `${BASE_URL}/api/Note/boards/${boardId}/columns/${dragged.columnId}/notes/${dragged.id}/move/${column.id}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(`Move failed: ${res.status}`);

      onRefresh();
    } catch (err) {
      console.error('Drop error:', err);
    }
  };
  const deleteWorkspace = async (id: number) => {
    const response = await fetch(`https://notenest-22y7.onrender.com/api/Column/boards/${column.boardId}/columns/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    })
    return response.ok;
  }
  const handleDelete = async (id: number) => {
    if (window.confirm(`Ви впевнені, що хочете видалити колонку "${column.name}"?`)) {
      const isOk = await deleteWorkspace(id);
      if (isOk) {
        onRefresh();
      }
    }
  };
  return (
    <div
      className="column"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    // onDragEnter={(e) => {
    //   e.currentTarget.style.border = "2px dashed #0079bf";
    // }}
    // onDragLeave={(e) => {
    //   e.currentTarget.style.border = "2px dashed transparent";
    // }}
    >
      <div className="column-first">
        <h4>{column.name}</h4>
        <button className="delete-btn" onClick={() => handleDelete(column.id)}>
          <span style={{ fontSize: '16px' }}>&times;</span> Delete Column
        </button>
      </div>


      <div className="notes-list">
        {column.notes?.map((note) => (
          <NoteComponent
            key={note.id}
            note={note}
            boardId={boardId}
            columnId={column.id}
            onRefresh={onRefresh}
            onClick={() => onNoteClick(note)}
          />
        ))}
      </div>

      <button onClick={() => setIsCreateOpen(true)}>
        + Add a card
      </button>
      {isCreateOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            <h3>Create Note</h3>

            <input
              placeholder="Note title"
              value={noteName}
              onChange={(e) => setNoteName(e.target.value)}
            />

            <textarea
              placeholder="Markdown content..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={6}
            />

            <div style={{ marginTop: 10 }}>
              <button onClick={addNote}>Save</button>
              <button onClick={() => setIsCreateOpen(false)}>Cancel</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}