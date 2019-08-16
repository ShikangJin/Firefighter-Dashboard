import React from 'react';
import { Card } from 'antd';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { flashSvg, normalSvg } from  './iconTemplate';
import styles from './index.less';

const { Meta } = Card;

const encodePrefix = 'data:image/svg+xml;charset=UTF-8,';

const MemberCard = ({ data }) => {
    const { humidity, pressure, proximity, temperature } = data;
    return (
        <div>
            <span>{'Pressure: ' + pressure + ' hPa'}</span><br/>
            <span>{'Temperature: ' + temperature + ' °C'}</span><br/> 
            <span>{'Humidity: ' + humidity + '%'}</span><br/>
            <span>{'Proximity: ' + proximity + ' cm'}</span><br/>
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