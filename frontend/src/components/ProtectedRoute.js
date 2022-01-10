import React, {Fragment, useEffect, useState} from 'react'
import {Route, Redirect} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'

const ProtectedRoute = ({component: Component, ...rest}) => {

    const {isAuthenticated, user, loading} = useSelector(state => state.auth)

    return (
        <div>
            <Fragment>
                {loading === false && (
                    <Route
                        {...rest}
                        render={props => {
                            if(isAuthenticated === false){
                                return <Redirect to='/login' />                                 
                            }

                            return <Component {...props}/>   
                        }}
                    />
                )}
            </Fragment>
        </div>
    )
}

export default ProtectedRoute
