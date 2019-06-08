import React from 'react';
import { Button } from 'antd';
import { GoogleMap, LoadScript, DrawingManager, Marker, InfoWindow } from '@react-google-maps/api';

const libs = ['drawing'];
const fillColor = '#ba2727';
var selectedPoly = null;

function selectNewPoly(poly) {
    if (selectedPoly !== null) {
        selectedPoly.setEditable(false);
        selectedPoly.setDraggable(false);
    }
    poly.setEditable(true);
    poly.setDraggable(true);
    selectedPoly = poly;
}

function deletePoly() {
    if (selectedPoly !== null) {
        selectedPoly.setMap(null);
        selectedPoly = null;
    }
}

export default class MapComponent extends React.Component {

    state = {
        showInfo: -1,
    }
    
    loadMarkers(information) {
        const { filteredData } = information;
        console.log(filteredData);
        let markerArr = [];
        if (filteredData.length == 0) {
            return markerArr;
        }
        filteredData.forEach((member, index) => {
            markerArr.push(
                <Marker
                    key={index}
                    onLoad={marker => {
                        console.log('marker: ', marker)
                    }}
                    title={member.name}
                    name={member.name}
                    position={{
                        lat: parseFloat(member.location.lat),
                        lng: parseFloat(member.location.lng)
                    }}
                    onClick={() => this.setState({
                        showInfo: index,
                    })}
                >
                    {this.state.showInfo === index && 
                        <InfoWindow 
                            onCloseClick={() => this.setState({
                                showInfo: -1,
                            })}
                            position={{
                                lat: parseFloat(member.location.lat),
                                lng: parseFloat(member.location.lng)
                            }}
                            options={{
                                pixelOffset: {height: -50}
                            }}
                            onPositionChanged={ () => 
                                console.log('unmount')
                            }
                        >
                            <div>
                                {member.name} Information
                            </div>
                        </InfoWindow>
                   }
                </Marker>
            );
        });
        return markerArr;
    }

    render() {
        const { information } = this.props;
        return (
            <LoadScript
                id="script-loader"
                libraries={libs}
                // googleMapsApiKey="Your Key"
            >
                <GoogleMap
                    id='example-map'
                    mapContainerStyle={{
                        height: "80vh",
                        width: "100%"
                    }}
                    zoom={15}
                    center={information.center}
                    clickableIcons={false}
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
                            circleOptions: {
                                fillColor: fillColor,
                                strokeColor: fillColor,
                            },
                            rectangleOptions: {
                                fillColor: fillColor,
                                strokeColor: fillColor,
                            },
                            polygonOptions: {
                                fillColor: fillColor,
                                strokeColor: fillColor,
                            },
                            polylineOptions: {
                                strokeColor: fillColor,
                            }
                        }}
                    /> 
                    <Button type="primary" onClick={this.props.showDrawer} style={{'width': '150px', 'marginLeft': '50%', 'marginTop': '10px', 'left': '-75px'}}>
                        Searching Panel
                    </Button>
                    <Button onClick={deletePoly}>
                        Delete
                    </Button>
                    {this.loadMarkers(information)}
                </GoogleMap> 
            </LoadScript>
        );
    }
}

