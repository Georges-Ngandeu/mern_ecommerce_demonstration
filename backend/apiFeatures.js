class ApiFeatures {
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
        this.result = {}
    }

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

    paginate(resPerPage){
        const currentPage =  Number(this.queryStr.page) || 1
        const skip = resPerPage * (currentPage - 1)

        this.result = this.query.limit(resPerPage).skip(skip)
        return this
    }
}

module.exports = ApiFeatures