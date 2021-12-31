import React, { Component } from 'react'
import {Card,Table,Button,Modal, message} from 'antd'
import { reqAddRole, reqRoles, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'

export default class Role extends Component {

    state = {
        roles: [],
        role: {},
        isShowAdd: false,
        isShowAuth: false,

    }

    constructor(props){
        super(props)

        this.authRef = React.createRef()

    }

    // formatterTime = (val) => {
    //     return val? moment(val).format('YYYY-MM-DD HH:mm:ss'):''

    // }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                // render: this.formatterTime
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                // render: this.formatterTime
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            }
        ]
        
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({role})

            }
        }

    }

    getRoles = async () => {
        const result = await reqRoles()
        console.log('this',this)
        if(result.data.status === 0){
            const roles = result.data.data

            this.setState({roles})

        }
        
    }

    addRole = async () => {
        this.formRef.current.validateFields().then(async(values,err)=>{
            if(!err){
                this.setState({isShowAdd:false})

                const roleName = values.roleName
                console.log(values)
                const result = await reqAddRole(roleName)
                console.log('result',result)
                if(result.data.status === 0){
                    message.success('添加角色成功！')
                    // this.getRoles()
                    const role = result.data.data
                    // const roles = [...this.state.roles]
                    // roles.push(role)
                    // this.setState({roles})
                    this.setState((state)=>({
                        roles:[...state.roles,role]

                    }))

                } else {
                    message.error('添加角色失败！')
                }
            
            }
        })   
    }

    updateRole = async () => {
        this.setState({isShowAuth:false})

        const role = this.state.role
        console.log('^^^^',this)
        const menus = this.authRef.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username

        const result = await reqUpdateRole(role)
        if(result.data.status === 0){
            
            if(role._id === memoryUtils.user.role_id){
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('当前用户角色权限修改了，重新登陆')
            } else{
                // this.getRoles()
                message.success('设置角色权限成功')
                this.setState({roles: [...this.state.roles]})

            }
            
        }else {
            message.error('角色更新失败')
        }


    }
        
  

    UNSAFE_componentWillMount(){
        this.initColumns()
        
    }

    componentDidMount(){
        this.getRoles()
    }

    
    render() {

        const {roles,role,isShowAdd,isShowAuth} = this.state
          
        const title = (
            <span>
                <Button type="primary" style={{margin:'0 15px'}} onClick={()=>{this.setState({isShowAdd:true})}}>创建角色</Button>
                <Button type="primary" disabled={!role._id} onClick={()=>{this.setState({isShowAuth:true})}}>设置角色的权限</Button>
            </span>

        )

        return (
            <Card title={title}>
                <Table 
                    bordered
                    rowSelection={{
                        type:'radio',
                        selectedRowKeys:[role._id],
                        onSelect: (role)=>{
                            this.setState({role})
                        }
                    }}
                
                    

                    rowKey='_id'
                    dataSource={roles} 
                    columns={this.columns}
                    onRow = {this.onRow}
                />

                <Modal title="添加角色" 
                    visible={isShowAdd===true} 
                    onOk={this.addRole} 
                    onCancel={()=>{this.setState({isShowAdd:false})}}
                    destroyOnClose={true}
                >
                    <AddForm      
                        setForm = {(formRef) => {this.formRef = formRef}}
                    />
                </Modal>

                <Modal title="设置角色的权限" 
                    visible={isShowAuth===true} 
                    onOk={this.updateRole} 
                    onCancel={()=>{this.setState({isShowAuth:false})}}
                    destroyOnClose={true}
                >
                    <AuthForm 
                        ref={this.authRef} 
                        role={role}    
                        
                    />
                </Modal>

            </Card>
        )
    }
}
