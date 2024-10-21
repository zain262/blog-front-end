import React, { useState } from "react";
import "./ModalAdd.css";

type ModalProps = {
  modal: boolean;
  setModal: (modal: boolean) => void;
  updateNew: (formData: FormData) => Promise<void>;
  authorId: string;
  _id: string;
  title: string;
  content: string;
  authorName: string;
};

function ModalUpdate({
  modal,
  setModal,
  updateNew,
  title,
  content,
  authorId,
  authorName,
  _id,
}: ModalProps) {
  //Create states to manage the update form
  const [contentupdate, setContent] = useState(content);
  const [titleupdate, setTitle] = useState(title);
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

  //Function to create the form and send it to the backend to update a blog post
  const add = async () => {
    const newPost = new FormData();
    newPost.append("_id", _id);
    newPost.append("title", titleupdate);
    newPost.append("content", contentupdate);
    newPost.append("authorId", authorId);
    newPost.append("authorName", authorName);
    if (file) {
      newPost.append("imageUrl", file);
    }

    await updateNew(newPost);
    //Turn off the update form
    setModal(false);
  };

  return (
    <>
      {modal && (
        <div className="modal">
          <div onClick={() => setModal(false)} className="overlay"></div>
          <div className="modal-content">
            <h2>Update Post!</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <input type="text" onChange={handleTitle} value={titleupdate} />
              <textarea
                onChange={handleDesc}
                value={contentupdate}
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

export default ModalUpdate;
