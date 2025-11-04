# Headless Sidebar Menu (React + TypeScript + Tailwind)

## Live

- Deployed: https://petrovskya.github.io/sidebar/

A headless, accessible sidebar menu with a clean component API:
- Headless logic in providers (no styling, no router inside).
- Styled AppMenu that integrates with React Router (wrapper approach).
- Collapsed/expanded desktop modes, hover popover for submenus, and mobile bottom bar with a drawer.

## Tech
- React, TypeScript, Vite
- Tailwind CSS
- React Router
- lucide-react (icons)

## Getting Started
1) Install
```bash
npm i
```

2) Dev
```bash
npm run dev
```

3) Build
```bash
npm run build
```

## GitHub Pages
- If your repo is `sidebar`, set Vite base to `/sidebar/` (already configured).
- To avoid 404 on direct links, use HashRouter or add a 404 fallback. Easiest: HashRouter.
- Deploy the `dist` folder to GitHub Pages (e.g., `gh-pages` branch or Pages → Deploy from a branch).

## Usage (example)
```tsx
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppMenu } from './components/AppMenu/AppMenu';
import { UsersIcon, ListIcon, StarIcon, BellIcon } from 'lucide-react';

function Page({ title }: { title: string }) {
  return <div className="grow p-6 md:p-10"><h1 className="text-3xl font-bold">{title}</h1></div>;
}

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <AppMenu>
          <AppMenu.Item to="/trends" label="Trends" />
          <AppMenu.SubMenu to="/clients" label="Clients" icon={<UsersIcon />}>
            <AppMenu.Item to="/clients/list" label="List" icon={<ListIcon />} />
            <AppMenu.Item to="/clients/reviews" label="Reviews" icon={<StarIcon />} />
            <AppMenu.Item to="/clients/notifications" label="Notifications" icon={<BellIcon />} />
          </AppMenu.SubMenu>
          {/* ...other items... */}
        </AppMenu>

        <main className="flex-1 pb-16 md:pb-0">
          <Routes>
            <Route path="/trends" element={<Page title="Trends" />} />
            <Route path="/clients/list" element={<Page title="Clients List" />} />
            <Route path="/clients/reviews" element={<Page title="Client Reviews" />} />
            <Route path="/clients/notifications" element={<Page title="Client Notifications" />} />
            <Route path="*" element={<Navigate to="/trends" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
```

## Architecture
- Headless providers: `src/components/Menu/HeadlessMenu.tsx`, `Headless.context.ts`
- Styled wrapper: `src/components/AppMenu/AppMenu.tsx`
- App usage: `src/App.tsx`

## Notes
- Desktop collapsed: icons only, hover to show submenu popover; click parent navigates to first child.
- Desktop expanded: submenu opens inline (and stays open if a child is active).
- Mobile: bottom bar; clicking a parent opens a drawer with submenu items.
- Basic ARIA is included; you can extend roles/aria attributes if needed.