import axios from "axios";
import ConstantList from "../../appConfig";
export const getAllEQAHealthOrgTypes = () => {
  return axios.get(ConstantList.API_ENPOINT+"/api/healthOrgType/simple/1/10");  
};

export const searchByPage = healthOrgType => {
    return axios.post(ConstantList.API_ENPOINT + "/api/healthOrgType/searchByDto", healthOrgType);
  };

export const getUserById = id => {
  return axios.get("/api/user", { data: id });
};
export const deleteItem = id => {
  return axios.delete(ConstantList.API_ENPOINT+"/api/healthOrgType/"+id);
};

export const getItemById = id => {
  return axios.get(ConstantList.API_ENPOINT + "/api/healthOrgType/getById/" + id);
};
export const checkCode = (id, code) => {
  const config = { params: {id: id, code: code } };
  var url = ConstantList.API_ENPOINT+"/api/healthOrgType/checkCode";
  return axios.get(url, config);
};

export const addNewEQAHealthOrgType = eQAPlanning => {
  return axios.post(ConstantList.API_ENPOINT + "/api/healthOrgType", eQAPlanning);
};
export const updateEQAHealthOrgType = eQAPlanning => {
  return axios.put(ConstantList.API_ENPOINT + "/api/healthOrgType/" + eQAPlanning.id, eQAPlanning);
};