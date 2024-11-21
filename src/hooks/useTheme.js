import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

// 테마 정보 반환
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
