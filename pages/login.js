import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginPage({ providers }) {
  const { data, status } = useSession();
  const router = useRouter();
  if(status == 'loading'){
    return ''
  }
  if(data){
    router.push('/');
  }
  return (
    <div className="flex items-center justify-center h-screen">
      {Object.values(providers).map((provider) => (
        <div key={provider.id}>
          <button
            className="bg-twitterWhite pr-3 pl-3 py-2 text-black rounded-full flex items-center gap-2"
            onClick={async () => await signIn(provider.id)}
          >
            <img src="/google.png" alt="" className="h-6" />
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
