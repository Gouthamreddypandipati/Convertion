const express=require('express')
const router=express.Router()
const{CreateAccount,GETAccount,Convert,Generateqid}=require('./core')


router.route('/').post(CreateAccount)
router.route('/:username').get(GETAccount)
router.route('/qid').post(Generateqid)

router.route('/convert').post(Convert)


module.exports=router
