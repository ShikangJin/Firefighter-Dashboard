import React, { Suspense } from 'react';
import { Drawer, Button, Card } from 'antd';
import SquadFinder from './SquadFinder';
import { connect } from 'dva';
import { select } from 'd3-selection';
import PageLoading from '@/components/PageLoading';
import { MiniArea, LineChart } from '@/components/Charts';
import  MapComponent  from '@/components/MapComponent';
import openSocket from 'socket.io-client';
var socket;

@connect(({ information }) => ({
    information,
}))
class Map extends React.Component {

    componentDidMount() {   
        const { dispatch } = this.props;
        socket = openSocket('http://localhost:3000/',{'forceNew':true })
        window.onbeforeunload = function(event) {
            socket.disconnect(true);
            dispatch({
                type: 'information/clear',
            });
        }
        socket.on('update', function(data) {
            console.log(data);
            const { dispatch, information } = this.props;
            dispatch({
                type: 'information/updateData',
                curIdx: information.curIdx,
                curSquads: information.curSquads,
                curName: information.curName,
                data: data,
            });
        }.bind(this));
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        socket.disconnect(true);
        dispatch({
            type: 'information/clear',
        });
    }

    fetchData(squads) {
        const { dispatch, information } = this.props;  
        dispatch({
            type: 'information/getData',
            squads: squads, //['Squad1', 'Squad2']
            wholeData: information.wholeData,
        });
    }

    showDrawer = () => {
        const { dispatch } = this.props;  
        dispatch({
            type: 'information/openDrawer',
        });
    };
    
    onClose = () => {
        const { dispatch } = this.props;  
        dispatch({
            type: 'information/closeDrawer',
        });
    };

    showChildrenDrawer = (index) => {
        const { dispatch, information } = this.props;  
        dispatch({
            type: 'information/openChildDrawer',
            curIdx: index,
        });
    };
    
    onChildrenDrawerClose = () => {
        const { dispatch } = this.props;  
        dispatch({
            type: 'information/closeChildDrawer',
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

    render() {
        const { information } = this.props;
        const { data, filteredData, curIdx } = information;
        console.log(information);
        console.log(this.parseData('bodyTemp'));
        return (
            <div>                
                <Drawer
                    title="Squad Searching Panel"
                    width={520}
                    closable={false}
                    onClose={this.onClose}
                    visible={information.visible}
                >
                    <SquadFinder nameClick={this.showChildrenDrawer.bind(this)} 
                                data={filteredData}
                                fetchData={this.fetchData.bind(this)}
                                nameSearch={this.nameSearch.bind(this)}
                    />
                    <Drawer
                        title="Member Information"
                        width={320}
                        closable={false}
                        onClose={this.onChildrenDrawerClose}
                        visible={information.childrenDrawer}
                    >
                        <Card hoverable={true}
                              title={'Basic Information'}
                              style={{'marginBottom': 12}}
                        >
                            <p>{'Name: ' + (filteredData[curIdx] === undefined ? '' : filteredData[curIdx].name)}</p>
                            <p>{'Age: ' + (filteredData[curIdx] === undefined ? 0 : filteredData[curIdx].age)}</p>
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
                            <p>{'Current Latitude: ' + (filteredData[curIdx] === undefined ? 0 : filteredData[curIdx].location.lat)}</p>
                            <p>{'Current Longitude: ' + (filteredData[curIdx] === undefined ? 0 : filteredData[curIdx].location.lng)}</p>
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
                </Drawer>
                
                <MapComponent information={information} 
                              showDrawer={this.showDrawer.bind(this)}
                />

            </div>
        );
    }
}

export default Map;