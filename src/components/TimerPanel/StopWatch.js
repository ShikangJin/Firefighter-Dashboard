import React from 'react';
import { Button, Icon } from 'antd';
import styles from './StopWatch.less';

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

    startTimer() {
        if (this.state.start) return;
        this.setState({
            timer: setInterval(this.tick.bind(this), 50),
            startTime: Date.now(),
            start: true,
            stop: false,
        });
    }

    pauseTimer() {
        clearInterval(this.state.timer);
        this.setState({
            beforeStopElapsed: this.state.elapsed,
            start: false,
            stop: true,
        });
    }

    resetTimer() {
        clearInterval(this.state.timer);
        this.setState({
            elapsed: 0,
            beforeStopElapsed: 0,
            start: false,
            stop: false,
        });
    }

    render() {
        const { elapsed } = this.state;
        let mins = Math.floor(elapsed / 60000 ), 
            seconds = Math.floor(elapsed / 1000) % 60, 
            ms = Math.floor(elapsed % 1000 / 10);
        let timeDisplay = (mins < 10 ? ('0' + mins) : mins) + ' : ' + (seconds < 10 ? ('0' + seconds) : seconds) + ' : ' + (ms < 10 ? ('0' + ms) : ms);

        return (
            <div className={styles.container}>
                <p className={styles.time}> {timeDisplay} </p>
                <div>
                    <Button 
                        size='small'
                        className={styles.controlBtm} 
                        onClick={this.startTimer.bind(this)}
                        type={this.state.start ? 'primary' : ''}
                    >
                        <Icon type="caret-right" />
                    </Button>
                    <Button 
                        size='small' 
                        className={styles.controlBtm} 
                        onClick={this.pauseTimer.bind(this)}
                        type={this.state.stop ? 'primary' : ''}
                    >
                        <Icon type="pause" />
                    </Button>
                    <Button 
                        size='small' 
                        className={styles.controlBtm} 
                        onClick={this.resetTimer.bind(this)}
                    >
                        <Icon type="redo" />
                    </Button>      
                </div>    
            </div>
        );
    }
}

export default StopWatch;