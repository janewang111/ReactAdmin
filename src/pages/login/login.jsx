import React from "react";
import { Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from  '../../api/index'
import '../../utils/memoryUtils'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";
import { Redirect } from "react-router-dom";

const rules = [
    {required: true,whitespace:true,message: '用户名不能为空!'},
    {min: 4,message: '用户名最少4位!'},
    {max: 12,message: '用户名最多12位'},
    {pattern: /^[a-zA-Z0-9_]+$/,message: '用户名英文数字或者下划线组成'},
]

// export default class Login extends Component {



//     onFinish=()=>{

//     }

//     render() {
//         return (
//             <div className="login">
//                 <header className="login-header">
//                     <img src={logo} alt="logo" />
//                     <h1>React项目：后台管理系统</h1>
//                 </header>
//                 <section className="login-content">
//                     <h2>用户登陆</h2>
//                     <Form
//                         name="normal_login"
//                         className="login-form"
//                         initialValues={{
//                             remember: true,
//                         }}
//                         // onSubmint={this.handleSubmit}
//                         onFinish={this.onFinish}

//                         >
//                         <Form.Item
//                             name="username"
//                             rules={[
//                                 {
//                                     required: true,
//                                     message: 'Please input your Username!',
//                                 },
//                             ]}
//                         >
//                             <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
//                         </Form.Item>
//                         <Form.Item
//                             name="password"
//                             rules={[
//                                 {
//                                     required: true,
//                                     message: 'Please input your Password!',
//                                 },
//                             ]}
//                         >
//                             <Input
//                             prefix={<LockOutlined className="site-form-item-icon" />}
//                             type="password"
//                             placeholder="密码"
//                             />
//                         </Form.Item>

//                         <Form.Item>
//                             <Button type="primary" htmlType="submit" className="login-form-button">
//                             登陆
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 </section>
//             </div>
//         )
//     }
// }

const Login = (props) => {
    const [form] = Form.useForm();

    const user = memoryUtils.user
    if(user && user._id ) {
    return <Redirect to='/'/>
    } 

    const onFinish =async (values) => {
        // form.validateFields() 
        const {username,password} = values
        const {history} = props
       
        const response = await reqLogin(username,password)
        // console.log('请求成功',response.data)   
        
        // reqLogin(username,password).then(response=>{
        //     console.log('成功了',response.data)
        // }).catch(error=>{
        //     console.log('失败了',error)
        // })

        const result = response.data
        if (result.status === 0){
            message.success('登陆成功')
            const user = result.data
            memoryUtils.user = user
            storageUtils.saveUser(user)
            console.log('登陆成功')
            history.replace('/')
        } else {
            console.log('登陆失败'+result.msg)
            message.error( result.msg)
        }

    };

    // React.useEffect(() => {
         
    // },[]);
  
    return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登陆</h2>
                    <Form
                        form={form}
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        >
                        <Form.Item
                            name="username"
                            initialValue="admin"
                            rules={rules}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={rules}    
                        >
                            <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                            登陆
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
    )
};

export default Login
