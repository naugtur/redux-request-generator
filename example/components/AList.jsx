import React, { PropTypes } from "react";
import Link from "./Link.jsx";
import {connect} from "react-redux";
import Loading from "./Loading.jsx";

function AList(props){
    console.log(props.data)
    return (
        <div>
        List
            <Loading isLoaded={!props.isFetching}>
                <ul>
                    {(!props.data.list)? "is empty" : props.data.list.map(function (itemName) {
                        return <li key={itemName}>
                            <Link name="aItem" options={{item: itemName}}>
                                {itemName}
                            </Link>
                        </li>
                    })}
                </ul>
            </Loading>
        </div>
    );
}

AList.propTypes = {
    data: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(state => (state.aList))(AList);
