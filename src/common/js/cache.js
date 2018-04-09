import storage from 'good-storage'

const IS_LOGIN = '__isLogin__'
const USER_INFO = '__userInfo__'

export function setIsLogin(val){
	storage.set(IS_LOGIN, val)
}

export function getIsLogin(){
	return storage.get(IS_LOGIN, false)
}

export function setUserInfo(val){
  storage.set(USER_INFO, val)
}

export function getUserInfo(){
  return storage.get(USER_INFO, {})
}
