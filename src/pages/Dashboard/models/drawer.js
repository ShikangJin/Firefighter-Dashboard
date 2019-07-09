export default {
    namespace: 'drawer',

    state: {
        visible: false, 
        childDrawer: false ,
        formDrawer: false,
        curIdx: -1,
    },

    effects: {
        *basicDrawer(payload, { _, put }) {
            yield put({
                type: 'setDrawer',
                payload: { ...payload },
            });
        },

        *infoDrawer(payload, { _, put }) {
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