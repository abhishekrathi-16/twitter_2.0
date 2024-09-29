import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useUserInfo from "../hooks/useUserInfo";
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
  const [originalUserInfo, setOriginalProfileInfo] = useState();
  const { userInfo } = useUserInfo();
  const [posts, setPosts] = useState([]);
  const [postsLikedByMe, setPostsLikedByMe] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!username) return;
    axios.get("/api/users?username=" + username).then((response) => {
      setProfileInfo(response.data.user);
      setOriginalProfileInfo(response.data.user);
      setIsFollowing(!!response.data.following)
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
    setProfileInfo(prev => ({ ...prev, [type]: src }));
  }

  async function updateProfile() {
    const { bio, name, username } = profileInfo;
    await axios.put("/api/profile", {
      bio,
      name,
      username,
    });
    setEditMode(false);
  }

  function cancel() {
    setProfileInfo((prev) => {
      const { bio, name, username } = originalUserInfo;
      return { ...prev, bio, name, username };
    });
    setEditMode(false);
  }

  function toggleFollow() {
    setIsFollowing(prev => !prev);
    axios.post("/api/followers", { 
      destination: profileInfo._id
     });
  }

  const isMyProfile = profileInfo?._id === userInfo?._id;

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
            editable={isMyProfile}
          />
          <div className="flex justify-between">
            <div className="ml-5 relative">
              <div className="absolute -top-12 border-4 rounded-full border-black overflow-hidden">
                <Avatar
                  big
                  src={profileInfo.image}
                  editable={isMyProfile}
                  onChange={src => updateUserImage("image", src)}
                />
              </div>
            </div>
            <div className="p-4">
              {!isMyProfile && (
                <button
                  onClick={toggleFollow}
                  className={
                    (isFollowing
                      ? "bg-twitterWhite text-black"
                      : "bg-twitterBlue text-white") +
                    " py-2 px-5 rounded-full font-bold"
                  }
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
              {isMyProfile && (
                <div>
                  {!editMode && (
                    <button
                      className="bg-twitterBlue text-white py-2 px-5 rounded-full"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                  {editMode && (
                    <div>
                      <button
                        className="bg-twitterBlue text-white py-2 px-5 rounded-full mr-2"
                        onClick={() => updateProfile()}
                      >
                        Save Profile
                      </button>
                      <button
                        className="bg-twitterWhite text-black py-2 px-5 rounded-full"
                        onClick={() => cancel()}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="px-5 mt-4">
            {!editMode && (
              <div>
                <h1 className="font-bold text-xl leading-5">
                  {profileInfo.name}
                </h1>
                <h2 className="text-twitterLightGray text-sm">
                  @{profileInfo.username}
                </h2>
                <div className="text-sm mt-2 mb-4">{profileInfo.bio}</div>
              </div>
            )}
            {editMode && (
              <div className="flex flex-col w-min">
                <input
                  type="text"
                  value={profileInfo.name}
                  className="bg-twitterBorder p-2 rounded-full text-center mb-2"
                  onChange={(e) =>
                    setProfileInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  value={profileInfo.username}
                  className="bg-twitterBorder p-2 rounded-full text-center mb-2"
                  onChange={(e) =>
                    setProfileInfo((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
                <div>
                  <textarea
                    value={profileInfo.bio}
                    className="bg-twitterBorder p-2 rounded-2xl mb-2 w-64 block"
                    onChange={(e) =>
                      setProfileInfo((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}
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
