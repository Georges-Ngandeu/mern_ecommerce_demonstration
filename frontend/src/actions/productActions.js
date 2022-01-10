import axios from 'axios'
import {
    ALL_PRODUCTS_FAIL,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_REQUEST,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    CLEAR_ERRORS
} from '../constants/productConstants'

export const getProducts = (keyword = '', currentPage, price, category, ratings) => {
    
    return async (dispatch) => {
        function onSuccess(data){
            dispatch({
                type: ALL_PRODUCTS_SUCCESS,
                payload: data
            })

            return data
        }

        function onError(error){
            dispatch({
                type: ALL_PRODUCTS_FAIL,
                payload: error.response.data.errorMessage
            }) 

            return error
        }

        try {
            dispatch({
                type: ALL_PRODUCTS_REQUEST,
            }) 

            let url = ''

            category ? url = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${ratings}&category=${category}` :
                url = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${ratings}`

            const {data} = await axios.get(url)

            return onSuccess(data)
        } catch(error) {
            return onError(error)
        }
        
    }
}

export const getProductDetails = (id) => {
    
    return async (dispatch) => {
        function onSuccess(data){
            dispatch({
                type: PRODUCT_DETAILS_SUCCESS,
                payload: data.result
            })

            return data
        }

        function onError(error){
            dispatch({
                type: PRODUCT_DETAILS_FAIL,
                payload: error.response.data.errorMessage
            })

            return error
        }

        try {
            dispatch({
                type: PRODUCT_DETAILS_REQUEST,
            }) 

            const {data} = await axios.get(`/api/v1/product/${id}`)

            return onSuccess(data)
        } catch(error) {
            return onError(error)
        }
        
    }
}

export const clearErrors = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: CLEAR_ERRORS
        })
    }
}