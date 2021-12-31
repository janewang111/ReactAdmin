import React, { Component } from 'react'
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import { reqWeather } from '../../api'
import storageUtils from '../../utils/storageUtils';
import menuList from '../../config/menuConfig';
import './index.less'
import LinkButton from '../link-button';


class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',
        weather: '',
    }



    getTime = () =>{
        this.timer = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather = async () =>{
        const {dayPictureUrl,weather} = await reqWeather('大连')
        this.setState({dayPictureUrl,weather})
    }

    getTitile = ()=>{
        const path = this.props.location.pathname
        let title
        menuList.forEach(item =>{
            if(item.key===path){
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if(cItem){
                    title = cItem.title
                }
            }

        })
        return title
    }

    logout = () =>{
        Modal.confirm({
            content: '确定要退出吗?',
            onOk:() => {
                console.log('onOk',this)
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            }
          });
    }

    componentDidMount(){
        this.getTime()
        // this.getWeather()
    }

    componentWillUnmount(){
        clearInterval(this.timer)
    }

    render() {

        const username = memoryUtils.user.username

        const {currentTime,dayPictureUrl,weather} = this.state

        const title = this.getTitile()

        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>

                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>

                </div>
            </div>
        )
    }
}

// export default Header

export default withRouter(Header)
