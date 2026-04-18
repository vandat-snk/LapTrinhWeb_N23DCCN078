"use client";
import NoteItem from "./NoteItem";

const NoteList = ({ notes, deleteNote }) => {
  return (
    <>
      {notes.map((note, index) => (
        <NoteItem
          key={note.id}
          note={note}
          deleteNote={deleteNote}
          index={index}
        />
      ))}
    </>
  );
};

export default NoteList;