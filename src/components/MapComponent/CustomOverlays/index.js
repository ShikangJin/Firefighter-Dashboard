import React from 'react';
import { Popconfirm } from 'antd';
import { OverlayView, Circle, Rectangle, Polygon } from '@react-google-maps/api';

class CustomOverlays extends React.Component {

    removeOverlay(idx, overlay, removeOverlay) {
        overlay.splice(idx, 1);
        removeOverlay(overlay);
    }

    loadOverlays(overlay, removeOverlay) {
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
                        <Popconfirm title="Do you want to remove this area？" okText="Yes" cancelText="No" onConfirm={() => this.removeOverlay(idx, overlay, removeOverlay)}>
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
                            <Popconfirm title="Do you want to remove this area？" okText="Yes" cancelText="No" onConfirm={() => this.removeOverlay(idx, overlay, removeOverlay)}>
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
                            <Popconfirm title="Do you want to remove this area？" okText="Yes" cancelText="No" onConfirm={() => this.removeOverlay(idx, overlay, removeOverlay)}>
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

    render() {
        const { overlay, removeOverlay } = this.props;
        return (
            <React.Fragment>
                {this.loadOverlays([...overlay], removeOverlay)}
            </React.Fragment>

        );
    }
}

export default CustomOverlays;