import Link from "next/link";

export default function TopNavLink({ title = "Tweet", url='/' }) {
  return (
    <Link href={url}>
      <div className="flex mb-2 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 mr-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
          />
        </svg>
        {title}
      </div>
    </Link>
  );
}
