function combineRealTimeData(realtime, memberMap) {
    Object.keys(realtime).forEach(id => {
        console.log(realtime);
        if (realtime[id] !== null) {
            Object.keys(realtime[id]).forEach(realtimeData => {
                if (realtimeData !== 'squad') {
                    memberMap[id][realtimeData] = realtime[id][realtimeData];
                }
            })
        }      
    })
}

function getSquadsData(curSquads, wholeData) {
    let curData = [];
    curSquads.forEach(squad => {
        if (squad === undefined) return;
        Object.keys(wholeData[squad]).forEach(id => {
            curData.push(wholeData[squad][id]);
        });
    });
    return curData;
}

function getFilteredData(curData, curName) {
    let filteredData = [];
    curData.forEach(member => {
        if (member.name.includes(curName)) {
            filteredData.push(member);
        }
    });
    return filteredData;
}

function getFirstMarker(filteredData) {
    let firstmarker = null;
    filteredData.some(data => {
        if (data.location !== undefined && (data.location.lat != 0 && data.location.lng != 0)) {
            firstmarker = data.location;
            return true;
        }
    });
    return firstmarker;
}

function getMemberMap(wholeData) {
    let memberMap = {};
    Object.keys(wholeData).forEach(squad => {
        Object.keys(wholeData[squad]).forEach(member => {
            memberMap[member] = wholeData[squad][member];
        })
    });
    return memberMap;
}

export {
    combineRealTimeData,
    getSquadsData,
    getFilteredData,
    getFirstMarker,
    getMemberMap
}