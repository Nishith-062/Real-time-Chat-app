import { Loader2, Users2 } from "lucide-react";
import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const Siderbar = () => {
    const {users,getUsers,selectedUser,setSelectedUser,isUsersLoading}=useChatStore()
    const {onlineUsers}=useAuthStore()    
    useEffect(()=>{
        getUsers()
    },[getUsers])

    if(isUsersLoading) return <div className="flex h-screen w-80 items-center justify-center border-r-2 " >< Loader2 className="animate-spin size-10"/></div>

  return (
    <div className="pt-16 w-80 h-screen flex flex-col border-r-2">
      {/* Fixed Header */}
      <div className="flex items-center gap-4 p-4 border-b-2 border-gray-900">
        <Users2 className="size-9" />
        <p className="text-2xl">Contacts</p>
      </div>

      {/* Scrollable list (takes remaining space only) */}
      <div className="flex-1 overflow-y-auto space-y-3 px-4 py-2">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className=" w-full lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>

        ))}
          
      </div>
    </div>
  );
};

export default Siderbar;
