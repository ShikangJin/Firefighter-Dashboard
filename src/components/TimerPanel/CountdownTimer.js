import React from 'react';
import { Button, Icon } from 'antd';

class CountdownTimer extends React.Component {
    state = {
        time: 0, // 5s
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

    render() {
        const { time } = this.state;
        let mins = Math.floor(time / 60000 ), 
            seconds = Math.floor(time / 1000 % 60), 
            ms = Math.floor(time % 1000 / 10);
        mins = (mins < 10 ? ('0' + mins) : mins);
        seconds = (seconds < 10 ? ('0' + seconds) : seconds);
        ms = (ms < 10 ? ('0' + ms) : ms);
        const style = {'display': 'flex', 'flexDirection': 'column', 'margin': '0 auto', 'width': '30%'}; 
        const display = this.state.start ? true : false;
        const timeStyle = {'textAlign': 'center', 'fontSize': 22};
        const colonStyle = {'marginTop': 22, 'fontSize': 22};
        const buttonStyle = { 'margin': '0 3.5%', 'width': '26%'};
        const arrowStyle = {'border': 'none', 'margin': 'auto'};
        return(
            <div>
                <div style={{'display': 'flex', 'width': '90%', 'margin': 'auto'}}>
                    <div style={style}> 
                        <Button disabled={display} onClick={() => this.setState({ time: this.state.time + 1000 * 60 })} size='small' shape='circle' style={arrowStyle}>
                            <Icon type="caret-up" theme="filled" />
                        </Button> 
                        <div style={timeStyle}>{mins}</div> 
                        <Button disabled={display} onClick={() => this.setState({ time: mins === '00' ? this.state.time : (this.state.time - 1000 * 60) })} size='small' shape='circle' style={arrowStyle}>
                            <Icon type="caret-down" theme="filled" />
                        </Button> 
                    </div>
                    <div>
                        <p style={colonStyle}>:</p> 
                    </div>
                    <div style={style}> 
                        <Button disabled={display} onClick={() => this.setState({ time: (this.state.time + 1000) / 1000 % 60 === 0 ? (this.state.time - 59000) : (this.state.time + 1000) })} size='small' shape='circle' style={arrowStyle}>
                            <Icon type="caret-up" theme="filled" />
                        </Button> 
                        <div style={timeStyle}>{seconds}</div> 
                        <Button disabled={display} onClick={() => this.setState({ time: seconds === '00' ? (this.state.time + 59000) : (this.state.time - 1000) })} size='small' shape='circle' style={arrowStyle}>
                            <Icon type="caret-down" theme="filled" />
                        </Button> 
                    </div>
                    <div>
                        <p style={colonStyle}>:</p> 
                    </div>
                    <div style={style}> 
                        <Button disabled={display} onClick={() => this.setState({ time: (this.state.time + 10) % 1000 / 10 === 0 ? (this.state.time - 990) : this.state.time + 10 })} size='small' shape='circle' style={arrowStyle}>
                            <Icon type="caret-up" theme="filled" />
                        </Button> 
                        <div style={timeStyle}>{ms}</div> 
                        <Button disabled={display} onClick={() => this.setState({ time: ms === '00' ? (this.state.time + 990) : (this.state.time - 10) })} size='small' shape='circle' style={arrowStyle}>
                            <Icon type="caret-down" theme="filled" />
                        </Button> 
                    </div>
                </div>
                
                <div style={{'margin': '0 auto', 'width': '90%', 'marginTop': 5}}>
                    <Button onClick={() => 
                            this.setState({
                                timer: setInterval(this.tick.bind(this), 10),
                                start: true,
                                stop: false,
                            })}
                            style={buttonStyle}
                            size='small'
                            type={this.state.start ? 'primary' : ''}
                    > 
                        <Icon type="caret-right" /> 
                    </Button>
                    <Button onClick={() => {
                        clearInterval(this.state.timer);
                        this.setState({
                            start: false,
                            stop: true,
                        });}}
                        style={buttonStyle}
                        size='small'
                        type={this.state.stop ? 'primary' : ''}
                    > 
                        <Icon type="pause" /> 
                    </Button>
                    <Button onClick={() => {
                        clearInterval(this.state.timer);
                        this.setState({
                            start: false,
                            stop: false,
                            time: 0,
                        });}}
                        style={buttonStyle}
                        size='small'
                    > 
                        <Icon type="redo" />
                    </Button>
                </div>
                
            </div>
        );
    }
}

export default CountdownTimer;