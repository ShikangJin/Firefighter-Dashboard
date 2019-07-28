import React from 'react';
import { Card } from 'antd';
import { MiniArea, LineChart } from '@/components/Charts';
import styles from './index.less';

const defaultLocation = {
    lat: 0,
    lng: 0,
};

const defaultData = {
    image: '',
    name: '',
    age: 0,
    humidity: 0, 
    pressure: 0, 
    proximity: 0, 
    temperature: 0,
    timestamp: '',
    // timeDetail: '',
    location: defaultLocation,
};

class DetailCards extends React.Component {

    parseData(historyData, type) {
        if (historyData.length === 0) {
            return historyData;
        }
        const result = [];
        historyData.forEach(data => {
            let yData;
            switch(type) {
                case 'bodyTemp': yData = data.bodyTemp; break;
                case 'heartRate': yData = data.heartRate; break;
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
        if (!data.location) data.location = defaultLocation;
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
            location 
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
                    <p> {'Temperature: ' + temperature + ' °F'} </p>   
                    <p> {'Humidity: ' + humidity + '%'} </p>
                    <p> {'Proximity: ' + proximity + ' cm'} </p>
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
                    title={'History Body Temperature'}
                >
                    <MiniArea 
                        color="#f2a521" 
                        data={this.parseData(historyData, 'bodyTemp')}
                        scale={{ y: { min: 35, max: 39 } }}
                    />
                </Card>
                <Card 
                    className={styles.card}
                    hoverable={true}
                    title={'History Heart Rate'}
                >
                    <LineChart 
                        data={this.parseData(historyData, 'heartRate')}
                        scale={{ y: { min: 50, max: 110 } }}
                        color='#db3830'
                    />
                </Card>
            </React.Fragment>
        );
    }
}

export default DetailCards;