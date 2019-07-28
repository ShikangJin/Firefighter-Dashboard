import React from 'react';
import { Table, Divider, Tag, Modal } from 'antd';

var columns = [];

function pickColor(status) {
    switch(status) {
        case 'good': return 'green';
        case 'Good': return 'green';
        case 'unknown': return 'grey';
        case 'Mayday': return 'red';
        default: return 'grey';
    }
}

class MemberTable extends React.Component {

    componentWillMount() {
        columns = [
            {
                title: 'Engine',
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
                       onClick={() => this.props.nameClick(index)}
                    >
                        {name}
                    </a>,
            },
            {
                title: 'Status',
                key: 'status',
                dataIndex: 'status',
                render: status => {
                    return (
                        <Tag color={pickColor(status)} key={status}>
                            {status.toUpperCase()}
                        </Tag>
                    );
                },
            },
        ];
    }
    
    render() {
        return (
            <div>
                <Table columns={columns} dataSource={this.props.data} />
            </div>
        );    
    }
}

export default MemberTable;