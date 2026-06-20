// Frontend/src/components/admin/AdminSidebar.tsx
import { use } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'usuarios', label: 'Usuarios', icon: '👥' },
  { id: 'conversaciones', label: 'Conversaciones', icon: '💬' },
  { id: 'reportes', label: 'Reportes', icon: '📈' },
];

export default function AdminSidebar({ activeSection, onSectionChange }: Props) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-gray-900 border-r border-gray-800/50 p-5 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Logo */}
        <div className="font-black text-xl bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2 px-2">
          <span>🛡️</span> Admin Panel
        </div>

        {/* Badge de admin */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-2 text-xs text-purple-300 font-semibold text-center">
          Panel de Administración
        </div>

        {/* Menú */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                activeSection === item.id
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer del sidebar */}
      <div className="border-t border-gray-800 pt-4 space-y-2">
        <p className="text-sm font-semibold text-gray-200 px-2">{user?.nombre}</p>
        <p className="text-xs text-purple-400 px-2 font-bold uppercase tracking-wider">Administrador</p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-xl text-xs font-semibold transition-all mt-2"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}