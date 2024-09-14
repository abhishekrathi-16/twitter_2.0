import { useEffect, useState } from "react";
import PostForm from "../components/PostForm";
import UsernameForm from "../components/UsernameForm";
import useUserInfo from "../hooks/useUserInfo";
import axios from "axios";
import PostContent from "../components/PostComponent";
import Layout from "../components/Layout";

export default function Home() {
  const { userInfo, status: userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);

  function fetchHomePosts() {
    axios.get("/api/posts").then((res) => {
      setPosts(res.data);
    });
  }
  useEffect(() => {
    fetchHomePosts();
  }, []);

  if (userInfoStatus === "loading") {
    return "loading user info";
  }

  if (!userInfo?.username) {
    return <UsernameForm />;
  }

  return (
    <Layout>
      <h1 className="text-lg font-bold p-4">Home</h1>
      <PostForm
        onPost={() => {
          fetchHomePosts();
        }}
      />
      <div className="">
        {posts.length > 0 &&
          posts.map((post) => (
            <div className="border-t border-twitterBorder p-5">
              <PostContent {...post} />
            </div>
          ))}
      </div>
    </Layout>
  );
}
