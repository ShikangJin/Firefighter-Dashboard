import React from 'react';
import { Button, Icon } from 'antd';

class StopWatch extends React.Component {
    state = {
        elapsed: 0,
        startTime: 0,
        beforeStopElapsed: 0,
        start: false,
        stop: false,
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    tick() {
        this.setState({
            elapsed: (new Date() - this.state.startTime) + this.state.beforeStopElapsed,
        });
    }

    render() {
        const { elapsed } = this.state;
        const buttonStyle = { 'margin': '0px 5px' };
        let mins = Math.floor(elapsed / 60000 ), 
            seconds = Math.floor(elapsed / 1000 % 60), 
            ms = Math.floor(elapsed % 1000 / 10);
        let timeDisplay = (mins < 10 ? ('0' + mins) : mins) + ' : ' + (seconds < 10 ? ('0' + seconds) : seconds) + ' : ' + (ms < 10 ? ('0' + ms) : ms);

        return (
            <div style={{'textAlign': 'center',}}>
                <p style={{ 'fontSize': 22, 'marginBottom': 5}}>
                    {timeDisplay}
                </p>
                <div>
                    <Button size='small'
                            style={buttonStyle} 
                            onClick={() => 
                                this.setState({
                                    timer: setInterval(this.tick.bind(this), 50),
                                    startTime: Date.now(),
                                    start: true,
                                    stop: false,
                                })
                            }
                            type={this.state.start ? 'primary' : ''}
                    >
                        <Icon type="caret-right" />
                    </Button>
                    <Button size='small' 
                            style={buttonStyle} 
                            onClick={() => {
                                clearInterval(this.state.timer);
                                this.setState({
                                    beforeStopElapsed: this.state.elapsed,
                                    start: false,
                                    stop: true,
                                })
                            }}
                            type={this.state.stop ? 'primary' : ''}
                    >
                        <Icon type="pause" />
                    </Button>
                    <Button size='small' 
                            style={buttonStyle} 
                            onClick={() => {
                                clearInterval(this.state.timer);
                                this.setState({
                                    elapsed: 0,
                                    beforeStopElapsed: 0,
                                    start: false,
                                    stop: false,
                                })
                            }}
                    >
                        <Icon type="redo" />
                    </Button>      
                </div>    
            </div>
        );
    }
}

export default StopWatch;