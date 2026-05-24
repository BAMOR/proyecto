import { Link } from 'react-router'
import { useCart } from '../hooks/useCart'

export const CartPage = () => {
    const { state, dispatch } = useCart()

    // Calculamos el total usando 'precio' (convertido a número)
    const total = state.cart.reduce((sum, item) => sum + (Number(item.precio) * item.quantity), 0)

    if (state.cart.length === 0) {
        return (
            <main className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 text-5xl">🛒</div>
                <h1 className="text-3xl font-black text-gray-900">Tu carrito está vacío</h1>
                <p className="text-gray-500 mt-2 mb-8 text-lg">Parece que aún no has añadido tecnología a tu colección.</p>
                <Link to="/" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Ir a la tienda
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-gray-900 mb-10">Tu Carrito</h1>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Lista de productos */}
                <div className="lg:col-span-2 space-y-6">
                    {state.cart.map(item => (
                        <div key={item.id} className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                            <img 
                                src={item.imagen_url || 'https://via.placeholder.com/150'} 
                                alt={item.nombre} 
                                className="w-32 h-32 object-cover rounded-2xl" 
                            />
                            
                            <div className="flex-1 text-center sm:text-left">
                                <span className="text-xs font-mono text-gray-400">{item.sku}</span>
                                <h3 className="font-bold text-gray-900 text-xl mb-1">{item.nombre}</h3>
                                <p className="text-blue-600 font-black text-2xl">Q{Number(item.precio).toFixed(2)}</p>
                                
                                <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                                        <button 
                                            className="px-4 py-2 hover:bg-gray-200 transition-colors font-bold text-gray-600"
                                            onClick={() => dispatch({ type: "decrease-quantity", payload: { id: item.id } })}
                                        >-</button>
                                        <span className="px-4 font-black text-gray-900 w-12 text-center">{item.quantity}</span>
                                        <button 
                                            className="px-4 py-2 hover:bg-gray-200 transition-colors font-bold text-gray-600"
                                            onClick={() => dispatch({ type: "add-to-cart", payload: { item } })}
                                        >+</button>
                                    </div>
                                    <button 
                                        className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors underline underline-offset-4"
                                        onClick={() => dispatch({ type: 'remove-from-cart', payload: { id: item.id } })}
                                    >Eliminar</button>
                                </div>
                            </div>
                            
                            <div className="text-right hidden md:block">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Subtotal</p>
                                <p className="text-2xl font-black text-gray-900">Q{(Number(item.precio) * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resumen de Compra */}
                <aside className="lg:col-span-1">
                    <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 sticky top-24 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-8">Resumen</h2>
                        <div className="space-y-5 border-b border-gray-700 pb-8 mb-8">
                            <div className="flex justify-between text-gray-400 text-lg">
                                <span>Subtotal</span>
                                <span className="text-white font-medium">Q{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-lg">
                                <span>Envío</span>
                                <span className="text-green-400 font-bold italic underline">Gratis</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end mb-10">
                            <span className="text-gray-400">Total</span>
                            <span className="text-4xl font-black text-white">Q{total.toFixed(2)}</span>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xl transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-600/20">
                            Pagar Ahora
                        </button>
                        <p className="text-center mt-6 text-gray-500 text-xs">
                            Pagos seguros procesados por TechStore Guatemala
                        </p>
                    </div>
                </aside>
            </div>
        </main>
    );
}