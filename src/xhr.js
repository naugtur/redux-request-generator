import xhr from "xhr"
import reduxRequest from "./core.js"

export default reduxRequest(function(reqOptions, defaults, success, failure){
    if (typeof reqOptions === "string"){
        reqOptions = {url: reqOptions}
    }
    return xhr(Object.assign({}, defaults, reqOptions), function(error, response){
        if(error){
            error.statusCode = 0;
            failure(error)
        }
        let body = response.body;
        if(response.statusCode !== 200){
            let err = Error(body || "HTTP" + response.statusCode)
            err.statusCode = response.statusCode
            failure(err)
        }
        try{
            body=JSON.parse(body)
        }catch(e){}
        success(body)
    })
})
