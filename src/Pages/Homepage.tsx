import React from "react";
import BlogPost from "../Components/BlogPost";
import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./Dashboard.css";
import Blog from "./Blog";
import ModalBlog from "../Components/ModalBlog";
import { useContext } from "react";
import UserContext from "../context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
const Post: PostType[] = [
  {
    _id: "p1",
    title: "The Benefits of Learning JavaScript",
    content:
      "JavaScript is a versatile language used for both frontend and backend development. Its non-blocking nature allows developers to create highly responsive applications. From simple DOM manipulation to complex server-side applications using Node.js, JavaScript is everywhere. With the rise of frameworks like React and Vue, learning JavaScript opens doors to modern web development.",
    authorId: "u1",
    authorName: "john_doe",
    createdAt: "2024-10-10T10:00:00Z",
  },
  {
    _id: "p2",
    title: "Understanding React Hooks",
    content:
      "React hooks have revolutionized how we manage state in functional components. Hooks like useState and useEffect simplify the way we handle side effects and lifecycle events. They promote a cleaner and more functional approach to managing state, allowing for better code reuse and easier testing. By leveraging hooks, developers can create more complex components without the overhead of class-based components.",
    authorId: "u2",
    authorName: "jane_smith",
    createdAt: "2024-10-11T09:00:00Z",
  },
  {
    _id: "p3",
    title: "Node.js Best Practices for API Development",
    content:
      "Node.js is great for building scalable network applications, and here are some best practices to follow when developing APIs. Firstly, always use asynchronous code to handle I/O operations to avoid blocking the event loop. Secondly, structure your application using the MVC pattern to separate concerns and improve maintainability. Additionally, ensure to handle errors gracefully and provide meaningful HTTP status codes in your responses.",
    authorId: "u3",
    authorName: "alex_jones",
    createdAt: "2024-10-12T12:30:00Z",
  },
];

type PostType = {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  imageUrl?: string;
  createdAt: string;
};

export default function HomePage() {
  //Create states to manage the posts and pagination
  const [posts, setPosts] = useState<PostType[]>(Post);
  const [modal, setModal] = useState(false);
  const [postend, setPostend] = useState(10);
  const [poststart, setPoststart] = useState(0);
  const [page, setPage] = useState(1);

  const nav = useNavigate();

  const userContext = useContext(UserContext);
  //Get the user context

  if (!userContext) {
    throw new Error("useContext must be used within a UserProvider");
  }

  const handleDelete = async (idCom: string) => {
    try {
      //Upon delete send a delee requets to the backend and refetch the posts
      const res = await axios.delete(
        `http://localhost:7000/api/v1/blogs/delete/${idCom}`,
        { withCredentials: true }
      );

      const response = await axios.get(
        "http://localhost:7000/api/v1/blogs/user/me",
        {
          withCredentials: true,
        }
      );

      setPosts(response.data.data.blogs);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const { user, setUser } = userContext;

  useEffect(() => {
    //Upon load fetch all the posts pertaining to the logged in user and set the context incase its missing
    const fetchPosts = async () => {
      try {
        if (!user) {
          console.log("AAAAAAAA");
          const res = await axios.get("http://localhost:7000/api/v1/users/me", {
            withCredentials: true,
          });

          setUser(res.data);
        }
        const response = await axios.get(
          "http://localhost:7000/api/v1/blogs/user/me",
          { withCredentials: true }
        );
        setPosts(response.data.data.blogs);
        console.log(response.data.data.blogs);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const addNew = async (formData: FormData) => {
    try {
      //Add a new blog by sending a create request to the backend and refetch all posts to update the frontend
      const res = await axios.post(
        "http://localhost:7000/api/v1/blogs/create",
        formData,
        {
          withCredentials: true,
        }
      );

      const response = await axios.get(
        "http://localhost:7000/api/v1/blogs/user/me",
        { withCredentials: true }
      );
      setPosts(response.data.data.blogs);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  //Pagination fucntions to edit the indexes of the posts array that should be visible per page
  const next = () => {
    const newPostEnd = postend + 10;
    if (newPostEnd <= Post.length) {
      setPostend(newPostEnd);
      setPoststart(poststart + 10);
      setPage((e) => e + 1);
    }
  };

  const prev = () => {
    const newPostStart = poststart - 10;
    if (newPostStart >= 0) {
      setPoststart(newPostStart);
      setPostend(postend - 10);
      setPage((e) => e - 1);
    }
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            nav("/dashboard");
          }}
        >
          Dashboard
        </button>
        <h1
          style={{
            textAlign: "center",
            color: "#5f33e1",
          }}
        >
          {user?.username + "'s Posts"}
        </h1>
        <button onClick={() => setModal(!modal)}>Create Post!</button>
      </div>
      {posts.length === 0 ? (
        <h1
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            padding: "10rem",
          }}
        >
          No Posts Yet 😔
        </h1>
      ) : (
        <div className="App">
          <div className="diplay-post">
            {posts.slice(poststart, postend).map((el) => {
              return (
                <BlogPost
                  id={el._id}
                  key={el._id}
                  title={el.title}
                  content={el.content}
                  createdAt={new Date(el.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                  authorName={el.authorName}
                  authorId={el.authorId}
                  delete={handleDelete}
                />
              );
            })}
          </div>
        </div>
      )}
      {posts.length <= 10 ? (
        <></>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <button onClick={() => prev()} disabled={page === 1 ? true : false}>
            Prev...
          </button>
          <button onClick={() => next()}>Next..</button>
        </div>
      )}
      <div>
        {modal && (
          <ModalBlog
            modal={modal}
            setModal={setModal}
            addNew={addNew}
            authorId={"a1"}
            authorName={"john"}
          />
        )}
      </div>
    </>
  );
}
