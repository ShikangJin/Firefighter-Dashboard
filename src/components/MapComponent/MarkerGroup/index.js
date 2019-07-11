import React from 'react';
import { Card } from 'antd';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { flashSvg, normalSvg } from  './iconTemplate';
import styles from './index.less';

const { Meta } = Card;

const encodePrefix = 'data:image/svg+xml;charset=UTF-8,';

const MemberCard = ({ data }) => {
    const { bodyTemp, heartRate, coLevel, airQuality, missionTime } = data;
    return (
        <div>
            <span>{'Body Temperature: ' + bodyTemp}</span><br/>
            <span>{'Heart Rate: ' + (heartRate)}</span><br/>
            <span>{'CO Level: ' + (coLevel * 100).toFixed(2) + '%'}</span><br/>
            <span>{'Air Quality: ' + (airQuality)}</span><br/> 
            <span>{'Mission Time: ' + (missionTime + (missionTime <= 1 ? ' min' : ' mins'))}</span><br/>
        </div>
    );
}

class MarkerGroup extends React.Component {

    state = {
        showInfo: -1,
    }

    setIcon(status) {
        if (status === 'MayDay') 
            return encodePrefix + encodeURIComponent(flashSvg);
        return encodePrefix + encodeURIComponent(normalSvg);
    }

    loadMarkers(filteredData, parentRef) {
        let markerArr = [];
        if (filteredData.length == 0) return markerArr;
        filteredData.forEach((member, index) => {
            const { name, location, status, image } = member;
            if (location === undefined) return;
            const parsedLocation = {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lng)
            }
            markerArr.push(
                <Marker
                    key={index}
                    animation={parentRef._google.maps.Animation.DROP}
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
                            options={{ pixelOffset: { height: -50 } }}
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