import LogDisplay from './LogDisplay';
import Navbar from './Navbar'; // Tu componente de navegación
import { Outlet } from 'react-router-dom';

const PrivateLayout = ({ currentAccount, onLogout, logs }) => {
  return (
    <div className="bg-[#1e1e1e] text-white min-h-screen">
      <Navbar currentAccount={currentAccount} onLogout={onLogout} />
      <main >
        <Outlet />
      </main>
      <LogDisplay logs={logs} />
    </div>
  );
};

export default PrivateLayout;
