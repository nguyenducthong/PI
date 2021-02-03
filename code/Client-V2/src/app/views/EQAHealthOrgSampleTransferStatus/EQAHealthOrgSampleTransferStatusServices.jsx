import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/HealthOrgEQARound";
const API_PATH_USER_IN_HEALTH_ORG =
  ConstantList.API_ENPOINT + "/api/UserInHealthOrg";
const API_PATH_USER = ConstantList.API_ENPOINT + "/api/users/getCurrentUser";

export const reRegisterEQARound = item => {
  var url = API_PATH + "/" + item.id;
  return axios.put(url, item);
};

export const registerEQARound = item => {
  var url = API_PATH + "/addMultiple";
  return axios.post(url, item);
};

export const getCurrentUser = () => {
  var url = API_PATH_USER;
  return axios.get(url);
};

export const getHealthOrgByUserId = userId => {
  var url = API_PATH_USER_IN_HEALTH_ORG + "/getListHealthOrgByUser/" + userId;
  return axios.get(url);
};

export const searchByPage = searchObject => {
  var url = API_PATH + "/searchByTransferredSample";
  return axios.post(url, searchObject);
};

export const searchEQARoundByPage = searchObject => {
  var url = API_PATH + "/searchEQARoundByPage";
  return axios.post(url, searchObject);
};

export const getItemById = id => {
  var url = API_PATH + "/" + id;
  return axios.get(url);
};

export const healthOrgRegisterRound = roundId => {
  var url = API_PATH + "/healthOrgRegisterRound/" + roundId;
  return axios.get(url);
};

export const changeSampleTransferStatus = (healthOrgID, status) => {
  let url = API_PATH + "/changeSampleTransferStatus/" + healthOrgID;
  return axios({
    url,
    method: "post",
    data: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
};
export const changeSampleTransferStatusRef = (healthOrgID, status) => {
  let url = API_PATH + "/changeSampleTransferStatusRef/" + healthOrgID;
  return axios({
    url,
    method: "post",
    data: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
};

export const checkCountReport = id => {
  const config = { params: { id: id} };

  var url =ConstantList.API_ENPOINT + "/api/EQAResultReport" + "/checkCountReport/" ;
  return axios.get(url, config);
};
