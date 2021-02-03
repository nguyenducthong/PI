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
  var url = API_PATH + "/search";
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

export const handleCancelRegistration = id => {
  var url = API_PATH + "/handleCancelRegistration/" + id;
  return axios.get(url);
};

export const handleCancelRegistrationFromDialog = (healthOrgId, roundId) => {
  let url = API_PATH + "/cancelRegistration/" + healthOrgId + "/" + roundId;
  return axios.post(url);
};
export const searchEQAPlanningByPage = searchObject => {
  var url = API_PATH + "/searchEQAPlanningByPage";
  return axios.post(url, searchObject);
};