import React from 'react';
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import styles from './ColorPicker.less';

class ColorPicker extends React.Component {
    state = {
        displayColorPicker: false,
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.props.changeColor(color.hex);
    };

    render() {
        const { color } = this.props;
        const { displayColorPicker } = this.state;
        const colorDetail = 
            (<div className={ styles.popover }>
                <div className={ styles.cover } onClick={ this.handleClose }/>
                <SketchPicker color={color} onChange={ this.handleChange } />
            </div>);
        return (
            <div>
                <div className={ styles.swatch } onClick={ this.handleClick }>
                    <div className={ styles.color } style={{'backgroundColor': color}}/>
                </div>
                { displayColorPicker ? colorDetail : null }
            </div>
        )
    }
}

export default ColorPicker;