import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../shop/Navbar';
import Footer from '../shop/Footer';

export default function ShopLayout() {
  const { pathname, search } = useLocation();

  // Global smooth scroll to top on ANY route/param change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname, search]); // Added search to handle category filter changes too

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
