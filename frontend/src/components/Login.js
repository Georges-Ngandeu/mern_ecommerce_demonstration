import React, {Fragment, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {useAlert} from 'react-alert'

import Loader from './Loader'
import MetaData from './Metadata'
import {login, clearErrors} from '../actions/userActions'



const Login = ({history}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const alert = useAlert()
    const dispatch = useDispatch()

    const {isAuthenticated, error, loading} = useSelector(state => state.auth)

    useEffect(() => {

        if(isAuthenticated){
            history.push('/')
        }

        if(error){
            alert.error(error)
            return dispatch(clearErrors())
        }
    }, [dispatch, alert, isAuthenticated, error, history])

    const submitHandler = (evt) => {
        evt.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <div>
            <Fragment>
                {loading ? <Loader /> : (
                    <Fragment>
                        <MetaData title={'login'} />

                        <div className="row wrapper"> 
                            <div className="col-10 col-lg-5">
                                <form className="shadow-lg" onSubmit={submitHandler}>
                                    <h1 className="mb-3">Login</h1>
                                    <div className="form-group">
                                        <label htmlFor="email_field">Email</label>
                                        <input
                                            type="email"
                                            id="email_field"
                                            className="form-control"
                                            value={email}
                                            onChange={(evt) => setEmail(evt.target.value) }
                                        />
                                    </div>
                        
                                    <div className="form-group">
                                        <label htmlFor="password_field">Password</label>
                                        <input
                                            type="password"
                                            id="password_field"
                                            className="form-control"
                                            value={password}
                                            onChange={(evt) => setPassword(evt.target.value) }
                                        />
                                    </div>

                                    <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>
                        
                                    <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    >
                                    LOGIN
                                    </button>

                                    <Link to="/register" className="float-right mt-3">New User?</Link>
                                </form>
                            </div>
                        </div>
                    </Fragment>
                )}
            </Fragment>
        </div>
    )
}

export default Login
