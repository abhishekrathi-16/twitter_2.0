import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PostContent from "../../../components/PostComponent";
import Layout from "../../../components/Layout";
import Link from "next/link";
import useUserInfo from "../../../hooks/useUserInfo";
import PostForm from "../../../components/PostForm";
import TopNavLink from "../../../components/TopNavLink";

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  const [replies, setReplies] = useState([]);
  const [repliesLikedByMe, setRepliesLikedByMe] = useState([]);
  const { userInfo } = useUserInfo();

  function fetchData() {
    axios.get("/api/posts?id=" + id).then((response) => {
      setPost(response.data.post);
    });

    axios.get("/api/posts?parent=" + id).then((response) => {
      setReplies(response.data.posts);
      setRepliesLikedByMe(response.data.idslikedByMe);
    });
  }
  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);
  return (
    <Layout>
      {post && (
        <div className="px-5 py-2">
          <TopNavLink />
          <PostContent {...post} big={true} />
        </div>
      )}
      {!!userInfo && (
        <div className="border-t border-twitterBorder py-5">
          <PostForm
            onPost={fetchData}
            compact
            parent={id}
            placeholder={"Tweet your reply"}
          />
        </div>
      )}
      <div className="">
        {replies.length > 0 &&
          replies.map((reply) => (
            <div className="p-5 border-t border-twitterBorder">
              <PostContent
                {...reply}
                likedByMe={repliesLikedByMe.includes(reply._id)}
              />
            </div>
          ))}
      </div>
    </Layout>
  );
}
