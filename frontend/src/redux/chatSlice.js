import { createSlice } from '@reduxjs/toolkit';

// Load firstTime from local storage if it exists
const initialFirstTime = localStorage.getItem('firstTime') ? parseInt(localStorage.getItem('firstTime'), 10) : 0;

const initialState = {
  socket: null,
  chatRooms: {},
  messageReceived: false,
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
        // Admin pushes messages
        state.chatRooms[user].push({ admin: message });
      } else {
        // User pushes messages
        state.chatRooms[user].push({ client: message });
      }
    },

    SetSocket(state, action) {
      const { socket } = action.payload;
      state.socket = socket;
    },

    SetMessageReceived(state, action) {
      state.messageReceived = action.payload.message;
    },

    RemoveChatRoom(state,action){
      let currentState2 = { ...state };
      delete currentState2.chatRooms[action.payload.socketId];
      state.chatRooms=currentState2.chatRooms;
    }


  },
});

export const { SetChatRooms, SetSocket, SetMessageReceived, RemoveChatRoom} = chatSlice.actions;
export default chatSlice.reducer;
