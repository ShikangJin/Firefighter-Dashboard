import React from 'react';
import { Button } from 'antd';

class CountdownTimer extends React.Component {
    state = {
        time: 0, // 5s
        start: false,
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
            });
        }
    }

    render() {
        const { time } = this.state;
        let mins = Math.floor(time / 60000 ), 
            seconds = Math.floor(time / 1000 % 60), 
            ms = Math.floor(time % 1000 / 10);
        mins = (mins < 10 ? ('0' + mins) : mins);
        seconds = (seconds < 10 ? ('0' + seconds) : seconds);
        ms = (ms < 10 ? ('0' + ms) : ms);
        const style = {'display': 'flex', 'flexDirection': 'column'}; 
        const display = {'display' : this.state.start ? 'none' : 'block'}
        return(
            <div>
                <div style={{'display': 'flex'}}>
                    <div style={style}> 
                        <p style={display} onClick={() => this.setState({ time: this.state.time + 1000 * 60 }) }>^</p> 
                        <p>{mins + ' : '}</p> 
                        <p style={display} onClick={() => this.setState({ time: mins === '00' ? this.state.time : (this.state.time - 1000 * 60) })}>V</p> 
                    </div>
                    <div style={style}> 
                        <p style={display} onClick={() => this.setState({ time: (this.state.time + 1000) / 1000 % 60 === 0 ? (this.state.time - 59000) : (this.state.time + 1000) })}>^</p> 
                        <p>{seconds  + ' : '}</p> 
                        <p style={display} onClick={() => this.setState({ time: seconds === '00' ? (this.state.time + 59000) : (this.state.time - 1000) })}>V</p> 
                    </div>
                    <div style={style}> 
                        <p style={display} onClick={() => this.setState({ time: (this.state.time + 10) % 1000 / 10 === 0 ? (this.state.time - 990) : this.state.time + 10 })}>^</p> 
                        <p>{ms}</p> 
                        <p style={display} onClick={() => this.setState({ time: ms === '00' ? (this.state.time + 990) : (this.state.time - 10) })}>V</p> 
                    </div>
                </div>
                
                <Button onClick={() => {
                    this.setState({
                        timer: setInterval(this.tick.bind(this), 10),
                        start: true,
                    });
                }}> 
                    Start 
                </Button>
                <Button onClick={() => {
                    clearInterval(this.state.timer);
                    this.setState({
                        start: false,
                    });
                }}> 
                    Stop 
                </Button>
            </div>
        );
    }
}

export default CountdownTimer;