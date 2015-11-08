import reduxRequest from "./core.js"


export default reduxRequest(function(reqOptions, defaults, success, failure){
    return fetch(reqOptions, defaults)
        .then(function(response){
                if(response.status !== 200){
                    return response.text().then(function(message){
                        var error = Error(message)
                        error.status = response.status
                        throw error
                    })
                }
                return response
            })
        .then(response => response.json())
        .then(success)
        .catch(failure)
})
