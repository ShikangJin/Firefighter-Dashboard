import { fakeFirefighterData, fakeHistoryData } from '@/services/api';

// var prefixDict = {};

export default {
    namespace: 'information',

    state: {
        visible: false, 
        childrenDrawer: false ,
        curIdx: -1,
        data: [],
        filteredData: [],
        center: {
            lat: -3.745,
            lng: -38.523
        },
        showInfo: -1,
        curHistoryData: [],
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
            const response = yield call(fakeHistoryData, payload.curIdx);
            yield put({
                type: 'setDrawer',
                payload: {
                    childrenDrawer: true,
                    curIdx: payload.curIdx,
                    curHistoryData: response,
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
        },

        *setInfoWindow(payload, { _, put }) {
            yield put({
                type: 'setInfo',
                idx: payload.idx,
            });
        },

        *getData(payload, { call, put }) {
            const response = yield call(fakeFirefighterData, payload);
            yield put({
                type: 'setData',
                payload: {
                    response: response,
                    location: response.length > 0 ? {
                        lat: parseFloat(response[0].location.lat),
                        lng: parseFloat(response[0].location.lng)
                    } : {
                        lat: -3.745,
                        lng: -38.523
                    }
                }
            });
        },

        *nameSearch(payload, { _, put }) {
            // TODO: 优化search. fetch data时储存前缀dict
            // search时直接提取结果返回 search O(1) fetch O(M*N)
            let data = payload.data;
            let name = payload.name;
            if (name.length === 0) {
                yield put({
                    type: 'setFilter',
                    filteredData: data,
                });
                return;
            }
            let result = [];
            data.forEach(member => {
                let i = 0;
                while (i < member.name.length && i < name.length) {
                    if (member.name[i] !== name[i]) {
                        break;
                    }
                    i++;
                }
                if (i === name.length) {
                    result.push(member);
                }
            });
            yield put({
                type: 'setFilter',
                filteredData: result,
            });
        },

        *clear(_, { call, put }) {
            yield put({
                type: 'clearData',
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

        setInfo(state, action) {
            return {
                ...state,
                showInfo: action.idx,
            }
        },

        setData(state, action) {
            // TODO: 在这里update前缀dict
            
            return {
                ...state,
                data: action.payload.response,
                filteredData: action.payload.response,
                center: action.payload.location
            };
        },

        setFilter(state, action) {
            return {
                ...state,
                filteredData: action.filteredData,
            }
        },

        clearData() {
            return {
                visible: false, 
                childrenDrawer: false ,
                curIdx: -1,
                data: [],
                filteredData: [],
                center: {
                    lat: -3.745,
                    lng: -38.523
                },
                showInfo: -1,
                curHistoryData: [],
            }
        }
    },
}