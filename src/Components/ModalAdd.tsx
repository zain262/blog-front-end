import { useState } from "react";
import "./ModalAdd.css";

type Note = {
  _id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
};

type ModalProps = {
  modal: boolean;
  setModal: (modal: boolean) => void;
  addNew: (el: Note) => void;
  _id: string;
  postId: string;
  authorId: string;
  authorName: string;
};

function ModalAdd({
  modal,
  setModal,
  addNew,
  _id,
  postId,
  authorId,
  authorName,
}: ModalProps) {
  const [desc, setDesc] = useState("");

  const handleDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);
  };

  const add = () => {
    //Function used to add a new comment to a post
    setModal(!modal);
    const note = {
      _id: _id,
      postId: postId,
      authorId: authorId,
      authorName: authorName,
      content: desc,
      createdAt: new Date().toISOString(),
    };
    //Create a new comment object
    addNew(note);
    //Send it to the backend
  };
  return (
    <>
      <div className="modal">
        <div onClick={() => setModal(!modal)} className="overlay"></div>
        <div className="modal-content">
          <h2>Add Comment</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <textarea
              style={{ minHeight: "70%" }}
              onChange={handleDesc}
              placeholder="Comment..."
            ></textarea>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => setModal(!modal)}
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
    </>
  );
}

export default ModalAdd;
