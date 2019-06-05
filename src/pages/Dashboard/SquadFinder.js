import React, { Suspense } from 'react';
import { Card, Row, Col, Select, Input } from 'antd';

const { Option } = Select;
const Search = Input.Search;
const squads = [];
for (let i = 0; i < 10; i++) {
    squads.push(<Option key={'squad' + i}>{'squad' + i}</Option>);
}

const MemberTable = React.lazy(() => import('./MemberTable.js'));
class SquadFinder extends React.Component {

    handleChange(value) {
        // dispatch here to get new state with members info in squads
        console.log(`Selected: ${value}`);
    }

    render() {
        return (
            <div>
                <Card>
                    <Row glutter={40}>
                            <Select
                                mode="tags"
                                size="default"
                                placeholder="Please select squads"
                                onChange={this.handleChange}
                                style={{width: '100%'}}
                            >
                                {squads}
                            </Select>
                    </Row>
                    <Row style={{'marginTop': '15px'}}>
                        <Search placeholder="input search text" 
                                    onSearch={value => console.log(value)} 
                                    enterButton
                                    style={{'width': '300px'}}
                         />
                    </Row>
                    <Row style={{'marginTop': '30px'}}>
                        <Suspense fallback={null}>
                            <MemberTable nameClick={this.props.nameClick} data={this.props.data}/>
                        </Suspense>
                        
                    </Row>
                </Card>
            </div>
        );
    }
}

export default SquadFinder;