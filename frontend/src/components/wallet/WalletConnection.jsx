import { useState, useEffect } from 'react';
import { Wallet, Sparkles, Zap, Shield, ChevronRight, Bird } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WalletConnection = ({ 
  isConnected, 
  currentAccount, 
  mtkBalance, 
  onConnect, 
  onAddNetwork 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  // Redirect to marketplace immediately when connected
  useEffect(() => {
    if (isConnected) {
      navigate('/marketplace');
    }
  }, [isConnected, navigate]);

  const handleConnect = async () => {
    setIsConnecting(true);
    await onConnect();
    setIsConnecting(false);
  };

  const handleAddNetwork = async () => {
    await onAddNetwork();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-20 left-1/2 sm:top-40 w-40 h-40 sm:w-80 sm:h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 hidden sm:block">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Logo and Brand */}
        <div className="text-center justify-center flex items-center gap-4 mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl  shadow-2xl relative">
            <Bird className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div className=''>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Neeftle
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">El futuro de los NFTs</p>
          </div>
          
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          
          {/* Connection Interface */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
              Conecta tu Wallet
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Descubre, colecciona y comercia NFTs únicos en el marketplace más innovador
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              </div>
              <span className="text-xs sm:text-sm">Transacciones 100% seguras</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              </div>
              <span className="text-xs sm:text-sm">Cero comisiones en gas</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              </div>
              <span className="text-xs sm:text-sm">NFTs exclusivos y raros</span>
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`w-full cursor-pointer font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 sm:space-x-3 group relative overflow-hidden text-sm sm:text-base ${
              isConnecting 
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
            }`}
          >
            {/* Button shine effect */}
            {!isConnecting && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
            
            {isConnecting ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Conectar con MetaMask</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Add Network Button */}
          <button
            onClick={handleAddNetwork}
            className="w-full cursor-pointer mt-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm"
          >
            Añadir Red Hardhat
          </button>

          {/* Alternative options */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">¿No tienes MetaMask?</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <a 
                href="https://metamask.io/download/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-colors border border-white/10 text-xs sm:text-sm text-center"
              >
                Descargar
              </a>
              <button 
                onClick={() => alert('Sección de ayuda en desarrollo')}
                className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-colors border border-white/10 text-xs sm:text-sm"
              >
                Ayuda
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 px-4">
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
            Al conectar aceptas nuestros{' '}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                alert('Términos de servicio en desarrollo');
              }}
              className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
            >
              Términos de Servicio
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;