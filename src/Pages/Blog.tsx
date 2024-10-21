import React from "react";
import { CiEdit } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
import { useState } from "react";
import ModalAdd from "../Components/ModalAdd";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import "./Blog.css";
import { useContext } from "react";
import UserContext from "../context";

type PostType = {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  imageUrl?: string;
  createdAt: string;
};

//Type the post

type CommentType = {
  _id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
};

//Type the comment

const initialComments: CommentType[] = [
  {
    _id: "c1",
    postId: "p1",
    authorId: "u2",
    authorName: "jane_smith",
    content: "Great post! I found the part about closures very helpful.",
    createdAt: "2024-10-10T12:00:00Z",
  },
  {
    _id: "c2",
    postId: "p1",
    authorId: "u3",
    authorName: "alex_jones",
    content: "I agree, JavaScript is incredibly versatile!",
    createdAt: "2024-10-10T13:15:00Z",
  },
  {
    _id: "c3",
    postId: "p2",
    authorId: "u1",
    authorName: "john_doe",
    content: "Hooks have simplified React development so much!",
    createdAt: "2024-10-11T10:15:00Z",
  },
  {
    _id: "c4",
    postId: "p2",
    authorId: "u3",
    authorName: "alex_jones",
    content: "The useEffect hook is my favorite part of React!",
    createdAt: "2024-10-11T11:30:00Z",
  },
  {
    _id: "c5",
    postId: "p2",
    authorId: "u2",
    authorName: "jane_smith",
    content: "Glad you liked it! useState is a game-changer too.",
    createdAt: "2024-10-11T12:45:00Z",
  },
];

//Initial comments used for testing

export default function Blog() {
  //Create states to manage comments the posts, and edits
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [post, setPost] = useState<PostType>();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [modal, setModal] = useState(false);

  const userContext = useContext(UserContext);
  //Get users info
  if (!userContext) {
    throw new Error("useContext must be used within a UserProvider");
  }

  const { user, setUser } = userContext;

  const { id } = useParams<{ id: string }>();
  //Get the id from the link

  useEffect(() => {
    //Incase the user context has expired refetch the users info from the backend
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

  useEffect(() => {
    //Get the blogs content from the back end and set it to posts
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/v1/blogs/${id}`,
          { withCredentials: true }
        );
        setPost(response.data.data.blog);
        //console.log(response.data.data.blog);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };
    fetchPosts();
  }, [id]);

  useEffect(() => {
    //Get the comments related to that post and set them to comments
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/v1/comments/post/${id}`,
          { withCredentials: true }
        );
        setComments(response.data.data.comments);
        /// console.log(response.data.data.comments);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };
    fetchComments();
  }, [id]);

  const addNew = async (el: CommentType) => {
    //Send a post request to add a comment to the back end and refetch all comments to ensure the front end is updated
    try {
      console.log("commnet", el);
      const res = await axios.post(
        "http://localhost:7000/api/v1/comments/add",
        el,
        {
          withCredentials: true,
        }
      );

      const response = await axios.get(
        `http://localhost:7000/api/v1/comments/post/${id}`,
        { withCredentials: true }
      );
      setComments(response.data.data.comments);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const handleEditClick = (index: number, content: string) => {
    //Used to handle edit of the comments
    setEditIndex(index);
    setEditContent(content);
  };

  const handleDelete = async (idCom: string) => {
    //Upon delete send a delete request to the back end and refetch the comments to ensure the frontend is up to date
    try {
      const res = await axios.delete(
        `http://localhost:7000/api/v1/comments/delete/${idCom}`,
        { withCredentials: true }
      );
      const response = await axios.get(
        `http://localhost:7000/api/v1/comments/post/${id}`,
        {
          withCredentials: true,
        }
      );

      setComments(response.data.data.comments);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const handleSaveClick = async (idCom: string) => {
    //Upon saving a edit on comments sned a patch request with the new content and refetch to ensure the front end is updated
    try {
      await axios.patch(
        `http://localhost:7000/api/v1/comments/update/${idCom}`,
        { content: editContent },
        { withCredentials: true }
      );

      const response = await axios.get(
        `http://localhost:7000/api/v1/comments/post/${id}`,
        {
          withCredentials: true,
        }
      );

      setComments(response.data.data.comments);
    } catch (error) {
      console.error("Error updating comment:", error);
    }

    setEditIndex(null);
  };

  return (
    <div
      style={{
        width: "60%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
      }}
    >
      {post ? (
        <>
          <h1
            style={{
              textAlign: "center",
              color: "#5f33e1",
            }}
          >
            {post.title}
          </h1>
          {/* if the posts contains a image display it  */}
          {post.imageUrl && (
            <img
              src={"\\" + post.imageUrl.split("\\").pop()}
              alt={post.title}
              style={{
                maxWidth: "100%",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            />
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontWeight: "700",
              gap: "1rem",
            }}
          >
            <p>Written By: {post.authorName}</p>
            <p>
              Published At:{" "}
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: "10px",
              lineHeight: "1.5",
            }}
          >
            {post.content}
          </p>
        </>
      ) : (
        <p>Loading post...</p>
      )}

      <div
        style={{
          backgroundColor: "#eaecf9ed",
          width: "100%",
          padding: "1rem",
          borderRadius: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h3>Comments ({comments.length}):</h3>
          <button
            style={{
              width: "10%",
            }}
            onClick={() => setModal(!modal)}
          >
            Add New
          </button>
        </div>
        {comments.map((el, index) => {
          return (
            <div
              key={el._id}
              style={{
                borderBottom: "2px solid black",
                padding: "1rem",
              }}
            >
              <p style={{ fontSize: "small" }}>
                From: {el.authorName} at{" "}
                {new Date(el.createdAt).toLocaleString()}
              </p>
              <div>
                {editIndex === index ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <button onClick={() => handleSaveClick(el._id)}>
                      Save
                    </button>
                  </div>
                ) : (
                  <p>{el.content}</p>
                )}
                {/* only show edit and delete options if the user is a admin or created the comment  */}
                {user?.id === el.authorId || user?.role === "admin" ? (
                  <div>
                    <button onClick={() => handleEditClick(index, el.content)}>
                      <CiEdit />
                    </button>
                    <button onClick={() => handleDelete(el._id)}>
                      <CiTrash />
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Modal to add a new comment  */}
      {modal && (
        <ModalAdd
          modal={modal}
          setModal={setModal}
          addNew={addNew}
          _id={Date.now().toString()}
          postId={post?._id || ""}
          authorId={user?.id || ""}
          authorName={user?.username || ""}
        />
      )}
    </div>
  );
}
