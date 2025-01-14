import { Link } from 'react-router-dom';

const Navbar = ({ handleLogout }) => {
  return (
    <div className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/dashboard">Admin Dashboard</Link>
        </div>
        <div className="space-x-6">
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/category" className="hover:text-gray-300">
            Categories
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
