import React, { Component } from 'react'
import {Card,List,} from 'antd'
import {ArrowLeftOutlined} from '@ant-design/icons'
import LinkButton from '../../componets/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'

const {Item} = List

export default class ProductDetail extends Component {

    state = {
        cName1: '',
        cName2: '',
    }

   async componentDidMount(){
        const {pCategoryId,categoryId} = this.props.location.state.product
        if (pCategoryId === '0'){
            const result = await reqCategory(categoryId)
            console.log('cName1 result',result)
            const cName1 = result.data.data.name
            this.setState({cName1})

        } else{
            const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            console.log('results',results)
      
        
            const cName1 = results[0].data.data.name
            const cName2 = results[1].data.data.name
        
       
            this.setState({cName1,cName2})

        }
        
 
    }


    

    render() {

        const {name,desc,price,detail,imgs} = this.props.location.state.product
        const {cName1,cName2} = this.state

        const title = (
            <span>
                <LinkButton>
                    <ArrowLeftOutlined style={{margin:'0 15px',fontSize:'15px'}} onClick={()=>{this.props.history.goBack()}}/>
                </LinkButton>  
                <span style={{fontSize:'15px'}}>商品详情</span>
            </span> 
        )

        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称：</span>
                        <span className='right'>{name}</span>

                    </Item>
                    <Item>
                        <span className='left'>商品描述：</span>
                        <span className='right'>{desc}</span>

                    </Item>
                    <Item>
                        <span className='left'>商品价格：</span>
                        <span className='right'>{price}元</span>

                    </Item>
                    <Item>
                        <span className='left'>所属分类：</span>
                        <span className='right'>{cName1} {cName2? '--->' + cName2:''}</span>

                    </Item>
                    <Item>
                        <span className='left'>商品图片：</span>
                        <span className='right'>
                            {
                                imgs.map((img)=>(
                                    <img key={img} className='product-img' src={BASE_IMG_URL + img} alt="img" />

                                ))
                            }
                        </span>

                    </Item>
                    <Item>
                        <span className='left'>商品详情：</span>
                        <span 
                            className='right' 
                            dangerouslySetInnerHTML={{__html:detail}}>
                        </span>

                    </Item>

                </List>
            </Card>
        )
    }
}
