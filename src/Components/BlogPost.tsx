import React, { useEffect } from "react";
import "./BlogPost.css";
import Blog from "../Pages/Blog";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
import { useContext, useState } from "react";
import UserContext from "../context";
import ModalUpdate from "./ModalUpdate";
import axios from "axios";

export default function BlogPost({
  id,
  authorId,
  title,
  content,
  authorName,
  createdAt,
  delete: handleDelete,
}: {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: string;
  delete: (id: string) => Promise<void>;
}) {
  const nav = useNavigate();
  const handleClick = () => {
    nav(`/post/${id}`);
  };

  //Get the post if from the link

  const [modal, setModal] = useState(false);
  const userContext = useContext(UserContext);
  //Try to get the users info from the usercontext

  if (!userContext) {
    throw new Error("useContext must be used within a UserProvider");
  }

  const { user, setUser } = userContext;

  useEffect(() => {
    //This useeffect is in case the user context is no longer avalible the frontend can remake the context by getting info from the backedn
    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:7000/api/v1/users/me", {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (!user) {
      getUser();
    }
  }, []);

  const UpdateNew = async (formData: FormData) => {
    //Used to update a blog
    try {
      const res = await axios.patch(
        "http://localhost:7000/api/v1/blogs/edit",
        formData,
        {
          withCredentials: true,
        }
      );
      //Send a patch request
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  return (
    <div className="post">
      <h1 onClick={() => handleClick()}>{title}</h1>
      <p
        style={{
          color: "black",
          fontWeight: "500",
        }}
      >
        {content.slice(0, 70)}...
        {/*Display the first 70 words as a preview*/}
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          color: "black",
          fontWeight: "bold",
        }}
      >
        <p>By: {authorName}</p>
        <p>Created At: {createdAt}</p>
        {/*Only show a edit and delete button if the user logged in created the blog or is an admin*/}
        {user?.id === authorId || user?.role === "admin" ? (
          <div>
            <button>
              <CiEdit onClick={() => setModal(!modal)} />
            </button>
            <button onClick={() => handleDelete(id)}>
              <CiTrash />
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div>
        {modal && (
          <ModalUpdate
            _id={id}
            modal={modal}
            setModal={setModal}
            title={title}
            content={content}
            updateNew={UpdateNew}
            authorId={"a1"}
            authorName={"john"}
          />
        )}
      </div>
    </div>
  );
}
