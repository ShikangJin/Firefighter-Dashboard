import React from 'react';
import { Popover, Button, Icon, Tooltip } from 'antd';
import StopWatch from './StopWatch.js';
import CountdownTimer from './CountdownTimer.js';

class TimerPanel extends React.Component {

    state = {
        stopWatchVisible: false,
        countDownVisible: false,
    }

    hide = (type) => {
        if (type === 'stopwatch')
            this.setState({ stopWatchVisible: false });
        else if (type === 'countdown')
            this.setState({ countDownVisible: false });
    }

    handleVisibleChange(type) {
        if (type === 'stopwatch')
            this.setState({ stopWatchVisible: true });
        else if (type === 'countdown')
            this.setState({ countDownVisible: true });
    }

    render() {
        const stopWatchTitle = (
            <React.Fragment> 
                <span>Stop Watch</span> 
                <Icon type="close" onClick={() => this.hide('stopwatch')} style={{'float': 'right', 'marginTop': 4}}/>
            </React.Fragment>
        );
        const countDownTitle = (
            <React.Fragment> 
                <span>Count Down Timer</span> 
                <Icon type="close" onClick={() => this.hide('countdown')} style={{'float': 'right', 'marginTop': 4}}/>
            </React.Fragment>
        );

        return (
            <div style={{'position': 'absolute', 'zIndex': 100, 'right': '20%', 'top': '10px'}}>
                <Popover
                    content={<StopWatch />}
                    title={stopWatchTitle}
                    trigger="click"
                    visible={this.state.stopWatchVisible}
                >
                    <Tooltip placement="top" title='Stop Watch'>
                        <Button onClick={() => this.handleVisibleChange('stopwatch')} shape='circle' style={{'marginRight': 10}}>
                            <Icon type="clock-circle" theme="filled" />
                        </Button>
                    </Tooltip>
                    
                </Popover>
                
                <Popover
                    content={<CountdownTimer />}  // Countdown Timer is Under Construction
                    title={countDownTitle}
                    trigger="click"
                    visible={this.state.countDownVisible}
                >
                    <Tooltip placement="top" title='Count Down Timer'>
                        <Button onClick={() => this.handleVisibleChange('countdown')} shape='circle'>
                            <Icon type="clock-circle" theme="filled" />
                        </Button>
                    </Tooltip>
                </Popover>
            </div>
            
        );
    }
}
export default TimerPanel;