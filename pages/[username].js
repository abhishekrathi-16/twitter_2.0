import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import TopNavLink from "../components/TopNavLink";
import axios from "axios";
import Cover from "../components/Cover";
import Avatar from "../components/Avatar";
import PostContent from "../components/PostComponent";

export default function UserPage() {
  const router = useRouter();
  const { username } = router.query;
  const [profileInfo, setProfileInfo] = useState();
  const [posts, setPosts] = useState([]);
  const [postsLikedByMe, setPostsLikedByMe] = useState([]);

  useEffect(() => {
    if (!username) return;
    axios.get("/api/users?username=" + username).then((response) => {
      setProfileInfo(response.data.user);
    });
  }, [username]);

  useEffect(() => {
    if (!profileInfo?._id) return;

    axios.get("/api/posts?author=" + profileInfo._id).then((response) => {
      setPosts(response.data.posts);
      setPostsLikedByMe(response.data.idslikedByMe);
    });
  }, [profileInfo]);

  function updateUserImage(type, src) {
    setProfileInfo(prev => ({...prev, [type]: src}))
  }

  return (
    <Layout>
      {!!profileInfo && (
        <div>
          <div className="px-5 pt-2">
            <TopNavLink title={profileInfo.name} />
          </div>
          <Cover
            src={profileInfo.cover}
            onChange={(src) => updateUserImage("cover", src)}
          />
          <div className="flex justify-between">
            <div className="ml-5 relative">
              <div className="absolute -top-12 border-4 rounded-full border-black">
                <Avatar big src={profileInfo.image} editable={true} />
              </div>
            </div>
            <div className="p-2">
              <button className="bg-twitterBlue text-white py-2 px-5 rounded-full">
                Follow
              </button>
            </div>
          </div>
          <div className="px-5 mt-4">
            <h1 className="font-bold text-xl leading-5">{profileInfo.name}</h1>
            <h2 className="text-twitterLightGray text-sm">
              @{profileInfo.username}
            </h2>
            <div className="text-sm mt-2 mb-4">Mars & Cars, Chips and Dips</div>
          </div>
        </div>
      )}
      {posts?.length > 0 &&
        posts.map((post) => (
          <div className="p-5 border-t border-twitterBorder" key={post._id}>
            <PostContent
              {...post}
              likedByMe={postsLikedByMe.includes(post._id)}
            />
          </div>
        ))}
    </Layout>
  );
}
