import React from 'react';
import { Menu, Tooltip, Button, Icon, Popover, Input, Modal, Dropdown, message } from 'antd';

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
            <div style={{position: 'absolute', 'bottom': '20px', 'right': 0, 'left': 0, 'marginRight': 'auto', 'marginLeft': 'auto', 'width': 210, 'display': 'flex'}}>
                <Tooltip placement="top" title='Delete Tag'>
                    <Button style={{'width': 30, 'padding': 0}} onClick={() => this.setState({ deleteTagModal: true })}>
                        <Icon type="delete" />
                    </Button>
                </Tooltip>
                <Modal
                    title="Please confirm to delete this tag"
                    visible={this.state.deleteTagModal}
                    onOk={() => this.handleDeleteTag.bind(this)(selectedTag)}
                    onCancel={() => this.setState({deleteTagModal: false})}
                    width={300}
                >
                    <p>{selectedTag.shapeTag}</p>
                </Modal>
                <Dropdown overlay={this.createMenu(this.props.tags)} placement="topCenter">
                    <Button style={{'width': 150, 'display': 'flex'}}>
                        <span style={{'wordWrap': 'break-word', 'width': '90%', 'display': 'block', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'textOverflow': 'ellipsis'}}>
                            {selectedTag.shapeTag}   
                        </span>  
                        <Icon type="up" style={{'width': '10%'}}/>
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
                        <Button style={{'width': 30, 'padding': 0}}> <Icon type="plus" /> </Button>
                        </Tooltip>
                </Popover>
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