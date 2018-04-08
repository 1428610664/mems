import storage from 'good-storage'

const IS_LOGIN = '__isLogin__'

export function setIsLogin(val){
	storage.set(IS_LOGIN, val)
}

export function getIsLogin(){
	return storage.get(IS_LOGIN, false)
}
