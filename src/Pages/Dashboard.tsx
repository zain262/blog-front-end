import React, { useState, useEffect, useContext } from "react";
import BlogPost from "../Components/BlogPost";
import "./Dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserContext from "../context";

interface BlogPostType {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
  authorId: string;
  delete: (id: string) => Promise<void>;
}

export default function Dashboard() {

  //Create states to manage posts and page view
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [postend, setPostend] = useState(10);
  const [poststart, setPoststart] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const nav = useNavigate();
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("useContext must be used within a UserProvider");
  }

  //Get the users info from the context
  const { user, setUser } = userContext;

  useEffect(() => {

    //Incase the users context isnt avalible reassign it
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
          "http://localhost:7000/api/v1/blogs/",
          {
            withCredentials: true,
          }
        );
        setPosts(response.data.data.blogs);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (idCom: string) => {
    try {
      //Send a delete request to the backend and refetch all the posts to reflect the delete
      await axios.delete(`http://localhost:7000/api/v1/blogs/delete/${idCom}`, {
        withCredentials: true,
      });
      const response = await axios.get("http://localhost:7000/api/v1/blogs/", {
        withCredentials: true,
      });
      setPosts(response.data.data.blogs);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const next = () => {
    //Upon going on the next page set the new display posts
    const newPostEnd = postend + 10;
    if (newPostEnd <= posts.length) {
      setPostend(newPostEnd);
      setPoststart(poststart + 10);
      setPage((e) => e + 1);
    }
  };

  const prev = () => {
    //Upon going to the prev page chnage the indexes to reflect the correct posts
    const newPostStart = poststart - 10;
    if (newPostStart >= 0) {
      setPoststart(newPostStart);
      setPostend(postend - 10);
      setPage((e) => e - 1);
    }
  };

  // filyer posts based on search query for both title and content
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {/* Header area */}
        <p>Welcome {user?.username + "!"}</p>
        <h1
          style={{
            textAlign: "center",
            color: "#5f33e1",
          }}
        >
          Blog App
        </h1>
        <button
          onClick={() => {
            nav("/homepage");
          }}
        >
          Your Blogs
        </button>
      </div>

      {/* Search bar */}
      <div style={{ textAlign: "center", margin: "1rem" }}>
        <input
          type="text"
          placeholder="Search by title or content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Show posts input */}
      <div className="App">
        <div className="diplay-post">
          {filteredPosts.slice(poststart, postend).map((el) => {
            return (
              <BlogPost
                id={el._id}
                key={el._id}
                title={el.title}
                content={el.content}
                createdAt={new Date(el.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
                authorName={el.authorName}
                authorId={el.authorId}
                delete={handleDelete}
              />
            );
          })}
        </div>
      </div>

        {/* Page nav buttons*/}
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
        <button
          onClick={() => next()}
          disabled={postend >= filteredPosts.length}
        >
          Next..
        </button>
      </div>
    </>
  );
}
