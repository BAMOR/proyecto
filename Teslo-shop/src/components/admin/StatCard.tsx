// Frontend/src/components/admin/StatCard.tsx

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string; // clases de tailwind ej: "blue", "green"
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  const colors: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400",
    green: "from-green-500/20 to-green-600/10 border-green-500/20 text-green-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400",
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-6 flex items-center gap-4`}>
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-white text-3xl font-black">{value}</p>
      </div>
    </div>
  );
}