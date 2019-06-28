import React, { Suspense } from 'react';
import { Drawer, Button, Card } from 'antd';
import SquadFinder from './SquadFinder';
import { connect } from 'dva';
import { select } from 'd3-selection';
import PageLoading from '@/components/PageLoading';
import { MiniArea, LineChart } from '@/components/Charts';
import  MapComponent  from '@/components/MapComponent';
import AddForm from './AddForm';
import openSocket from 'socket.io-client';
import pic from '@/assets/demoPic.jpg';
var socket;

@connect(({ information }) => ({
    information,
}))
class Map extends React.Component {

    componentDidMount() {   
        const { dispatch } = this.props;
        socket = openSocket('http://localhost:3000/', { 'forceNew': true })
        // don't need to call disconnect when refreshing page since it will auto trigger disconnect
        window.onbeforeunload = dispatch({ type: 'information/clear' });  
        socket.on('update', function(data) {
            console.log(data);
            const { dispatch, information } = this.props;
            console.log(information);
            const { curSquads, curName, curIdx, filteredData } = information;
            dispatch({
                type: 'information/updateData',
                curIdx: curIdx,
                curSquads: curSquads,
                curName: curName,
                data: data,
                id: filteredData[curIdx] ? filteredData[curIdx].id : -1,
            });
        }.bind(this));
        dispatch({
            type: 'information/fetchShapeTags'
        });
        
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        // must call disconnect here to remove callback function at server side 
        socket.disconnect(true);
        dispatch({ type: 'information/clear' });
    }

    fetchData(curSquads) {
        const { dispatch, information } = this.props;  
        dispatch({
            type: 'information/getData',
            curSquads: curSquads,
            wholeData: information.wholeData,
        });
    }

    setDrawer = (status) => {
        const { dispatch } = this.props;  
        dispatch({
            type: 'information/drawer',
            visible: status,
        });
    };

