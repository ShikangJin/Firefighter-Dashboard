import React from 'react';
import { Form, Input, Button, Upload, Icon, message } from 'antd';
import styles from './index.less';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}
  
function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    if (!isJPG && !isPNG) 
        message.error('You can only upload JPG or PNG file!');
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) 
        message.error('Image must smaller than 2MB!');
    return (isJPG || isPNG) && isLt2M;
}

class RegistrationForm extends React.Component {
    
    state = {
        loading: false,
        imageUrl: '',
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                this.setState({
                    imageUrl,
                    loading: false,
                })},
            );
        }
    };

    handleSubmit = e => {
        const { dispatch } = this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            this.props.form.resetFields();
            this.props.addMember(values, this.state.imageUrl);
        });
    };
      
      
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                span: 24,
                offset: 0,
                },
                sm: {
                span: 16,
                offset: 8,
                },
            },
        };

        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Picture</div>
            </div>
        );
        const imageUrl = this.state.imageUrl;
        const { getFieldDecorator } = this.props.form;

        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className={styles.form}>
                <Form.Item className={styles.imgUploadItem}> 
                    <div className={styles.imgUploadField}>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange} 
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" className={styles.img} /> : uploadButton}
                        </Upload>
                    </div>
                </Form.Item>
                <Form.Item label={<span> Name </span>}>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please input name!', whitespace: true }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label={<span> Age </span>}>
                    {getFieldDecorator('age', {
                        rules: [{ required: true, message: 'Please input age!', whitespace: true }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label={<span> Squad </span>}>
                    {getFieldDecorator('squad', {
                        rules: [{ required: true, message: 'Please input squad!', whitespace: true }],
                    })(<Input />)}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

const AddMemberForm = Form.create({ name: 'register' })(RegistrationForm);
export default AddMemberForm;