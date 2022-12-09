module.exports = class AppResponse {
    constructor(res, data, statusCode) {
        this.res = res
        this.statusCode = statusCode || 500;
        this.data = data;
        this.status = statusCode >= 400 ? "error" : "success";
        
    }

    send(){
        this.res.status(this.statusCode).json({
            statusCode: this.statusCode,
            data: this.data,
            status: this.status,
        })
    }
}