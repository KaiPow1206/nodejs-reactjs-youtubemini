import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { detailUser, uploadfile, updateUser } from "../utils/fetchFromAPI";
import ReactPlayer from "react-player";

const InfoUser = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);
  const [avatar, setAvatar] = useState("http://dergipark.org.tr/assets/app/images/buddy_sample.png");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const { id } = useParams();
  const formFile = useRef();
  const formFileVideo = useRef();
  const navigate = useNavigate();


  useEffect(() => {
    detailUser(id)
      .then((result) => {
        console.log(result)
        setChannelDetail(result);
        const avatarUrl = `http://localhost:8080/${result.avatar}`
        setAvatar(avatarUrl);
        localStorage.setItem("USER_AVATAR", avatarUrl); // Lưu avatar vào localStorage
        setFullName(result.full_name);
        setEmail(result.email);
      })
      .catch((error) => {
        console.log(error)
      })
  }, [id]);


  const handleUpload = async () => {
    const file = formFile.current.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("hinhanh", file);

    try {
      const result = await uploadfile(id, formData); // Gọi API uploadfile và truyền id
      if (result.data) {
        setAvatar(`http://localhost:8080/${result.data.url}?t=${new Date().getTime()}`); // Làm mới URL để tránh cache
        toast.success("Avatar uploaded successfully");
      }
    } catch (error) {
      toast.error("Error uploading avatar");
      console.error("Upload avatar error:", error);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateUser = async () => {
    const payload = {
      full_name: fullName,
      pass_word: password,
      email: email,
    };

    console.log("Updating user with ID:", id);
    console.log("Payload:", payload);

    try {
      const result = await updateUser(id, payload); // Gọi API updateUser

      if (result && result.message) {
        await handleUpload(); // Gọi hàm upload avatar trước khi cập nhật
        toast.success(result.message);
        navigate("/"); // Chuyển hướng sau khi cập nhật thành công
      }
    } catch (error) {
      // Kiểm tra xem có thông tin lỗi trong phản hồi không
      if (error.response && error.response.data) {
        toast.error(error.response.data.message); // Hiển thị thông báo lỗi từ backend
      } else {
        toast.error("Error updating user"); // Thông báo lỗi chung
      }
      console.error("Update user error:", error);
    }
  };


  return (
    <div className="p-5" style={{ minHeight: "95vh" }}>
      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            className="nav-link active"
            id="nav-home-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-home"
            type="button"
            role="tab"
            aria-controls="nav-home"
            aria-selected="true"
          >
            Info
          </button>
          <button
            className="nav-link"
            id="nav-profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-profile"
            type="button"
            role="tab"
            aria-controls="nav-profile"
            aria-selected="false"
          >
            Upload video
          </button>
        </div>
      </nav>
      <div className="tab-content mt-3" id="nav-tabContent">
        {/* Update user info */}
        <div
          className="tab-pane fade show active"
          id="nav-home"
          role="tabpanel"
          aria-labelledby="nav-home-tab"
          tabIndex={0}
        >
          <div className="row">
            <div className="col-2" style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap"
            }}>
              <img
                className="rounded-circle"
                src={avatar}
                width="150"
                style={{ height: "150px", objectFit: "cover" }}
                alt="Avatar"
                onError={(e) => {
                  e.target.onerror = null; // Ngăn chặn lặp lại lỗi
                  e.target.src = "http://dergipark.org.tr/assets/app/images/buddy_sample.png";
                }}
              />
              <input
                className="form-control"
                type="file"
                id="formFile"
                ref={formFile}
                onChange={handleAvatarChange}
              />
            </div>
            <div className="col-10">
              <form className="row g-3 text-white">
                <div className="col-md-6">
                  <label htmlFor="inputFullName" className="form-label">Full name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputFullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputEmail" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="inputEmail"
                    value={channelDetail?.email || ""}
                    onChange={(e) => setChannelDetail({ ...channelDetail, email: e.target.value })}
                    readOnly
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="inputPassword" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="inputPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <button type="button" className="btn btn-primary" onClick={handleUpdateUser}>
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Upload video */}
        <div
          className="tab-pane fade"
          id="nav-profile"
          role="tabpanel"
          aria-labelledby="nav-profile-tab"
          tabIndex={0}
        >
          <div className="row">
            <div className="col-2 text-white">
              <label htmlFor="inputThumbnail" className="form-label">Thumbnail</label>
              <img
                src="https://cdn.icon-icons.com/icons2/495/PNG/512/video-clip-3_icon-icons.com_48391.png"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                alt="Thumbnail"
              />
              <input className="form-control" type="file" id="formFile" ref={formFileVideo} />
            </div>
            <div className="col-6">
              <form className="row g-3 text-white">
                <div className="col-md-12">
                  <label htmlFor="videoName" className="form-label">Video name</label>
                  <input type="text" className="form-control" id="videoName" />
                </div>
                <div className="col-md-12">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea className="form-control" id="description"></textarea>
                </div>
                <div className="col-12">
                  <button type="button" className="btn btn-primary">Upload</button>
                </div>
              </form>
            </div>
            <div className="col-4 text-white">
              <label htmlFor="inputSource" className="form-label">Source</label>
              <input className="form-control" type="file" id="inputSource" />
              <ReactPlayer url={`null`} className="react-player" controls />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoUser;
