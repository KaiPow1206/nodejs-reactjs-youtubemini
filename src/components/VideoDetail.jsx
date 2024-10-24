import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Videos, Loader } from "./";
import { getVideo } from "../utils/fetchFromAPI"; // Giả sử đây là file API bạn gọi

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState(null);
  const { id } = useParams(); // Lấy ID từ URL

  useEffect(() => {
    getVideo(id) // Sử dụng `id` từ useParams để gọi API
      .then((result) => {
        setVideoDetail(result);
      })
      .catch(() => {
        console.log("error");
      });

    // Dữ liệu video gợi ý tĩnh
    let lstItem = [
      { video_id: 1, video_name: "Build and Deploy 5 JavaScript & React API Projects in 10 Hours - Full Course | RapidAPI", thumbnail: "https://i.ytimg.com/vi/QU9c0053UAU/hq720.jpg", channelTitle: "JavaScript Mastery" },
      { video_id: 2, video_name: "The movies Iron man 4: 0.1 Hours", thumbnail: "https://i.ytimg.com/vi/t86sKsR4pnk/hq720.jpg", channelTitle: "JavaScript Mastery" }
    ];
    setVideos(lstItem);
  }, [id]);

  if (!videoDetail) return <Loader />; // Hiển thị loader nếu chưa có dữ liệu

  // Kiểm tra xem `user` có tồn tại trước khi truy cập thuộc tính `user_id`
  const { video_name, description, source, views, user } = videoDetail;

  return (
    <Box className="p-5" minHeight="95vh">
      <Stack direction={{ xs: "column", md: "row" }}>
        <Box flex={1}>
          <Box sx={{ width: "100%", position: "sticky", top: "86px" }}>
            {/* Video chính */}
            <ReactPlayer url={source} className="react-player" controls />
            <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
              {video_name}
            </Typography>
            <Stack direction="row" justifyContent="space-between" sx={{ color: "#fff" }} py={1} px={2}>
              <div>
                <i className="fa-solid fa-comments pe-3"></i>

                {/* Kiểm tra nếu `user` tồn tại trước khi hiển thị */}
                {user && (
                  <Link to={`/channel/${user.user_id}`}>
                    <Typography variant={{ sm: "subtitle1", md: 'h6' }} color="#fff">
                      <b>{user.full_name}</b>
                      <CheckCircleIcon sx={{ fontSize: "12px", color: "gray", ml: "5px" }} />
                    </Typography>
                  </Link>
                )}
              </div>
              <Stack direction="row" gap="20px" alignItems="center">
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  <i className="far fa-eye me-2" /> {parseInt(views).toLocaleString()}
                </Typography>
                <div>
                  <a href="#!" className="text-white rounded-start p-2 border">
                    <i className="far fa-thumbs-up me-2" /> {parseInt(0).toLocaleString()}
                  </a>
                  <a href="#!" className="text-white rounded-end p-2 border">
                    <i className="far fa-thumbs-down me-2" />
                  </a>
                </div>
              </Stack>
            </Stack>

            <div className="text-white bg-dark rounded p-3">
              {description}
            </div>

            {/* Comment Section */}
            {/* ... */}
          </Box>
        </Box>

        <Box px={2} py={{ md: 1, xs: 5 }} justifyContent="center" alignItems="center">
          {/* Danh sách video gợi ý */}
          <Videos videos={videos} direction="column" />
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;
