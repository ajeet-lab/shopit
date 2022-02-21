class ApiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {};
        this.query = this.query.find({
            ...keyword
        });
        return this;
    };
    filter() {
        let queryCopy = {
            ...this.queryStr
        };

        // Removing fields from the queryStr
        let removeFields = ["keyword", "limit", "page"];
        removeFields.forEach(ele => delete queryCopy[ele]);

        // Advance filter price, rating etc.
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    };

    pagination(resPerPage) {
        let currentPage = Number(this.queryStr.page) || 1;
        let skip = resPerPage * (currentPage - 1);
        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }

}

module.exports = ApiFeature;