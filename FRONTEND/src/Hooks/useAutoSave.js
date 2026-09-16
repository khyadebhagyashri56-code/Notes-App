
import { useEffect, useRef, useState } from "react";

function useAutoSave({ noteId, title, content, saveNote }) {
  const [status, setStatus] = useState("saved");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setStatus("Saving");

    const timer = setTimeout(async () => {
      try {
        await saveNote(noteId, title, content);
        setStatus("saved");
      } catch (error) {
        console.error("Auto-save failed:", error);
        setStatus("error");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [noteId, title, content, saveNote]);
  return status;
}

export default useAutoSave;
