import React, {PropTypes} from "react"
import ROUTES from "../ROUTES"

const Link = ({name, options, children, ...props}) =>
    <a href={'#' + ROUTES.generate(name, options)} {...props}>{children}</a>

Link.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.object,
    children: PropTypes.node.isRequired
}

export default Link
