import { createSlice, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import axios from "axios";

const hostURL = "http://localhost:3030/posts";

const initialState = {
  posts: [],
  status: "idle",
  error: null
};

export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
  const resp = await axios.get(hostURL);
  return resp.data;
});

export const addNewPost = createAsyncThunk(
  "post/addNewPost",
  async (initialPost) => {
    const resp = await axios.post(hostURL, initialPost);
    console.log(resp);
    return resp.data;
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const resp = await axios.delete(hostURL + `/${id}`);
      if (resp?.status === 200) {
        return initialPost;
      }
      console.log(resp);
      return `${resp?.status}: ${resp?.statusText}`;
    } catch (error) {
      return error.message;
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete not complete yo");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = posts;
      });
  }
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export default postSlice.reducer;
