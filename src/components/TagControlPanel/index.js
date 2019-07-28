import React from 'react';
import { Menu, Tooltip, Button, Icon, Popover, Input, Modal, Dropdown, message } from 'antd';
import styles from './index.less';

class TagControlPanel extends React.Component {
    state = {
        addTagModal: false,
        deleteTagModal: false,
        newPropValue: '',
    }

    createMenu(tags) {
        let items = [];
        tags.forEach(tag => {
            items.push(
                <Menu.Item key={tag.shapeTag} id={tag.idx}>   
                    <span> {tag.shapeTag} </span> 
                </Menu.Item> 
            );
        });
        return (
            <Menu onClick={(e) => {this.props.setSelectedTag({shapeTag: e.key, idx: e.item.props.id})}}>
                {items}
            </Menu>
        );
    }

    handleVisibleChange = visible => {
        this.setState({ visible });
    };

    enterTag() {
        if (this.state.newPropValue === '' || (!this.state.newPropValue.replace(/\s/g, '').length)) {
            message.warning('Please enter something');
            return;
        }
        this.setState({ addTagModal: true })
    }

    handleAddTag() {
        this.props.addShapeTag(this.state.newPropValue);
        this.setState({newPropValue: '', addTagModal: false});
    }

    handleDeleteTag(selectedTag) {
        this.props.deleteShapeTag(selectedTag.idx);
        this.setState({deleteTagModal: false});
    }

    render() {
        const { selectedTag } = this.props;
        return (
            <div className={styles.container}>

                <Tooltip placement="top" title='Delete Tag'>
                    <Button 
                        className={styles.controlBtm} 
                        onClick={() => this.setState({ deleteTagModal: true })}
                    >
                        <Icon type="delete" />
                    </Button>
                </Tooltip>
                
                <Dropdown overlay={this.createMenu(this.props.tags)} placement="topCenter">
                    <Button className={styles.dropdownBtm}>
                        <span className={styles.tag}>
                            {selectedTag.shapeTag}   
                        </span>  
                        <Icon type="up" className={styles.icon}/>
                    </Button>
                </Dropdown>
                
                <Popover
                    content={ 
                        <Input 
                            value={this.state.newPropValue}
                            onChange={e => this.setState({ newPropValue: e.target.value })}onPressEnter={this.enterTag.bind(this)}
                            allowClear
                            placeholder="Press Enter to Add"
                        /> 
                    }
                    title="New Tag"
                    trigger="click"
                    visible={this.state.visible}
                    onVisibleChange={this.handleVisibleChange}
                >
                    <Tooltip placement="top" title='Add New Tag'>
                        <Button className={styles.controlBtm}><Icon type="plus" className={styles.addIcon}/> </Button>
                    </Tooltip>
                </Popover>

                <Modal
                    title="Please confirm to delete this tag"
                    visible={this.state.deleteTagModal}
                    onOk={() => this.handleDeleteTag.bind(this)(selectedTag)}
                    onCancel={() => this.setState({deleteTagModal: false})}
                    width={300}
                >
                    <p>{selectedTag.shapeTag}</p>
                </Modal>
                <Modal
                    title="Please confirm to add this tag"
                    visible={this.state.addTagModal}
                    onOk={this.handleAddTag.bind(this)}
                    onCancel={() => this.setState({addTagModal: false})}
                    width={300}
                >
                    <p>{this.state.newPropValue}</p>
                </Modal>

            </div>
        );
    }
}

export default TagControlPanel;