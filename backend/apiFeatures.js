class ApiFeatures {
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
        this.result = {}
    }

    /*
    |------------------------------------------------------------------
    |Algorithmic Thinking
    |------------------------------------------------------------------
    |1) is search keyword define ?
    |   yes: set the search parameter object
    |   no: set search parameter object to an empty object
    |2) run the search query with the search parameter object
    |3) return the result
    */
    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}

        this.result = this.query.find({...keyword})
        return this
    }

    /*
    |------------------------------------------------------------------
    |Algorithmic Thinking
    |------------------------------------------------------------------
    |1) get the search query string object
    |2) remove fields "keyword", "limit" and "page"
    |3) prepare the query parameter object
    |4) run the query with the search parameter object
    |5) return the result
    */
    filter(){
        const queryCopy = {...this.queryStr}
        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach(elt => delete queryCopy[elt])

        //filter for price and rating
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        
        this.result = this.query.find(JSON.parse(queryStr))
        return this
    }

    /*
    |------------------------------------------------------------------
    |Algorithmic Thinking
    |------------------------------------------------------------------
    |1) get the current page
    |2) compute the skip from the current page
    |3) run the query with skip and limit
    |4) return the result
    */
    paginate(resPerPage){
        const currentPage =  Number(this.queryStr.page) || 1
        const skip = resPerPage * (currentPage - 1)

        this.result = this.query.limit(resPerPage).skip(skip)
        return this
    }
}

module.exports = ApiFeatures