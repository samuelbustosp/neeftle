import React from 'react';

const LogDisplay = ({ logs }) => (
  <div className="bg-gray-800 rounded-lg p-4">
    <h3 className="text-lg font-semibold text-white mb-2">Logs de Actividad</h3>
    <ul className="space-y-1 max-h-60 overflow-y-auto">
      {logs.slice(0, 50).map((log, index) => (
        <li 
          key={index} 
          className={`text-sm ${
            log.type === 'success' ? 'text-green-400' : 
            log.type === 'error' ? 'text-red-400' : 
            log.type === 'warning' ? 'text-yellow-400' : 
            'text-gray-300'
          }`}
        >
          {log.message}
        </li>
      ))}
    </ul>
  </div>
);

export default LogDisplay;