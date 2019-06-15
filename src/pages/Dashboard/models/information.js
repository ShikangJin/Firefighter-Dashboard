import { fakeFirefighterData, fakeHistoryData } from '@/services/api';

// var prefixDict = {};

export default {
    namespace: 'information',

    state: {
        visible: false, 
        childrenDrawer: false ,
        curIdx: -1,
        curSquads: [],
        curName: '',
        data: [],
        wholeData: [],
        filteredData: [],
        center: {
            lat: -3.745,
            lng: -38.523
        },
        showInfo: -1,
        curHistoryData: [],
        intervalId: null,
        socket: null,
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
            const response = yield call(fakeHistoryData, payload);
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
            // const response = yield call(fakeFirefighterData, payload);
            yield put({
                type: 'setData',
                payload: {
                    wholeData: payload.wholeData,
                    curSquads: payload.squads,
                }
            });
        },

        *updateData(payload, { call, put }) {
            // const response1 = yield call(fakeFirefighterData, payload);
            const response2 = yield call(fakeHistoryData, payload);
            console.log(payload);
            yield put({
                type: 'setNewData',
                payload: {
                    wholeData: payload.data,
                    // response: response1,
                    curSquads: payload.curSquads,
                    curHistoryData: response2,
                    curName: payload.curName,
                    socket: payload.socket,
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
                    curName: name,
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
                curName: name,
            });
        },
        
        *setInterval(payload, { _, put }) {
            yield put({
                type: 'startInterval',
                intervalId: payload.intervalId,
            });
        },

        // *setSocket(payload, { _, put }) {
        //     yield put({
        //         type: 'socket',
        //         socket: payload.socket,
        //     });
        // },

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
            const { wholeData, curSquads } = action.payload;
            let curData = [];
            curSquads.forEach(squad => {
                if (squad === undefined) return;
                console.log(parseInt(squad[5]));
                curData.push(...wholeData[parseInt(squad[5])]);
            });
            console.log(curData);
            return {
                ...state,
                data: curData,
                filteredData: curData,
                center: curData.length > 0 ? {
                    lat: parseFloat(curData[0].location.lat),
                    lng: parseFloat(curData[0].location.lng)
                } : {
                    lat: -3.745,
                    lng: -38.523
                },
                curSquads: action.payload.curSquads,
            };
        },

        setNewData(state, action) {
            const { wholeData, curSquads, curHistoryData, curName, socket } = action.payload;
            console.log(curSquads);
            let curData = [];
            curSquads.forEach(squad => {
                if (squad === undefined) return;
                console.log(parseInt(squad[5]));
                curData.push(...wholeData[parseInt(squad[5])]);
            });
            if (curName.length === 0) {
                return {
                    ...state,
                    wholeData: wholeData,
                    data: curData,
                    filteredData: curData,
                    curHistoryData: curHistoryData,
                }
            }
            let result = [];
            curData.forEach(member => {
                let i = 0;
                while (i < member.name.length && i < curName.length) {
                    if (member.name[i] !== curName[i]) {
                        break;
                    }
                    i++;
                }
                if (i === curName.length) {
                    result.push(member);
                }
            });
            return {
                ...state,
                wholeData: wholeData,
                data: curData,
                filteredData: result,
                curHistoryData: curHistoryData,
            }
        },

        // socket(state, action) {
        //     return {
        //         ...state,
        //         socket: action.socket,
        //     }
        // },

        setFilter(state, action) {
            return {
                ...state,
                filteredData: action.filteredData,
                curName: action.curName,
            }
        },

        startInterval(state, action) {
            return {
                ...state,
                intervalId: action.intervalId,
            }
        },

        clearData() {
            return {
                visible: false, 
                childrenDrawer: false ,
                curIdx: -1,
                curSquads: [],
                curName: '',
                data: [],
                // wholeData: [],
                filteredData: [],
                center: {
                    lat: -3.745,
                    lng: -38.523
                },
                showInfo: -1,
                curHistoryData: [],
                intervalId: null,
            }
        }
    },
}