import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import PostContent from "../../../components/PostComponent";
import Layout from "../../../components/Layout";
import Link from "next/link";

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();
  useEffect(() => {
    if (!id) return;

    axios.get("/api/posts?id=" + id).then((response) => {
      setPost(response.data.post);
    });
  }, [id]);
  return (
    <Layout>
      {post && (
        <div className="px-5 py-2">
          <Link href={'/'}>
            <div className="flex mb-5 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6 mr-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
              Tweet
            </div>
          </Link>
          <PostContent {...post} big={true} />
        </div>
      )}
    </Layout>
  );
}
