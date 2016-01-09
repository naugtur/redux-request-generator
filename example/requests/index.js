
const defineRequests = require('redux-request')


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
