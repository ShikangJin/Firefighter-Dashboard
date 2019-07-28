import React from 'react';
import { List } from 'antd';
import TagControlPanel from '@/components/TagControlPanel';
import styles from './index.less';
import check from '@/assets/check.png';

// function dataProcessing(data) {
//     let result = [];
//     data.forEach(src => {
//         let srcObj = {};
//         srcObj.text = src.text;
//         srcObj.
//         result.push(src.text);
//     })
//     return result;
// }

class ResourceManage extends React.Component {

    switchDisplay(item) {
        const { modifyOverlay, overlay } = this.props;
        item.display = !item.display;
        modifyOverlay(overlay);
    }

    render() {
        const { overlay, tags, deleteShapeTag, addShapeTag, setSelectedTag, selectedTag } = this.props;
        return (
            <div className={styles.tab}>
                <h3 className={styles.title}>Resource Manage</h3>
                <div className={styles.list}>
                    <List
                        size="small"
                        bordered
                        dataSource={overlay}
                        renderItem={item => 
                            <List.Item className={styles.item}>
                                <div onClick={() => this.switchDisplay.bind(this)(item)}> {item.text} </div>
                                <div className={styles.check}> {item.display ? <img src={check} alt='check'/> : null}</div>
                            </List.Item>
                        }
                    />
                </div>
                <TagControlPanel 
                    tags={tags}
                    deleteShapeTag={deleteShapeTag}
                    addShapeTag={addShapeTag}
                    setSelectedTag={setSelectedTag}
                    selectedTag={selectedTag}
                />
            </div>
        );
    }
}

export default ResourceManage;