import React from 'react';
import { Card } from 'antd';
import { MiniArea, LineChart } from '@/components/Charts';
import styles from './index.less';
import { defaultData } from '@/defaultSettings';

var minTemp = 100, maxTemp = -100;

class DetailCards extends React.Component {

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        return true;
    }

    parseData(historyData, type) {
        if (!historyData || historyData.length === 0) {
            return [];
        }
        const result = [];
        historyData.forEach(data => {
            let yData;
            switch(type) {
                case 'bodyTemp': yData = data.bodyTemp; break;
                case 'heartRate': yData = data.heartRate; break;
                case 'temp': {yData = data.temp ? data.temp : 0; minTemp=Math.min(minTemp,yData); maxTemp=Math.max(maxTemp,yData)}; break;
                default: yData = 0; break;
            }
            result.push({
                x: data.time,
                y: parseFloat(yData),
            });
        })      
        return result;
    }

    checkData(data) {
        if (!data.image) data.image = '';
        if (!data.name) data.name = '';
        if (!data.age) data.age = 0;
        if (!data.humidity) data.humidity = 0;
        if (!data.pressure) data.pressure = 0;
        if (!data.proximity) data.proximity = 0;
        if (!data.temperature) data.temperature = 0;
        if (!data.timestamp) data.timestamp = '00/00/0000';
        // if (!data.timeDetail) data.timeDetail = '00:00:00 AM';
        if (!data.location) data.location = {lat: 0, lng: 0};
        if (!data.ppb) data.ppb = 0;
        if (!data.rh) data.rh = 0;
        if (!data.acc) data.acc = {x: 0, y: 0, z: 0};
        if (!data.gyro) data.gyro = {x: 0, y: 0, z: 0};
    }

    render() {
        let { data, historyData } = this.props;
        if (data === undefined) data = defaultData;
        else this.checkData(data);
        const { 
            image, 
            name,
            age,
            humidity, 
            pressure, 
            proximity, 
            temperature,
            timestamp,
            timeDetail,
            location,
            ppb,
            rh,
            acc,
            gyro,
        } = data;
        return (
            <React.Fragment>
                <Card 
                    className={styles.card}
                    hoverable={true}
                    title={'Basic Information'}
                >
                    <img src={image} alt="pic" className={styles.img}/>
                    <p> {'Name: ' + name} </p>
                    <p> {'Age: ' + age} </p>
                </Card>
                
                <Card 
                    className={styles.card}
                    hoverable={true}
                    title={'Real-Time Data'}
                >    
                    <p> {'Pressure: ' + pressure + ' hPa'} </p>
                    <p> {'Temperature: ' + temperature + ' °C'} </p>   
                    <p> {'Humidity: ' + humidity + '%'} </p>
                    <p> {'Proximity: ' + proximity + ' cm'} </p>
                    <p> {'PPB: ' + ppb} </p>
                    <p> {'RH: ' + rh} </p>
                    <p> {`Accelerometer: (${acc.x}, ${acc.y}, ${acc.z})`} </p>
                    <p> {`Gyroscope: (${gyro.x}, ${gyro.y}, ${gyro.z})`} </p>
                </Card>

                <Card 
                    className={styles.card}
                    hoverable={true}
                    title={'GPS'}
                >
                    <p>{'Time: ' + timestamp}</p>
                    <p>{'Current Latitude: ' + location.lat}</p>
                    <p>{'Current Longitude: ' + location.lng}</p>
                </Card>

                <Card 
                    className={styles.card}
                    hoverable={true}
                    title={'History Temperature'}
                >
                    <LineChart 
                        color="#f2a521" 
                        data={this.parseData(historyData, 'temp')}
                        scale={{ y: { min: minTemp - 5, max: maxTemp + 5 } }}
                    />
                </Card>
            </React.Fragment>
        );
    }
}

export default DetailCards;