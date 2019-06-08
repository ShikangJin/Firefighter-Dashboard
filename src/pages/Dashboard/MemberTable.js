import React from 'react';
import { Table, Divider, Tag, Modal } from 'antd';

var columns = [];

class MemberTable extends React.Component {

    componentWillMount() {
        columns = [
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
                    let color = status === 'good' ? 'green' : 'red';
                    return (
                        <Tag color={color} key={status}>
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