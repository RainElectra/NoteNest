import type { Column, Note } from "../types/types";
import NoteComponent from "./Note";

interface Props {
  column: Column;
  boardId: number;
  onRefresh: () => void;
  onNoteClick: (note: Note) => void;
}

export default function ColumnComponent({ column, boardId, onRefresh, onNoteClick }: Props) {
  const BASE_URL = "https://notenest-22y7.onrender.com";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzIiwidW5pcXVlX25hbWUiOiJkZWx1cmVkMWFkbWluIiwibmJmIjoxNzc1OTgwNjY1LCJleHAiOjE3NzcyNzY2NjUsImlhdCI6MTc3NTk4MDY2NX0.hpIM0kEQSRVekkH_IuXkPC-v03Z6l02EMG1_E0jGKzg";

  const addNote = async () => {
    const name = prompt("Enter note name:");
    if (!name) return;

    try {
      const res = await fetch(`${BASE_URL}/api/Note/boards/${boardId}/columns/${column.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          content: "",
          isDone: false,
          date: new Date().toISOString().split('T')[0],
          columnId: column.id
        })
      });
      if (res.ok) onRefresh();
    } catch (err) {
      console.error("Add note error:", err);
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

      <button onClick={addNote}>
        + Add a card
      </button>
    </div>
  );
}