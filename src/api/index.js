import { message } from 'antd'
import jsonp from 'jsonp'
import ajax from './ajax'


// export function reqLogin(username,password){
//     return ajax('/login',{username,password},'POST')

// }
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')

export const reqAddUser = (user) => ajax('/manage/user/add',user,'POST')

export const reqUsers = () => ajax('/manage/user/list')

export const reqDeleteUser = (userId) => ajax('/manage/user/delete',{userId},'POST')

export const reqAddOrUpdateUser = (user) => ajax('/manage/user/'+(user._id?'update':'add'),user,'POST')

export const reqWeather = (city)=> {

    return new Promise((resolve,reject)=>{
        
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url,{},(err,data)=>{
            console.log('jsonp()',err,data)
            if(!err && data.status === 'success') {
                const {dayPictureUrl,weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            } else {
                message.error('获取天气信息失败')

            }
    })

    })  
}

export const reqCategorys = (parentId) => ajax('/manage/category/list',{parentId})

export const reqAddCategory = (parentId,categoryName) => ajax('/manage/category/add',{parentId,categoryName},'POST')

export const reqUpdateCategory = ({categoryId,categoryName}) => ajax('/manage/category/update',{categoryId,categoryName},'POST')

export const reqCategory = (categoryId) => ajax('/manage/category/info',{categoryId})


export const reqProducts = (pageNum,pageSize) => ajax('/manage/product/list',{pageNum,pageSize})

// export const reqProductsNameSearch = (pageNum,pageSize,productName) => ajax('/manage/product/search',{pageNum,pageSize,productName})

// export const reqProductsDescSearch = (pageNum,pageSize,productDesc) => ajax('/manage/product/search',{pageNum,pageSize,productDesc})

export const reqSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax('/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})

export const reqUpdataStatus = (productId,status) => ajax('/manage/product/updateStatus',{productId,status},'POST')

export const reqDeleteImg = (name) => ajax('/manage/img/delete',{name},'POST')

export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/'+ (product._id?'update':'add'),product,'POST')

// export const reqUpdateProduct = (product) => ajax('/manage/product/update',product,'POST')

export const reqRoles = () => ajax('/manage/role/list')

export const reqAddRole = (roleName) => ajax('/manage/role/add',{roleName},'POST')

export const reqUpdateRole = (role) => ajax('/manage/role/update',role,'POST')