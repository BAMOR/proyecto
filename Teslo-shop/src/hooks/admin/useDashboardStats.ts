import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/api";
import type { Stats } from "../../types/dashboard";

export const useDashboardStats = () =>
    useQuery({
        queryKey: ["admin", "stats"],
        queryFn: async () => {
            const { data } = await api.get<{ success: boolean; stats: Stats }>("/dashboard/stats");
            return data.stats;
        },
    });
