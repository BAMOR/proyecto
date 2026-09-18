import { motion } from "framer-motion";
import type { ComponentType, SVGProps } from "react";

type Color = "blue" | "green" | "purple" | "orange";

const COLOR_STYLES: Record<Color, string> = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-400",
    green: "from-green-500/20 to-green-600/5 border-green-500/20 text-green-400",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400",
    orange: "from-orange-500/20 to-orange-600/5 border-orange-500/20 text-orange-400",
};

interface StatCardProps {
    label: string;
    value: string | number;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    color?: Color;
    index?: number;
}

export const StatCard = ({ label, value, icon: Icon, color = "blue", index = 0 }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.05 }}
        whileHover={{ y: -3 }}
        className={`bg-gradient-to-br ${COLOR_STYLES[color]} border rounded-2xl p-5 flex flex-col gap-2`}
    >
        <Icon className="h-7 w-7" />
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-white text-2xl font-black">{value}</p>
    </motion.div>
);
