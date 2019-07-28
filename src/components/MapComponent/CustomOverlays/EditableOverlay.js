import React from 'react';
import { Popconfirm, Popover, Button, Card, Row, Col } from 'antd';
import { OverlayView, Circle, Rectangle, Polygon } from '@react-google-maps/api';
import ColorPicker from './ColorPicker';
import styles from './index.less';

const PopWindowContent = ({ removeOverlay, changeStrokeColor, changeTextColor, changeFillColor, fillColor, strokeColor, textColor }) => {
    return (
        <div className={styles.popWindow}>
            <Row gutter={16}>
                <Col span={12}>
                    <span>Area Color</span>
                </Col>
                <Col span={12}>
                    <ColorPicker color={fillColor} changeColor={changeFillColor}/>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <span>Stroke Color</span>
                </Col>
                <Col span={12}>
                    <ColorPicker color={strokeColor} changeColor={changeStrokeColor}/>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <span>Text Color</span>
                </Col>
                <Col span={12}>
                    <ColorPicker color={textColor} changeColor={changeTextColor}/>
                </Col>
            </Row>
            <Row>
                <Button onClick={removeOverlay}> Delete </Button> 
            </Row>
            
        </div>
    );
}

const PopWindow = ({ visible, text, handleVisibleChange, removeOverlay, changeStrokeColor, textColor, changeTextColor, changeFillColor, fillColor, strokeColor }) => {
    return (
        <Popover
            content={
                <PopWindowContent 
                    removeOverlay={removeOverlay} 
                    changeFillColor={changeFillColor}
                    changeStrokeColor={changeStrokeColor} 
                    changeTextColor={changeTextColor}
                    fillColor={fillColor}
                    strokeColor={strokeColor}
                    textColor={textColor}
                />}
            title="Edit Overlay"
            trigger="click"
            visible={visible}
            onVisibleChange={handleVisibleChange}
        >
            <span className={styles.text} style={{'color': textColor}}> {text} </span>
        </Popover>
    );
}


class EditableOverlay extends React.Component {
    state = {
        visible: false,
        fillColor: 'rgba(255, 255, 255, 0)',
        strokeColor: 'red',
        textColor: 'red',
    };

    calPolyCenter(paths) {
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
        return polyCenter;
    }

    handleVisibleChange = visible => {
        this.setState({ visible });
    };

    changeFillColor(fillColor) {
        const { changeOverlayColor, shape } = this.props;
        shape.fillColor = fillColor;
        changeOverlayColor();
    }

    changeStrokeColor(strokeColor) {
        const { changeOverlayColor, shape } = this.props;
        shape.strokeColor = strokeColor;
        changeOverlayColor();
    }

    changeTextColor(textColor) {
        const { changeOverlayColor, shape } = this.props;
        shape.textColor = textColor;
        changeOverlayColor();
    }

    render() {
        const { visible } = this.state;
        const { removeOverlay, shape, idx } = this.props;
        const { fillColor, strokeColor, textColor, key, text } = shape;
        if (shape.shape === 'circle') {
            return (
                <OverlayView
                    position={{
                        lat: shape.center.lat(), 
                        lng: shape.center.lng(), 
                    }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}  
                >   
                    <React.Fragment>
                        <PopWindow 
                            visible={visible}
                            text={text} 
                            handleVisibleChange={this.handleVisibleChange.bind(this)}
                            removeOverlay={() => removeOverlay(idx)} 
                            changeFillColor={this.changeFillColor.bind(this)}
                            changeStrokeColor={this.changeStrokeColor.bind(this)}
                            changeTextColor={this.changeTextColor.bind(this)}
                            textColor={textColor}
                            fillColor={fillColor}
                            strokeColor={strokeColor}
                            key={idx}
                        />
                        <Circle center={shape.center} radius={shape.radius} options={{fillColor: fillColor, strokeColor: strokeColor}} />
                    </React.Fragment>     
                </OverlayView>
            );
        } else if (shape.shape === 'rect') {
            return (
                <OverlayView
                    bounds={shape.bounds}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}  
                    key={idx}
                >   
                    <React.Fragment>
                        <PopWindow 
                            visible={visible}
                            text={text}
                            handleVisibleChange={this.handleVisibleChange.bind(this)}
                            removeOverlay={() => removeOverlay(idx)} 
                            changeFillColor={this.changeFillColor.bind(this)}
                            changeStrokeColor={this.changeStrokeColor.bind(this)}
                            changeTextColor={this.changeTextColor.bind(this)}
                            textColor={textColor}
                            fillColor={fillColor}
                            strokeColor={strokeColor}
                            key={idx}
                        />
                        <Rectangle bounds={shape.bounds} options={{fillColor: fillColor, strokeColor: strokeColor}}/>
                    </React.Fragment>
                </OverlayView>
            );
        } else if (shape.shape === 'poly') {
            let paths = shape.paths.getArray()[0].j;
            let polyCenter = this.calPolyCenter(paths);
            return (
                <OverlayView
                    position={polyCenter}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}  
                    key={idx}
                >   
                    <React.Fragment>
                        <PopWindow 
                            visible={visible}
                            text={text} 
                            handleVisibleChange={this.handleVisibleChange.bind(this)}
                            removeOverlay={() => removeOverlay(idx)} 
                            changeFillColor={this.changeFillColor.bind(this)}
                            changeStrokeColor={this.changeStrokeColor.bind(this)}
                            changeTextColor={this.changeTextColor.bind(this)}
                            textColor={textColor}
                            fillColor={fillColor}
                            strokeColor={strokeColor}
                            key={idx}
                        />
                        <Polygon paths={paths} options={{fillColor: fillColor, strokeColor: strokeColor}}/>
                    </React.Fragment>               
                </OverlayView>
            );
        }
    }
}


export default EditableOverlay;