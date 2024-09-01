import axios from "axios";

export const http = axios.create({
  // baseURL: "https://PostingApp.render.com.marketmajesty.net/api",
  baseURL: "http://localhost:4001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// export const uploadPath =
// "https://PostingApp.render.com.marketmajesty.net/uploads/";
export const uploadPath = "http://localhost:4001/uploads/";
