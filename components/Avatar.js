import EditableImage from "./EditableImage";

export default function Avatar({ src, big, onChange, editable }) {
  const widthClass = big ? "w-24 h-24" : "w-12 h-12";

  return (
    <div className="rounded-full overflow-hidden">
      <EditableImage
        type="image"
        src={src}
        editable={editable}
        onChange={onChange}
        className={"rounded-full overflow-hidden " + widthClass}
      />
    </div>
  );
}
