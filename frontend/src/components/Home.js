import React, {Fragment, useEffect, useState} from 'react'
import Product from './Product'
import Loader from './Loader'
import Pagination from 'react-js-pagination'

import MetaData from './Metadata'

import {useDispatch, useSelector} from 'react-redux'
import {getProducts, clearErrors} from '../actions/productActions'

import {useAlert} from 'react-alert'

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const {createSliderWithTooltip} = Slider
const Range = createSliderWithTooltip(Slider.Range)

const Home = ({match}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([1, 1000])
    const [category, setCategory] = useState('')
    const [ratings, setRatings] = useState(0)

    const categoryies= [
        "Electronics",
        "Headphones",
        "Accessories",
        "Cameras",
        "Laptops",
        "Food"
    ]

    const {loading, products, productCount, resPerPage, error, filteredProductCount } = useSelector(state => state.products)

    const keyword = match.params.keyword

    const alert = useAlert()
    const dispatch = useDispatch()
    
    useEffect(() => {
        
        if(error){
            alert.error(error)
            return dispatch(clearErrors())

        }
        
        dispatch(getProducts(keyword, currentPage, price, category, ratings))

    }, [dispatch, alert, error, currentPage, price, keyword, category, ratings])

    function setCurrentPageNo(pageNumber){
        setCurrentPage(pageNumber)
    }

    let count = 0
    keyword ? count = filteredProductCount : count = productCount
   
    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Buy best products online'} />
                    <h1 id="products_heading">Latest Products</h1>
        
                    <section id="products" className="container mt-5">
                        <div className="row">
                            {keyword ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div  className="px-5">
                                            <Range
                                                marks={{
                                                    1: `s1`,
                                                    1000: `$1000`
                                                }}
                                                min={1}
                                                max={1000}
                                                defaultValue={[1, 1000]}
                                                tipFormatter={value => `$${value}`}
                                                tipProps={{
                                                    placement : "top",
                                                    visible : true
                                                }}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                            
                                            />

                                            <hr className="my-5"/> 

                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Categories
                                                </h4> 

                                                <ul className="pl-0">
                                                    {categoryies.map(category => (
                                                        <li style={{
                                                            cursor: 'pointer',
                                                            listStyleType: 'none',
                                                            }}
                                                            key={category}
                                                            onClick = {() => setCategory(category)}
                                                        >
                                                          {category}      
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div> 

                                            <hr className="my-3"/> 

                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Ratings
                                                </h4> 

                                                <ul className="pl-0">
                                                    {[5, 4, 3, 2, 1].map(star => (
                                                        <li style={{
                                                            cursor: 'pointer',
                                                            listStyleType: 'none',
                                                            }}
                                                            key={star}
                                                            onClick = {() => setRatings(star)}
                                                        >
                                                            <div className="rating-outer">
                                                                <div className="rating-inner"
                                                                    style={{
                                                                        width: `${star * 20}%`
                                                                    }} 
                                                                >
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div> 
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            { products && products.map(product => (
                                                <Product key = {product._id} product={product} col={4}/>
                                            ))}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                products && products.map(product => (
                                        <Product key = {product._id} product={product} col={3}/>
                                    ))
                            )}

                            
                        </div>
                    </section>

                    <div className="d-flex justify-content-center mt-5">
                        {resPerPage <= count && (
                              <Pagination 
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productCount ? productCount : 0}
                                pageRangeDisplayed={3}     
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                           />
                        )}
                      
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Home