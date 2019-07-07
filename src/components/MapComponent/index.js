/* global google */
import React from 'react';
import { Popover,Popconfirm, Input, Dropdown, Button, Menu, Tag, Card, Icon, Modal, message, Tooltip } from 'antd';
import { GoogleMap, LoadScript, DrawingManager, Marker, InfoWindow, OverlayView, Rectangle, Circle, Polygon } from '@react-google-maps/api';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import Pic from '@/assets/demoPic.jpg';
import mapAuth from '@/assets/mapKey.json';
import TimerPanel from '@/components/TimerPanel';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; 

const libs = ['drawing'];
const fillColor = '#ba2727';
var selectedPoly = null;
const { Meta } = Card;
var firstMarker = null;

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
        console.log(selectedPoly);
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
        curCenter: null,
        selectedTag: (this.props.tags && this.props.tags[0]) ? this.props.tags[0] : {shapeTag: 'Please Select Tag', idx: -1},
        newPropValue: '',
        addTagModal: false,
        deleteTagModal: false,
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.firstmarker != nextProps.firstmarker && nextProps.firstmarker !== null) {
            this.mapRef.panTo(nextProps.firstmarker);
        }  
        this.setState({
            selectedTag: (nextProps.tags && nextProps.tags[0]) ? nextProps.tags[0] : {shapeTag: 'Please Select Tag', idx: -1},
        }); 
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
        // console.log(this._google);
       
        const { filteredData } = information;
        const flashTemplate = [
            '<?xml version="1.0"?>',
            '<svg width="26px" height="26px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
            '<circle stroke="#222" fill="{{ color }}" cx="50" cy="50" r="35">',
            '<animate attributeType="XML" attributeName="fill" values="#800;#f00;#800;#800" dur="0.8s" repeatCount="indefinite"/>',
            '</circle>',
            '</svg>'
        ].join('\n');
        const normalTemplate = [
            '<?xml version="1.0"?>',
            '<svg width="26px" height="26px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
            '<circle stroke="#222" fill="{{ color }}" cx="50" cy="50" r="35">',
            '</circle>',
            '</svg>'
        ].join('\n');
        const flashSvg = flashTemplate.replace('{{ color }}', '#e60017');
        const normalSvg = normalTemplate.replace('{{ color }}', '#00cc25');
        let markerArr = [];
        if (filteredData.length == 0) return markerArr;
        filteredData.forEach((member, index) => {
            if (this.valid(member)) {
                markerArr.push(
                    <Marker
                        key={index}
                        animation={this._google.maps.Animation.DROP}
                        title={member.name}
                        name={member.name}
                        position={{
                            lat: parseFloat(member.location.lat),
                            lng: parseFloat(member.location.lng)
                        }}
                        onClick={() => this.setState({
                            showInfo: index,
                        })}
                        icon={{
                            url: member.status === 'MayDay' ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(flashSvg) : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(normalSvg), 
                        }}
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

    loadOverlays() {
        const overlay = [...this.state.overlay];
        let shapes = [];
        overlay.forEach((shape, idx) => {
            if (shape.shape === 'circle') {
                shapes.push(<OverlayView
                    position={{
                        lat: shape.center.lat(), 
                        lng: shape.center.lng(), 
                    }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}  
                    key={idx}
                    >   
                    <React.Fragment>
                        <Popconfirm title="Do you want to remove this area？" okText="Yes" cancelText="No" onConfirm={() => this.removeOverlay.bind(this)(idx)}>
                            <span style={{'color': 'Red', 'fontWeight': 'bold', 'fontSize': 18}}>{shape.text}</span>
                        </Popconfirm>
                        <Circle center={shape.center} radius={shape.radius} />
                    </React.Fragment>     
                </OverlayView>);
            } else if (shape.shape === 'rect') {
                shapes.push( 
                    <OverlayView
                        bounds={shape.bounds}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}  
                        key={idx}
                        >   
                        <React.Fragment>
                            <Popconfirm title="Do you want to remove this area？" okText="Yes" cancelText="No" onConfirm={() => this.removeOverlay.bind(this)(idx)}>
                                <span style={{'color': 'Red', 'fontWeight': 'bold', 'fontSize': 18}}>{shape.text}</span>
                            </Popconfirm>         
                            <Rectangle bounds={shape.bounds}/>
                        </React.Fragment>
                    </OverlayView>       
                );
            } else if (shape.shape === 'poly') {
                let paths = shape.paths.getArray()[0].j;
                let polyCenter = {
                    lat: 0,
                    lng: 0,
                };
                paths.forEach(point => {
                    polyCenter.lat += point.lat();
                    polyCenter.lng += point.lng();
                })
                polyCenter.lat = polyCenter.lat / paths.length;
                polyCenter.lng = polyCenter.lng / paths.length;
                shapes.push( 
                    <OverlayView
                        position={polyCenter}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}  
                        key={idx}
                        >   
                        <React.Fragment>
                            <Popconfirm title="Do you want to remove this area？" okText="Yes" cancelText="No" onConfirm={() => this.removeOverlay.bind(this)(idx)}>
                                <span style={{'color': 'Red', 'fontWeight': 'bold', 'fontSize': 18}}>{shape.text}</span>
                            </Popconfirm>
                            <Polygon paths={paths}/>
                        </React.Fragment>
                        
                    </OverlayView>       
                );
            }
        }) ;
        return shapes;
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    saveInputRef = input => (this.input = input);

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    removeOverlay(idx) {
        let overlay = [...this.state.overlay];
        overlay.splice(idx, 1);
        this.setState({overlay: overlay});
    }

    addPoly() {
        const overlay = [...this.state.overlay];
        if (selectedPoly === null) {
            return;
        }
        if (selectedPoly.center !== undefined) {
            overlay.push({shape: 'circle', center: selectedPoly.center, radius: selectedPoly.radius, text: this.state.selectedTag.shapeTag});
            // this.addOverlay('circle');
        } else if (selectedPoly.bounds !== undefined) {
            overlay.push({shape: 'rect', bounds: selectedPoly.bounds, text: this.state.selectedTag.shapeTag});
            // this.addOverlay('rect');
        } else if (selectedPoly.getPaths !== undefined) {
            overlay.push({shape: 'poly', paths: selectedPoly.getPaths(), text: this.state.selectedTag.shapeTag});
            // this.addOverlay('poly');
        } else {
            return;
        }
        selectedPoly.setMap(null);
        selectedPoly = null;
        this.setState({overlay: overlay});
    }

    createMenu(tags) {
        let items = [];
        tags.forEach(tag => {
            // console.log(tag);
            items.push(
                <Menu.Item key={tag.shapeTag} id={tag.idx}>   
                    <span> {tag.shapeTag} </span> 
                </Menu.Item> 
            );
        });
        return (
            <Menu onClick={(e) => {this.setState({selectedTag: {shapeTag: e.key, idx: e.item.props.id}})}}>
                {items}
            </Menu>
        );
    }   

    render() {
        const { information, firstmarker } = this.props;
        const { inputVisible, inputValue } = this.state;
       
        return (
            <LoadScript
                id="script-loader"
                libraries={libs}
                // googleMapsApiKey={mapAuth.key}
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
                    onLoad={map => {
                        this.mapRef = map;
                        if (this._google === undefined) {
                            this._google = window.google;
                        }
                    }}
                    onCenterChanged={() => {this.setState({
                        curCenter: {
                            lat: this.mapRef.getCenter().lat(),
                            lng: this.mapRef.getCenter().lng(),
                        }
                    })}}
                >
                    <DrawingManager
                        // onLoad={drawingManager => {
                        // }}
                        onPolygonComplete={(polygon) => {
                            console.log(polygon);
                            selectNewPoly(polygon);
                            this._google.maps.event.addListener(polygon, 'click', 
                                () => selectNewPoly(polygon) 
                            );
                        }}
                        onPolylineComplete={(polygon) => {
                            selectNewPoly(polygon);
                            this._google.maps.event.addListener(polygon, 'click', 
                                () => selectNewPoly(polygon) 
                            );
                        }}
                        onRectangleComplete={(polygon) => {
                            selectNewPoly(polygon);
                            this._google.maps.event.addListener(polygon, 'click', 
                                () => selectNewPoly(polygon) 
                            );
                        }}
                        onCircleComplete={(polygon) => {
                            selectNewPoly(polygon);
                            this._google.maps.event.addListener(polygon, 'click', 
                                () => selectNewPoly(polygon) 
                            );
                        }}
                        onMarkerComplete={(marker) => {
                            marker.ref = 'marker';
                            selectNewPoly(marker)
                            selectedPoly.setDraggable(true);
                            selectedPoly.setAnimation(google.maps.Animation.DROP);
                            this._google.maps.event.addListener(marker, 'click', 
                                () => selectNewPoly(marker)
                            );
                        }}
                        options={{
                            drawingControl: true,
                            drawingControlOptions: {
                                position: 6,
                                drawingModes: ['marker', 'rectangle', 'circle', 'polygon']
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
                            },
                        }}
                    /> 
                    <Button type="primary" onClick={() => this.props.setDrawer(true)} style={{'position': 'absolute', 'right': 0, 'left': 0, 'marginRight': 'auto', 'marginLeft': 'auto', 'width': 150, 'marginTop': 10}}>
                        Searching Panel
                    </Button>

                    <div style={{'position': 'absolute', 'bottom': 60, 'left': 5,}}>
                        <Tooltip placement="top" title='Cancle Shape'>
                            <Button shape='circle' onClick={deletePoly} size='small' style={{'marginRight': 5}}>
                                <Icon type="close" />
                            </Button>
                        </Tooltip>
                        <Tooltip placement="top" title='Confirm Shape'>
                            <Button shape='circle' onClick={this.addPoly.bind(this)} size='small'>
                                <Icon type="check" />
                            </Button>
                        </Tooltip>
                    </div>

                    <div style={{position: 'absolute', 'bottom': '20px', 'right': 0, 'left': 0, 'marginRight': 'auto', 'marginLeft': 'auto', 'width': 210, 'display': 'flex'}}>
                        <Tooltip placement="top" title='Delete Tag'>
                            <Button style={{'width': 30, 'padding': 0}} onClick={() => this.setState({ deleteTagModal: true })}>
                                <Icon type="delete" />
                            </Button>
                        </Tooltip>
                        <Modal
                            title="Please confirm to delete this tag"
                            visible={this.state.deleteTagModal}
                            onOk={() => {
                                    this.props.deleteShapeTag(this.state.selectedTag.idx);
                                    this.setState({deleteTagModal: false});
                                }}
                            onCancel={() => this.setState({deleteTagModal: false})}
                            width={300}
                        >
                            <p>{this.state.selectedTag.shapeTag}</p>
                        </Modal>
                        <Dropdown overlay={this.createMenu(this.props.tags)} placement="topCenter">
                            <Button style={{'width': 150, 'display': 'flex'}}>
                                <span style={{'wordWrap': 'break-word', 'width': '90%', 'display': 'block', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'textOverflow': 'ellipsis'}}>
                                    {this.state.selectedTag.shapeTag}   
                                </span>  
                                <Icon type="up" style={{'width': '10%'}}/>
                            </Button>
                        </Dropdown>
                        <Popover
                            content={ 
                                <Input 
                                    value={this.state.newPropValue}
                                    onChange={e => this.setState({ newPropValue: e.target.value })}onPressEnter={() => {
                                        if (this.state.newPropValue === '' || (!this.state.newPropValue.replace(/\s/g, '').length)) {
                                            message.warning('Please enter something');
                                            return;
                                        }
                                        this.setState({ addTagModal: true })
                                    }}
                                    allowClear
                                    placeholder="Press Enter to Add"
                                /> 
                            }
                            title="New Tag"
                            trigger="click"
                            visible={this.state.visible}
                            onVisibleChange={this.handleVisibleChange}
                        >
                             <Tooltip placement="top" title='Add New Tag'>
                                <Button style={{'width': 30, 'padding': 0}}> <Icon type="plus" /> </Button>
                             </Tooltip>
                        </Popover>
                        <Modal
                            title="Please confirm to add this tag"
                            visible={this.state.addTagModal}
                            onOk={() => {
                                this.props.addShapeTag(this.state.newPropValue);
                                this.setState({newPropValue: '', addTagModal: false});
                            }}
                            onCancel={() => this.setState({addTagModal: false})}
                            width={300}
                        >
                            <p>{this.state.newPropValue}</p>
                        </Modal>
                    </div>
                    <TimerPanel />
                    {this.loadOverlays()}
                    {this.loadMarkers(information)}
                </GoogleMap> 
            </LoadScript>
        );
    }
}

