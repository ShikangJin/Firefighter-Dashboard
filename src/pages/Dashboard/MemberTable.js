import React from 'react';
import { Table, Divider, Tag, Modal } from 'antd';

function memberInfo(idx) {
    let info = data[idx].info;
    Modal.info({
        title: info.name,
        content: (
            <div style={{'marginTop': '20px'}}>
                <p>{'Age: ' + info.age}</p>
                <p>{'Body Temperature: ' + info.bodyTemp}</p>
            </div>
        ),
        onOk() {},
    });
};

const columns = [
    {
        title: 'Squad',
        dataIndex: 'squad',
        key: 'squad',
        render: text => <span style={{'fontWeight': 'bold'}}>{text}</span>,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, _, index) => 
            <a href="javascript:;"
               onClick={() => memberInfo(index)}
            >
                {name}
            </a>,
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: status => {
            let color = status === 'good' ? 'green' : 'red';
            return (
                <Tag color={color} key={status}>
                    {status.toUpperCase()}
                </Tag>
            );
        },
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        info: {
            name: 'John Brown',
            age: 21,
            bodyTemp: 27.2,
        },
        squad: 'Squad1',
        status: 'good',
    },
    {
        key: '2',
        name: 'Jim Green',
        info: {
            name: 'Jim Green',
            age: 22,
            bodyTemp: 27.4,
        },
        squad: 'Squad2',
        status: 'bad',
    },
    {
        key: '3',
        name: 'Joe Black',
        info: {
            name: 'Joe Black',
            age: 19,
            bodyTemp: 27.1,
        },
        squad: 'Squad3',
        status: 'good',
    },
    
];

function showInfo(info) {
    Modal.info({
        title: info.name,
        content: (
          <div>
            <p>{'Age: ' + info.age}</p>
            <p>{'Body Temperature: ' + info.bodyTemp}</p>
          </div>
        ),
        onOk() {},
    });
};

class MemberTable extends React.Component {
    render() {
        return (
            <div>
                <Table columns={columns} dataSource={data} />
            </div>
        );    
    }
}

export default MemberTable;