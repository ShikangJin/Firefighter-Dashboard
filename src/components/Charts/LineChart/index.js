import React, { Component } from 'react';
import {Chart, Axis, Tooltip, Geom, Coord, Label} from 'bizcharts';
import autoHeight from '../autoHeight';
import DataSet from '@antv/data-set';
const { DataView } = DataSet;

@autoHeight()
export default class LineChart extends Component {
  render() {
    const { 
        data, 
        height, 
        scale = {}, 
        color = 'rgba(24, 144, 255, 0.2)' 
    } = this.props;
    if (!data || data.length <= 0)
      return null;
    const ytitle = {
      autoRotate: true,
      offset: -10,
      textStyle: {
        fontSize: '22',
        textAlign: 'left',
        fill: 'rgb(75,83,87)',
        rotate: 0
      },
      position: 'end',
    };
    const xtitle = {
      autoRotate: true,
      offset: -20,
      textStyle: {
        fontSize: '22',
        textAlign: 'center',
        fill: 'rgb(75,83,87)',
        rotate: 0
      },
      position: 'end',
    };
    const line = {
      stroke: 'rgb(197,197,200)',
      lineWidth: 2
    };
    const axis = [];
    let i = 0;
    for (let key in data[0]) {
      axis[i++] = key;
    }
    
    const scaleProps = {
        x: {
          type: 'cat',
          range: [0, 1],
          ...scale.x,
        },
        y: {
          min: 0,
          ...scale.y,
        },
      };

    const position = axis[0] + '*' + axis[1];
    return (
      <div style={{ height }}>
          {height > 0 && 
            (<Chart height={height} data={data} scale={scaleProps} padding='auto'>
                {/* <Axis name={axis[0]} title={xtitle} tickLine={null} line={line} label={null}/> */}
                {/* <Axis name={axis[1]} title={ytitle} tickLine={null} line={line} label={null}/> */}
                <Tooltip/>
                <Geom type="line" position={position} size={2} color={color}/>
                <Geom type='point' position={position} size={1} shape={'circle'}
                color={color} style={{ stroke: color, lineWidth: 2}}>
                </Geom>
            </Chart>)
          }
      </div>
   )
  }
}
