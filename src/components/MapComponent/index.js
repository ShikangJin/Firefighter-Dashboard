import React from 'react';
import { Button } from 'antd';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import TimerPanel from '@/components/TimerPanel';
import DrawingManagerPro from './DrawingManagerPro';
import TagControlPanel from './TagControlPanel';
import CustomOverlays from './CustomOverlays';
import MarkerGroup from './MarkerGroup';
import mapAuth from '@/assets/mapKey.json';
import { mapContainerStyle, libs } from './settings';

export default class MapComponent extends React.Component {

    state = {
        overlay: [],
        visible: false,
        inputVisible: false,
        inputValue: '',
        selectedTag: (this.props.tags && this.props.tags[0]) ? this.props.tags[0] : {shapeTag: 'Please Select Tag', idx: -1},
    }

    constructor(props) {
        super(props);
        this.selectedPoly = null;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.firstmarker != nextProps.firstmarker && nextProps.firstmarker !== null) {
            let latlng = new this._google.maps.LatLng(parseFloat(nextProps.firstmarker.lat), parseFloat(nextProps.firstmarker.lng));
            this.mapRef.panTo(latlng);
        }  
        this.setState({
            selectedTag: (nextProps.tags && nextProps.tags[0]) ? nextProps.tags[0] : {shapeTag: 'Please Select Tag', idx: -1},
        }); 
    }

    removeOverlay(overlay) {
        this.setState({ overlay: overlay });
    }

    addPoly() {
        const overlay = [...this.state.overlay];
        if (this.selectedPoly === null) {
            return;
        }
        if (this.selectedPoly.center !== undefined) {
            overlay.push({shape: 'circle', center: this.selectedPoly.center, radius: this.selectedPoly.radius, text: this.state.selectedTag.shapeTag});
        } else if (this.selectedPoly.bounds !== undefined) {
            overlay.push({shape: 'rect', bounds: this.selectedPoly.bounds, text: this.state.selectedTag.shapeTag});
        } else if (this.selectedPoly.getPaths !== undefined) {
            overlay.push({shape: 'poly', paths: this.selectedPoly.getPaths(), text: this.state.selectedTag.shapeTag});
        } else {
            return;
        }
        this.selectedPoly.setMap(null);
        this.selectedPoly = null;
        this.setState({overlay: overlay});
    }

    setSelectedTag(tag) {
        this.setState({
            selectedTag: tag
        });
    }

    init(map) {
        this.mapRef = map;
        this._google = window.google;
    }

    render() {
        const { information, firstmarker } = this.props;
        const { inputVisible, inputValue } = this.state;
        const { filteredData } = information; 
        return (
            <LoadScript
                id="script-loader"
                libraries={libs}
                googleMapsApiKey={mapAuth.key}
            >
                <GoogleMap
                    id='example-map'
                    mapContainerStyle={mapContainerStyle}
                    zoom={15}
                    center={information.center}
                    clickableIcons={false}
                    onLoad={map => this.init.bind(this)(map)}
                >
                    <DrawingManagerPro 
                        parentRef={this}
                        addPoly={this.addPoly.bind(this)}
                    />
                    
                    <Button type="primary" onClick={() => this.props.setDrawer(true)} style={{'position': 'absolute', 'right': 0, 'left': 0, 'marginRight': 'auto', 'marginLeft': 'auto', 'width': 150, 'marginTop': 10}}>
                        Searching Panel
                    </Button>

                    <TagControlPanel 
                        tags={this.props.tags}
                        deleteShapeTag={this.props.deleteShapeTag}
                        addShapeTag={this.props.addShapeTag}
                        setSelectedTag={this.setSelectedTag.bind(this)}
                        selectedTag={this.state.selectedTag}
                    />

                    <TimerPanel />

                    <CustomOverlays 
                        overlay={this.state.overlay}
                        removeOverlay={this.removeOverlay.bind(this)}
                    />

                    <MarkerGroup 
                        parentRef={this}
                        filteredData={filteredData}
                    />
                </GoogleMap> 
            </LoadScript>
        );
    }
}

