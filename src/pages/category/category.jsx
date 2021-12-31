import React, { Component } from 'react'
import {Card,Table,Button, message,Modal} from 'antd'
import {PlusOutlined,ArrowRightOutlined} from '@ant-design/icons'
import './category.less'
import LinkButton from '../../componets/link-button'
import { reqCategorys,reqAddCategory,reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component {

    state = {
        loading:false,
        categorys: [],
        subCategorys:[],
        parentId:'0',
        parentName:'',
        showStatus: 0,
    }

    initColumns = () =>{
        this.columns = [
            {
              title: '分类名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              width:300,
              render: (category)=>(
                
                  <span>
                      <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                      {
                         (this.state.parentId==='0'?<LinkButton onClick={() =>  this.showSubCategorys(category)}>查看子分类</LinkButton>:null)
                      }
                      
                  </span>
              )
            }
          ];
    }


    getCategorys =async (parentId) => {

        parentId = parentId || this.state.parentId

        this.setState({loading:true})
        const result = await reqCategorys(parentId)
        this.setState({loading:false})
    
        if (result.data.status ===0){
            if(parentId === '0'){
                const categorys = result.data.data
                this.setState({categorys})
            } else{
                const subCategorys = result.data.data
                this.setState({subCategorys})
            }  
        } else {
            message.error('获取分类列表失败')
        }
    }


    showSubCategorys= (category)=>{
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{
            this.getCategorys()
        })

    }

    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    handleCancel = () => {
        // this.formRef.current.resetFields()

        this.setState({
            showStatus:0

        })
    }

    showAdd = () => {

        this.setState({
            showStatus:1
        })
    }

    addCategory = () => {
        this.formRef.current.validateFields().then(async(values,err)=>{
            if(!err){
                this.setState({
                    showStatus:0
                })
        
                // const {parentId,categoryName} = this.formRef.current.getFieldsValue()
                const {parentId,categoryName} = values
                const result = await reqAddCategory(parentId,categoryName)
             
                if (result.data.status === 0) {
        
                    if(parentId === this.state.parentId){
                        this.getCategorys()
                    } else if (parentId === '0'){
                        this.getCategorys('0')
                    } 
                }
        
            }

        })
    }

    showUpdate = (category) =>{
        this.category = category
        this.setState({
            showStatus:2
        })
    }

    updateCategory = () => {

        this.formRef.current.validateFields().then(async(values,err)=>{
            if(!err){
                this.setState({
                    showStatus:0
                })
        
                const categoryId = this.category._id
                // const categoryName = this.formRef.current.getFieldValue('categoryName')
                const {categoryName} = values
                
                // this.formRef.current.resetFields()
        
                const result = await reqUpdateCategory({categoryId,categoryName})
                if (result.data.status === 0){
                    this.getCategorys()
                }

            }
        })

    }


    // updateCate = (cateName) => {
    //     console.log('cateName',cateName)
    //     const {categoryName} = this.state
    //     this.setState({categoryName:cateName},()=>{
    //         console.log('@',this.state.categoryName)
    //     })
    // }


    UNSAFE_componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getCategorys()
    }

    render() {

        const {categorys,subCategorys,parentId,parentName,loading,showStatus} = this.state

        const category = this.category || {}

        const categoryName = category.name || ''

        

        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined  style={{marginRight:5}}/>
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' icon={<PlusOutlined />} onClick={this.showAdd}>添加
               
            </Button>
        )

        return (
            <div >
                <Card className="card" title={title} extra={extra} >
                    <Table 
                        
                        bordered  
                        loading={loading}
                        dataSource={parentId==='0'?categorys:subCategorys} 
                        columns={this.columns} 
                        pagination={{defaultPageSize:5,showQuickJumper:true}}
                        rowKey={record=>record._id}
                       
                    />

                    <Modal title="添加分类" 
                           visible={showStatus===1} 
                           onOk={this.addCategory} 
                           onCancel={this.handleCancel}
                           destroyOnClose={true}
                    >
                        <AddForm 
                            parentId={parentId} 
                            categorys={categorys}
                            setForm = {(formRef) => {this.formRef = formRef}}
                        />
                    </Modal>

                    <Modal title="更新分类" 
                           visible={showStatus===2} 
                           onOk={this.updateCategory} 
                           onCancel={this.handleCancel}
                           destroyOnClose={true}     
                    >
                        <UpdateForm 
                            categoryName = {categoryName} 
                            setForm = {(formRef)=>{this.formRef = formRef}}
                            // updateCate={this.updateCate}
                        /> 
                    </Modal>
                </Card>
            </div>
        )
    }
}
