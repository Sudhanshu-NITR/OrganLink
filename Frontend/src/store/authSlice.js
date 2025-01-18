import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    hospital: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) =>{
            state.status = true,
            state.hospital = action.payload;
        },
        logout: (state) =>{
            state.status = false,
            state.hospital = null;
        }
    }
});


export const {login, logout} = authSlice.actions;

export default authSlice.reducer;