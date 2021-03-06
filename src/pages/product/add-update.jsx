import React, { Component } from 'react'
import {Card,Form,Input,Cascader,Button, message} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from '../../componets/link-button'
import { reqCategorys,reqAddOrUpdateProduct } from '../../api'
import PictureWall from './picture-wall'
import RichTextEdit from './rich-text-edit'

const {Item} = Form
const {TextArea} = Input


export default class ProductAddUpdate extends Component {

    formRef = React.createRef()

    imgRef = React.createRef()

    richTextRef = React.createRef()

    state = {
        options: [],

    }

    initOptions = async (categorys) => {
        const options = categorys.map((category)=>({
            value: category._id,
            label: category.name,
            isLeaf: false
        }))
        

        const {isUpdate,product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId!=='0'){
            const subCategorys = await this.getCategorys(pCategoryId)
            const childOptions = subCategorys.map((c)=>({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))

            const targetOption = options.find(option => option.value === pCategoryId)
            targetOption.children = childOptions
        }

        this.setState({options})


        
    }

    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if(result.data.status === 0){
            const categorys = result.data.data
            if(parentId === '0'){
                this.initOptions(categorys)
            } else {
                return categorys
            }
        }

    }
    
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;

        const subCategorys = await this.getCategorys(targetOption.value)

        if (subCategorys && subCategorys.length>0){
            targetOption.loading = false;
            targetOption.children = subCategorys.map((subCategory)=>(
                {
                    label: subCategory.name,
                    value: subCategory._id,
                    isLeaf: true
                }
            ))

        } else {
            targetOption.isLeaf = true
        }

        this.setState({
            options: [...this.state.options],
        })

        console.log('addupdate',this)
    }
    
        

    validatePrice = (rule,value,callback) => {
        if (value*1 > 0) {
            callback()
        } else {
            callback('??????????????????0')
        }
    }

    submit = async () => {
        this.formRef.current.validateFields().then(async(values,err)=>{    
            if(!err){
                const {name,desc,price,categoryIds} = values
                let pCategoryId,categoryId
                if (categoryIds.length===1){
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.imgRef.current.getImages()
                const detail  = this.richTextRef.current.getDetail()

                const product = {pCategoryId,categoryId,name,desc,price,imgs,detail}
                if(this.isUpdate){
                    product._id = this.product._id
                }

                const result = await reqAddOrUpdateProduct(product)
                if (result.data.status===0){
                    message.success(`${this.isUpdate?'??????':'??????'}????????????!`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate?'??????':'??????'}????????????!`)
                }
           
            }
        })
    }

  
    componentDidMount(){
        this.getCategorys('0')
    }

    UNSAFE_componentWillMount(){
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }
    render() {
        const {isUpdate,product} = this
        const {pCategoryId,categoryId,imgs} = product
        const categoryIds = []
        if(isUpdate){
            if(pCategoryId === '0'){
                categoryIds.push(categoryId)
            } else{
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
            
        }
        const title=(
            <span>
                <LinkButton >
                    <ArrowLeftOutlined 
                        style={{margin:'0 15px',fontSize:'15px'}} 
                        onClick={()=>{this.props.history.goBack()}}
                    />
                </LinkButton>
                <span style={{fontSize:'15px'}}>{isUpdate?'????????????':'????????????'}</span>
            </span>
            
        )

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 16 }
        };

          
        return (
            <Card title={title} className='product-detail'>
                <Form {...formItemLayout} style={{width:'100%'}} ref={this.formRef}>
                    <Item 
                        label="???????????????"
                        name="name"
                        initialValue={product.name}
                        rules={[{ required: true, message: '????????????????????????!' }]}
                    >
                      
                        <input placeholder="?????????????????????" style={{width:'400px'}}/>

                    </Item>
                    <Item 
                        label="???????????????"
                        name="desc"
                        initialValue={product.desc}
                        rules={[{ required: true, message: '????????????????????????!' }]}
                    >
                        <TextArea autoSize placeholder="?????????????????????" style={{width:'400px'}}/>

                    </Item>
                    <Item 
                        label="???????????????"
                        name="price"
                        initialValue={product.price}
                        rules={[
                                { required: true, message: '????????????????????????!' },
                                { validator:this.validatePrice}
                            ]}
                    >
                      
                        <input type='number' addonafter="???" placeholder="?????????????????????" style={{width:'400px'}}/>

                    </Item>
                    <Item 
                        name = 'categoryIds'
                        label="???????????????"
                        initialValue= {categoryIds}
                        rules={[{ required: true, message: '????????????????????????!' }]}
                    >
                        <Cascader 
                            placeholder='?????????????????????'
                            options={this.state.options} 
                            loadData={this.loadData} 
                            style={{width:'400px'}}
                        />
                    </Item>
                    <Item 
                        label="???????????????"
                        name="imgs"
            
                    >
                        <PictureWall ref={this.imgRef} imgs={imgs} />

                    </Item>
                    <Item 
                        label="???????????????"
                        name="detail"
                        labelCol= {{ span: 2 }}
                        wrapperCol= {{ span: 16 }}
                    >
                        <RichTextEdit ref={this.richTextRef}/>
                       

                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>??????</Button>
                    </Item>
                    
                </Form>

            </Card>
        )
    }
}
