import React, { useState } from "react";
import "./ModalAdd.css";

type Post = {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
};

type ModalProps = {
  modal: boolean;
  setModal: (modal: boolean) => void;
  addNew: (formData: FormData) => Promise<void>;
  authorId: string;
  authorName: string;
};

function ModalBlog({
  modal,
  setModal,
  addNew,
  authorId,
  authorName,
}: ModalProps) {
  //Create states to manage the create form
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  //Create function to set the form states for the description titles and image files
  const handleDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  //Function to create the form and send it to the backend to create a blog post
  const add = async () => {
    const newPost = new FormData();
    newPost.append("title", title);
    newPost.append("content", content);
    newPost.append("authorId", authorId);
    newPost.append("authorName", authorName);
    if (file) {
      newPost.append("imageUrl", file);
    }

    await addNew(newPost);
    //Turn off the new form
    setModal(false);
  };

  return (
    <>
      {modal && (
        <div className="modal">
          <div onClick={() => setModal(false)} className="overlay"></div>
          <div className="modal-content">
            <h2>Add Post!</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <input type="text" onChange={handleTitle} placeholder="Title" />
              <textarea
                onChange={handleDesc}
                placeholder="Content..."
                style={{ minHeight: "70%" }}
              />
              <input type="file" onChange={handleFileChange} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setModal(false)}
                className="edit-button-class"
              >
                Cancel
              </button>
              <button onClick={add} className="edit-button-class">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalBlog;
