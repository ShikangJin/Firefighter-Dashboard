import React, { Suspense } from 'react';
import { Drawer, Button, Card } from 'antd';
import SquadFinder from './SquadFinder';
import { connect } from 'dva';
import { select } from 'd3-selection';
import PageLoading from '@/components/PageLoading';
import { MiniArea, LineChart } from '@/components/Charts';
import  MapComponent  from '@/components/MapComponent';

@connect(({ information }) => ({
    information,
}))
class Map extends React.Component {

    componentDidMount() {
        // var intervalId = setInterval(this.updateData, 5000);
        // this.setState({
        //     intervalId: intervalId,
        // });
    }

    updateData() {
        console.log('update');
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'information/clear',
        });
        // use intervalId from the state to clear the interval
        // clearInterval(this.state.intervalId);
     }

    fetchData(squads) {
        const { dispatch } = this.props;  
        dispatch({
            type: 'information/getData',
            squads: squads, //['Squad1', 'Squad2']
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
        let result = [];
        curHistoryData.forEach(data => {
            let yData;
            switch(type) {
                case 'bodyTemp': yData = data.bodyTemp; break;
                case 'heartBeat': yData = data.heartBeat; break;
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
                              style={{'marginBottom': 10}}
                        >
                            <p>{'Name: ' + (filteredData[curIdx] === undefined ? '' : filteredData[curIdx].name)}</p>
                            <p>{'Age: ' + (filteredData[curIdx] === undefined ? 0 : filteredData[curIdx].age)}</p>
                            <p>{'Body Temperature: ' + (filteredData[curIdx] === undefined ? 0 : filteredData[curIdx].bodyTemp)}</p>
                            <p>{'Heart Beat: ' + (filteredData[curIdx] === undefined ? 0 : filteredData[curIdx].heartBeat)}</p>
                        </Card>
                        <Card hoverable={true}
                              title={'History Body Temperature'}
                              style={{'marginBottom': 10}}
                        >
                            <MiniArea 
                                color="#f2a521" 
                                data={this.parseData('bodyTemp')}
                                scale={{y: {min: 35, max: 39}}}
                            />
                        </Card>
                        <Card hoverable={true}
                              title={'History Heart Beat'}
                        >
                            <LineChart 
                                data={this.parseData('heartBeat')}
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