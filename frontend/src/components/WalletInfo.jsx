import React, { useState } from 'react';
import { 
  Copy, 
  Wallet, 
  TrendingUp, 
  Check, 
  Activity,
  Clock,
  ShoppingCart,
  Tag,
  X,
  Zap
} from 'lucide-react';
import ActivityLogs from "./Activity";

const WalletInfo = ({ account, mtkBalance, activityLogs }) => {
  const [copied, setCopied] = useState(false);

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert('Error copiando la dirección');
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 sm:p-6 shadow-xl text-white w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p- mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Mi Wallet</h3>
            <p className="text-gray-400 text-sm">Información de la cuenta</p>
          </div>
        </div>
        
        {/* Balance Section - Mobile First */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20 sm:min-w-[200px]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Balance MTK</p>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {Number(mtkBalance).toFixed(2)} <span className="text-green-400">MTK</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Address Section */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-3">
            <span className="text-sm text-gray-400 font-medium">Dirección de Wallet</span>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center space-x-1 text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg transition-colors w-fit"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <div className="text-sm sm:text-base font-mono text-white break-all bg-black/20 rounded-lg px-3 py-2">
            <span className="sm:hidden">{shortenAddress(account)}</span>
            <span className="hidden sm:inline">{account}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{activityLogs.length}</p>
                <p className="text-xs text-gray-400">Transacciones</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">
                  {activityLogs.filter(log => log.type === 'buy').length}
                </p>
                <p className="text-xs text-gray-400">Compras</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs - Full Width */}
      <div className="mt-6">
      <ActivityLogs activityLogs={activityLogs} />
      </div>
    </div>

  );
};

export default WalletInfo;