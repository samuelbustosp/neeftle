import React from 'react';
import { 
  Activity, 
  Clock, 
  ShoppingCart, 
  Tag, 
  X, 
  Zap,
  Plus,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';

const ActivityLogs = ({ activityLogs }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'buy':
        return <ShoppingCart className="w-4 h-4 text-green-400" />;
      case 'list':
        return <Tag className="w-4 h-4 text-blue-400" />;
      case 'cancel':
        return <X className="w-4 h-4 text-red-400" />;
      case 'mint':
        return <Plus className="w-4 h-4 text-purple-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'buy':
        return 'border-green-500/20 bg-green-500/5';
      case 'list':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'cancel':
        return 'border-red-500/20 bg-red-500/5';
      case 'mint':
        return 'border-purple-500/20 bg-purple-500/5';
      default:
        return 'border-gray-500/20 bg-gray-500/5';
    }
  };

      const getActivityText = (log) => {
    switch (log.type) {
      case 'buy':
        return (
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm sm:text-base">Compra realizada</p>
            <p className="text-gray-400 text-xs sm:text-sm truncate">
              NFT #{log.tokenId} por {log.price} MTK
            </p>
          </div>
        );
      case 'list':
        return (
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm sm:text-base">NFT listado</p>
            <p className="text-gray-400 text-xs sm:text-sm truncate">
              NFT #{log.tokenId} por {log.price} MTK
            </p>
          </div>
        );
      case 'cancel':
        return (
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm sm:text-base">Listado cancelado</p>
            <p className="text-gray-400 text-xs sm:text-sm truncate">
              NFT #{log.tokenId}
            </p>
          </div>
        );
      case 'mint':
        return (
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm sm:text-base">NFT minteado</p>
            <p className="text-gray-400 text-xs sm:text-sm truncate">
              '{log.name}'
            </p>
          </div>
        );
      default:
        return (
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm sm:text-base">Actividad</p>
            <p className="text-gray-400 text-xs sm:text-sm">Acción realizada</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-white/10 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Actividad Reciente</h3>
            <p className="text-gray-400 text-sm">
              {activityLogs.length} {activityLogs.length === 1 ? 'transacción' : 'transacciones'}
            </p>
          </div>
        </div>
        
        {/* Filter buttons - could be added later */}
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-400">
            Últimas 24 horas
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar">
        {activityLogs.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm sm:text-base">Sin actividad reciente</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2">
              Tus transacciones aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {activityLogs.map((log, i) => (
              <div
                key={log.id || i}
                className={`flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-4 rounded-xl border ${getActivityColor(log.type)} hover:bg-white/5 transition-all duration-300 hover:scale-[1.02]`}
              >
                {/* Activity Icon */}
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  {getActivityIcon(log.type)}
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  {getActivityText(log)}
                </div>

                {/* Timestamp */}
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">
                      {new Date(log.timestamp).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(log.timestamp).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ActivityLogs;