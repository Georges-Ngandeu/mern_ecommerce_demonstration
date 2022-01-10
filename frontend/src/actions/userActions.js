import axios from 'axios'
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_REQUEST,
    REGISTER_REQUEST_SUCCESS,
    REGISTER_REQUEST_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PROFILE_RESET,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    UPDATE_PASSWORD_RESET,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,

    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants'

export const login = (email, password) => {
    return async(dispatch) => {
        function onSuccess(data){
            dispatch({
                type: LOGIN_SUCCESS,
                payload: data
            })

            return data
        }

        function onError(error){
            dispatch({
                type: LOGIN_FAIL,
                payload: error.response.data.errorMessage
            }) 

            return error
        }

        try {
            dispatch({
                type: LOGIN_REQUEST,
            }) 

            let config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }


            const {data} = await axios.post('/api/v1/login', {email, password, config})

            return onSuccess(data)
        } catch(error) {
            return onError(error)
        }

    }
}

export const register = (userData) => {
    return async(dispatch) => {
        function onSuccess(data){
            dispatch({
                type: REGISTER_REQUEST_SUCCESS,
                payload: data
            })

            return data
        }

        function onError(error){
            dispatch({
                type: REGISTER_REQUEST_FAIL,
                payload: error.response.data.errorMessage
            }) 

            return error
        }

        try {
            dispatch({
                type: REGISTER_REQUEST,
            }) 

            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

            const {data} = await axios.post('/api/v1/register', userData, {config})

            return onSuccess(data)
        } catch(error) {
            return onError(error)
        }

    }
}

export const updateProfile = (userData) => {
    return async(dispatch) => {
        function onSuccess(data){
            dispatch({
                type: UPDATE_PROFILE_SUCCESS,
                payload: data.success
            })

            return data
        }

        function onError(error){
            dispatch({
                type: UPDATE_PROFILE_FAIL,
                payload: error.response.data.errorMessage
            }) 

            return error
        }

        try {
            dispatch({
                type: UPDATE_PROFILE_REQUEST,
            }) 

            let config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

            const {data} = await axios.put('/api/v1/me/update', userData, {config})

            return onSuccess(data)
        } catch(error) {
            return onError(error)
        }

    }
}

export const updatePassword = (passwords) => {
    return async(dispatch) => {
        function onSuccess(data){
            dispatch({
                type: UPDATE_PASSWORD_SUCCESS,
                payload: data.success
            })

            return data
        }

        function onError(error){
            dispatch({
                type: UPDATE_PASSWORD_FAIL,
                payload: error.response.data.errorMessage
            }) 

            return error
        }

        try {
            dispatch({
                type: UPDATE_PASSWORD_REQUEST,
            }) 

            let config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const {data} = await axios.put('/api/v1/password/update', passwords, {config})

            return onSuccess(data)
        } catch(error) {
            return onError(error)
        }

    }
}

export const loadUser = () => {
    return async(dispatch) => {
        function onSuccess(data){
            dispatch({
                type: LOAD_USER_SUCCESS,
                payload: data.user
            })

            return data
        }

        function onError(error){
            dispatch({
                type: LOAD_USER_FAIL,
                payload: error.response.data.errorMessage
            }) 

            return error
        }

        try {
            dispatch({
                type: LOAD_USER_REQUEST,
            }) 

            const {data} = await axios.get('/api/v1/me')

            return onSuccess(data)
        } catch(error) {
            return onError(error)
        }

    }
}

export const logout = () => {
    return async(dispatch) => {
        function onSuccess(data){
            dispatch({
                type: LOGOUT_SUCCESS,
                payload: data.user
            })

            return data
        }

        function onError(error){
            dispatch({
                type: LOGOUT_FAIL,
                payload: error.response.data.errorMessage
            }) 

            return error
        }

        try {

            const {data} = await axios.get('/api/v1/logout')

            return onSuccess(data)
        } catch(error) {
            return onError(error)
        }

    }
}

export const forgotPassword = (email) => {
    return async(dispatch) => {
        function onSuccess(data){
            dispatch({
                type: FORGOT_PASSWORD_SUCCESS,
                payload: data.message
            })

            return data
        }

        function onError(error){
            dispatch({
                type: FORGOT_PASSWORD_FAIL,
                payload: error.response.data.errorMessage
            }) 

            return error
        }

        try {
            dispatch({
                type: FORGOT_PASSWORD_REQUEST,
            }) 

            let config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const {data} = await axios.post('/api/v1/password/forgot', email, {config})

            return onSuccess(data)
        } catch(error) {
            return onError(error)
        }

    }
}

export const resetPassword = (token, passwords) => {
    return async(dispatch) => {
        function onSuccess(data){
            dispatch({
                type: NEW_PASSWORD_SUCCESS,
                payload: data.success
            })

            return data
        }

        function onError(error){
            dispatch({
                type: NEW_PASSWORD_FAIL,
                payload: error.response.data.errorMessage
            }) 

            return error
        }

        try {
            dispatch({
                type: NEW_PASSWORD_REQUEST,
            }) 

            let config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const {data} = await axios.put(`/api/v1/password/reset/${token}`, passwords, {config})

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