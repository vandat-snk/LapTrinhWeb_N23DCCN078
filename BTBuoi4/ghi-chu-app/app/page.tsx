"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import NoteInput from "../components/NoteInput";
import NoteList from "../components/NoteList";
import { ThemeProvider } from "../context/ThemeContext";

export default function Page() {
  const [notes, setNotes] = useState([]);

  // load
  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // save
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (text) => {
    if (!text.trim()) return;
    setNotes([
      {
        id: Date.now(),
        text,
        time: new Date().toLocaleString(),
      },
      ...notes,
    ]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <ThemeProvider>
      <div className="wrapper">
        <div className="container">
          <Header count={notes.length} />
          <NoteInput addNote={addNote} />
          <NoteList notes={notes} deleteNote={deleteNote} />
        </div>
      </div>
    </ThemeProvider>
  );
}