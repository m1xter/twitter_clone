import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: listUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/all");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    // Detectar @ para mostrar el dropdown
    const match = value.match(/@(\w*)$/);
    if (match) {
      const query = match[1].toLowerCase();
      const suggestions = listUsers?.filter((user) =>
        user.username.toLowerCase().startsWith(query)
      );
      setFilteredUsers(suggestions);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const addMention = (username) => {
    // Reemplazar la mención en el texto
    const updatedText = text.replace(/@\w*$/, `@${username} `);
    setText(updatedText);
    setShowDropdown(false);
  };


  const highlightText = (text) => {
    // Reemplaza el patrón `@ejemplo` con un `span` estilizado
    const regex = /(@\w+)/g;
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} style={{ color: "blue" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };



  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <div className="relative">

		


          <textarea
            className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
            placeholder="What is happening?!"
            value={text}
            onChange={handleTextChange}
          />

          {showDropdown && (
            <div className="absolute bg-gray-800 rounded shadow-md mt-1 max-h-40 overflow-y-auto">
              {filteredUsers?.map((user) => (
                <div
                  key={user._id}
                  onClick={() => addMention(user.username)}
                  className="cursor-pointer p-2 hover:bg-gray-700"
                >
                  {user.username}
                </div>
              ))}
            </div>
          )}
        </div>

        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  );
};
export default CreatePost;
