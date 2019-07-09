import React from 'react';
import { Card } from 'antd';
import { Marker, InfoWindow } from '@react-google-maps/api';

const { Meta } = Card;

class MarkerGroup extends React.Component {

    state = {
        showInfo: -1,
    }

    valid(member) {
        return member.location !== undefined;
    }

    loadMarkers(filteredData, parentRef) {
        const flashTemplate = [
            '<?xml version="1.0"?>',
            '<svg width="26px" height="26px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
            '<circle stroke="#222" fill="{{ color }}" cx="50" cy="50" r="35">',
            '<animate attributeType="XML" attributeName="fill" values="#800;#f00;#800;#800" dur="0.8s" repeatCount="indefinite"/>',
            '</circle>',
            '</svg>'
        ].join('\n');
        const normalTemplate = [
            '<?xml version="1.0"?>',
            '<svg width="26px" height="26px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">',
            '<circle stroke="#222" fill="{{ color }}" cx="50" cy="50" r="35">',
            '</circle>',
            '</svg>'
        ].join('\n');
        const flashSvg = flashTemplate.replace('{{ color }}', '#e60017');
        const normalSvg = normalTemplate.replace('{{ color }}', '#00cc25');
        let markerArr = [];
        if (filteredData.length == 0) return markerArr;
        filteredData.forEach((member, index) => {
            if (this.valid(member)) {
                markerArr.push(
                    <Marker
                        key={index}
                        animation={parentRef._google.maps.Animation.DROP}
                        title={member.name}
                        name={member.name}
                        position={{
                            lat: parseFloat(member.location.lat),
                            lng: parseFloat(member.location.lng)
                        }}
                        onClick={() => this.setState({
                            showInfo: index,
                        })}
                        icon={{
                            url: member.status === 'MayDay' ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(flashSvg) : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(normalSvg), 
                        }}
                    >
                        {this.state.showInfo === index && 
                            <InfoWindow 
                                onCloseClick={() => this.setState({ showInfo: -1 })}
                                position={{
                                    lat: parseFloat(member.location.lat),
                                    lng: parseFloat(member.location.lng)
                                }}
                                options={{ pixelOffset: { height: -50 } }}
                                onPositionChanged={() => console.log('unmount')}
                            >
                                <Card hoverable >
                                    <img src={member.image} alt='pic' style={{ 'width': 160, 'position': 'relative', 'marginBottom': 12 }}/>
                                    <Meta title={member.name} description={ 
                                    <div>
                                        <span>{'Body Temperature: ' + member.bodyTemp}</span><br/>
                                        <span>{'Heart Rate: ' + (member.heartRate)}</span><br/>
                                        <span>{'CO Level: ' + (member.coLevel * 100).toFixed(2) + '%'}</span><br/>
                                        <span>{'Air Quality: ' + (member.airQuality)}</span><br/> 
                                        <span>{'Mission Time: ' + (member.missionTime + (member.missionTime <= 1 ? ' min' : ' mins'))}</span><br/>
                                    </div>}/>        
                                </Card>
                            </InfoWindow>
                        }
                    </Marker> 
                );
            } 
           
               
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