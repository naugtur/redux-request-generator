# redux-request

One function that creates actions and reducers for your http requests.

## Usage
```js
const {actions, reducers} = defineRequests(definitions, defaults)

//use in your app
combineReducers({
    ...reducers
});
```

`definitions` is a map from state keys to request definitions:
```js
definition:= {
    requestGenerator: (args) => (url or Request object),
    mapper: (data) => (data)
}
```

`redux-thunk` middleware is required for actions creator to work

## Example

1. Define requests available to your app.
```js
const {actions, reducers} = defineRequests({
    books: {
        requestGenerator: (author) => (`/api/books/by/${author}`),
        mapper: (data, author) => ({[author]: data.results})
    }
}, defaults)
```
2. Add thunk middleware and combine defined reducers with your other reducers.
```js
const createStoreWithMiddleware = applyMiddleware([thunk])(createStore)
const reducer = combineReducers({
    myField: myReducer,
    ...reducers
})
const store = createStoreWithMiddleware(reducer)
```
3. To fetch data dispatch just one action and both your helper functions will be given the arguments passed to the action.
```js
store.dispatch(actions.books("JRRTolkien"))
```

4. Use the key (`books`) in a component. Show loading indicator while `isFetching` is true. `state.books` will contain:
 - `isFetching` - set to true while the request is waiting for response
 - `error` - error object if there was an error fetching data `{statusCode, messages}`
 - `data` - whatever `mapper` returned after the response came in.
