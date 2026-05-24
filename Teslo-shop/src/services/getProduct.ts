

import { api } from "../api/api"
import type { ProductosResponse} from "../types/products"


export const getProduct = async () : Promise<ProductosResponse> => {


const {data} = await api.get<ProductosResponse>("/productos")


return data

}