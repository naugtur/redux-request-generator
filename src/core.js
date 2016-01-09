const T = {
    REQUEST_ERROR: "@@request_error",
    REQUEST_START: "@@request_start",
    REQUEST_END: "@@request_end"
}

export {T as actionTypes}

export default function reduxRequest(requestImplementation){

    return function defineRequests(definitions, defaults = {}) {
        let reducers = {}
        let actions = {}
        Object.keys(definitions).forEach(function (key) {
            reducers[key] = createReducerFunction(key, {
                [T.REQUEST_START]: (state) => {
                    return Object.assign({}, state, {
                        isFetching: true
                    })
                },
                [T.REQUEST_END]: (state, {data}) => ({
                        isFetching: false,
                        data: Object.assign({}, state.data, data)
                }),
                [T.REQUEST_ERROR]: (state, {error}) => {
                    return Object.assign({}, state, {
                        isFetching: false,
                        error
                    })
                }
            })

            actions[key] = createFetchAction(key, definitions[key], defaults)
        })

        return {reducers, actions}
    }


    function createReducerFunction(stateKey, reducers) {
        return function (state, action) {
            if (reducers[action.type] && stateKey === action.stateKey) {
                return reducers[action.type](state, action)
            } else {
                return (state || {
                    isFetching: false,
                    data: {}
                })
            }
        }

    }

    function createFetchAction(stateKey, options, defaults) {
        return function fetchAction(...args) {
            return (dispatch, getState) => {
                if (!options.condition || options.condition(getState()[stateKey])) {
                    return dispatch(fetchData(options.requestGenerator(...args), stateKey, options.mapper, args, defaults))
                }
            }
        }
    }



    function fetchData(reqOptions, stateKey, mapper, args, defaults) {
        return function (dispatch) {
            dispatch({
                type: T.REQUEST_START,
                stateKey
            })

            return requestImplementation(reqOptions, defaults, function success(body){
                body = (mapper? mapper(body, ...args) : body)
                return dispatch(receive(body, stateKey))
            }, function failure(error){
                return dispatch(requestError(error, stateKey))
            })
        }
    }

    function receive(data, stateKey) {
        return {
            type: T.REQUEST_END,
            data,
            stateKey,
            fetchedAt: Date.now()
        }
    }

    function requestError(error, stateKey) {
        return {
            type: T.REQUEST_ERROR,
            error,
            stateKey
        }
    }

}