    setFormDrawer = (status) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'information/drawer',
            formDrawer: status,
        });
    };

    openChildDrawer = (index) => {
        const { dispatch, information } = this.props;  
        dispatch({
            type: 'information/childDrawer',
            curIdx: index,
            id: information.filteredData[index].id,
            childDrawer: true,
        });
    };
    
    closeChildDrawer = () => {
        const { dispatch } = this.props;  
        dispatch({
            type: 'information/childDrawer',
            childDrawer: false,
        });
    };

    nameSearch(name) {
        const { information, dispatch } = this.props;
        dispatch({
            type: 'information/nameSearch',
            data: information.data,
            name: name,
        });
    }

    parseData(type) {
        const { information } = this.props;
        const { curHistoryData } = information;
        if (curHistoryData.length === 0) {
            return curHistoryData;
        }
        const result = [];
        curHistoryData.forEach(data => {
            let yData;
            switch(type) {
                case 'bodyTemp': yData = data.bodyTemp; break;
                case 'heartRate': yData = data.heartRate; break;
                default: yData = 0; break;
            }
            result.push({
                x: data.time,
                y: parseFloat(yData),
            });
        })      
        return result;
    }

    addShapeTag(tag) {
        const { dispatch } = this.props;
        dispatch({
            type: 'information/addShapeTag',
            shapeTag: tag,
        });
    }

    deleteShapeTag(idx) {
        console.log(idx);
        if (idx < 0) {
            return;
        }
        const { dispatch } = this.props;
        dispatch({
            type: 'information/deleteShapeTag',
            idx: idx,
        });
    }

    render() {
        const { information } = this.props;
        const { data, filteredData, curIdx, wholeData, firstmarker, shapeTags } = information;
        console.log(information);
        return (
            <div>                
                <Drawer
                    title="Squad Searching Panel"
                    width={520}
                    closable={false}
                    onClose={() => this.setDrawer(false)}
                    visible={information.visible}
                >
                    <SquadFinder nameClick={this.openChildDrawer.bind(this)} 
                                data={filteredData}
                                fetchData={this.fetchData.bind(this)}
                                nameSearch={this.nameSearch.bind(this)}
                                squads={wholeData === undefined ? [] : Object.keys(wholeData)}
                    />
                    <Button type="primary" onClick={() => this.setFormDrawer(true)} style={{'marginTop': 12}}>
                        Add Member
                    </Button>
                    <Drawer
                        title="Member Information"
                        width={320}
                        closable={false}
                        onClose={this.closeChildDrawer}
                        visible={information.childDrawer}
                    >
                        <Card hoverable={true}
                              title={'Basic Information'}
                              style={{'marginBottom': 12}}
                        >
                            <img src={filteredData[curIdx] === undefined ? '' : filteredData[curIdx].image} alt="pic" style={{'width': 160, 'marginLeft': '50%', 'marginBottom': 14, 'left': -80, 'position': 'relative'}}/>
                            <p>{'Name: ' + (filteredData[curIdx] === undefined ? '' : filteredData[curIdx].name)}</p>
                            <p>{'Age: ' + (filteredData[curIdx] === undefined ? 0 : filteredData[curIdx].age)}</p>
                        </Card>
                        
                        <Card hoverable={true}
                              title={'Real-Time Data'}
                              style={{'marginBottom': 12}}>
                            <p>{'Body Temperature: ' + (filteredData[curIdx] === undefined ? 0 : filteredData[curIdx].bodyTemp)}</p>    
                            <p>{'Heart Rate: ' + (filteredData[curIdx] === undefined ? 0 : filteredData[curIdx].heartRate)}</p>
                            <p>{'CO Level: ' + (filteredData[curIdx] === undefined ? '0%' : ((filteredData[curIdx].coLevel * 100).toFixed(2) + '%'))}</p>
                            <p>{'Mission Time: ' + (filteredData[curIdx] === undefined ? '0 min' : filteredData[curIdx].missionTime + (filteredData[curIdx].missionTime <= 1 ? ' min' : ' mins'))}</p>
                            <p>{'Air Quality: ' + (filteredData[curIdx] === undefined ? 0 : filteredData[curIdx].airQuality)}</p>
                        </Card>

                        <Card hoverable={true}
                              title={'GPS'}
                              style={{'marginBottom': 12}}
                        >
                            <p>{'Time: ' + (filteredData[curIdx] === undefined ? '' : (filteredData[curIdx].timestamp) + ' ' + (filteredData[curIdx].timeDetail))}</p>
                            <p>{'Current Latitude: ' + ((filteredData[curIdx] === undefined || filteredData[curIdx].location === undefined) ? 0 : filteredData[curIdx].location.lat)}</p>
                            <p>{'Current Longitude: ' + ((filteredData[curIdx] === undefined || filteredData[curIdx].location === undefined) ? 0 : filteredData[curIdx].location.lng)}</p>
                        </Card>
                        <Card hoverable={true}
                              title={'History Body Temperature'}
                              style={{'marginBottom': 12}}
                        >
                            <MiniArea 
                                color="#f2a521" 
                                data={this.parseData('bodyTemp')}
                                scale={{y: {min: 35, max: 39}}}
                            />
                        </Card>
                        <Card hoverable={true}
                              title={'History Heart Rate'}
                              style={{'marginBottom': 12}}
                        >
                            <LineChart 
                                data={this.parseData('heartRate')}
                                scale={{y: {min: 50, max: 110}}}
                                color='#db3830'
                            />
                        </Card>
                    </Drawer>

                    <Drawer
                        title="Add Member"
                        width={320}
                        closable={false}
                        onClose={() => this.setFormDrawer(false)}
                        visible={information.formDrawer}
                    >
                        <AddForm />
                    </Drawer>
                </Drawer>
                
                <MapComponent information={information} 
                              setDrawer={this.setDrawer.bind(this)}
                              firstmarker={firstmarker}
                              tags={shapeTags}
                              addShapeTag={this.addShapeTag.bind(this)}
                              deleteShapeTag={this.deleteShapeTag.bind(this)}
                />

            </div>
        );
    }
}

export default Map;