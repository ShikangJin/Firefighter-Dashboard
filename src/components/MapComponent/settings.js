const fillColor = 'rgba(255, 255, 255, 0)';
const strokeColor = 'red';

const drawingManagerOptions = {
    drawingControl: true,
    drawingControlOptions: {
        position: 6,
        drawingModes: ['marker', 'rectangle', 'circle', 'polygon']
    },
    circleOptions: {
        fillColor: fillColor,
        strokeColor: strokeColor,
    },
    rectangleOptions: {
        fillColor: fillColor,
        strokeColor: strokeColor,
    },
    polygonOptions: {
        fillColor: fillColor,
        strokeColor: strokeColor,
    },
}

const mapContainerStyle = {
    height: "80vh",
    width: "100%"
}

const libs = ['drawing'];

export {
    drawingManagerOptions,
    mapContainerStyle,
    libs
};