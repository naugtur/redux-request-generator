var xhr = require("xhr")

const T = {
    REQUEST_ERROR: "@@request_error",
    REQUEST_START: "@@request_start",
    REQUEST_END: "@@request_end"
}

var reducers = {}

var actions = {}

//stateKey: string
//options:
//  requestGenerator: function (...args) => url | Request
//  options: map of options to fetch(,options)
//  mapper: function (data,...args) => data

export default function defineRequest(stateKey, options) {
    reducers[stateKey] = createReducerFunction(stateKey, {
        [T.REQUEST_START]: (state) => {
            return Object.assign({}, state, {
                isFetching: true
            })
        },
        [T.REQUEST_END]: (state, {data}) => ({
            isFetching: false,
            data
        }),
        [T.REQUEST_ERROR]: (state, {error}) => {
            return Object.assign({}, state, {
                error
            })
        }
    })

    actions[stateKey] = createFetchAction(stateKey, options)

}

export {reducers, actions}


function requestError(error, stateKey) {
    return {
        type: T.REQUEST_ERROR,
        error,
        stateKey
    }
}


function receive(data, stateKey, mapper, args) {
    return {
        type: T.REQUEST_END,
        data: (mapper? mapper(data, ...args) : data),
        stateKey: stateKey,
        fetchedAt: Date.now()
    }
}

function createReducerFunction(stateKey, reducers) {
    return function (state, action) {
        if (reducers[action.type] && stateKey === action.stateKey) {
            return reducers[action.type](state, action)
        } else {
            return (state || {
                isFetching: false,
                data: []
            })
        }
    }

}

function createFetchAction(stateKey, options) {
    return function fetchIfNeeded(...args) {
        return (dispatch, getState) => {
            if (!(getState()[stateKey].isFetching)) {
                return dispatch(fetchData(options.requestGenerator(...args), stateKey, options, args))
            }
        }
    }
}



function fetchData(reqOptions, stateKey, options, args) {
    return function (dispatch) {
        dispatch({
            type: T.REQUEST_START,
            stateKey
        })

        return xhr(reqOptions, function(error, response){
            if(error){
                return dispatch(requestError(error, stateKey))
            }
            if(response.statusCode !== 200){
                let error = Error(message)
                error.statusCode = response.statusCode
                return dispatch(requestError(error, stateKey))
            }
            let body = response.body;
            try{
                body=JSON.parse(body)
            }catch(e){}
            dispatch(receive(body, stateKey, options.mapper, args))
        })
    }
}
