import axios from "axios";
import ConstantList from "../../appConfig";

const API_PATH = ConstantList.API_ENPOINT + "/api/referenceDocument";

export const getCurrentUser = ()=> {
    var url =  ConstantList.API_ENPOINT + "/api/users/getCurrentUser";
    return axios.get(url);
  };
   
export const searchByPage = (searchObject) => {
    var url = API_PATH + "/searchByDto";
    return axios.post(url, searchObject);
};

export const getItemById = id => {
    var url = API_PATH + "/getById/" + id;
    return axios.get(url);
};

export const deleteItem = id => {
    var url = API_PATH + "/" + id;
    return axios.delete(url);
};

export const saveItem = item => {
    var url = API_PATH;
    if (item.id) {
        return axios.put(url + "/" + item.id, item);
    }
    return axios.post(url, item);
};
