import React, {Fragment, useEffect, useState} from 'react'

import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {useAlert} from 'react-alert'

import Loader from './Loader'
import MetaData from './Metadata'
import {updateProfile, loadUser, clearErrors} from '../actions/userActions'
import {UPDATE_PROFILE_RESET} from '../constants/userConstants'


const UpdateProfile = ({history}) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.png')

    const alert = useAlert()
    const dispatch = useDispatch()

    const {user} = useSelector(state => state.auth)
    const {error, isUpdated, loading} = useSelector(state => state.user)

    useEffect(() => {
        if(user){
            setName(user.name)
            setEmail(user.email)
            setAvatarPreview(user.avatar.url)
        }

        if(error){
            alert.error(error)
            return dispatch(clearErrors())
        }

        if(isUpdated){
            alert.success('User updated successfully!')
            dispatch(loadUser())

            dispatch({
                type: UPDATE_PROFILE_RESET
            })

            return history.push('/me')
        }
    }, [dispatch, alert, error, history, isUpdated])

    const submitHandler = (evt) => {
        evt.preventDefault()

        let formData = new FormData() 
        formData.set('name', name)
        formData.set('email', email)
        formData.set('avatar', avatar)
     
        dispatch(updateProfile(formData))
    }

    const onChange = (evt) => {
        const reader = new FileReader()

        reader.onload = () => {
            if(reader.readyState === 2){
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(evt.target.files[0])
    }

    return (
        <div>
            <Fragment>
                {loading ? <Loader /> : (
                    <Fragment>
                        <MetaData title = 'Update profile'/>
                        <div className="row wrapper">
                            <div className="col-10 col-lg-5">
                                <form className="shadow-lg" encType='multipart/form-data' onSubmit={submitHandler}>
                                    <h1 className="mt-2 mb-5">Update Profile</h1>

                                    <div className="form-group">
                                        <label htmlFor="email_field">Name</label>
                                        <input 
                                            type="name" 
                                            id="name_field" 
                                            className="form-control"
                                            name='name'
                                            value={name}
                                            onChange={(evt)  => setName(evt.target.value)} 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email_field">Email</label>
                                        <input
                                            type="email"
                                            id="email_field"
                                            className="form-control"
                                            name='email'
                                            value={email}
                                            onChange={(evt)  => setEmail(evt.target.value)} 
                                        />
                                    </div>

                                    <div className='form-group'>
                                        <label for='avatar_upload'>Avatar</label>
                                        <div className='d-flex align-items-center'>
                                            <div>
                                                <figure className='avatar mr-3 item-rtl'>
                                                    <img
                                                        src={avatarPreview}
                                                        className='rounded-circle'
                                                        alt='Avatar Preview'
                                                    />
                                                </figure>
                                            </div>
                                            <div className='custom-file'>
                                                <input
                                                    type='file'
                                                    name='avatar'
                                                    className='custom-file-input'
                                                    id='customFile'
                                                    accepts='images/*'
                                                    onChange={onChange}
                                                />
                                                <label className='custom-file-label' htmlFor='customFile'>
                                                    Choose Avatar
                                            </label>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn update-btn btn-block mt-4 mb-3"
                                        disabled = {loading ? true : false}
                                    >
                                        Update
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

export default UpdateProfile
