import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

// Drawer Context 
interface DrawerContextValue {
  openSubMenuDrawer: (details: { label: string; children: ReactNode }) => void;
  openOverflowMenuDrawer: () => void;
  closeDrawer: () => void;
}

type DrawerState =
  | { type: null }
  | { type: "submenu"; label: string; children: ReactNode }
  | { type: "overflow-menu" };
  
const initialDrawerState: DrawerState = { type: null };

export const DrawerContext = createContext<DrawerContextValue | null>(null);

export const useDrawerContext = (): DrawerContextValue => {
  const context = useContext(DrawerContext);
  if (!context)
    throw new Error(
      "useDrawerContext must be used within DrawerContext.Provider"
    );
  return context;
};

export const useDrawer = () => {
  const [drawer, setDrawer] = useState<DrawerState>(initialDrawerState);

  const openSubMenuDrawer = useCallback((details: { label: string, children: ReactNode }) => {
    setDrawer({ type: 'submenu', ...details });
  }, []);

  const openOverflowMenuDrawer = useCallback(() => {
    setDrawer({ type: 'overflow-menu' });
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawer({ type: null });
  }, []);

  return { drawer, openOverflowMenuDrawer, openSubMenuDrawer, closeDrawer };
}