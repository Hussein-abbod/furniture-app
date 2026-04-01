import { Outlet } from 'react-router-dom';
import Navbar from '../shop/Navbar';
import Footer from '../shop/Footer';

export default function ShopLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
