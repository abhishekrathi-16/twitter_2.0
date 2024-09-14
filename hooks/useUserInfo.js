import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function useUserInfo() {
  const { data: session, status: sessionStatus } = useSession();
  const [userInfo, setUserInfo] = useState();
  const [status, setStatus] = useState("loading");
  const getUserInfo = () => {
    if (sessionStatus === "loading"){
      setStatus('unauthenticated')
    }

    if(!session?.user?.id) return; // just return if there is no session
    fetch("/api/users?id=" + session.user.id).then(response => {
      response.json().then(json => {
        setUserInfo(json.user);
        setStatus("authenticated");
      });
    });
  };

  useEffect(() => {
    getUserInfo();
  }, [sessionStatus]);

  return { userInfo, setUserInfo, status };
}
