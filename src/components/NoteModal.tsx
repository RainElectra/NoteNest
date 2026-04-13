import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Note } from "../types/types";

interface Props {
  note: Note;
  boardId: number;
  columnId: number;
  onClose: () => void;
  onRefresh: () => void;
}

export default function NoteModal({ note, boardId, columnId, onClose, onRefresh }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(note.name);
  const [editContent, setEditContent] = useState(note.content);
  const [localIsDone, setLocalIsDone] = useState(note.isDone);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzIiwidW5pcXVlX25hbWUiOiJkZWx1cmVkMWFkbWluIiwibmJmIjoxNzc1OTgwNjY1LCJleHAiOjE3NzcyNzY2NjUsImlhdCI6MTc3NTk4MDY2NX0.hpIM0kEQSRVekkH_IuXkPC-v03Z6l02EMG1_E0jGKzg";
  const toggleDone = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setLocalIsDone(newValue);

    try {
      const response = await fetch(`https://notenest-22y7.onrender.com/api/Note/boards/${boardId}/columns/${columnId}/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: editName,   
          content: editContent,
          isDone: newValue,
          date: note.date,
          columnId: columnId
        })
      });

      if (response.ok) {
        onRefresh();
      } else {
        setLocalIsDone(!newValue);
        alert("Помилка при збереженні стану");
      }
    } catch (error) {
      setLocalIsDone(!newValue);
      console.error("Помилка мережі:", error);
    }
  };
  const handleSave = async () => {
    const response = await fetch(`https://notenest-22y7.onrender.com/api/Note/boards/${boardId}/columns/${columnId}/notes/${note.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: editName,
        content: editContent,
        isDone: localIsDone,
        date: note.date,
      })
    });

    if (response.ok) {
      setIsEditing(false);
      onRefresh();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {isEditing ? (
          <div className="edit-mode">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Write your markdown here..."
            />
            <div>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="view-mode">
            <div className="modal-header">
              <h2>{note.name}</h2>
              <input
                id="modal-checkbox"
                type="checkbox"
                checked={localIsDone}
                onChange={toggleDone}
                className="custom-checkbox"
              />
            </div>
            <div className="markdown-body">
              <ReactMarkdown>{note.content || "*No content yet. Click Edit to add something!*"}</ReactMarkdown>
            </div>
            <div className="note-bottom">
              <div>
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={onClose}>Close</button>
              </div>
              <p>{note.date}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}