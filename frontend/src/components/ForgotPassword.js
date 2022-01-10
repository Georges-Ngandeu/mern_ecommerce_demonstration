import React, {Fragment, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useAlert} from 'react-alert'

import Loader from './Loader'
import MetaData from './Metadata'
import {forgotPassword, clearErrors} from '../actions/userActions'

const ForgotPassword = ({history}) => {
    const [email, setEmail] = useState('')

    const alert = useAlert()
    const dispatch = useDispatch()

    const {error, message, loading} = useSelector(state => state.forgotPassword)

    useEffect(() => {
        if(error){
            alert.error(error)
            return dispatch(clearErrors())
        }

        if(message){
            alert.success(message)
        }
       
    }, [dispatch, alert, error, message])

    const submitHandler = (evt) => {
        evt.preventDefault()

        let formData = new FormData() 
        formData.set('email', email)
     
        dispatch(forgotPassword(formData))
    }
   
    return (
        <div>
            <Fragment>
                {loading ? <Loader /> : (
                    <Fragment>
                        <MetaData title='Forgot password'/>
                        <div className="row wrapper">
                            <div className="col-10 col-lg-5">
                                <form className="shadow-lg" onSubmit={submitHandler}>
                                    <h1 className="mt-2 mb-5">Forgot Password</h1>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            id="email_field"
                                            className="form-control"
                                            name='email'
                                            value={email}
                                            onChange={(evt)  => setEmail(evt.target.value)} 
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

export default ForgotPassword
