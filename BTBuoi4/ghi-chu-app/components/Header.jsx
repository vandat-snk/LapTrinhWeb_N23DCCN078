"use client";
import { useTheme } from "../context/ThemeContext";

const Header = ({ count }) => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="header-box">
      <div className="header-left">
        <span className="title">📒 Ghi Chú Cá Nhân</span>
      </div>

      <div className="header-right">
        <span className="badge">{count} ghi chú</span>
        <span className="toggle" onClick={toggleTheme}>
          {darkMode ? "☀️" : "🌙"}
        </span>
      </div>
    </div>
  );
};

export default Header;