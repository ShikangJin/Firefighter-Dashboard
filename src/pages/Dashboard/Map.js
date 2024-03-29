import React, { Suspense } from 'react';
import { Drawer, Button } from 'antd';
import { connect } from 'dva';
import openSocket from 'socket.io-client';
import  MapComponent from '@/components/MapComponent';
import DetailCards from '@/components/DetailCards';
import AddMemberForm from '@/components/AddMemberForm';
import EngineFinder from './EngineFinder';

var socket;
var testSocket;

// const DetailCards =  React.lazy(() => import('@/components/DetailCards'));

@connect(({ information, drawer }) => ({
    information, 
    drawer,
}))
class Map extends React.Component {

    componentDidMount() {   
        const { dispatch } = this.props;
       
        // don't need to call disconnect when refreshing page since it will auto trigger disconnect
        window.onbeforeunload = () => {
            testSocket.close();
            dispatch({ type: 'information/clear' });
        }    
       
        this.initGCPPipeline();
        // this.initAWSPipeline();
        
        dispatch({
            type: 'information/fetchShapeTags'
        });        
    }

    initGCPPipeline() {
        socket = openSocket('http://localhost:3000/', { 'forceNew': true })
        socket.on('update', data => this.handleRealtimeData.bind(this)(data)); 
        socket.on('infoUpdate', data => this.handleBasicInfo.bind(this)(data));
    }

    initAWSPipeline() {
        // wss://ang6ru9hxa.execute-api.us-east-1.amazonaws.com/test
        testSocket = new WebSocket('ws://10.250.21.73:8005/ws');
        testSocket.onopen = () => console.log('open');
        testSocket.onerror = () => console.log('error');
        testSocket.onmessage = function(e) {
            console.log(e);
            console.log(e.data);
            let jsonData = JSON.parse(JSON.parse(e.data));
            console.log(jsonData);
            if (jsonData.Type === 'Profile') {
                let parsedJson = this.parseAWSData(jsonData.Data);
                this.handleBasicInfo.bind(this)(parsedJson);
            }
           
            else if (jsonData.Type === 'RealTime') 
                // this.handleRealtimeData.bind(this)(jsonData.data)
                console.log(jsonData.Data);
        }.bind(this)
        testSocket.onclose = () => console.log('close');
        // this.fetchProfile();
    }

    parseAWSData(data) {
        let resultData = {};
        data.forEach(engine => {
            let key = Object.keys(engine)[0];
            let originArr = [...engine[key]];
            engine[key] = {};
            originArr.forEach(member => {
                let memberKey = Object.keys(member)[0];
                engine[key][memberKey] = member[memberKey];
            });
            resultData[key] = engine[key];
        });
        console.log(resultData);
        return resultData;
    }

    fetchProfile() {
        const { dispatch, information } = this.props;
        const { curName, curSquads, realtimeBuffer } = information;
        dispatch({
            type: 'information/fetchInfo',
            curSquads: curSquads,
            realtime: realtimeBuffer,
            curName: curName,
        });
    }

    /**
     * Socket Callback Functions
     */
    handleRealtimeData(data) {    
        console.log(data);
        const { dispatch, information, drawer } = this.props;
        const { curSquads, curName, filteredData, wholeData, memberMap } = information;
        const { curIdx } = drawer; 
        dispatch({
            type: 'information/updateData',
            curIdx: curIdx,
            curSquads: curSquads,
            curName: curName,
            realtime: data,
            wholeData: wholeData,
            id: filteredData[curIdx] ? filteredData[curIdx].id : -1,
            memberMap: memberMap,
        });  
    }

    handleBasicInfo(data) {   
        console.log(data);
        const { dispatch, information } = this.props;
        const { curName, curSquads, realtimeBuffer } = information;
        dispatch({
            type: 'information/getInfo',
            wholeData: data,
            curSquads: curSquads,
            realtime: realtimeBuffer,
            curName: curName,
        });
    }

    /**
     * Drawer Control Functions
     */
    setDrawer = (status) => {
        const { dispatch } = this.props;  
        dispatch({
            type: 'drawer/basicDrawer',
            visible: status,
        });
    };

