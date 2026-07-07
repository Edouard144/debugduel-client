import { useEffect } from "react";

export function useKeyboard(
  key: string,
  callback: () => void,
  modifiers?: { ctrl?: boolean; shift?: boolean; alt?: boolean }
) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (modifiers?.ctrl && !e.ctrlKey && !e.metaKey) return;
      if (modifiers?.shift && !e.shiftKey) return;
      if (modifiers?.alt && !e.altKey) return;
      e.preventDefault();
      callback();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, modifiers]);
}
