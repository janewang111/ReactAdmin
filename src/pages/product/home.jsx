import React, { Component } from 'react'
import {Card,Table,Button,Select, message,} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import LinkButton from '../../componets/link-button'
import { reqProducts,reqSearchProducts, reqUpdataStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const { Option } = Select



export default class ProductHome extends Component {

    state = {
        loading:false,
        products: [],
        total: 0,
        searchType:'productName',
        searchName:'',

    }

    updateStatus = async (productId,status) => {
        const result = await reqUpdataStatus(productId,status)
        if(result.data.status===0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)

        }
    }

    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
              },
              {
                title: '商品描述',
                dataIndex: 'desc',
              },
              {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price 
              },
              {
                title: '状态',
                // dataIndex: 'status',
                width: 100,
                render: (product)=>{
                    const {status,_id} = product
                    return (
                        <span>
                            <Button 
                                type="primary" 
                                onClick={()=>this.updateStatus(_id,status===1?2:1)}
                            >
                                {status===1?'下架':'上架'}
                            </Button>
                             <span>
                                 {status===1?'在售':'已下架'}
                            </span>
                        </span>
                    )
                    
                }
              },
              {
                title: '操作',
                width: 100,
                render: (product)=>(

                    <span>
                        <LinkButton 
                            onClick={()=>this.props.history.push('/product/detail',{product})}
                        >
                            详情
                        </LinkButton>
                        <LinkButton 
                            onClick={()=>this.props.history.push('/product/addupdate',product)}
                        >
                            修改
                        </LinkButton>

                    </span>
                    
                )
              },
        ]

    }

    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({loading:true})
        const {searchName,searchType} = this.state
        let result
        if(searchName) {
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        } else {
            result = await reqProducts(pageNum,PAGE_SIZE)
        }
        
        this.setState({loading:false})
        console.log(result)
        if (result.data.status === 0) {
            const {list,total} = result.data.data
          
            this.setState({products:list,total})


        }

    }

    // search = async(pageNum) => {
    
    //     const {searchType,searchName} = this.state
     
    //     let result = ''
    //     if(searchType === 'productName'){
    //         result = await reqProductsNameSearch(pageNum,PAGE_SIZE,searchName)
    //     } else {
    //         result = await reqProductsDescSearch(pageNum,PAGE_SIZE,searchName)
    //     }

    //     console.log('search result',result)
    //     if (result.data.status === 0){
    //         const {list,total} = result.data.data
    //         this.setState({products:list,total})
    //     }
    // }

    UNSAFE_componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getProducts(1)
    }
    
    
    render() {
        const {products,total,loading,searchType,searchName} = this.state
        
        const title = (
            <span>
                <Select 
                    value= {searchType} 
                    style={{ width: 150 }}
                    onChange={value=>this.setState({searchType:value})} 
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <input 
                    value={searchName} 
                    placeholder='关键字' 
                    style={{margin:'0 15px'}}
                    onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>

            </span>

        )
        const extra = (
            <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={()=>{this.props.history.push('/product/addupdate')}} 
            >
                添加商品
            </Button>

        )
        return (
            <Card title={title} extra={extra}>
                <Table 
                    bordered
                    loading={loading}
                    rowKey='_id'
                    dataSource={products} 
                    columns={this.columns} 
                    pagination={{
                        current:this.pageNum,
                        defaultPageSize:PAGE_SIZE,
                        showQuickJumper:true,
                        total,
                        // onChange:(pageNum)=>{this.getProducts(pageNum)}
                        onChange: this.getProducts
                    }}
                />

            </Card>
        )
    }
}
