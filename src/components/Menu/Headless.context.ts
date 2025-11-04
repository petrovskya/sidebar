import { createContext, useContext } from 'react';

export interface HeadlessContextProps { 
  isCollapsed: boolean;
  isMobile: boolean;
  activePath: string;
  isSubMenuOpen: (id: string) => boolean;
  openSubMenuOnHover: (id: string | null) => void;
  hoveredSubMenuPath: string | null;
}

export interface SubMenuContextProps {
  isParentActive: boolean;
  parentPath: string;
  displayMode?: 'inline' | 'popover';
}

// CONTEXT //

const MenuContext = createContext<HeadlessContextProps | undefined>(undefined);
const SubMenuContext = createContext<SubMenuContextProps | undefined>(undefined);

// HOOKS //

export const useMenu = () => {
  const context = useContext(MenuContext);
  if(!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}

export const useSubMenu = () => {
  // This context is optional, so we don't need to throw an error if it's not found
  return useContext(SubMenuContext);
}

export { MenuContext, SubMenuContext };