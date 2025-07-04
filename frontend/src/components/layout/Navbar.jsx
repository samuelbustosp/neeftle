import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  Wallet,
  LogOut,
  Bird,
  SquareLibrary
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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 4xl:px-24">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 xl:h-28 2xl:h-32 4xl:h-40">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 4xl:space-x-8 cursor-pointer"
            onClick={() => navigate('/marketplace')}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 4xl:w-20 4xl:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl lg:rounded-2xl flex items-center justify-center">
              <Bird className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 4xl:text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Neeftle
            </h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 xl:space-x-8 2xl:space-x-10 4xl:space-x-12">
            {/* Mi colección */}
            <Link 
              to={'/collection'} 
              className="p-2 lg:p-3 xl:p-4 2xl:p-5 4xl:p-6 flex items-center gap-1 lg:gap-2 xl:gap-3 2xl:gap-4 4xl:gap-5 hover:bg-white/10 rounded-xl lg:rounded-2xl transition-colors"
            >
              <SquareLibrary className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10" />
              <span className="font-semibold text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl hidden sm:inline">
                Mi colección
              </span>
              <span className="font-semibold text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl sm:hidden">
                Colección
              </span>
            </Link>

            {/* User Account */}
            <Link 
              to="/account" 
              className="p-2 lg:p-3 xl:p-4 2xl:p-5 4xl:p-6 hover:bg-white/10 rounded-xl lg:rounded-2xl transition-colors"
            >
              <User className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10" />
            </Link>

            {/* Wallet Info */}
            {currentAccount && (
              <Link 
                to={'/account'} 
                className="items-center flex gap-1 lg:gap-2 xl:gap-3 2xl:gap-4 4xl:gap-5"
              >
                <div className="hidden sm:flex items-center space-x-2 lg:space-x-3 xl:space-x-4 2xl:space-x-5 4xl:space-x-6 bg-white/10 rounded-xl lg:rounded-2xl px-3 py-2 lg:px-4 lg:py-3 xl:px-5 xl:py-4 2xl:px-6 2xl:py-5 4xl:px-8 4xl:py-6">
                  <Wallet className="w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 4xl:w-8 4xl:h-8 text-green-400" />
                  <span className="text-sm lg:text-base xl:text-lg 2xl:text-xl 4xl:text-2xl font-mono">
                    {formatAddress(currentAccount)}
                  </span>
                </div>
                
                {/* Mobile wallet indicator */}
                <div className="sm:hidden w-3 h-3 bg-green-400 rounded-full"></div>
              </Link>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 lg:p-3 xl:p-4 2xl:p-5 4xl:p-6 cursor-pointer hover:bg-red-500/20 rounded-xl lg:rounded-2xl transition-colors text-red-400 hover:text-red-300"
            >
              <LogOut className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 4xl:w-10 4xl:h-10" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;