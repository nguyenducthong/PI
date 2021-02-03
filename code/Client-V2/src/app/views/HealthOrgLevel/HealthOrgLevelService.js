import axios from "axios";
import ConstantList from "../../appConfig";
export const getAllEQAhealthOrgLevels = () => {
  return axios.get(ConstantList.API_ENPOINT+"/api/healthOrgLevel/getAll");  
};

export const searchByPage = healthOrgLevel => {
    return axios.post(ConstantList.API_ENPOINT + "/api/healthOrgLevel/searchByDto", healthOrgLevel);
  };

export const getUserById = id => {
  return axios.get("/api/user", { data: id });
};
export const deleteItem = id => {
  return axios.delete(ConstantList.API_ENPOINT+"/api/healthOrgLevel/"+id);
};

export const getItemById = id => {
  return axios.get(ConstantList.API_ENPOINT + "/api/healthOrgLevel/getById/" + id);
};
export const checkCode = (id, code) => {
  const config = { params: {id: id, code: code } };
  var url = ConstantList.API_ENPOINT+"/api/healthOrgLevel/checkCode";
  return axios.get(url, config);
};

export const addNewEQAhealthOrgLevel = eQAPlanning => {
  return axios.post(ConstantList.API_ENPOINT + "/api/healthOrgLevel", eQAPlanning);
};
export const updateEQAhealthOrgLevel = eQAPlanning => {
  return axios.put(ConstantList.API_ENPOINT + "/api/healthOrgLevel/" + eQAPlanning.id, eQAPlanning);
};