const fillColor = '#ba2727';

const drawingManagerOptions = {
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