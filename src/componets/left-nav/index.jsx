import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu } from 'antd';
import './index.less'
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig';
import memoryUtils from '../../utils/memoryUtils';

const { SubMenu } = Menu;


class LeftNav extends Component {

    hasAuth = (item) => {
        const {key,isPublic} = item
        
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username

        if(username==='admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        } else if(item.children){
            return !!item.children.find(child => menus.indexOf(child.key)!== -1)
        }

        return false

    }

    // getMenuNodes_map = (menuList)=>{
    //     return menuList.map(item =>{
    //         if(!item.children){
    //             return (
    //                 <Menu.Item key={item.key} icon={item.icon}>
    //                     <Link to={item.key}>{item.title}</Link>
    //                 </Menu.Item>
    //             ) 
    //         } else {
    //             return (
    //                 <SubMenu key={item.key} icon={item.icon} title={item.title}>
    //                     {this.getMenuNodes_map(item.children)}
    //                 </SubMenu>
    //             )
    //         }
    //     })
    // }

    getMenuNodes = (menuList)=>{
        const path = this.props.location.pathname
     
        return menuList.reduce((pre,item)=>{
            if (this.hasAuth(item)) {
                if(!item.children){
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>{item.title}</Link>
                        </Menu.Item>
                    ))
    
                } else {
    
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    if(cItem){
                        this.openkey = item.key
                    }
    
                    pre.push((
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                } 

            }
            
            return pre
        },[])
    }

    UNSAFE_componentWillMount(){
        this.menuNode = this.getMenuNodes(menuList)
    }

    render() {

        let path = this.props.location.pathname
        if(path.indexOf('/product')===0){
            path = '/product'
        }

        const openkey = this.openkey

        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo} alt="logo"></img>
                    <h1>硅谷后台</h1>
                </Link>

                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openkey]}
                    mode="inline"
                    theme="dark"
                >
                    {/* <Menu.Item key="/home" icon={<PieChartOutlined />}>
                        <Link to='/home'>首页</Link>
                    </Menu.Item>
                   
                    <SubMenu key="sub1" icon={<MailOutlined />} title="商品">
                        <Menu.Item key="/category" icon={<MailOutlined/>}>
                            <Link to='/category'>品类管理</Link>
                        </Menu.Item>
                        <Menu.Item key="/product" icon={<MailOutlined/>}>
                            <Link to='/product'>商品管理</Link>  
                        </Menu.Item>
                    </SubMenu>

                    <Menu.Item key="/user" icon={<PieChartOutlined />}>
                        <Link to='/user'>用户管理</Link> 
                    </Menu.Item>

                    <Menu.Item key="/role" icon={<PieChartOutlined />}>
                        <Link to='/role'>角色管理</Link>
                    </Menu.Item>

                    <SubMenu key="sub2" icon={<MailOutlined />} title="图形图表">
                        <Menu.Item key="/charts/bar" icon={<MailOutlined/>}>
                            <Link to='/charts/bar'>柱状图</Link>
                        </Menu.Item>
                        <Menu.Item key="/charts/line" icon={<MailOutlined/>}>
                            <Link to='/charts/line'>线型图</Link>  
                        </Menu.Item>
                        <Menu.Item key="/charts/pie" icon={<MailOutlined/>}>
                            <Link to='/charts/pie'>饼图</Link>  
                        </Menu.Item>
                    </SubMenu> */}
 
                    {
                        this.menuNode
                    } 

                   
                </Menu>

            </div>
            
        )
    }
}

export default withRouter(LeftNav)
