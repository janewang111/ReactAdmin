import React, { Component } from 'react'
import {Card,Table,Button,Modal, message} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { reqAddOrUpdateUser, reqDeleteUser,reqUsers } from '../../api'
import {formateDate} from '../../utils/dateUtils'
import LinkButton from '../../componets/link-button'
import UserForm from './user-form';

export default class User extends Component {

    state = {
        users: [],
        user: {},
        roles: [],
        isShow: false,

    }



    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (role_id) => this.roleNames[role_id]
                // render: (role_id)=> this.state.roles.find(role => role._id === role_id).name
            },
            {
                title: '操作',
                render: (user) =>{
                 
                    return (
                        <span>
                            <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                            <LinkButton onClick={() => this.confirm(user)}>删除</LinkButton>
                        </span>
                        
                    )
                }
                
            }
        ]
        
    }

    confirm = (user) => {
        const {_id,username} = user
        Modal.confirm({
            title: `确定要删除${username}吗？`,
            icon: <ExclamationCircleOutlined />,
            onOk:async ()=>{
                const result = await reqDeleteUser(_id)
             
                console.log('****',result)
                if(result.data.status === 0){
                    this.getUsers()
                    message.success('删除成功')
                }


            }
        })
    }



    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre,role)=>{
            pre[role._id] = role.name 
            return pre
        },{})

        this.roleNames = roleNames

    }

    getUsers = async () => {
        const result = await reqUsers()
        if(result.data.status === 0 ){
            const {users,roles} = result.data.data
            this.initRoleNames(roles)
            console.log('users',users)
            this.setState({users,roles})

        }

    }

    addRole = async () => {
        const {users} = this.state
        const user = this.formRef.current.getFieldsValue()
        // this.formRef.current.resetFields()
        if(this.user){
            user._id = this.user._id
        }
        
        console.log('this',this)
        const result = await reqAddOrUpdateUser(user)
     
        this.setState({isShow:false})
        if(result.data.status === 0 ){
            message.success(`${this.user?'修正':'添加'}用户成功`)
            const user = result.data.data
            this.setState({users:[...users,user]})
        }
        
        console.log('&&&',result)
        
        
    } 

    showUpdate = (user) => {
        this.setState({isShow:true})
        this.user = user

    }

    showAdd = () => {
        this.user = null
        this.setState({isShow:true})
    }


   

    
    
    

    UNSAFE_componentWillMount(){
        this.initColumns()
        
    }

    componentDidMount(){
        this.getUsers()
    }

    
    render() {

        const {users,roles,isShow} = this.state
        const user = this.user|| {} 
          
        const title = <Button type="primary" onClick={this.showAdd}>添加用户</Button>

        return (
            <Card title={title}>
                <Table 
                    bordered
                    rowKey='_id'
                    dataSource={users} 
                    columns={this.columns}
                   
                />

                <Modal title={user._id?'修改用户':'添加用户'}
                    visible={isShow===true} 
                    onOk={this.addRole} 
                    onCancel={()=>{
                        // this.formRef.current.resetFields()
                        this.setState({isShow:false})}
                    }
                    destroyOnClose={true}
                >
                    <UserForm 
                        roles={roles}
                        user={user}
                        setForm={(formRef)=>{this.formRef = formRef}}
                    />
                </Modal>

            </Card>
        )
    }
}
