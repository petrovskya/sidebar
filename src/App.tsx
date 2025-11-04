import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BarcodeIcon, BellIcon, BoxIcon,  ChartColumnBigIcon, CircleCheckBigIcon, CircleQuestionMarkIcon, ContainerIcon, CreditCardIcon, FlagTriangleRightIcon, FlameIcon, ListIcon, SettingsIcon, ShoppingBasketIcon, ShoppingCartIcon, StarIcon, TicketIcon, UsersIcon } from 'lucide-react';

import { AppMenu } from './components/AppMenu/AppMenu';

const Page = ({ title }: { title: string }) => (
  <div className="grow p-6 md:p-10">
    <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
    <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Content for the {title.toLowerCase()} page goes here.</p>
  </div>
);

function App() {
  return (
    <Router basename={import.meta.env.VITE_BASE_URL}>
      <div className="flex min-h-screen text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 ">
        <AppMenu>
          <AppMenu.Item to="/trends" icon={<ChartColumnBigIcon />} label="Trends" />
          <AppMenu.Item to="/tasks" icon={<CircleCheckBigIcon />} label="Tasks" />
          <AppMenu.Item to="/tickets" icon={<TicketIcon />} label="Tickets" />
          <AppMenu.Item to="/payments" icon={<CreditCardIcon />} label="Payments" />

          <AppMenu.SubMenu to="/clients" icon={<UsersIcon />} label="Clients">
            <AppMenu.Item to="/clients/list" icon={<ListIcon />} label="List" />
            <AppMenu.Item to="/clients/reviews" icon={<StarIcon />} label="Reviews" />
            <AppMenu.Item to="/clients/notifications" icon={<BellIcon />} label="Notifications" />
          </AppMenu.SubMenu>

          <AppMenu.SubMenu to="/inventory" icon={<BoxIcon />} label="Inventory">
            <AppMenu.Item to="/inventory/products" icon={<BarcodeIcon />} label="Products" />
            <AppMenu.Item to="/inventory/orders" icon={<ShoppingBasketIcon />} label="Orders" />
            <AppMenu.Item to="/inventory/suppliers" icon={<ContainerIcon />} label="Suppliers" />
          </AppMenu.SubMenu>

          <AppMenu.Item to="/shop" icon={<ShoppingCartIcon />} label="Shop" />
          <AppMenu.Item to="/reports" icon={<FlagTriangleRightIcon />} label="Reports" />
          <AppMenu.Item to="/tender" icon={<FlameIcon />} label="Tender" />

          <AppMenu.Separator />

          <AppMenu.Item to="/settings" icon={<SettingsIcon />} label="Settings" />
          <AppMenu.Item to="/knowledge-base" icon={<CircleQuestionMarkIcon />} label="Knowledge Base" />
        </AppMenu>

        <main className="flex-1 pb-16 md:pb-0">
          <Routes>
            <Route path="/trends" element={<Page title="Trends" />} />
            <Route path="/tasks" element={<Page title="Tasks" />} />
            <Route path="/tickets" element={<Page title="Tickets" />} />
            <Route path="/payments" element={<Page title="Payments" />} />
            <Route path="/clients/list" element={<Page title="Clients List" />} />
            <Route path="/clients/reviews" element={<Page title="Client Reviews" />} />
            <Route path="/clients/notifications" element={<Page title="Client Notifications" />} />
            <Route path="/inventory/products" element={<Page title="Inventory Products" />} />
            <Route path="/inventory/orders" element={<Page title="Inventory Orders" />} />
            <Route path="/inventory/suppliers" element={<Page title="Inventory Suppliers" />} />
            <Route path="/shop" element={<Page title="Shop" />} />
            <Route path="/reports" element={<Page title="Reports" />} />
            <Route path="/tender" element={<Page title="Tender" />} />
            <Route path="/settings" element={<Page title="Settings" />} />
            <Route path="/knowledge-base" element={<Page title="Knowledge Base" />} />
            <Route path="*" element={<Navigate to="/trends" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;