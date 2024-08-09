import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar';
import { AppContext } from './Context/AppContext'; // Corrected import

const Layout = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  // const { Name } = context;

  return (
    <div className='relative h-screen overflow-hidden'>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
