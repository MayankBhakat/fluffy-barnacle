

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socket:false,
  chatRooms: {},
  messageReceived:false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    SetChatRooms(state, action) {
      const { user, message, isAdmin } = action.payload; // Destructure isAdmin from payload

      // Check if user exists in state, if not, create a new entry
      if (!state.chatRooms[user]) {
        state.chatRooms[user] = [];
      }

      // Add message based on isAdmin flag
      if (isAdmin) {
        state.chatRooms[user].push({ admin: message });
      } else {
        state.chatRooms[user].push({ client: message });
      }
    },

    SetSocket(state,action){
      const {socket} = action.payload;
     state.socket=socket;

    },

    SetMessageReceived(state,action){
      state.messageReceived=action.payload.message;
    }
  },
});

export const { SetChatRooms,SetSocket ,SetMessageReceived} = chatSlice.actions;
export default chatSlice.reducer;
