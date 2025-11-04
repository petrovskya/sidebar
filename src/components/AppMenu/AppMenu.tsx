import {
  Children,
  createContext,
  Fragment,
  isValidElement,
  useContext,
  useMemo,
  type Key,
  type ReactNode,
  useId,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  useEscape,
  useFocusReturn,
  useMediaQuery,
  useSidebarState,
} from "../../hooks";

import {
  HeadlessMenuProvider,
  HeadlessSubMenuProvider,
} from "../Menu/HeadlessMenu";
import { useMenu, useSubMenu } from "../Menu/Headless.context";

import { DrawerContext, useDrawer, useDrawerContext } from "./drawer";
import { getVisibleItems, isMenuItemElement, isSubMenuElement } from "./helpers";

const MobileDisplayStyleContext = createContext<"sidebar" | "drawer">(
  "sidebar"
);

// TYPES //

export interface MenuItemProps {
  to: string;
  label: string;
  icon?: ReactNode;
}

export interface SubMenuProps extends MenuItemProps {
  children: ReactNode;
}

interface ToggleButtonProps {
  onToggle: () => void;
}

interface DrawerProps {
  children: ReactNode;
  title?: string;
  onClose: () => void;
}

// CONSTANTS //

const MAX_VISIBLE_MOBILE_ITEMS = 5;

const MenuItem = ({ to, label, icon }: MenuItemProps) => {
  const { activePath, isMobile, isCollapsed } = useMenu();
  const subMenuContext = useSubMenu();
  const mobileDisplayStyle = useContext(MobileDisplayStyleContext);

  const isActive = activePath === to;
  const isMobileSidebarItem = isMobile && mobileDisplayStyle === "sidebar";

  // In collapsed desktop mode, items inside a popover should show their labels.
  const isPopoverItem = subMenuContext?.displayMode === "popover";
  const hideLabel = isCollapsed && !isMobile && !isPopoverItem;

  const itemClasses = `
    flex items-center w-full text-sm font-medium transition-colors duration-150
    ${
      isMobileSidebarItem
        ? "flex-col justify-center h-16 px-2 text-gray-500" // Style for bottom bar
        : `h-10 px-3 my-1 rounded-lg ${subMenuContext ? "pl-10" : ""}` // Style for Desktop and Drawer
    }
    ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }
  `;

  return (
    <li
      className={
        isMobileSidebarItem
          ? "flex justify-center items-center gap-2 shrink-0 flex-1 basis-0"
          : "w-full relative group"
      }
      key={to}
    >
      <Link
        to={to}
        className={itemClasses}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="w-6 h-6">{icon}</span>
        <span
          className={`overflow-hidden transition-all whitespace-nowrap ${
            hideLabel
              ? "hidden"
              : isMobileSidebarItem
              ? "text-xs mt-1"
              : "w-auto ml-3"
          }`}
        >
          {label}
        </span>
      </Link>

      {isCollapsed && !isMobile && !isPopoverItem && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
          {label}
        </div>
      )}
    </li>
  );
};

