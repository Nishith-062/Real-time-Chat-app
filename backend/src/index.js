import express from 'express'
import authRoutes from './routes/auth.routes.js'
import dotenv from 'dotenv'
import DbConnect from './lib/db.js'
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.routes.js';
import cors from 'cors'
import {app,io,server} from '../src/lib/socket.js'

app.use(express.json({ limit: '5mb' })); // or 10mb if needed
dotenv.config()


const port=process.env.PORT


app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use(cookieParser())
app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)




server.listen(port,()=>{
    console.log(`server running on localhost:${port}`);
    DbConnect()
})