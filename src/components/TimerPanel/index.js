import React from 'react';
import { Popover, Button, Icon, Tooltip, Divider } from 'antd';
import StopWatch from './StopWatch.js';
import CountdownTimer from './CountdownTimer.js';
import styles from './index.less';

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
                <span>Stopwatch</span> 
                <Icon 
                    type="close" 
                    onClick={() => this.hide('stopwatch')} 
                    className={styles.icon} 
                />
            </React.Fragment>
        );
        const countDownTitle = (
            <React.Fragment> 
                <span>Countdown Timer</span> 
                <Icon 
                    type="close" 
                    onClick={() => this.hide('countdown')} 
                    className={styles.icon} 
                />
            </React.Fragment>
        );

        return (
            <div className={styles.timerPanel}>
                <Popover
                    content={<StopWatch />}
                    title={stopWatchTitle}
                    trigger="click"
                    visible={this.state.stopWatchVisible}
                >
                    <Tooltip placement="top" title='Stopwatch'>
                        <Button 
                            onClick={() => this.handleVisibleChange('stopwatch')} 
                            shape='circle' 
                            className={styles.iconButton} 
                            type='link'
                        >
                            <Icon type="clock-circle" theme="filled" />
                        </Button>
                    </Tooltip>
                    
                </Popover>
                <Divider type='vertical' className={styles.timePanelDivider} />
                <Popover
                    content={<CountdownTimer />}  // Countdown Timer is Under Construction
                    title={countDownTitle}
                    trigger="click"
                    visible={this.state.countDownVisible}
                >
                    <Tooltip placement="top" title='Countdown Timer'>
                        <Button 
                            onClick={() => this.handleVisibleChange('countdown')} 
                            shape='circle'
                            type='link'
                            className={styles.iconButton} 
                        >
                            <Icon type="clock-circle" />
                        </Button>
                    </Tooltip>
                </Popover>
            </div>
            
        );
    }
}
export default TimerPanel;