import axios from 'axios';

const web3Instance = axios.create({
  baseURL: "http://3.37.46.45:30352/api",
  withCredentials: true,
});

export default web3Instance;