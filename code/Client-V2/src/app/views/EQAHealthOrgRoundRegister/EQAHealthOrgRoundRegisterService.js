import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/HealthOrgEQARound";
const EXCEL_PATH =
  ConstantList.API_ENPOINT + "/api/fileDownload/exportExcel_healthOrgEQARoundTable";
export const getAll = () => {
  return axios.get(API_PATH + "/getAll");
};
export const searchByPage = (searchObject) => {
  var url = API_PATH + "/search";
  return axios.post(url, searchObject);
};
export const searchHealthOrg = (searchObject, page, pageSize) => {
  var pageIndex = page;
  var url = API_PATH + "/searchHealthOrg";
  return axios.post(url, searchObject);
};

export const searchSampleSetByPage = searchObject => {
  var url = ConstantList.API_ENPOINT + "/api/EQASampleSet/searchByDto";
  return axios.post(url, searchObject);
};
export const getByPage = (page, pageSize) => {
  var pageIndex = page + 1;
  var params = pageIndex + "/" + pageSize;
  var url = API_PATH + params;
  return axios.get(url);
};

export const getItemById = id => {
  var url = API_PATH + "/" + id;
  return axios.get(url);
};

export const getTubeById = id => {
  var url =
    ConstantList.API_ENPOINT +
    "/api/EQASampleTube/getByHealthOrgEQARoundIdAdmin/" +
    id;
  return axios.get(url);
};

export const getItemByIdRoundRegister = id => {
  var url = API_PATH + "/" + id;
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

export const addMultiple = itemList => {
  return axios.post(API_PATH + "/addMultiple", itemList);
};


export const exportToExcel = (searchObject) => {
  return axios({
    method: 'post',
    url: EXCEL_PATH,
    data: searchObject,
    responseType: 'blob',
  })
};

export const updateSubscriptionStatus = (listId) => {
  var url = API_PATH + "/updateStatus";
  return axios.post(url, listId);
};