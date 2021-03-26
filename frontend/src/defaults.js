export const BACKEND_URL = "http://127.0.0.1:8000";

// Authorization header used to make queries to the backend with correct user token
export const AXIOS_HEADER = (token) => (
  {
    'Content-Type': 'application/json',
    'Authorization': `JWT ${token}`
  }
);