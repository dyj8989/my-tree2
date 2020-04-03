import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000'
export const getTreeList = (url) => {
  return axios.get(url)
}
