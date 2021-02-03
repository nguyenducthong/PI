import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/EQAPlanning";

export const search = searchObject => {
  var url = API_PATH + "/searchByDto";
  return axios.post(url, searchObject);
};

export const getByPage = (page, pageSize) => {
  var pageIndex = page + 1;
  var params = pageIndex + "/" + pageSize;
  var url = ConstantList.API_ENPOINT + "/api/EQAPlanning/" + params;
  return axios.get(url);
};
export const getUserById = id => {
  return axios.get("/api/user", { data: id });
};
export const getAllEQAPlannings = eQAPlanning => {
  return axios.post(
    ConstantList.API_ENPOINT + "/api/EQAPlanning/searchByDto",
    eQAPlanning
  );
};
export const getById = id => {
  return axios.get(ConstantList.API_ENPOINT + "/api/EQAPlanning/getById/" + id);
};
export const deleteEQAPlanning = id => {
  return axios.delete(ConstantList.API_ENPOINT + "/api/EQAPlanning/" + id);
};

export const checkCode = (id, code) => {
  const config = { params: { id: id, code: code } };
  var url = ConstantList.API_ENPOINT + "/api/EQAPlanning/checkCode";
  return axios.get(url, config);
};

export const addNewEQAPlanning = eQAPlanning => {
  return axios.post(ConstantList.API_ENPOINT + "/api/EQAPlanning", eQAPlanning);
};

export const updateEQAPlanning = eQAPlanning => {
  return axios.put(
    ConstantList.API_ENPOINT + "/api/EQAPlanning/" + eQAPlanning.id,
    eQAPlanning
  );
};

export const checkNotBeingUsed = id => {
  return axios.get(
    ConstantList.API_ENPOINT + "/api/EQAPlanning/checkNotBeingUsed/" + id
  );
};
