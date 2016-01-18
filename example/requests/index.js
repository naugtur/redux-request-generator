
const defineRequests = require('redux-request-generator')


const {actions, reducers} = defineRequests({
    "aList": {
        requestGenerator: () => (`/api/list`)
    },
    "aItems": {
        requestGenerator: (itemName) => (`/api/item/${itemName}`),
        mapper: (data, itemName) => ({ [itemName]: data })
    }
}, {
    "aList": { list:[] },
    "aItems": {}
})

export { actions, reducers }
