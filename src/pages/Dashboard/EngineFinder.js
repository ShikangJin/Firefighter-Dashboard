import React, { Suspense } from 'react';
import { Card, Row, Col, Select, Input } from 'antd';

const { Option } = Select;
const Search = Input.Search;

const MemberTable = React.lazy(() => import('@/components/MemberTable'));

class EngineFinder extends React.Component {

    // generateOptions(squads) {
    //     const options = [];
    //     squads.forEach(squad => {
    //         options.push(<Option key={squad}>{squad}</Option>);
    //     });
    //     return options;
    // }
    render() {
        const { squads } = this.props;

        return (
            <div>
                {/* <Card> */}
                    {/* <Row glutter={40}>
                            <Select
                                mode="tags"
                                size="default"
                                placeholder="Please select engines"
                                onChange={value => this.props.fetchData(value)}
                                style={{width: '100%'}}
                            >
                                {this.generateOptions(squads)}
                            </Select>
                    </Row> */}
                    <Row style={{'marginTop': '15px'}}>
                        <Search 
                            placeholder="Member Name Filter" 
                            onSearch={value => this.props.nameSearch(value)} 
                            enterButton
                            style={{'width': '300px'}}
                         />
                    </Row>
                    <Row style={{'marginTop': '30px'}}>
                        <Suspense fallback={null}>
                            <MemberTable nameClick={this.props.nameClick} data={this.props.data}/>
                        </Suspense>
                        
                    </Row>
                {/* </Card> */}
            </div>
        );
    }
}

export default EngineFinder;