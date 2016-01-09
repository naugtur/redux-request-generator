import React, {PropTypes} from "react"

const Loading = ({isLoaded,children}) =>
    (isLoaded? children : <div className="loading">Loading...</div>)


Loading.propTypes = {
    isLoaded: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired
}

export default Loading
