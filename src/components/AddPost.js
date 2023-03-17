import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { addNewPost } from "../features/postSlice";

function AddPost() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const onTitleChange = (e) => setTitle(e.target.value);
  const onContentChange = (e) => setContent(e.target.value);
  const onAuthorChange = (e) => setAuthor(e.target.value);

  const dispatch = useDispatch();

  const canSave =
    [title, content, author].every(Boolean) && addRequestStatus === "idle";

  const onSavePostClicked = () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        //unwrap returns a  new promise that has the payload or a reject payload hence to use the tryCatch
        dispatch(addNewPost({ title, content, userId: author })).unwrap();

        setTitle("");
        setContent("");
        setAuthor("");
      } catch (error) {
        console.log("Failed to save boiii", error);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <section className="add-post-section">
      <h2>Add new post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          name="postTitle"
          id="postTitle"
          value={title}
          onChange={onTitleChange}
        />
      </form>
      <label htmlFor="postAuthor">Post Author:</label>
      <select name="" id="postAuthor" value={author} onChange={onAuthorChange}>
        <option value=" "></option>
        <option value="person1">Person 1</option>
        <option value="person2">Person 2</option>
        <option value="person3">Person 3</option>
      </select>
      <label htmlFor="postContent" className="content-label">
        Content:
      </label>
      <textarea
        type="text"
        name="postContent"
        id="postContent"
        value={content}
        onChange={onContentChange}
      />
      <button
        type="button"
        className="save-post-button"
        onClick={onSavePostClicked}
      >
        Save Post
      </button>
    </section>
  );
}

export default AddPost;
