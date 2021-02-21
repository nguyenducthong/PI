import axios from "axios";
import ConstantList from "../../appConfig";
export const getAllQualifications = () => {
  //return axios.get("/api/user/all");
  //alert( axios.defaults.headers.common["Authorization"]);
  return axios.get(ConstantList.API_ENPOINT+"/api/qualification/getAll");  
  //return axios.get(ConstantList.API_ENPOINT+"/public/animal/1/10");  
};

export const searchByPage = qualification => {
    return axios.post(ConstantList.API_ENPOINT + "/api/qualification/searchByDto", qualification);
  };

export const getUserById = id => {
  return axios.get("/api/user", { data: id });
};
export const deleteItem = id => {
  return axios.delete(ConstantList.API_ENPOINT+"/api/qualification/"+id);
};

export const getQualificationById = id => {
  return axios.get(ConstantList.API_ENPOINT + "/api/qualification/getById/" + id);
};
export const checkCode = (id, code) => {
  const config = { params: {id: id, code: code } };
  var url = ConstantList.API_ENPOINT+"/api/qualification/checkCode";
  return axios.get(url, config);
};

export const addNewQualification = qualification => {
  return axios.post(ConstantList.API_ENPOINT + "/api/qualification", qualification);
};
export const updateQualification = qualification => {
  return axios.put(ConstantList.API_ENPOINT + "/api/qualification/" + qualification.id, qualification);
};