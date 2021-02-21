import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/EQAActivityLog";
export const searchByPage = (searchObject) => {
    var url = API_PATH + "/searchByDto";
    return axios.post(url, searchObject);
  };