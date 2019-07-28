import React from 'react';
import { Button } from 'antd';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import TimerPanel from '@/components/TimerPanel';
// import EnginesOverview from '@/components/EnginesOverview';
// import ResourceManage from '@/components/ResourceManage';
import ControlPanel from '@/components/ControlPanel';
import DrawingManagerPro from './DrawingManagerPro';
// import TagControlPanel from './TagControlPanel';
import CustomOverlays from './CustomOverlays';
import MarkerGroup from './MarkerGroup';
import mapAuth from '@/assets/mapKey.json';
import { mapContainerStyle, libs } from './settings';
import styles from './index.less';

var keyIdx = 0;

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

    init(map) {
        this.mapRef = map;
        this._google = window.google;
    }

    modifyOverlay(overlay) {
        this.setState({ overlay: overlay });
    }

    addPoly() {
        const overlay = [...this.state.overlay];
        const text = this.state.selectedTag.shapeTag;
        if (this.selectedPoly === null) return;
        if (this.selectedPoly.center !== undefined) {
            overlay.push({ 
                shape: 'circle', 
                center: this.selectedPoly.center, 
                radius: this.selectedPoly.radius, 
                text: text, 
                display: true,
                key: keyIdx++,
                fillColor: 'rgba(255, 255, 255, 0)',
                strokeColor: 'red',
                textColor: 'red',
            });
        } else if (this.selectedPoly.bounds !== undefined) {
            overlay.push({
                shape: 'rect', 
                bounds: this.selectedPoly.bounds, 
                text: text,
                display: true,
                key: keyIdx++,
                fillColor: 'rgba(255, 255, 255, 0)',
                strokeColor: 'red',
                textColor: 'red',
            });
        } else if (this.selectedPoly.getPaths !== undefined) {
            overlay.push({
                shape: 'poly', 
                paths: this.selectedPoly.getPaths(), 
                text: text,
                display: true,
                key: keyIdx++,
                fillColor: 'rgba(255, 255, 255, 0)',
                strokeColor: 'red',
                textColor: 'red',
            });
        } else return;
        this.selectedPoly.setMap(null);
        this.selectedPoly = null;
        this.setState({overlay: overlay});
    }

    setSelectedTag(tag) {
        this.setState({
            selectedTag: tag
        });
    }

    render() {
        const { filteredData, center, firstmarker, wholeData, handleClickEngine, setDrawer, handleClickAdd, curSquads, tags, deleteShapeTag, addShapeTag } = this.props;
        const { inputVisible, inputValue, overlay, selectedTag } = this.state;
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
                    center={center}
                    clickableIcons={false}
                    onLoad={map => this.init.bind(this)(map)}
                >
                    <DrawingManagerPro 
                        parentRef={this}
                        addPoly={this.addPoly.bind(this)}
                    />
                    
                    {/* <Button 
                        type="primary"
                        onClick={() => this.props.setDrawer(true)} 
                        className={styles.searchBtm}
                    >
                        Searching Panel
                    </Button> */}

                    {/* <TagControlPanel 
                        tags={tags}
                        deleteShapeTag={deleteShapeTag}
                        addShapeTag={addShapeTag}
                        setSelectedTag={this.setSelectedTag.bind(this)}
                        selectedTag={selectedTag}
                    /> */}

                    <TimerPanel />
                    <ControlPanel 
                        wholeData={wholeData}
                        handleClickEngine={handleClickEngine}
                        handleClickMember={setDrawer}
                        handleClickAdd={handleClickAdd}
                        curSquads={curSquads}
                        overlay={overlay}
                        tags={tags}
                        deleteShapeTag={deleteShapeTag}
                        addShapeTag={addShapeTag}
                        setSelectedTag={this.setSelectedTag.bind(this)}
                        selectedTag={selectedTag}
                        modifyOverlay={this.modifyOverlay.bind(this)}
                    />

                    <CustomOverlays 
                        overlay={overlay}
                        modifyOverlay={this.modifyOverlay.bind(this)}
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

