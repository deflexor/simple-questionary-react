import { Session } from 'meteor/session'

export const USER_SES_KEY = 'user'

const userId = 'user' + Math.round(Math.random() * 1000)
Session.setDefaultPersistent(USER_SES_KEY, { id: userId, name: '', age: '' })

