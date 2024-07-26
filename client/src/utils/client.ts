import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://dev-it-express-react.onrender.com',
});
