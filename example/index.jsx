import * as promise from "es6-promise";
promise.polyfill();

import React from "react";
import ReactDOM from "react-dom"

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

import * as actions from "./actions";
import reducer from "./reducers";
import App from "./components/App.jsx";

const middleware = [thunk, logger()];
const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
const store = createStoreWithMiddleware(reducer);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("redux-app")
);

// Dispatch navigation events when the URL"s hash changes, and when the
// application loads
function onHashChange() {
    store.dispatch(actions.navigate())
}

window.addEventListener("hashchange", onHashChange, false)

onHashChange()
