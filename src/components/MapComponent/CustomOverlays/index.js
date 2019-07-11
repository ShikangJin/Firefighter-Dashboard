import React from 'react';
import EditableOverlay from './EditableOverlay';

class CustomOverlays extends React.Component {

    removeOverlay(idx) {
        const { removeOverlay, overlay } = this.props;
        let copidOverlay = [...overlay];
        copidOverlay.splice(idx, 1);
        removeOverlay(copidOverlay);
    }

    loadOverlays() {
        const { overlay } = this.props;
        let shapes = [];
        overlay.forEach((shape, idx) => {
            shapes.push(
                <EditableOverlay 
                    removeOverlay={this.removeOverlay.bind(this)} 
                    shape={shape}
                    idx={idx}
                    key={shape.key} // used to find previous rendered component with same key and copy the state information from it 
                />
            );
        });
        return shapes;
    }

    render() {
        return (
            <React.Fragment>
                {this.loadOverlays()}
            </React.Fragment>
        );
    }
}

export default CustomOverlays;