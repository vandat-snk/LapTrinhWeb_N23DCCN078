"use client";
import { useState } from "react";

const NoteInput = ({ addNote }) => {
  const [text, setText] = useState("");

  return (
    <div className="input-box">
      <input
        placeholder="Nhập ghi chú mới..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="btn-add"
        onClick={() => {
          addNote(text);
          setText("");
        }}
      >
        + Thêm
      </button>
    </div>
  );
};

export default NoteInput;