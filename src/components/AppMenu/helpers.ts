// TYPE GUARD //

import { isValidElement, type ReactElement, type ReactNode } from "react";
import { AppMenu, type MenuItemProps, type SubMenuProps } from "./AppMenu";

// These are functions to check if the child is a MenuItem component or a SubMenu component.
const isMenuItemElement = (
  child: ReactNode
): child is ReactElement<MenuItemProps> => {
  if (!isValidElement(child)) {
    return false;
  }
  return child.type === AppMenu.Item;
};

const isSubMenuElement = (
  child: ReactNode
): child is ReactElement<SubMenuProps> => {
  if (!isValidElement(child)) {
    return false;
  }

  return child.type === AppMenu.SubMenu;
};


// UTILS //
// This function is used to get the visible items and the overflow items based on the max visible items on mobile.
const getVisibleItems = <T,>(
  items: T[],
  shouldSlice: boolean,
  maxVisible: number
) => {
  if (!shouldSlice) {
    return { visible: items, overflow: [] };
  }

  return {
    visible: items.slice(0, maxVisible),
    overflow: items.slice(maxVisible),
  };
};

export { isMenuItemElement, isSubMenuElement, getVisibleItems };