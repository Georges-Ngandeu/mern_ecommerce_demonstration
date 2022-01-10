import React, {Fragment, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useAlert} from 'react-alert'

import Loader from './Loader'
import MetaData from './Metadata'
import {resetPassword, clearErrors} from '../actions/userActions'

const NewPassword = ({history, match}) => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const alert = useAlert()
    const dispatch = useDispatch()

    const {error, success, loading} = useSelector(state => state.forgotPassword)

    useEffect(() => {
        if(error){
            alert.error(error)
            return dispatch(clearErrors())
        }

        if(success){
            alert.success('Password updated successfully!')
            return history.push('/login')
        }
       
    }, [dispatch, alert, error, history, success])

    const submitHandler = (evt) => {
        evt.preventDefault()

        let formData = new FormData() 
        formData.set('password', password)
        formData.set('confirmPassword', confirmPassword)
     
        dispatch(resetPassword(match.params.token, formData))
    }
   
    return (
        <div>
            <Fragment>
                {loading ? <Loader /> : (
                    <Fragment>
                        <MetaData title='New password'/>
                        <div className="row wrapper">
                            <div className="col-10 col-lg-5">
                                <form className="shadow-lg" onSubmit={submitHandler}>
                                    <h1 className="mt-2 mb-5">New Password</h1>
                                    <div className="form-group">
                                        <label htmlFor="old_password_field">Password</label>
                                        <input
                                            type="password"
                                            id="old_password_field"
                                            className="form-control"
                                            name='password'
                                            value={password}
                                            onChange={(evt)  => setPassword(evt.target.value)} 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="new_password_field">Confirm Password</label>
                                        <input
                                            type="password"
                                            id="new_password_field"
                                            className="form-control"
                                            name='confirmPassword'
                                            value={confirmPassword}
                                            onChange={(evt)  => setConfirmPassword(evt.target.value)} 
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        className="btn update-btn btn-block mt-4 mb-3"
                                        disabled = {loading ? true : false}
                                    >
                                        Set Password
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

export default NewPassword
