import {Router} from 'express'
import { cashOut, getAccount, getTransactions } from './controllers/controllerAccounts'
import { accessVerify, getUser, getUsers, login, setUsers} from './controllers/controllerUsers'

const router = Router()

router.post('/createUsers',setUsers)
router.get('/getUsers',getUsers)
router.post('/getUser',accessVerify,getUser)
router.post('/login',login)
router.post('/getAccount',accessVerify,getAccount)
router.post('/cashOut',accessVerify,cashOut)
router.post('/getTransactions',accessVerify,getTransactions)

export default router