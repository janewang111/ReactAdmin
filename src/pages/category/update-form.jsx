import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form,Input} from 'antd'

const Item = Form.Item




export default class UpdateForm extends Component {

    static propTypes = {
        categoryName:PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }

    formRef = React.createRef()
    

    // handleKeyUp= (event) =>{
    //     const {target} = event
    //     this.props.updateCate(target.value)
    //     console.log('target value',target.value)
    // }

    UNSAFE_componentWillMount(){
        this.props.setForm(this.formRef)

    }

    // componentDidMount(){
    //     this.props.setForm(this.formRef)

    // }

    render() {
        const {categoryName} = this.props
        console.log('update from categoryName',categoryName)
        console.log('update-form',this)
        return (
            <Form ref={this.formRef}>
                <Item
                    name='categoryName'
                    initialValue= {categoryName}
                    rules={[{required:true,message:'分类名称必须输入'}]}
                >
                    <Input/>
                </Item>
                
            </Form>
        )
    }
}
