import React from "react"
import {connect} from "react-redux";
import { actions as fetchActions } from "../requests"
import AList from "./AList.jsx";
import AItem from "./AItem.jsx";

//This component includes asynchronously dispatching actions for fetching data for the screen matching route
function App(props) {
    switch (props.location.name) {
    case "root" :
        asyncCall(props.dispatch,fetchActions.aList)
        return <AList/>
    case "aItem" :
        asyncCall(props.dispatch,fetchActions.aItems, props.location.options.app)
        return <AItem itemName={props.location.options.itemName}/>
    default :
        return <div>Not implemented</div>
    }
}

function asyncCall(dispatch, action, ...args){
    setTimeout(function(){
        dispatch(action(...args))
    },0)
}

export default connect(state => ({
    location: state.navigation.location || {}
}))(App);
