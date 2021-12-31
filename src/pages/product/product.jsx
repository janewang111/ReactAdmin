import React, { Component } from 'react'
import { Route,Switch,Redirect} from 'react-router-dom'
import './product.less'


import ProductAddUpdate from './add-update'
import ProductDetail from './detail'
import ProductHome from './home'

export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route exact path='/product' component={ProductHome} />
                <Route path='/product/addupdate' component={ProductAddUpdate}/>
                <Route path='/product/detail' component={ProductDetail}/>
                <Redirect to='/product'/>   
            </Switch>
        )
    }
}