const SubMenu = ({ children, to, label, icon }: SubMenuProps) => {
  const {
    isCollapsed,
    activePath,
    isMobile,
    isSubMenuOpen,
    openSubMenuOnHover,
    hoveredSubMenuPath,
  } = useMenu();

  const { openSubMenuDrawer } = useDrawerContext();
  const mobileDisplayStyle = useContext(MobileDisplayStyleContext);
  const navigate = useNavigate();

  const isOpen = isSubMenuOpen(to);
  const isHovered = hoveredSubMenuPath === to;

  const isChildActive = !!(activePath && activePath.startsWith(to + "/"));
  const isActive = activePath === to || isChildActive;

  const uniqueId = useId();

  // Get the first child path of the submenu //
  const getFirstChildPath = (): string | null => {
    const firstChild = Children.toArray(children).find(isMenuItemElement);

    return firstChild ? firstChild.props.to : null;
  };

  // Handle the opening of the submenu //
  const handleOpenSubMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
 
    // Open the submenu on mobile //
    if (isMobile) {
      openSubMenuDrawer({ label, children });
      return;
    }

    // Open the submenu on desktop in collapsed mode //
    if (!isMobile && isCollapsed) {
      openSubMenuOnHover(to);
    }

    // Navigate to the first child of the submenu //
    const firstChildPath = getFirstChildPath();
    if (firstChildPath) {
      navigate(firstChildPath);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (isMobile) return;
      if (isCollapsed) {
        openSubMenuOnHover(to);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (isMobile) return;
      if (isCollapsed) {
        openSubMenuOnHover(null);
      }
    }
  };

  const triggerClasses = `
        flex items-center gap-2 w-full text-sm font-medium transition-colors duration-150
        h-10 px-3 my-1 rounded-lg cursor-pointer
        ${
          isActive
            ? "bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-blue-300"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }
    `;

  // Desktop hover handling for the submenu //
  const liProps = !isMobile
    ? {
        onMouseEnter: () => openSubMenuOnHover(to),
        onMouseLeave: () => openSubMenuOnHover(null),
      }
    : {};

  // MOBILE RENDERING //
  const isMobileSidebarItem = isMobile && mobileDisplayStyle === "sidebar";
  if (isMobileSidebarItem) {
    const mobileButtonClasses = `
            flex flex-col items-center justify-center w-full h-16 px-2
            transition-colors duration-150
            ${
              isChildActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            }
        `;
    return (
      <li className="shrink-0 flex-1 basis-0" key={to}>
        <button
          type="button"
          onClick={handleOpenSubMenu}
          className={mobileButtonClasses}
          title={label}
        >
          <span className="w-6 h-6">{icon}</span>
          <span className="mt-1 text-xs">{label}</span>
        </button>
      </li>
    );
  }

  // Desktop rendering for the submenu //
  return (
    <li className="relative w-full group" {...liProps}>
      <button
        type="button"
        onClick={handleOpenSubMenu}
        aria-haspopup={!isMobile && !isCollapsed ? "menu" : undefined}
        aria-expanded={!isMobile && !isCollapsed ? isOpen : undefined}
        aria-controls={`submenu-${uniqueId}`}
        id={`submenu-trigger-${uniqueId}`}
        onKeyDown={handleKeyDown}
        className={triggerClasses}
      >
        <span className="w-6 h-6">{icon}</span>
        <span
          className={`overflow-hidden transition-all whitespace-nowrap ${
            isCollapsed && !isMobile ? "hidden" : "w-auto ml-3"
          }`}
        >
          {label}
        </span>
      </button>

      {/* Desktop rendering - Inline submenu */}
      {!isMobile && !isCollapsed && (
        <div
          id={`submenu-${uniqueId}`}
          aria-label={`${label} submenu`}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "flex max-h-96" : "hidden"
          }`}
        >
          <ul
            className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-4 py-1"
            aria-labelledby={`submenu-trigger-${uniqueId}`}
          >
            <HeadlessSubMenuProvider parentPath={to} displayMode="inline">
              {children}
            </HeadlessSubMenuProvider>
          </ul>
        </div>
      )}

      {/* Desktop rendering - Popover submenu */}
      {!isMobile && isCollapsed && isHovered && (
        <div
          id={`submenu-${uniqueId}`}
          role="menu"
          className="absolute left-full top-0 ml-2 z-20 animate-fade-in"
          onMouseEnter={() => openSubMenuOnHover(to)}
          onMouseLeave={() => openSubMenuOnHover(null)}
        >
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700 p-2 min-w-[200px]">
            <div className="font-semibold text-sm px-3 py-2 text-gray-800 dark:text-gray-200">
              {label}
            </div>
            <ul
              className="space-y-1"
              aria-labelledby={`submenu-trigger-${uniqueId}`}
            >
              <HeadlessSubMenuProvider parentPath={to} displayMode="popover">
                {children}
              </HeadlessSubMenuProvider>
            </ul>
          </div>
        </div>
      )}
    </li>
  );
};

const Separator = () => {
  const { isCollapsed } = useMenu();

  return (
    <li role="separator" aria-hidden="true">
      <hr
        className={`my-2 border-gray-200 dark:border-gray-700 transition-all ${
          isCollapsed ? "mx-3" : "mx-5"
        }`}
      />
    </li>
  );
};

const ToggleButton = ({ onToggle }: ToggleButtonProps) => {
  const { isCollapsed } = useMenu();

  return (
    <div
      className={`flex items-center px-3 py-4 ${
        isCollapsed ? "justify-center" : "justify-end "
      }`}
    >
      <button
        onClick={onToggle}
        className="h-10 px-3 flex items-center justify-center text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="w-6 h-6">
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </span>
      </button>
    </div>
  );
};

const MobileDrawer = ({ children, title, onClose }: DrawerProps) => {
  // Escape key handling for the mobile drawer // 
  useEscape(onClose);

  // Focus return for the mobile drawer //
  const containerRef = useFocusReturn<HTMLDivElement>();

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 animate-fade-in"
      />
      <div
        ref={containerRef}
        tabIndex={-1}
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl p-4 animate-slide-in-up max-h-[60vh] flex flex-col"
      >
        {title && (
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-gray-100 shrink-0">
            {title}
          </h3>
        )}
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

// STYLED MENU WITH INTEGRATION WITH REACT ROUTER //

export const AppMenu = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery("(max-width: 576px)");

  // Sidebar state handling //
  const { isCollapsed, setIsCollapsed } = useSidebarState();

  // Drawer state handling //
  const { drawer, openSubMenuDrawer, openOverflowMenuDrawer, closeDrawer } =
    useDrawer();

  // Handling the visible items for the mobile drawer //
  const allItems = Children.toArray(children);

  const { visible: visibleItems, overflow: overflowItems } = useMemo(
    () => getVisibleItems(allItems, isMobile, MAX_VISIBLE_MOBILE_ITEMS),
    [allItems, isMobile]
  );

  // Handling active submenus //
  const openSubMenus = useMemo(() => {
    const activeSubMenu = Children.toArray(children).find((child) => {
      if (!isSubMenuElement(child)) {
        return false;
      }
      return pathname.startsWith(child.props.to + "/");
    });

    if (activeSubMenu && isSubMenuElement(activeSubMenu)) {
      return [activeSubMenu.props.to];
    }

    return [];
  }, [children, pathname]);

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuWrapperClasses = isMobile
    ? "fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex flex-col"
    : `relative z-30 flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`;

  return (
    <HeadlessMenuProvider
      isCollapsed={isCollapsed}
      isMobile={isMobile}
      activePath={pathname}
      openSubMenus={openSubMenus}
    >
      <MobileDisplayStyleContext.Provider value="sidebar">
        <DrawerContext.Provider
          value={{ openSubMenuDrawer, openOverflowMenuDrawer, closeDrawer }}
        >
          <aside className={menuWrapperClasses}>
            {isMobile && overflowItems.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={openOverflowMenuDrawer}
                  className="flex flex-col items-center justify-center w-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 py-2"
                >
                  <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </button>
              </div>
            )}
            <nav className="flex-1" aria-label="Primary">
              <ul
                className={
                  isMobile ? "flex justify-around items-center" : "p-2"
                }
              >
                {isMobile ? visibleItems : children}
              </ul>
            </nav>
            {!isMobile && (
              <ToggleButton onToggle={handleToggleSidebar} />
            )}
          </aside>

          {/* Mobile drawer */}
          {drawer.type !== null && (
            <MobileDrawer
              // Drawer title renders only for items with children
              title={drawer.type === "submenu" ? drawer.label : ""}
              onClose={closeDrawer}
            >
              {/* Drawer content only for submenu items */}
              {drawer.type === "submenu" && (
                <ul
                  className="flex justify-center gap-2 p-2"
                  onClick={closeDrawer}
                >
                  {drawer.children}
                </ul>
              )}
              
              {/* Drawer content for overflow menu items that are not visible on mobile */}
              {drawer.type === "overflow-menu" && (
                <MobileDisplayStyleContext.Provider value="drawer">
                  <ul>
                    {overflowItems.map((item, index) => {
                      const elementKey: Key =
                        isValidElement(item) && item.key != null
                          ? item.key
                          : `overflow-${index}`;
                      return <Fragment key={elementKey}>{item}</Fragment>;
                    })}
                  </ul>
                </MobileDisplayStyleContext.Provider>
              )}
            </MobileDrawer>
          )}
        </DrawerContext.Provider>
      </MobileDisplayStyleContext.Provider>
    </HeadlessMenuProvider>
  );
};

// Assigning sub-components for a clean API
AppMenu.Item = MenuItem;
AppMenu.SubMenu = SubMenu;
AppMenu.Separator = Separator;

