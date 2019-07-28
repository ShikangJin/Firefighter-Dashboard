import React from 'react';
import EditableOverlay from './EditableOverlay';

class CustomOverlays extends React.Component {

    removeOverlay(idx) {
        const { modifyOverlay, overlay } = this.props;
        let copidOverlay = [...overlay];
        copidOverlay.splice(idx, 1);
        modifyOverlay(copidOverlay);
    }

    loadOverlays() {
        const { overlay, modifyOverlay } = this.props;
        let shapes = [];
        overlay.forEach((shape, idx) => {
            if (shape.display) {
                shapes.push(
                    <EditableOverlay 
                        removeOverlay={this.removeOverlay.bind(this)} 
                        changeOverlayColor={() => modifyOverlay(overlay)}
                        shape={shape}
                        idx={idx}
                        key={shape.key} // used to find previous rendered component with same key and copy the state information from it 
                    />
                );
            }
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