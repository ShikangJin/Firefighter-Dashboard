import React from 'react';
import { Popover, Input, Button, Tag, Card, Icon } from 'antd';
import { GoogleMap, LoadScript, DrawingManager, Marker, InfoWindow, OverlayView, Rectangle } from '@react-google-maps/api';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import Pic from '@/assets/demoPic.jpg';
import mapAuth from '@/assets/mapKey.json';

const libs = ['drawing'];
const fillColor = '#ba2727';
var selectedPoly = null;
const { Meta } = Card;

function selectNewPoly(poly) {
    if (selectedPoly !== null) {
        if (selectedPoly.ref === 'marker') {
            selectedPoly.setIcon({url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"});
        } else {
            selectedPoly.setEditable(false);
            selectedPoly.setDraggable(false);
        }
    }
    if (poly.ref === 'marker') {
        poly.setIcon({url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"});
    } else {
        poly.setEditable(true);
        poly.setDraggable(true);
    }
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
        overlay: [],
        visible: false,
        inputVisible: false,
        inputValue: '',
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    };
    
    handleVisibleChange = visible => {
        this.setState({ visible });
    };
    
    valid(member) {
        return member.location !== undefined;
    }

    loadMarkers(information) {
        const { filteredData } = information;
        let markerArr = [];
        if (filteredData.length == 0) return markerArr;
        filteredData.forEach((member, index) => {
            if (this.valid(member)) {
                markerArr.push(
                    <Marker
                        key={index}
                        onLoad={marker => {
                            console.log('marker: ', marker)
                        }}
                        animation={google.maps.Animation.DROP}
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
                                onCloseClick={() => this.setState({ showInfo: -1 })}
                                position={{
                                    lat: parseFloat(member.location.lat),
                                    lng: parseFloat(member.location.lng)
                                }}
                                options={{ pixelOffset: { height: -50 } }}
                                onPositionChanged={() => console.log('unmount')}
                            >
                                <Card hoverable >
                                    <img src={member.image} alt='pic' style={{ 'width': 160, 'position': 'relative', 'marginBottom': 12 }}/>
                                    <Meta title={member.name} description={ 
                                    <div>
                                        <span>{'Body Temperature: ' + member.bodyTemp}</span><br/>
                                        <span>{'Heart Rate: ' + (member.heartRate)}</span><br/>
                                        <span>{'CO Level: ' + (member.coLevel * 100).toFixed(2) + '%'}</span><br/>
                                        <span>{'Air Quality: ' + (member.airQuality)}</span><br/> 
                                        <span>{'Mission Time: ' + (member.missionTime + (member.missionTime <= 1 ? ' min' : ' mins'))}</span><br/>
                                    </div>}/>        
                                </Card>
                            </InfoWindow>
                       }
                    </Marker>
                );
            }    
        });
        return markerArr;
    }

    addOverlay() {
        const { inputValue } = this.state;
        if (inputValue === '') {
            this.setState({
                inputVisible: false,
            })
            return;
        }
        const overlay = [...this.state.overlay];
        let idx = overlay.length === 0 ? 0 : (parseInt(overlay[overlay.length - 1].key) + 1);
        // console.log(selectedPoly);
        overlay.push( 
            <OverlayView
                position={{
                    lat: -3.745, 
                    lng: -38.523
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}  
                key={idx}
                >   
                <TweenOne>
                    <QueueAnim delay={100} leaveReverse={true}>  
                        <div key={idx}>
                            <Tag color="#108ee9" closable onClose={() => this.removeOverlay.bind(this)(idx)}> 
                                {inputValue} 
                            </Tag>
                        </div>
                    </QueueAnim>
                </TweenOne>         
            </OverlayView>       
        );
        // console.log(overlay);
        this.setState({
            overlay: overlay,
            inputVisible: false,
            inputValue: ''
        });
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    saveInputRef = input => (this.input = input);

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    removeOverlay(key) {
        let overlay = [...this.state.overlay];
        overlay.forEach((obj, idx) => {
            if (parseInt(obj.key) === key) {
                overlay.splice(idx, 1);
            }
        });
        this.setState({overlay: overlay});
    }


    render() {
        const { information } = this.props;
        const { inputVisible, inputValue } = this.state;
        let addOverlayObj = this.addOverlay.bind(this);
        return (
            <LoadScript
                id="script-loader"
                libraries={libs}
                googleMapsApiKey={mapAuth.key}
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
                        // onLoad={drawingManager => {
                        // }}
                        onPolygonComplete={(polygon) => {
                            console.log(polygon);
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
                        onMarkerComplete={(marker) => {
                            marker.ref = 'marker';
                            selectNewPoly(marker)
                            selectedPoly.setDraggable(true);
                            selectedPoly.setAnimation(google.maps.Animation.DROP);
                            window.google.maps.event.addListener(marker, 'click', 
                                () => selectNewPoly(marker)
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
                    <Button type="primary" onClick={() => this.props.setDrawer(true)} style={{'width': '150px', 'marginLeft': '50%', 'marginTop': '10px', 'left': '-75px'}}>
                        Searching Panel
                    </Button>
                    <Button onClick={deletePoly}>
                        Delete
                    </Button>
                    {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78, position: 'absolute', 'bottom': '55px', 'left': '0px', 'margin': '5px', 'backgroundColor': '#108ee9', 'color': 'white' }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.addOverlay.bind(this)}
                        onPressEnter={this.addOverlay.bind(this)}
                    />
                    )}
                    {!inputVisible && (
                    <Tag color="#108ee9" onClick={this.showInput} style={{ borderStyle: 'dashed', position: 'absolute', 'bottom': '55px', 'left': '0px', 'margin': '5px' }}>
                        <Icon type="plus" /> New Label
                    </Tag>
                    )}
                    {this.state.overlay}
                    {this.loadMarkers(information)}
                </GoogleMap> 
            </LoadScript>
        );
    }
}

