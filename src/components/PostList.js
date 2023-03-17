import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPosts,
  getPostsError,
  getPostsStatus,
  selectAllPosts
} from "../features/postSlice";
import { deletePost } from "../features/postSlice";

function PostList() {
  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  const dispatch = useDispatch();

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content;
  if (postStatus === "loading") {
    content = "Loading...";
  } else if (postStatus === "succeeded") {
    const reversePosts = posts.slice().sort((a, b) => b.id - a.id);
    content = reversePosts.map((post) => (
      <article key={post.id} className="individual-posts">
        <h3>{post.title}</h3>
        <p>{post.content.substring(0, 100)}</p>
        <p className="post-credit">
          <span>by {post.author ? post.author : "Unknown author"}</span>
        </p>
        <button
          onClick={() => {
            dispatch(deletePost({ id: post.id })).unwrap();
          }}
        >
          {" "}
          delete
        </button>
      </article>
    ));
  } else if (postStatus === "failed") {
    content = <p>{error}</p>;
  }

  return <section className="post-container">{content}</section>;
}

export default PostList;
