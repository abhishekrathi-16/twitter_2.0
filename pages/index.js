import { useEffect, useState } from "react";
import PostForm from "../components/PostForm";
import UsernameForm from "../components/UsernameForm";
import useUserInfo from "../hooks/useUserInfo";
import axios from "axios";
import PostContent from "../components/PostComponent";
import Layout from "../components/Layout";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session } = useSession();
  const { userInfo, setUserInfo ,status: userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const [idsLikedByme, setIdsLikedByMe] = useState([]);
  const router = useRouter();

  function fetchHomePosts() {
    axios.get("/api/posts").then((res) => {
      setPosts(res.data.posts);
      setIdsLikedByMe(res.data.idslikedByMe);
    });
  }

  async function logout() {
    setUserInfo(null);
    await signOut();
  }

  useEffect(() => {
    fetchHomePosts();
  }, []);

  if (userInfoStatus === "loading") {
    return "loading user info";
  }

  if (userInfo && !userInfo?.username) {
    return <UsernameForm />;
  }

  if(!userInfo){
    router.push('/login')
    return 'no user info'
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
              {post.parent && (
                <div>
                  <PostContent {...post.parent} />
                  <div className="relative h-8">
                    <div className="absolute border-l-2 ml-5 -top-6 border-twitterBorder h-16"></div>
                  </div>
                </div>
              )}
              <PostContent
                {...post}
                likedByMe={idsLikedByme.includes(post._id)}
              />
            </div>
          ))}
      </div>
      {userInfo && (
        <div className="p-5 text-center border-t border-twitterBorder">
          <button
            onClick={logout}
            className="bg-twitterWhite text-black px-5 py-2 rounded-full"
          >
            Logout
          </button>
        </div>
      )}
    </Layout>
  );
}
