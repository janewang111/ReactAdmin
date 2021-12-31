import store from 'store'

const USER_KEY = 'user_key'

// eslint-disable-next-line
export default {
    saveUser(user){
        // localStorage.setItem(USER_KEY,Json.stringify(user))
        store.set(USER_KEY,user)
        
    },

    getUser(){
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },

    removeUser(){
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}