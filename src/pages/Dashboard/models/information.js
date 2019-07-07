import { fakeFirefighterData, fakeHistoryData, addNewMember } from '@/services/api';

// var prefixDict = {};

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
    },

    effects: {

        *getHistory(payload, { call, put }) {
            const response = yield call(fakeHistoryData, payload.id);
            yield put({
                type: 'fetchHistory',          
                curHistoryData: response,          
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
            console.log(payload);
            yield put({
                type: 'setNewData',
                payload: {
                    wholeData: payload.data,
                    curSquads: payload.curSquads,
                    curHistoryData: response,
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

        setData(state, action) {
            // TODO: 在这里update前缀dict
            const { wholeData, curSquads } = action.payload;
            let curData = [];
            curSquads.forEach(squad => {
                if (squad === undefined) return;
                Object.keys(wholeData[squad]).forEach(id => {
                    curData.push(wholeData[squad][id]);
                });
            });
            console.log(curData);
            let firstmarker = null;
            curData.some(data => {
                if (data.location !== undefined) {
                    firstmarker = data;
                    return true;
                }
            });
            return {
                ...state,
                data: curData,
                filteredData: curData,
                firstmarker: firstmarker,
                curSquads: action.payload.curSquads,
            };
        },

        setNewData(state, action) {
            const { wholeData, curSquads, curHistoryData, curName, socket } = action.payload;
            let curData = [];
            curSquads.forEach(squad => {
                if (squad === undefined) return;
                Object.keys(wholeData[squad]).forEach(id => {
                    curData.push(wholeData[squad][id]);
                });
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

        setFilter(state, action) {
            return {
                ...state,
                filteredData: action.filteredData,
                curName: action.curName,
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