import React from 'react';
import { Drawer, Button } from 'antd';
import { connect } from 'dva';
import openSocket from 'socket.io-client';
import  MapComponent from '@/components/MapComponent';
import DetailCards from '@/components/DetailCards';
import AddMemberForm from '@/components/AddMemberForm';
import EngineFinder from './EngineFinder';

var socket;

@connect(({ information, drawer }) => ({
    information, 
    drawer,
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
        const { dispatch, information } = this.props;  
        dispatch({
            type: 'drawer/infoDrawer',
            curIdx: index,
            childDrawer: true,
        });
        dispatch({
            type: 'information/getHistory',
            id: information.filteredData[index].id,
        });
    };

    closeChildDrawer = () => {
        const { dispatch } = this.props;  
        dispatch({
            type: 'drawer/infoDrawer',
            childDrawer: false,
        });
    };


    /**
     *  Data Handling Functions
     */
    fetchData(curSquads) {
        const { dispatch, information } = this.props;  
        dispatch({
            type: 'information/getData',
            curSquads: curSquads,
            wholeData: information.wholeData,
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
        socket.disconnect(true);
        dispatch({ type: 'information/clear' });
    }

    render() {
        const { information, drawer } = this.props;
        const { data, filteredData, wholeData, firstmarker, shapeTags, curHistoryData, center } = information;
        const { visible, childDrawer, curIdx, formDrawer } = drawer;
        console.log(information);
        return (
            <React.Fragment>    
                <Drawer
                    title="Engines Searching Panel"
                    width={520}
                    closable={false}
                    onClose={() => this.setDrawer(false)}
                    visible={visible}
                >
                    <EngineFinder 
                        nameClick={this.openChildDrawer.bind(this)} 
                        data={filteredData}
                        fetchData={this.fetchData.bind(this)}
                        nameSearch={this.nameSearch.bind(this)}
                        squads={wholeData === undefined ? [] : Object.keys(wholeData)}
                    />

                    <Button 
                        type="primary" 
                        onClick={() => this.setFormDrawer(true)} 
                        style={{'marginTop': 12}}> 
                        Add Member
                    </Button>

                    <Drawer
                        title="Member Information"
                        width={320}
                        closable={false}
                        onClose={this.closeChildDrawer}
                        visible={childDrawer}
                    >            
                        <DetailCards data={filteredData[curIdx]} historyData={curHistoryData}/>  
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
                </Drawer>
                
                <MapComponent 
                    filteredData={filteredData} 
                    center={center}
                    setDrawer={this.setDrawer.bind(this)}
                    firstmarker={firstmarker}
                    tags={shapeTags}
                    addShapeTag={this.addShapeTag.bind(this)}
                    deleteShapeTag={this.deleteShapeTag.bind(this)}
                />

            </React.Fragment>
        );
    }
}

export default Map;