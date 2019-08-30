import React from 'react';
import { Card, List, Button, Icon, Tooltip } from 'antd';
import check from '@/assets/check.png';
import styles from './index.less';

function dataProcessing(data) {
    let result = [];
    Object.keys(data).forEach(engine => {
        let curEngine = {};
        curEngine.name = engine;
        curEngine.members = data[engine];
        result.push(curEngine);
    })
    return result;
}

function pickDot(status) {
    switch(status) {
        case 'good': return styles.greenDot;
        case 'Good': return styles.greenDot;
        case 'unknown': return styles.greyDot;
        case 'Mayday': return styles.redDot;
        default: return styles.greyDot;
    }
}

function generateStatusGraph(members) {
    let graphNodes = [];
    Object.keys(members).forEach(member => {
        graphNodes.push(
            <div key={members[member].id} className={pickDot(members[member].status)}/>
        );
    });
    return (
        <div style={{'display': 'flex', 'flexWrap': 'wrap', 'width': '100%'}}>
            {graphNodes}
        </div>
    );
}

class EnginesOverview extends React.Component {
    
    render() {
        const { wholeData, handleClickEngine, handleClickMember, handleClickAdd, curSquads } = this.props;
        return (
            <div className={styles.tab}>
                <h3 className={styles.title}>Engines Overview</h3>
                <div className={styles.list}>
                    <List
                        size="small"
                        // bordered
                        dataSource={dataProcessing(wholeData)}
                        header={
                            <div>
                                {/* <Tooltip placement="top" title='Engine name'>
                                    <Icon type="team" />
                                </Tooltip> */}
                                {/* <Tooltip placement="top" title='Member Status'>
                                    <Icon type="heart" />
                                </Tooltip> */}
                                <span className={styles.listTitle}>Engine</span>
                                <span>Status</span>
                            </div>
                        }
                        renderItem={item => 
                            <List.Item className={styles.item}>
                                <div className={styles.check}>
                                    {curSquads.indexOf(item.name) > -1 ? <img src={check} alt="check"/> : null}
                                </div>

                                <div className={styles.name}>
                                    <a href="javascript:;" onClick={() => handleClickEngine(item.name)}>{item.name}</a>
                                </div>
                                
                                <Button ghost className={styles.status} onClick={() => handleClickMember(true)}>
                                    {generateStatusGraph(item.members)}
                                </Button>

                                {/* <div className={styles.division}>
                                    <span>Div</span>    
                                </div> */}
                                            
                            </List.Item>}
                    />
                </div>
                <Tooltip placement="top" title='Add Member'>
                    <Button 
                        type='primary' 
                        shape='circle' 
                        size='small' 
                        className={styles.add} 
                        onClick={() => handleClickAdd(true)}
                    > 
                        <Icon style={{'margin': 0}} type="user-add" />
                    </Button>    
                </Tooltip>
            </div>
        );
    }
}

export default EnginesOverview;