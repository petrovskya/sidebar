import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { MenuContext, SubMenuContext, useMenu, type HeadlessContextProps, type SubMenuContextProps } from './Headless.context';

interface MenuProps {
  children: ReactNode;
  isCollapsed: boolean;
  isMobile: boolean;
  activePath: string;
  openSubMenus: string[];
}

interface SubMenuProps {
  children: ReactNode;
  parentPath: string;
  displayMode?: 'inline' | 'popover';
}

// HEADLESS PROVIDER COMPONENTS //
//These are the providers for the headless menu and sub menu. They are the "controlled" components, this makes them stateless and flexible, allowing the consumer to control it using any state management solution.

// HEADLESS MENU PROVIDER //
const HeadlessMenuProvider = ({ children, isCollapsed, isMobile, activePath, openSubMenus}: MenuProps) => {

  const [hoveredSubMenuPath, setHoveredSubMenuPath] = useState<string | null>(null);
  const hoverTimerRef = useRef<number | null>(null);

  const isSubMenuOpen = useCallback((id: string) => openSubMenus.includes(id), [openSubMenus]);

  // MANAGES THE DISPLAY OF THE POPOVER MENU IN THE COLLAPSED MODE. Uses a timer with a delay to give the user time to move the cursor from the trigger to the popover menu, without closing it. The timer id is stored in `useRef` to be preserved between renders without calling them. 
  const openSubMenuOnHover = useCallback((id: string | null) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    if (!isMobile && isCollapsed) {
      if (id) {
        setHoveredSubMenuPath(id);
      } else {
        hoverTimerRef.current = window.setTimeout(() => {
          setHoveredSubMenuPath(null);
        }, 100);
      }
    }
  }, [isMobile, isCollapsed]);

  const contextValue: HeadlessContextProps = useMemo(() => ({
    isCollapsed,
    isMobile,
    activePath,
    hoveredSubMenuPath,
    isSubMenuOpen,
    openSubMenuOnHover,
  }), [isCollapsed, isMobile, activePath, hoveredSubMenuPath, isSubMenuOpen, openSubMenuOnHover]);


  // CLEARS THE TIMER WHEN THE COMPONENT IS UNMOUNTED //
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  return <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
}

// HEADLESS SUB MENU PROVIDER //
// This is the provider for the sub menu. It's a "controlled" component, so this makes it stateless and flexible, allowing the consumer to control it using any state management solution.
const HeadlessSubMenuProvider = ({ children, parentPath, displayMode = 'inline' }: SubMenuProps) => {

  const { activePath } = useMenu();

  // CHECKS IF THE PARENT PATH IS ACTIVE //
  const isParentActive = !!(activePath && parentPath && activePath.startsWith(parentPath));

  const contextValue: SubMenuContextProps = useMemo(() => ({
    isParentActive,
    parentPath,
    displayMode,
  }), [isParentActive, parentPath, displayMode]);

  return <SubMenuContext.Provider value={contextValue}>{children}</SubMenuContext.Provider>
}

export { HeadlessMenuProvider, HeadlessSubMenuProvider };