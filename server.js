const dotenv=require('dotenv').config()
const express=require('express');
const user=require('./model')
const connectDb=require('./dbconnection')

const app=express()

connectDb()
const port= process.env.PORT || 5000
// automaticaaly parse Incoming Json
app.use(express.json());

/*it's middleware*/
app.use('/api/Bank',require('./routes'))


app.listen(port,()=>{
  console.log(`wow running  ${port}`)
})