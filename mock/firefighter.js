import moment from 'moment';

var id = 0;
const squadsData = [null, null, null, null, null, null, null, null, null, null];

squadsData.forEach((_, idx) => {
    if (squadsData[idx] === null) {
        squadsData[idx] = [];
    }
    let squadData = squadsData[idx];
    for (let i = 0; i < 3; i++) {
        squadData.push({
            id: id,
            name: 'Member' + id,
            age: 20 + Math.floor(Math.random() * 20),
            bodyTemp: (36 + Math.random() * 2).toFixed(1),
            squad: 'Squad' + idx,
            status: Math.random() < 0.2 ? 'bad' : 'good',
            location: {
                lat: (-3.745 + Math.random() * 0.01).toFixed(3),
                lng: (-38.523 + Math.random() * 0.01).toFixed(3),
            },
            heartBeat: Math.floor(60 + Math.random() * 40),
        });
        id++;
    }
});

function getData(req, res) {
    let returnData = [];
    if (req.query.squads === '') {
        return res.json(returnData);
    }
    const squads = req.query.squads.split(' ');
    squads.forEach(squad => {
        returnData = returnData.concat(squadsData[parseInt(squad[5])]);  
    });
    return res.json(returnData);
    // console.log(squads); // { squads: squads1 }
    // return req;
}

function getHistoryData(req, res) {
    let returnData = [];
    const beginDay = new Date().getTime();
    for (let i = 0; i < 10; i += 1) {
        returnData.push({
            id: req.query.id,
            time: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
            bodyTemp: (36 + Math.random() * 2).toFixed(1),
            heartBeat: Math.floor(60 + Math.random() * 40),
        });
    }
    return res.json(returnData);
}

export default {
    'GET /firefighter/data': getData,
    'GET /firefighter/history': getHistoryData,
};