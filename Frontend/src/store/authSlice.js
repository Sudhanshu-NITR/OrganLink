import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async () => {
    const response = await fetch("your-refresh-token-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Add any necessary refresh token from localStorage if needed
      body: JSON.stringify({ 
        refreshToken: localStorage.getItem("refreshToken") 
      }),
    });
    const data = await response.json();
    return data;
  }
);

const initialState = {
    status: false,
    hospital: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.hospital = action.payload;
            // Store tokens when logging in
            localStorage.setItem("accessToken", action.payload.accessToken);
            localStorage.setItem("refreshToken", action.payload.refreshToken);
        },
        logout: (state) => {
            state.status = false;
            state.hospital = null;
            // Clear tokens when logging out
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
    },
    extraReducers: (builder) => {
        builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
            // Update the access token when refresh is successful
            localStorage.setItem("accessToken", action.payload.accessToken);
        });
    }
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;