    setFormDrawer = (status) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'drawer/basicDrawer',
            formDrawer: status,
        });
    };

    openChildDrawer = (index) => {
        // clearInterval(this._interval);
        const { dispatch, information } = this.props;  
        dispatch({
            type: 'drawer/infoDrawer',
            curIdx: index,
            childDrawer: true,
        });
        dispatch({
            type: 'information/getHistory',
            id: information.filteredData[index].id,
        })
        // let interval = setInterval(() => dispatch({
        //     type: 'information/getHistory',
        //     id: information.filteredData[index].id,
        // }), 10000);
        // this._interval = interval;
    };

    closeChildDrawer = () => {
        const { dispatch } = this.props;  
        dispatch({
            type: 'drawer/infoDrawer',
            childDrawer: false,
        });
        clearInterval(this._interval);
    };

    handleClickEngine = (engine) => {
        const { dispatch, information } = this.props;  
        const { curSquads, wholeData, curName } = information;
        let newSquads = [...curSquads];
        let containIdx = newSquads.indexOf(engine);
        if (containIdx > -1) 
            newSquads.splice(containIdx, 1);
        else 
            newSquads.unshift(engine);
        dispatch({
            type: 'information/getData',
            curSquads: newSquads,
            wholeData: wholeData,
            curName: curName,
        });      
    }   

    /**
     *  Data Handling Functions
     */
    fetchData(curSquads) {
        const { dispatch, information } = this.props;
        const { wholeData, curName } = information  
        dispatch({
            type: 'information/getData',
            curSquads: curSquads,
            wholeData: wholeData,
            curName: curName,
        });
    }

    nameSearch(name) {
        const { information, dispatch } = this.props;
        dispatch({
            type: 'information/nameSearch',
            data: information.data,
            name: name,
        });
    }

    addShapeTag(tag) {
        const { dispatch } = this.props;
        dispatch({
            type: 'information/addShapeTag',
            shapeTag: tag,
        });
    }

    deleteShapeTag(idx) {
        if (idx < 0) return;
        const { dispatch } = this.props;
        dispatch({
            type: 'information/deleteShapeTag',
            idx: idx,
        });
    }

    addMember(values, imageUrl) {
        const { dispatch } = this.props;
        dispatch({
            type: 'information/addMember',
            name: values.name,
            age: values.age,
            squad: values.squad,
            pic: imageUrl,
        });
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        // must call disconnect here to remove callback function at server side 
        if (socket) socket.disconnect(true);
        if (testSocket) testSocket.close();
        dispatch({ type: 'information/clear' });
    }

    render() {
        const { information, drawer } = this.props;
        const { data, filteredData, wholeData, firstmarker, shapeTags, curHistoryData, center, curSquads } = information;
        const { visible, childDrawer, curIdx, formDrawer } = drawer;
        console.log(information);
        return (
            <React.Fragment>    
                <Drawer
                    title="Members Table"
                    width={520}
                    closable={false}
                    onClose={() => this.setDrawer(false)}
                    visible={visible}
                >
                    <EngineFinder 
                        nameClick={this.openChildDrawer.bind(this)} 
                        data={filteredData}
                        // fetchData={this.fetchData.bind(this)}
                        nameSearch={this.nameSearch.bind(this)}
                        squads={wholeData === undefined ? [] : Object.keys(wholeData)}
                    />

                    {/* <Button 
                        type="primary" 
                        onClick={() => this.setFormDrawer(true)} 
                        style={{'marginTop': 12}}> 
                        Add Member
                    </Button> */}

                    <Drawer
                        title="Member Information"
                        width={320}
                        closable={false}
                        onClose={this.closeChildDrawer}
                        visible={childDrawer}
                    >          
                        
                        <DetailCards data={filteredData[curIdx]} historyData={curHistoryData}/>
                               
                    </Drawer>      
                </Drawer>
                
                <Drawer
                        title="Add Member"
                        width={320}
                        closable={false}
                        onClose={() => this.setFormDrawer(false)}
                        visible={formDrawer}
                    >
                    <AddMemberForm addMember={this.addMember.bind(this)}/>
                </Drawer>

                <MapComponent 
                    filteredData={filteredData} 
                    wholeData={wholeData}
                    center={center}
                    setDrawer={this.setDrawer.bind(this)}
                    firstmarker={firstmarker}
                    tags={shapeTags}
                    addShapeTag={this.addShapeTag.bind(this)}
                    deleteShapeTag={this.deleteShapeTag.bind(this)}
                    handleClickEngine={this.handleClickEngine.bind(this)}
                    handleClickAdd={this.setFormDrawer.bind(this)}
                    curSquads={curSquads}
                />

            </React.Fragment>
        );
    }
}

export default Map;