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
    bodyTemp: 0,
    heartRate: 0,
    coLevel: 0,
    missionTime: 0,
    airQuality: 0,
    timestamp: '',
    timeDetail: '',
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

    render() {
        const { data, historyData } = this.props;
        if (data === undefined) data = defaultData;
        if (data.location === undefined) data.location = defaultLocation;
        const { 
            image, 
            name,
            age,
            bodyTemp,
            heartRate,
            coLevel,
            missionTime,
            airQuality,
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
                    <p> {'Body Temperature: ' + bodyTemp} </p>    
                    <p> {'Heart Rate: ' + heartRate} </p>
                    <p> {'CO Level: ' + ((coLevel * 100).toFixed(2) + '%')} </p>
                    <p> {'Mission Time: ' + missionTime + (missionTime <= 1 ? ' min' : ' mins')} </p>
                    <p> {'Air Quality: ' + (airQuality)} </p>
                </Card>

                <Card 
                    className={styles.card}
                    hoverable={true}
                    title={'GPS'}
                >
                    <p>{'Time: ' + timestamp + ' ' + timeDetail}</p>
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