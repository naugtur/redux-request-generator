# redux-request-generator

*This is not yet released. API or the way it integrates into redux might change. Feedback welcome.*

One function that creates actions and reducers for your http requests.

**Browser support**

By default `fetch` is used, so it has to be there (or shimmed)

If you're considering shimming fetch, use `require('redux-request-generator/xhr')` instead. It uses xhr for making http requests.

No support for IE8 or IE9, but you should be able to get it to work.

## Usage
```js
const defineRequests = require('redux-request-generator')
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
    condition: (state) => (boolean), //optional
    mapper: (data) => (data) //optional
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
    myField: myCustomReducer,
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
 - `data` - response or whatever `mapper` returned after the response came in. *Must be an object*
