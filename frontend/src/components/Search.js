import React, {useState} from 'react'
import { useHistory } from 'react-router-dom'

const Search = () => {

    const history = useHistory()

    const [keyword, setKeyword] = useState('')

    const searchHandler = (evt) => {
        evt.preventDefault()
        
        if(keyword.trim()){
            history.push(`/search/${keyword}`)
        }else {
            history.push(`/`)
        }

    }

    return (
        <form onSubmit={searchHandler}>
            <div className="input-group">
                <input
                    type="text"
                    id="search_field"
                    className="form-control"
                    placeholder="Enter Product Name ..."
                    onChange={(evt) => setKeyword(evt.target.value)} 
                />
                <div className="input-group-append">
                    <button id="search_btn" className="btn">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </form>
    )
}

export default Search