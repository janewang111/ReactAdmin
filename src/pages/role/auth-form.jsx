import React, { Component } from 'react'
import {Form,Input,Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const {Item} = Form




export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object.isRequired
    }

    // state = {
    //     checkedKeys: [],
    // }

    constructor(props){
      super(props)

      const {menus} = this.props.role
      this.state={checkedKeys:menus}

    }

    getMenus = () => this.state.checkedKeys
    

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre,item)=>{
            pre.push(
              {
                title: item.title,
                key: item.key,
                children: item.children ? this.getTreeNodes(item.children): null
              }
            )
            return pre
        },[])
    }

    onCheck = (checkedKeys, info) => {
      console.log('onCheck', checkedKeys, info)
      this.setState({checkedKeys})
    }

    UNSAFE_componentWillMount(){
      this.treeNodes = this.getTreeNodes(menuList)
    }
    
    render() {

        const {role} = this.props

        const {checkedKeys} = this.state

        return (
            <div >
                <Item label='角色名称'> 
                    <Input value={role.name} disabled/>
                </Item>
                
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                    treeData={
                      [
                        {
                          title: '平台权限',
                          key: 'key',
                          children: this.treeNodes
                        }
                      ]
                    }
                />
            </div>
        )
    }
}



