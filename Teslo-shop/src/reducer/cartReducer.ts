import type { Producto } from "../types/products"

// 1. El item del carrito es UN Producto + la cantidad
export type CartItem = Producto & { quantity: number }

// 2. Acciones (Corregido a 'CartActions' para ser consistentes)
export type CartActions = 
    { type: 'add-to-cart', payload: { item: Producto } } |
    { type: 'remove-from-cart', payload: { id: number } } |
    { type: 'clear-cart' } |
    { type: 'decrease-quantity', payload: { id: Producto['id'] } }

export type CartState = {
    cart: CartItem[]
}

// 3. Persistencia
const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
}

export const initialState : CartState = {
    cart: initialCart()
}

// 4. Reducer corregido
export const cartReducer = (
    state: CartState = initialState,
    action: CartActions
): CartState => {

    if(action.type === 'add-to-cart'){
        const itemExist = state.cart.find(item => item.id === action.payload.item.id)

        let updatedCart: CartItem[] = []

        if(itemExist){

            updatedCart = state.cart.map(p => (
                p.id === action.payload.item.id
                ? {...p, quantity: p.quantity +1}
                : p
            ))  
        }
        else{
            const newItem: CartItem = {...action.payload.item, quantity: 1}
            updatedCart = [...state.cart, newItem]
        }
        return {
            ...state,
            cart: updatedCart
        }
    }

    if(action.type === 'remove-from-cart'){

        return{
            ...state,
            cart : state.cart.filter(p=> p.id !== action.payload.id)
        }
    }

    if(action.type === 'clear-cart'){
        return{
            ...state,
            cart: []
        }
    }
    if (action.type === 'decrease-quantity') {
    const updatedCart = state.cart.map(item => {
        if (item.id === action.payload.id && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 }
        }
        return item
    })
    return { ...state, cart: updatedCart }
}





    return state
}