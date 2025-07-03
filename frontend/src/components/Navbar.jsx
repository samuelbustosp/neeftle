import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  Wallet,
  LogOut,
  Bird
} from 'lucide-react';

const Navbar = ({ currentAccount, onLogout }) => {
  const navigate = useNavigate();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleLogout = () => {
    onLogout();          // Limpia blockchain state
    navigate('/login');  // Redirige
  };

  return (
    <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/marketplace')}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Bird className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Neeftle
            </h1>
          </div>

          
          

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <Link to="/collection" className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <User className="w-5 h-5" />
            </Link>

            {currentAccount && (
              <Link to={'/account'} className='items-center flex gap-1'>
                <div className="hidden sm:flex items-center space-x-2 bg-white/10 rounded-xl px-3 py-2">
                  <Wallet className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-mono">{formatAddress(currentAccount)}</span>
                </div>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/20 rounded-xl transition-colors text-red-400 hover:text-red-300"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
