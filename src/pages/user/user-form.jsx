import React, { Component } from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const {Option} = Select



export default class UserForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired,
     
    }

    handleChange = () => {

    }

    formRef = React.createRef()

    UNSAFE_componentWillMount(){
        this.props.setForm(this.formRef)
        const {roles} = this.props
    }
    
    render() {


        console.log('addform this',this)

        const {roles} = this.props
        const user = this.props.user || {}

        // const {} = this.props
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 }
        };
        
        return (
            <Form ref={this.formRef} {...formItemLayout}>
                <Item 
                    label='用户名'
                    name='username'
                    initialValue={user.username}
                    // rules={[{required:true,message:'用户名必须输入'}]}
                > 
                    <Input placeholder='请输入用户名'/>
                </Item>
                {
                    user._id? null:(
                        <Item 
                            label='密码'
                            name='password'
                            initialValue={user.password}
                            // rules={[{required:true,message:'密码必须输入'}]}
                        > 
                            <Input type='password' placeholder='请输入密码'/>
                        </Item>

                    )
                }
                
                <Item 
                    label='手机号'
                    name='phone'
                    initialValue={user.phone}
                > 
                    <Input placeholder='请输入电话'/>
                </Item>
                <Item 
                    label='邮箱'
                    name='email'
                    initialValue={user.email}
                > 
                    <Input placeholder='请输入邮箱'/>
                </Item>
                <Item 
                    label='角色'
                    name='role_id'
                    initialValue={user._id?user.role_id:roles[0]._id}
                > 
                    <Select  onChange={this.handleChange}>
                        {this.props.roles.map((role)=>{
                            return (
                                <Option key={role._id} value={role._id}>{role.name}</Option>

                            )

                        })}
                        {/* <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>
                            Disabled
                        </Option>
                        <Option value="Yiminghe">yiminghe</Option> */}
                    </Select>
                </Item>
                
                
            </Form>
        )
    }
}



