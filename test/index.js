import reduxRequestGenerator, {actionTypes as T} from '../src/core'
import sinon from 'sinon'

var defined
var sandbox
var fetchStub
var requestGeneratorStub

const KEY = 'akey'
const RESPONSE = 'aresponse'

beforeEach(() => {
    sandbox = sinon.sandbox.create()
    fetchStub = sandbox.stub()
    requestGeneratorStub = sandbox.stub()
    const reduxRequest = reduxRequestGenerator(fetchStub)

    defined = reduxRequest({
        [KEY]: {
            requestGenerator: requestGeneratorStub
        }
    })
})

afterEach(() => {
    sandbox.restore()
})

describe('redux request', () => {

    it('returns reducers and actions', () => {
        Object.keys(defined).sort().should.eql(['actions', 'reducers'])
        defined.reducers.should.have.property(KEY)
        defined.actions.should.have.property(KEY)
    })

    describe('reducers', () => {

        describe('reducer for start action', () => {

            it('handles the request start action', () => {
                const state = defined.reducers[KEY]({}, {
                    type: T.REQUEST_START,
                    stateKey: KEY
                })
                state.isFetching.should.be.true
            })

            it('produces a new state object instead of mutating the old one', () => {
                const initialState = {
                    isFetching: false
                }
                const state = defined.reducers[KEY](initialState, {
                    type: T.REQUEST_START,
                    stateKey: KEY
                })
                state.should.not.be.exactly(initialState)
                state.isFetching.should.be.true()
                initialState.isFetching.should.be.false()
            })

            it('preserves data', () => {
                const state = defined.reducers[KEY]({
                    data: 1
                }, {
                    type: T.REQUEST_START,
                    stateKey: KEY
                })
                state.should.have.property('data')
            })
        })
        describe('reducer for end action', () => {

            it('handles the request end action', () => {
                const state = defined.reducers[KEY]({
                    isFetching: true
                }, {
                    type: T.REQUEST_END,
                    stateKey: KEY,
                    data: {
                        result1: 1
                    }
                })
                state.isFetching.should.be.false()
                state.data.should.have.property('result1')
            })

            it('preserves other data fields', () => {
                const state = defined.reducers[KEY]({
                    data: {
                        otherstuff: 1
                    },
                    isFetching: true
                }, {
                    type: T.REQUEST_END,
                    stateKey: KEY,
                    data: {
                        result1: 1
                    }
                })
                state.data.should.have.property('otherstuff')
                state.data.should.have.property('result1')
            })

            it('produces a new state object instead of mutating the old one', () => {
                const initialState = {
                    isFetching: true
                }
                const state = defined.reducers[KEY](initialState, {
                    type: T.REQUEST_END,
                    stateKey: KEY
                })
                state.should.not.be.exactly(initialState)
                state.isFetching.should.be.false()
                initialState.isFetching.should.be.true()
            })

            it('removes old errors / cleans up state', () => {
                const state = defined.reducers[KEY]({
                    error: Error('oh no'),
                    spam: 1,
                    isFetching: true
                }, {
                    type: T.REQUEST_END,
                    stateKey: KEY,
                    data: {
                        result1: 1
                    }
                })
                state.data.should.not.have.property('error')
                state.data.should.not.have.property('spam')
            })
        })

        describe('reducer for error action', () => {

            it('handles the request error action', () => {
                const state = defined.reducers[KEY]({
                    isFetching: true
                }, {
                    type: T.REQUEST_ERROR,
                    stateKey: KEY,
                    error: Error('oh no')
                })
                state.isFetching.should.be.false()
                state.should.have.property('error')
                state.error.message.should.eql('oh no')
            })

            it('produces a new state object instead of mutating the old one', () => {
                const initialState = {
                    isFetching: true
                }
                const state = defined.reducers[KEY](initialState, {
                    type: T.REQUEST_ERROR,
                    stateKey: KEY
                })
                state.should.not.be.exactly(initialState)
                state.isFetching.should.be.false()
                initialState.isFetching.should.be.true()
            })

            it('should preserve the data', () => {
                const state = defined.reducers[KEY]({
                    isFetching: true,
                    data: {
                        otherstuff: 1
                    }
                }, {
                    type: T.REQUEST_ERROR,
                    stateKey: KEY,
                    error: Error('oh no')
                })
                state.data.should.have.property('otherstuff')
            })

        })
    })
    describe('action creator', () => {
        var dispatch
        var getState
        beforeEach(() => {
            dispatch = sandbox.stub()
            dispatch.onFirstCall().callsArgWith(0, dispatch)

            getState = sandbox.stub().returns({
                [KEY]: 1
            })
        })
        it('should dispatch start action', () => {

            const actionThunk = defined.actions[KEY]()
            actionThunk(dispatch, getState)

            dispatch.callCount.should.eql(2)
            dispatch.secondCall.calledWith({
                type: T.REQUEST_START,
                stateKey: KEY
            }).should.be.true()
        })

        it('should call requestGenerator', () => {
            const arg = Symbol()
            const actionThunk = defined.actions[KEY](arg)
            actionThunk(dispatch, getState)

            requestGeneratorStub.callCount.should.eql(1)
            requestGeneratorStub.calledWith(arg).should.be.true()
        })

        it('should dispatch end action', () => {
            const exampleData = {example:1}
            fetchStub.callsArgWith(2,exampleData)

            const actionThunk = defined.actions[KEY]()
            actionThunk(dispatch, getState)

            dispatch.callCount.should.eql(3)
            dispatch.thirdCall.calledWithMatch({
                type: T.REQUEST_END,
                stateKey: KEY,
                data: exampleData
            }).should.be.true()

        })

        it('should call mapper if defined', () => {
            const mapperResult = 'maper returns this'
            const mapperStub = sandbox.stub().returns(mapperResult)
            const exampleData = {example:1}
            fetchStub.callsArgWith(2,exampleData)
            const reduxRequest = reduxRequestGenerator(fetchStub)
            defined = reduxRequest({
                [KEY]: {
                    requestGenerator: requestGeneratorStub,
                    mapper: mapperStub
                }
            })
            const arg = Symbol()
            const actionThunk = defined.actions[KEY](arg)
            actionThunk(dispatch, getState)

            mapperStub.callCount.should.eql(1)
            mapperStub.calledWith(exampleData, arg).should.be.true()

            dispatch.thirdCall.calledWithMatch({
                type: T.REQUEST_END,
                stateKey: KEY,
                data: mapperResult
            }).should.be.true()
        })

        it('should dispatch error action', () => {
            const exampleData = Error('oh no')
            fetchStub.callsArgWith(3,exampleData)

            const actionThunk = defined.actions[KEY]()
            actionThunk(dispatch, getState)

            dispatch.callCount.should.eql(3)
            dispatch.thirdCall.calledWithMatch({
                type: T.REQUEST_ERROR,
                stateKey: KEY,
                error: exampleData
            }).should.be.true()

        })
    })
})
