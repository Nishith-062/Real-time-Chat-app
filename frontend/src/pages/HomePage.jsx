import React from 'react'
import Siderbar from '../components/Siderbar'
import NoChatSelected from '../components/NoChatSelected'
import { useChatStore } from '../store/useChatStore'
import ChatContainer from '../components/ChatContainer'


const HomePage = () => {
  const {selectedUser}=useChatStore()
  return (
    <div className='flex h-screen overflow-hidden'>
              <Siderbar/>
      <div className=" flex-1 flex items-center justify-center overflow-hidden">
      {!selectedUser?<NoChatSelected/>:<ChatContainer/>}
      </div>
    </div>
  )
}

export default HomePage