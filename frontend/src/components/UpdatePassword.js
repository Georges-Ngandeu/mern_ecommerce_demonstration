import React, {Fragment, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useAlert} from 'react-alert'

import Loader from './Loader'
import MetaData from './Metadata'
import {updatePassword, clearErrors} from '../actions/userActions'
import {UPDATE_PASSWORD_RESET} from '../constants/userConstants'

const UpdatePassword = ({history}) => {
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')

    const alert = useAlert()
    const dispatch = useDispatch()

    const {error, isUpdated, loading} = useSelector(state => state.user)

    useEffect(() => {
        if(error){
            alert.error(error)
            return dispatch(clearErrors())
        }

        if(isUpdated){
            alert.success('Password updated successfully!')

            dispatch({
                type: UPDATE_PASSWORD_RESET
            })

            return history.push('/me')
        }
       
    }, [dispatch, alert, error, history, isUpdated])

    const submitHandler = (evt) => {
        evt.preventDefault()

        let formData = new FormData() 
        formData.set('oldPassword', oldPassword)
        formData.set('password', password)
     
        dispatch(updatePassword(formData))
    }
   
    return (
        <div>
            <Fragment>
                {loading ? <Loader /> : (
                    <Fragment>
                        <MetaData title='Update password'/>
                        <div className="row wrapper">
                            <div className="col-10 col-lg-5">
                                <form className="shadow-lg" onSubmit={submitHandler}>
                                    <h1 className="mt-2 mb-5">Update Password</h1>
                                    <div className="form-group">
                                        <label htmlFor="old_password_field">Old Password</label>
                                        <input
                                            type="password"
                                            id="old_password_field"
                                            className="form-control"
                                            name='oldPassword'
                                            value={oldPassword}
                                            onChange={(evt)  => setOldPassword(evt.target.value)} 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="new_password_field">New Password</label>
                                        <input
                                            type="password"
                                            id="new_password_field"
                                            className="form-control"
                                            name='password'
                                            value={password}
                                            onChange={(evt)  => setPassword(evt.target.value)} 
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        className="btn update-btn btn-block mt-4 mb-3"
                                        disabled = {loading ? true : false}
                                    >
                                        Update Password
                                    </button>
                                </form>
                            </div>
                        </div>
                    </Fragment>
                )}
            </Fragment>
        </div>
    )
}

export default UpdatePassword
