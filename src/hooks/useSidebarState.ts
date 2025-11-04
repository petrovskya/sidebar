import { useEffect, useState } from "react";

const useSidebarState = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? window.localStorage.getItem("sidebar:isCollapsed")
          : null;
      return stored === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("sidebar:isCollapsed", String(isCollapsed));
    } catch {
      // ignore write errors (storage disabled/private mode)
    }
  }, [isCollapsed]);

  return { isCollapsed, setIsCollapsed };
};

export default useSidebarState;
