import useUserInfo from "../hooks/useUserInfo";
import { useState } from 'react'
import axios from 'axios'
import Avatar from "./Avatar";

export default function PostForm({ onPost }) {
  const { userInfo, status } = useUserInfo();
  const [text, setText] = useState("")

  async function onPostSubmit(e){
    e.preventDefault();
    await axios.post('/api/posts',{text});
    setText('')
    if(onPost){
      onPost()
    }
  }

  if (status === "loading") return '';
  return (
    <>
      <form className="mx-4" onSubmit={onPostSubmit}>
        <div className="flex">
          <div className="">
            <Avatar src={userInfo?.image} />
          </div>
          <div className="grow pl-2">
            <textarea
              className="w-full p-2 bg-transparent text-twitterWhite"
              placeholder={"What's happening?"}
              value={text}
              onChange={e=>setText(e.target.value)}
            />
            <div className="text-right border-t border-twitterBorder pt-2">
              <button className="bg-twitterBlue text-white px-5 py-1 rounded-full">
                Tweet
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
