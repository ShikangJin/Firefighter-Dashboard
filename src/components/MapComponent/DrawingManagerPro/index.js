import React from 'react';
import { drawingManagerOptions } from '../settings';
import { Tooltip, Button, Icon } from 'antd';
import { DrawingManager } from '@react-google-maps/api';
import styles from './index.less';

class DrawingManagerPro extends React.Component {

    /**
     * Shape and Marker Management Function  
     */
    selectObj(poly, parentRef) {
        if (parentRef.selectedPoly !== null) {
            if (parentRef.selectedPoly.ref === 'marker') {
                parentRef.selectedPoly.setIcon({url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"});
            } else {
                parentRef.selectedPoly.setEditable(false);
                parentRef.selectedPoly.setDraggable(false);
            }
        }
        if (poly.ref === 'marker') {
            poly.setIcon({url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"});
        } else {
            poly.setEditable(true);           
        }
        poly.setDraggable(true);
        parentRef.selectedPoly = poly;
    }

    deletePoly(parentRef) {
        if (parentRef.selectedPoly === null) return;
        parentRef.selectedPoly.setMap(null);
        parentRef.selectedPoly = null;
    }

    initNewItem(item, isMarker, parentRef) {
        if (isMarker) {
            item.ref = 'marker';
            item.setAnimation(parentRef._google.maps.Animation.DROP);
        }
        this.selectObj(item, parentRef);
        parentRef._google.maps.event.addListener(item, 'click', 
            () => this.selectObj(item, parentRef) 
        );
    }


    render() {
        const { parentRef, addPoly } = this.props;
        return (
            <React.Fragment>
                <div className={styles.controlPanel}>
                    <Tooltip placement="top" title='Cancle Shape'>
                        <Button 
                            shape='circle' 
                            onClick={() => this.deletePoly(parentRef)} 
                            size='small' 
                            className={styles.controlBtm}
                        >
                            <Icon type="close" />
                        </Button>
                    </Tooltip>
                    <Tooltip placement="top" title='Confirm Shape'>
                        <Button shape='circle' onClick={addPoly} size='small'>
                            <Icon type="check" />
                        </Button>
                    </Tooltip>
                </div>
                <DrawingManager
                    onPolygonComplete={polygon => this.initNewItem(polygon, false, parentRef)}
                    onRectangleComplete={rect => this.initNewItem(rect, false, parentRef)}
                    onCircleComplete={circle => this.initNewItem(circle, false, parentRef)}
                    onMarkerComplete={marker => this.initNewItem(marker,true, parentRef)}
                    options={drawingManagerOptions}
                />
            </React.Fragment> 
        );
    }
}

export default DrawingManagerPro;