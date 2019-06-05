export default {
    namespace: 'information',

    state: {
        visible: false, 
        childrenDrawer: false ,
        curInfo: {},
    },

    effects: {
        *openDrawer(_, { call, put }) {
            // const response = yield call(queryTags);
            yield put({
                type: 'setDrawer',
                payload: {
                    visible: true,
                },
            });
        },

        *closeDrawer(_, { call, put }) {
            // const response = yield call(queryTags);
            yield put({
                type: 'setDrawer',
                payload: {
                    visible: false,
                },
            });
        },

        *openChildDrawer(payload, { call, put }) {
            yield put({
                type: 'setDrawer',
                payload: {
                    childrenDrawer: true,
                    curInfo: payload.curInfo,
                },
            });
        },

        *closeChildDrawer(_, { call, put }) {
            yield put({
                type: 'setDrawer',
                payload: {
                    childrenDrawer: false,
                }   
            });
        }
    },

    reducers: {
        setDrawer(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
}