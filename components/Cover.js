import { FileDrop } from "react-file-drop";
import { PulseLoader } from 'react-spinners'
import { useState } from "react";

export default function Cover({ src, onChange }) {
  const [isFileNearby, setIsFileNearby] = useState(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  let classes = "";
  if (isFileNearby && !isFileOver) {
    classes += " bg-white opacity-60";
  }
  if (isFileOver) {
    classes += " bg-blue-500 opacity-60";
  }

  function updateImage(files, e) {
    e.preventDefault();
    setIsFileOver(false);
    setIsFileNearby(false);
    setIsUploading(true);
    const data = new FormData();
    data.append("cover", files[0]);
    fetch("/api/upload", {
      method: "POST",
      body: data,
    }).then(async (response) => {
      const json = await response.json();
      onChange(json.src);
      setIsUploading(false);
    });
  }

  return (
    <FileDrop
      onDrop={updateImage}
      onDragOver={() => setIsFileOver(true)}
      onDragLeave={() => setIsFileOver(false)}
      onFrameDragEnter={() => setIsFileNearby(true)}
      onFrameDragLeave={() => setIsFileNearby(false)}
    >
      <div className={"bg-twitterBorder relative"}>
        <div className={"absolute inset-0 " + classes}></div>
        {isUploading && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(48,140,216,0.9" }}
          >
            <PulseLoader size={12} color={'#fff'} />
          </div>
        )}
        {src && (
          <div className="flex overflow-hidden items-center h-52">
            <img src={src} className="w-full" alt="" />
          </div>
        )}
      </div>
    </FileDrop>
  );
}
