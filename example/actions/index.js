import T from "../actions/ACTION_TYPES"
import ROUTES from "../ROUTES"


export function navigate() {
    return {
        type: T.NAVIGATION,
        location: ROUTES.lookup(window.location.hash.substr(1)),
    }
}
