import { Session } from 'meteor/session'

export const USER_SES_KEY = 'user'

export const REPLY_TYPES_4 = {}


const userId = 'user' + Math.round(Math.random() * 1000)
Session.setDefaultPersistent(USER_SES_KEY, { id: userId, name: '', age: '' })

