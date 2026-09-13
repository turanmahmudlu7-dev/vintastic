/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Product } from './pages/Product';
import { Shop } from './pages/Shop';
import { NewDrops } from './pages/NewDrops';
import { Collections } from './pages/Collections';
import { About } from './pages/About';
import { AdminLayout } from './pages/Admin/AdminLayout';
import { Dashboard } from './pages/Admin/Dashboard';
import { Products } from './pages/Admin/Products';
import { Orders } from './pages/Admin/Orders';
import { Content } from './pages/Admin/Content';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col scanlines">
        <Navbar />
        <main className="flex-grow z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/new" element={<NewDrops />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/category/:category" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="content" element={<Content />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
