import axios from 'axios'
import {
    ADD_TO_CART,
    REMOVE_TO_CART,
} from '../constants/cartConstants'

export const addItemToCart = (id, quantity) => {
    return async (dispatch, getState) => {
        try {
            
            let url = `/api/v1/product/${id}`
            
            const {data} = await axios.get(url)
            
            dispatch({
                type: ADD_TO_CART,
                payload: {
                    product: data.result._id,
                    name: data.result.name,
                    price: data.result.price,
                    image: data.result.images[0].url,
                    stock: data.result.stock,
                    quantity
                }
            }) 

            localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

            return
        } catch(error) {
            return console.log(error)
        }
        
    }
}

export const removeItemToCart = (id) => {
    return async (dispatch, getState) => {
        try {
            
            let url = `/api/v1/product/${id}`
            
            const {data} = await axios.get(url)
            
            dispatch({
                type: REMOVE_TO_CART,
                payload: id
            }) 

            localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

            return
        } catch(error) {
            return console.log(error)
        }
        
    }
}