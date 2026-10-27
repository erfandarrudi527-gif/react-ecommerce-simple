import axios from "axios";

// Local FakeStore-compatible API (run with: npm run api)
// Override with REACT_APP_API_URL when deploying elsewhere.
axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:4000";

const http = {
  get: axios.get,
  post: axios.post,
  delete: axios.delete,
  put: axios.put,
  patch: axios.patch,
};

export default http;
