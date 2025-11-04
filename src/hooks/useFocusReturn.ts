import { useEffect, useRef } from "react";

const useFocusReturn = <T extends HTMLElement>() => {
  const containerRef = useRef<T | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
   // Save the previous focus
    if (document.activeElement instanceof HTMLElement) {
      previouslyFocused.current = document.activeElement;
    }

    // Set the focus on the new container
    containerRef.current?.focus();

    // Return the function to restore the focus
    return () => {
      // Check if the saved element still exists in the document
      if (previouslyFocused.current && document.body.contains(previouslyFocused.current)) {
        previouslyFocused.current.focus();
      }
    };
  }, []);

  return containerRef;
};

export default useFocusReturn;
