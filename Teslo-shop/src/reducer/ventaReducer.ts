import type { VentaActions, VentaDraftState } from "../types/ventas";

export const initialVentaState: VentaDraftState = { items: [] };

export const ventaReducer = (state: VentaDraftState, action: VentaActions): VentaDraftState => {
    if (action.type === "add-item") {
        const existente = state.items.find((item) => item.id === action.payload.producto.id);

        if (existente) {
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
                ),
            };
        }

        return { ...state, items: [...state.items, { ...action.payload.producto, cantidad: 1 }] };
    }

    if (action.type === "remove-item") {
        return { ...state, items: state.items.filter((item) => item.id !== action.payload.id) };
    }

    if (action.type === "decrease-quantity") {
        return {
            ...state,
            items: state.items.map((item) =>
                item.id === action.payload.id && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item
            ),
        };
    }

    if (action.type === "clear") {
        return initialVentaState;
    }

    return state;
};
