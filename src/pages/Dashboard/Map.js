/* eslint-disable no-undef */
import React, { Suspense } from 'react';
import { GoogleMap, LoadScript, DrawingManager, DrawingManagerOptions, DrawingControlOptions } from '@react-google-maps/api';
import { Drawer, Button } from 'antd';
import SquadFinder from './SquadFinder';
import { connect } from 'dva';
import { select } from 'd3-selection';

const data = [
    {
        key: '1',
        name: 'John Brown',
        info: {
            name: 'John Brown',
            age: 21,
            bodyTemp: 27.2,
        },
        squad: 'Squad1',
        status: 'good',
        // location: {lat: ... , lon: ...}
    },
    {
        key: '2',
        name: 'Jim Green',
        info: {
            name: 'Jim Green',
            age: 22,
            bodyTemp: 27.4,
        },
        squad: 'Squad2',
        status: 'bad',
    },
    {
        key: '3',
        name: 'Joe Black',
        info: {
            name: 'Joe Black',
            age: 19,
            bodyTemp: 27.1,
        },
        squad: 'Squad3',
        status: 'good',
    },
    
];
const libs = ['drawing'];
var selectedPoly = null;

function selectNewPoly(poly) {
    if (selectedPoly !== null) {
        selectedPoly.setEditable(false);
    }
    poly.setEditable(true);
    selectedPoly = poly;
}

function deletePoly() {
    if (selectedPoly !== null) {
        selectedPoly.setMap(null);
        selectedPoly = null;
    }
}

@connect(({ information }) => ({
    information,
}))
class Map extends React.Component {

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
        const { dispatch } = this.props;  
        dispatch({
            type: 'information/openChildDrawer',
            curInfo: data[index].info,
        });
    };
    
    onChildrenDrawerClose = () => {
        const { dispatch } = this.props;  
        dispatch({
            type: 'information/closeChildDrawer',
        });
    };

    selectNewPoly(poly) {
        if (selectedPoly !== null) {
            selectedPoly.setEditable(false);
        }
        poly.setEditable(true);
        selectedPoly = poly;
    }

    render() {
        const { information } = this.props;
        return (
            <div>                
                <Drawer
                    title="Squad Searching Panel"
                    width={520}
                    closable={false}
                    onClose={this.onClose}
                    visible={information.visible}
                >
                    
                    <SquadFinder nameClick={this.showChildrenDrawer.bind(this)} data={data}/>
                    <Drawer
                        title="Member Information"
                        width={320}
                        closable={false}
                        onClose={this.onChildrenDrawerClose}
                        visible={information.childrenDrawer}
                    >
                        <div>
                            <p>{'Name: ' + information.curInfo.name}</p>
                            <p>{'Age: ' + information.curInfo.age}</p>
                            <p>{'Body Temperature: ' + information.curInfo.bodyTemp}</p>
                        </div>
                    </Drawer>
                    
                </Drawer>
                <Suspense>

                
                <LoadScript
                    id="script-loader"
                    libraries={libs}
                    googleMapsApiKey="AIzaSyDeaidjVKshIVDTt4tGDbMJv1uGYjFipD8"
                >
                    <GoogleMap
                        id='example-map'
                        mapContainerStyle={{
                            height: "80vh",
                            width: "100%"
                        }}
                        zoom={7}
                        center={{
                            lat: -3.745,
                            lng: -38.523
                        }}
                    >
                        <DrawingManager
                            onLoad={drawingManager => {
                            console.log(drawingManager)
                            }}
                            onPolygonComplete={(polygon) => {
                                selectNewPoly(polygon);
                                window.google.maps.event.addListener(polygon, 'click', 
                                    () => selectNewPoly(polygon) 
                                );
                            }}
                            onPolylineComplete={(polygon) => {
                                selectNewPoly(polygon);
                                window.google.maps.event.addListener(polygon, 'click', 
                                    () => selectNewPoly(polygon) 
                                );
                            }}
                            onRectangleComplete={(polygon) => {
                                selectNewPoly(polygon);
                                window.google.maps.event.addListener(polygon, 'click', 
                                    () => selectNewPoly(polygon) 
                                );
                            }}
                            onCircleComplete={(polygon) => {
                                selectNewPoly(polygon);
                                window.google.maps.event.addListener(polygon, 'click', 
                                    () => selectNewPoly(polygon) 
                                );
                            }}
                            options={{
                                drawingControl: true,
                                drawingControlOptions: {
                                    position: 6,
                                },
                            }}
                        /> 
                        <Button type="primary" onClick={this.showDrawer.bind(this)} style={{'width': '150px', 'marginLeft': '50%', 'marginTop': '10px', 'left': '-75px'}}>
                            Searching Panel
                        </Button>
                        <Button onClick={deletePoly}>
                            Delete
                        </Button>
                    </GoogleMap> 
                </LoadScript>
                </Suspense>
            </div>
        );
    }
}

export default Map;