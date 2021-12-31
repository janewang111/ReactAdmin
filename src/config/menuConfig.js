import {MailOutlined} from '@ant-design/icons';

const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: <MailOutlined/>,
        isPublic: true

    },
    {
        title: '商品',
        key: '/products',
        icon: 'appstore',
        children: [
            {
                title: '品类管理',
                key: '/category',
                icon: 'bars'
            },
            {
                title: '商品管理',
                key: '/product',
                icon: 'tool'
            } 
        ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: <MailOutlined/>
    },
    {
        title: '角色管理',
        key: '/role',
        icon: <MailOutlined/>
    },
    {
        title: '图形图表',
        key: '/charts',
        icon: 'appstore',
        children: [
            {
                title: '柱状图',
                key: '/charts/bar',
                icon: 'bars'
            },
            {
                title: '线形图',
                key: '/charts/line',
                icon: 'tool'
            },
            {
                title: '饼图',
                key: '/charts/pie',
                icon: 'bars'
            }  
        ]
    },
]

export default menuList