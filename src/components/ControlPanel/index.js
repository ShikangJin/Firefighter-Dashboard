import React from 'react';
import { Icon, Tabs } from 'antd';
import styles from './index.less';
import EnginesOverview from '@/components/EnginesOverview';
import ResourceManage from '@/components/ResourceManage';

const { TabPane } = Tabs;

class ControlPanel extends React.Component {  
    render() {
        const { wholeData, handleClickEngine, handleClickMember, handleClickAdd, curSquads, overlay, tags, deleteShapeTag, addShapeTag, setSelectedTag, selectedTag, modifyOverlay } = this.props;
        return (
            <div className={styles.container}>
                
                <Tabs defaultActiveKey="1" >
                    <TabPane tab={<Icon type="team" />} key="1">
                        <EnginesOverview 
                            wholeData={wholeData}
                            handleClickEngine={handleClickEngine}
                            handleClickMember={handleClickMember}
                            handleClickAdd={handleClickAdd}
                            curSquads={curSquads}
                        />
                    </TabPane>
                    <TabPane tab={<Icon type="cluster" />} key="2">
                        <ResourceManage 
                            overlay={overlay}
                            tags={tags}
                            deleteShapeTag={deleteShapeTag}
                            addShapeTag={addShapeTag}
                            setSelectedTag={setSelectedTag}
                            selectedTag={selectedTag}
                            modifyOverlay={modifyOverlay}
                        />
                    </TabPane>
                </Tabs>
            </div>

        );
    }
}

export default ControlPanel;