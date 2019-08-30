import React from 'react';
import { Card } from 'antd';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { flashSvg, normalSvg } from  './iconTemplate';
import styles from './index.less';
import { defaultData } from '@/defaultSettings';

const { Meta } = Card;

const encodePrefix = 'data:image/svg+xml;charset=UTF-8,';

function checkData(data) {
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

const MemberCard = ({ data }) => {
    checkData(data);
    const { humidity, pressure, proximity, temperature, ppb, rh, acc, gyro } = data;
    return (
        <div className={styles.memberCard}>
            <span>{'Pressure: ' + pressure + ' hPa'}</span><br/>
            <span>{'Temperature: ' + temperature + ' °C'}</span><br/> 
            <span>{'Humidity: ' + humidity + '%'}</span><br/>
            <span>{'Proximity: ' + proximity + ' cm'}</span><br/>
            <span>{'PPB: ' + ppb}</span><br/>
            <span>{'RH: ' + rh}</span><br/>
            <span> {`Accelerometer: (${acc.x}, ${acc.y}, ${acc.z})`} </span><br/>
            <span> {`Gyroscope: (${gyro.x}, ${gyro.y}, ${gyro.z})`} </span><br/>
        </div>
    );
}

class MarkerGroup extends React.Component {

    state = {
        showInfo: -1,
    }

    setIcon(status) {
        if (status === 'Mayday') 
            return encodePrefix + encodeURIComponent(flashSvg);
        return encodePrefix + encodeURIComponent(normalSvg);
    }

    loadMarkers(filteredData, parentRef) {
        let markerArr = [];
        if (filteredData.length == 0) return markerArr;
        filteredData.forEach((member, index) => {
            const { name, location, status, image } = member;
            if (location === undefined || (location.lat == 0 && location.lng == 0)) return;
            const parsedLocation = {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lng)
            }
            markerArr.push(
                <Marker
                    key={index}
                    // animation={parentRef._google.maps.Animation.DROP}
                    title={name}
                    name={name}
                    position={parsedLocation}
                    onClick={() => this.setState({ showInfo: index })}
                    icon={{ url: this.setIcon(status) }}
                >
                    {this.state.showInfo === index && 
                        <InfoWindow 
                            onCloseClick={() => this.setState({ showInfo: -1 })}
                            position={parsedLocation}
                            options={{ pixelOffset: { height: -30 } }}
                        >
                            <Card hoverable>
                                <img src={image} alt='pic' className={styles.img} />
                                <Meta title={name} description={<MemberCard data={member}/>} />
                            </Card>
                        </InfoWindow>
                    }
                </Marker> 
            );          
        });
        return markerArr;
    }

    render() {
        const { filteredData, parentRef } = this.props;
        return (
            <React.Fragment>
                {this.loadMarkers(filteredData, parentRef)}
            </React.Fragment>
        );
    }
}

export default MarkerGroup;