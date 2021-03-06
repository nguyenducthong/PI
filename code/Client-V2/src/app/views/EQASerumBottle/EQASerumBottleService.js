import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/SerumBottle";
export const getAll = () => {
  return axios.get(API_PATH);
};
export const searchByPage = searchObject => {
  var url = API_PATH + "/searchByDto";
  return axios.post(url, searchObject);
};
export const checkCode = (id, code) => {
  const config = { params: { id: id, code: code } };
  var url = API_PATH + "/checkCode";
  return axios.get(url, config);
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

export const saveOrUpdateMultipleEQASerumBottle = (serumBottleList, id) => {
  return axios.post(API_PATH + "/saveOrUpdateMultiple/" + id, serumBottleList);
};

export const getSerumBottleBySerumBank = serumBankDto => {
  return axios.post(API_PATH + "/getBySerumBank", serumBankDto);
};
