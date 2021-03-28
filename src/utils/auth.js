import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = Config.TokenKey
const rememberKey = Config.isRememberMeKey

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getPoint(point) {
   return Cookies.get(point)
}

export function setPoint(point, value) {
  return Cookies.set(point, value)
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  } else {
    return Cookies.set(TokenKey, token)
  }
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setRememberMe(remember) {
  return Cookies.set(rememberKey, remember)
}

export function getRememberMe() {
  return Cookies.get(rememberKey)
}
