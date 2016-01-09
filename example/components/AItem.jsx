import React from "react";
import {connect} from "react-redux";
import Loading from "./Loading.jsx";

function AItem(props) {
    return (
        <div>
            Item
            <Loading isLoaded={!props.isFetching}>
            <p>{JSON.stringify(props.data[props.itemName])}</p>
            </Loading>
        </div>
    );
}

export default connect(state => (state.aItems))(AItem);
