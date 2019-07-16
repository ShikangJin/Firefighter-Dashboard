import { fakeFirefighterData, fakeHistoryData, addNewMember, getInfo } from '@/services/api';
import { combineRealTimeData, getSquadsData, getFilteredData, getFirstMarker, getMemberMap } from '@/utils/dataHandling';

const shapeTags = ['Fire Boundray', 'Emergency Area'];

export default {
    namespace: 'information',

    state: {
        curSquads: [],
        curName: '',
        data: [],
        wholeData: {},
        filteredData: [],
        center: {
            lat: -3.745,
            lng: -38.523
        },
        firstmarker: null,
        curHistoryData: [],
        shapeTags: [],
        realtimeBuffer: {},
    },

    effects: {
        *getHistory(payload, { call, put }) {
            const response = yield call(fakeHistoryData, payload.id);
            yield put({
                type: 'fetchHistory',          
                curHistoryData: response,          
            });
        },

        *getInfo(payload, { call, put }) {
            yield put({
                type: 'setInfo',
                wholeData: payload.wholeData,
                curSquads: payload.curSquads,
                realtime: payload.realtime,
                curName: payload.curName,
            });
        },

        *getData(payload, { call, put }) {
            yield put({
                type: 'setData',
                payload: { ...payload },
            });
        },

        *updateData(payload, { call, put }) {
            const response = yield call(fakeHistoryData, payload.id);
            if (Object.keys(payload.wholeData).length === 0) {
                yield put({
                    type: 'setBuffer',
                    realtime: payload.realtime,
                });
                return;
            }
            yield put({
                type: 'setNewData',
                payload: {
                    wholeData: payload.wholeData,
                    realtime: payload.realtime,
                    curSquads: payload.curSquads,
                    curHistoryData: response,
                    curName: payload.curName,
                    memberMap: payload.memberMap,
                }
            });
        },

        *nameSearch(payload, { _, put }) {
            const { data, name } = payload;
            yield put({
                type: 'setFilter',
                data: data,
                curName: name,
            });
        },
        
        *setInterval(payload, { _, put }) {
            yield put({
                type: 'startInterval',
                intervalId: payload.intervalId,
            });
        },

        *addMember(payload, { call, _ }) {
            yield call(addNewMember, payload);
        },

        *fetchShapeTags(_, { call, put }) {
            yield put({
                type: 'getShapeTags',
            });
        },

        *addShapeTag(payload, { _, put }) {
            yield put({
                type: 'setShapeTag',
                shapeTag: payload.shapeTag, 
            });
        },

        *deleteShapeTag(payload, {_, put }) {
            yield put({
                type: 'removeShapeTag',
                idx: payload.idx,
            });
        },

        *clear(_, { call, put }) {
            yield put({
                type: 'clearData',
            });
        }
    },

    reducers: {

        fetchHistory(state, action) {
            return {
                ...state,
                curHistoryData: action.curHistoryData
            };
        },

        setInfo(state, action) {
            const { wholeData , curSquads, realtime, curName } = action;
            // set member map
            let memberMap = getMemberMap(wholeData);
            // combine realtime data and whole data 
            combineRealTimeData(realtime, memberMap);
            // get current squads data
            let curData = getSquadsData(curSquads, wholeData);
            // get current filtered data
            let filteredData = getFilteredData(curData, curName);
            // set first marker
            let firstmarker = getFirstMarker(filteredData);

            return {
                ...state,
                data: curData,
                wholeData: wholeData,
                filteredData: filteredData,
                firstmarker: firstmarker,
                curSquads: curSquads,
                memberMap: memberMap,
            };
        },

        setBuffer(state, action) {
            return {
                ...state,
                realtimeBuffer: action.realtime,
            }
        },

        setData(state, action) {
            const { wholeData, curSquads, curName } = action.payload;
            // get current squads data
            let curData = getSquadsData(curSquads, wholeData);
            // get filtered data
            let filteredData = getFilteredData(curData, curName);
            // set first marker
            let firstmarker = getFirstMarker(filteredData);

            return {
                ...state,
                data: curData,
                filteredData: filteredData,
                firstmarker: firstmarker,
                curSquads: action.payload.curSquads,
            };
        },

        setNewData(state, action) {
            const { realtime, curSquads, curHistoryData, curName, wholeData, memberMap } = action.payload;
            // combine realtime data with whole data
            combineRealTimeData(realtime, memberMap);
            // get current squad data
            let curData = getSquadsData(curSquads, wholeData);
            // get filtered data
            let filteredData = getFilteredData(curData, curName);

            return {
                ...state,
                wholeData: wholeData,
                data: curData,
                filteredData: filteredData,
                curHistoryData: curHistoryData,
                realtimeBuffer: realtime,
            }
        },

        setFilter(state, action) {
            const { curName, data } = action;
            // get filtered data
            let filteredData = getFilteredData(data, curName);
            return {
                ...state,
                filteredData: filteredData,
                curName: curName,
            }
        },

        getShapeTags(state, action) {
            let processedTags = [];
            shapeTags.forEach((shapeTag, idx) => {
                processedTags.push({
                    idx: idx,
                    shapeTag: shapeTag,
                });
            });
            return {
                ...state,
                shapeTags: processedTags,
            }
        },

        setShapeTag(state, action) {
            shapeTags.push(action.shapeTag);
            let processedTags = [];
            shapeTags.forEach((shapeTag, idx) => {
                processedTags.push({
                    idx: idx,
                    shapeTag: shapeTag,
                });
            });
            return {
                ...state,
                shapeTags: processedTags,
            }
        },

        removeShapeTag(state, action) {
            shapeTags.splice(action.idx, 1);
            let processedTags = [];
            shapeTags.forEach((shapeTag, idx) => {
                processedTags.push({
                    idx: idx,
                    shapeTag: shapeTag,
                });
            });
            return {
                ...state,
                shapeTags: processedTags,
            }
        },

        clearData(state) {
            console.log('clean');
            return {
                ...state,
                curSquads: [],
                curName: '',
                data: [],
                filteredData: [],
                center: {
                    lat: -3.745,
                    lng: -38.523
                },
                firstmarker: null,
                curHistoryData: [],
            }
        }
    },
}