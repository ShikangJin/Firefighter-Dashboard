import React from 'react';
import { Button, Icon } from 'antd';
import styles from './CountDownTimer.less';

const CustomTime = ({ children, display, handleAdd, handleSubtraction }) => {
    return (
        <div className={styles.innerBlock}> 
            <Button 
                disabled={display} 
                onClick={handleAdd} 
                size='small' 
                shape='circle' 
                className={styles.arrow}
            >
                <Icon type="caret-up" theme="filled" />
            </Button> 
            {children} 
            <Button 
                disabled={display} 
                onClick={handleSubtraction} 
                size='small' 
                shape='circle' 
                className={styles.arrow}
            >
                <Icon type="caret-down" theme="filled" />
            </Button>
        </div>
    );
}

class CountdownTimer extends React.Component {

    state = {
        time: 0, 
        start: false,
        stop: false,
    }

    tick() {
        if (this.state.time > 0) {
            this.setState({
                time: this.state.time - 10,
            });
        } else {
            clearInterval(this.state.timer);
            this.setState({
                start: false,
                stop: false,
            });
        }
    }

    startTimer() {
        if (this.state.start) return;
        this.setState({
            timer: setInterval(this.tick.bind(this), 10),
            start: true,
            stop: false,
        })
    }

    pauseTimer() {
        clearInterval(this.state.timer);
        this.setState({
            start: false,
            stop: true,
        });
    }

    resetTimer() {
        clearInterval(this.state.timer);
        this.setState({
            start: false,
            stop: false,
            time: 0,
        });
    }

    render() {   
        const { time, start } = this.state;
        let mins = Math.floor(time / 60000), 
            seconds = Math.floor(time / 1000) % 60, 
            ms = Math.floor(time % 1000 / 10);

        mins = (mins < 10 ? ('0' + mins) : mins);
        seconds = (seconds < 10 ? ('0' + seconds) : seconds);
        ms = (ms < 10 ? ('0' + ms) : ms);

        return(
            <React.Fragment>
                <div className={styles.timeContainer}>
                    <CustomTime
                        display={start}
                        handleAdd={() => this.setState({ time: this.state.time + 1000 * 60 })}
                        handleSubtraction={() => this.setState({ time: mins === '00' ? this.state.time : (this.state.time - 1000 * 60) })}
                    >
                        <div className={styles.time}>{mins}</div>
                    </CustomTime>
                   
                    <div>
                        <p className={styles.colon}>:</p> 
                    </div>
                    
                    <CustomTime
                        display={start}
                        handleAdd={() => this.setState({ time: Math.floor((this.state.time + 1000) / 1000) % 60 === 0 ? (this.state.time - 59000) : (this.state.time + 1000) })}
                        handleSubtraction={() => this.setState({ time: seconds === '00' ? (this.state.time + 59000) : (this.state.time - 1000) })}
                    >
                        <div className={styles.time}>{seconds}</div> 
                    </CustomTime>
               
                    <div>
                        <p className={styles.colon}>:</p> 
                    </div>
                    
                    <CustomTime
                        display={start}
                        handleAdd={() => this.setState({ time: (this.state.time + 10) % 1000 / 10 === 0 ? (this.state.time - 990) : this.state.time + 10 })}
                        handleSubtraction={() => this.setState({ time: ms === '00' ? (this.state.time + 990) : (this.state.time - 10) })}
                    >
                        <div className={styles.time}>{ms}</div> 
                    </CustomTime>
            
                </div>
                
                <div className={styles.controlContainer}>
                    <Button 
                        onClick={this.startTimer.bind(this)}
                        className={styles.controlBtm}
                        size='small'
                        type={this.state.start ? 'primary' : ''}
                    > 
                        <Icon type="caret-right" /> 
                    </Button>
                    <Button 
                        onClick={this.pauseTimer.bind(this)}
                        className={styles.controlBtm}
                        size='small'
                        type={this.state.stop ? 'primary' : ''}
                    > 
                        <Icon type="pause" /> 
                    </Button>
                    <Button 
                        onClick={this.resetTimer.bind(this)}
                        className={styles.controlBtm}
                        size='small'
                    > 
                        <Icon type="redo" />
                    </Button>
                </div>         
            </React.Fragment>
        );
    }
}

export default CountdownTimer;