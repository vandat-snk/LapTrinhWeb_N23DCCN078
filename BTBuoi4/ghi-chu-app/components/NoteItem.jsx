"use client";

const NoteItem = ({ note, deleteNote, index }) => {
  return (
    <div className={`note ${index === 2 ? "active" : ""}`}>
      <div>
        <p>{note.text}</p>
        <small>{note.time}</small>
      </div>

      <span className="delete" onClick={() => deleteNote(note.id)}>
        Xóa
      </span>
    </div>
  );
};

export default NoteItem;