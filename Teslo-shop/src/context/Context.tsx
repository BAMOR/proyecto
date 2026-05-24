import React, { createContext, useReducer } from "react";
import { cartReducer, initialState, type CartActions, type CartState } from "../reducer/cartReducer";


interface CartContextProps{
    state: CartState,
    dispatch: React.Dispatch<CartActions>
}

type CartProvider = {
    children: React.ReactNode

}
export const CartContext = createContext<CartContextProps | undefined>(undefined)

export const CartProvider = ({children}:CartProvider) =>{

    const [state,dispatch] = useReducer(cartReducer,initialState)

    return (
        <CartContext.Provider value={{state, dispatch}}>
            {children}
        </CartContext.Provider>
    )

}