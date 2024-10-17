
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.pathname);

  return (
    <div className='flex justify-center gap-4 sm:gap-8 h-16 items-center text-white bg-black p-2 sm:p-4'>
      <div 
        onClick={() => { navigate("/") }} 
        className={`transition-all cursor-pointer hover:font-bold ${location.pathname === "/" ? "font-bold" : ""}`}
      >
        All Images
      </div>
      <div 
        onClick={() => { navigate("/upload") }} 
        className='transition-all cursor-pointer hover:font-bold'
      >
        Upload Images
      </div>
            <div 
        onClick={() => { navigate("/") }} 
        className={`transition-all cursor-pointer hover:font-bold ${location.pathname === "/" ? "font-bold" : ""}`}
      >
        Database
      </div>
    </div>
  );
}

export default Navbar;
