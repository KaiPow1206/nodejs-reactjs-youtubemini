import axios from 'axios';

export const BASE_URL = 'http://localhost:8080';

const options = {
  params: {
    maxResults: 50,
  },
  headers: {
    'token': localStorage.getItem("LOGIN_USER")
  },
};



export const fetchFromAPI = async (url) => {
  const { data } = await axios.get(`${BASE_URL}/${url}`);

  return data;
};

export const getListVideo = async () =>{
  const {data} = await axios.get(`${BASE_URL}/video/get-videos`);
  return data;
}

export const getType = async ()=>{
  const{data}=await axios.get(`${BASE_URL}/video/get-types`,options);
  return data;
}

export const getListVideoType = async(typeid)=>{
    const {data} = await axios.get(`${BASE_URL}/video/get-typpes-details/${typeid}`);
    return data;
}

export const registerApi= async(pageload)=>{
  const{data} = await axios.post(`${BASE_URL}/auth/register`,pageload);
  return data;
}
export const loginAPI = async (pageload) =>{
  const{data} = await axios.post(`${BASE_URL}/auth/login`,pageload);
  return data;
}

export const loginFaceBooKAPI =async(newUser) => {
  console.log("ádas", newUser)
  const{data} = await axios.post(`${BASE_URL}/auth/login-face`,newUser);
  console.log("new", newUser)
  return data;
}
