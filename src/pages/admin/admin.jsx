import React, { Component } from 'react'
import { Layout } from 'antd';
import { Redirect,Switch,Route } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../componets/left-nav';
import Header from '../../componets/header';
import Category from '../category/category'
import Bar from '../charts/bar'
import Line from '../charts/line';
import Pie from '../charts/pie'
import Product from '../product/product';
import Role from '../role/role';
import User from '../user/user';
import Home from '../home/home';

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    
    render() {
        const user = memoryUtils.user
        if (!user || !user._id) {
            return <Redirect to='/login'/>
        }
        return (
            <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header>
                        <Header/>
                    </Header>
                    <Content style={{margin:20,backgroundColor:'white'}}>
                        <Switch>
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Redirect to='/home'/>

                        </Switch>
                    </Content>
                    <Footer style={{textAlign:'center',color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更加页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}
