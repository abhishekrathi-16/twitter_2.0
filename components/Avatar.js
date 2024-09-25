export default function Avatar({ src, big, onChange, editable }) {
  const widthClass = big?'w-24':'w-12';
  return (
    <div className={"rounded-full overflow-hidden "+widthClass}>
      <img src={src} alt="avatar" />
    </div>
  );
}