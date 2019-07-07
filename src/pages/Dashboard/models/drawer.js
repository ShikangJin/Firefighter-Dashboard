export default {
    namespace: 'drawer',

    state: {
        visible: false, 
        childDrawer: false ,
        formDrawer: false,
        curIdx: -1,
    },

    effects: {
        *firstDrawer(payload, { call, put }) {
            yield put({
                type: 'setDrawer',
                payload: { ...payload },
            });
        },

        *secondDrawer(payload, { call, put }) {
            const { childDrawer, curIdx } = payload;
            if (!childDrawer) {
                yield put({
                    type: 'setDrawer',
                    payload: {
                        childDrawer: childDrawer,
                    },   
                });
                return;
            }
            yield put({
                type: 'setDrawer',
                payload: {
                    childDrawer: childDrawer,
                    curIdx: curIdx,
                },
            });
        },
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