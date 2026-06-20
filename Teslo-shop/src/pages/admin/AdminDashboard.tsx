// Frontend/src/pages/admin/AdminDashboard.tsx
import { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';

// Datos ficticios de placeholder (luego los reemplazas con datos reales del backend)
const FAKE_STATS = {
  totalUsuarios: 48,
  totalConversaciones: 312,
  mensajesHoy: 27,
  usuariosActivos: 12,
};

const FAKE_USUARIOS = [
  { id: 1, nombre: 'Ana García', correo: 'ana@umg.edu.gt', carrera: 'Ing. Sistemas', chats: 14 },
  { id: 2, nombre: 'Carlos López', correo: 'carlos@umg.edu.gt', carrera: 'Administración', chats: 9 },
  { id: 3, nombre: 'María Sánchez', correo: 'maria@umg.edu.gt', carrera: 'Derecho', chats: 22 },
  { id: 4, nombre: 'Luis Pérez', correo: 'luis@umg.edu.gt', carrera: 'Medicina', chats: 5 },
  { id: 5, nombre: 'Sofía Ruiz', correo: 'sofia@umg.edu.gt', carrera: 'Ing. Civil', chats: 18 },
];

const FAKE_CONVERSACIONES = [
  { id: 1, usuario: 'Ana García', titulo: '¿Cómo resolver integrales?', mensajes: 8, fecha: '2026-05-29' },
  { id: 2, usuario: 'Carlos López', titulo: 'Resumen de administración...', mensajes: 4, fecha: '2026-05-29' },
  { id: 3, usuario: 'María Sánchez', titulo: 'Derecho constitucional G...', mensajes: 12, fecha: '2026-05-28' },
  { id: 4, usuario: 'Luis Pérez', titulo: 'Anatomía del sistema nerv...', mensajes: 6, fecha: '2026-05-28' },
  { id: 5, usuario: 'Sofía Ruiz', titulo: 'Cálculo estructural básico', mensajes: 10, fecha: '2026-05-27' },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden font-sans">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-y-auto p-8">

        {/* SECCIÓN: DASHBOARD */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black text-white">Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Resumen general del sistema AcadBot</p>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard title="Total Usuarios" value={FAKE_STATS.totalUsuarios} icon="👥" color="blue" />
              <StatCard title="Conversaciones" value={FAKE_STATS.totalConversaciones} icon="💬" color="purple" />
              <StatCard title="Mensajes Hoy" value={FAKE_STATS.mensajesHoy} icon="📨" color="green" />
              <StatCard title="Usuarios Activos" value={FAKE_STATS.usuariosActivos} icon="🟢" color="orange" />
            </div>

            {/* Tabla rápida de últimas conversaciones */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 text-gray-100">Últimas Conversaciones</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-800">
                    <th className="pb-3 font-semibold">Usuario</th>
                    <th className="pb-3 font-semibold">Tema</th>
                    <th className="pb-3 font-semibold">Mensajes</th>
                    <th className="pb-3 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {FAKE_CONVERSACIONES.map((c) => (
                    <tr key={c.id} className="text-gray-300 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3">{c.usuario}</td>
                      <td className="py-3 text-gray-400">{c.titulo}</td>
                      <td className="py-3">
                        <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full text-xs font-bold">
                          {c.mensajes}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{c.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN: USUARIOS */}
        {activeSection === 'usuarios' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black text-white">Usuarios</h1>
              <p className="text-gray-400 text-sm mt-1">Lista de todos los estudiantes registrados</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-800/50">
                  <tr className="text-left text-gray-400">
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Nombre</th>
                    <th className="px-6 py-4 font-semibold">Correo</th>
                    <th className="px-6 py-4 font-semibold">Carrera</th>
                    <th className="px-6 py-4 font-semibold">Chats</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {FAKE_USUARIOS.map((u) => (
                    <tr key={u.id} className="text-gray-300 hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 text-gray-500">#{u.id}</td>
                      <td className="px-6 py-4 font-medium">{u.nombre}</td>
                      <td className="px-6 py-4 text-gray-400">{u.correo}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                          {u.carrera}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-green-400 font-bold">{u.chats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN: CONVERSACIONES */}
        {activeSection === 'conversaciones' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black text-white">Conversaciones</h1>
              <p className="text-gray-400 text-sm mt-1">Historial de todos los chats del sistema</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-800/50">
                  <tr className="text-left text-gray-400">
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Usuario</th>
                    <th className="px-6 py-4 font-semibold">Tema</th>
                    <th className="px-6 py-4 font-semibold">Mensajes</th>
                    <th className="px-6 py-4 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {FAKE_CONVERSACIONES.map((c) => (
                    <tr key={c.id} className="text-gray-300 hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 text-gray-500">#{c.id}</td>
                      <td className="px-6 py-4 font-medium">{c.usuario}</td>
                      <td className="px-6 py-4 text-gray-400">{c.titulo}</td>
                      <td className="px-6 py-4">
                        <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full text-xs font-bold">
                          {c.mensajes}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{c.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN: REPORTES (placeholder) */}
        {activeSection === 'reportes' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-black text-white">Reportes</h1>
              <p className="text-gray-400 text-sm mt-1">Análisis y estadísticas del sistema</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4">
              <span className="text-6xl">📈</span>
              <h2 className="text-xl font-bold text-gray-300">Próximamente</h2>
              <p className="text-gray-500 text-sm max-w-xs">
                Aquí se conectarán gráficas y reportes reales cuando implementemos el backend.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}