import axios from "axios";
import ConstantList from "../../appConfig";


export const searchByPage = searchObject => {
    return axios.post(ConstantList.API_ENPOINT + "/api/EQAProgramIntroduction/searchByDto", searchObject);
  };

// export const getUserById = id => {
//   return axios.get("/api/user", { data: id });
// };
export const deleteItem = id => {
  return axios.delete(ConstantList.API_ENPOINT+"/api/EQAProgramIntroduction/"+id);
};

export const getItemById = id => {
  return axios.get(ConstantList.API_ENPOINT + "/api/EQAProgramIntroduction/getById/" + id);
};
export const checkCode = (id, code) => {
  const config = { params: {id: id, code: code } };
  var url = ConstantList.API_ENPOINT+"/api/EQAProgramIntroduction/checkCode";
  return axios.get(url, config);
};

export const addNew = introduceTheProgram => {
  return axios.post(ConstantList.API_ENPOINT + "/api/EQAProgramIntroduction", introduceTheProgram);
};
export const update = introduceTheProgram => {
  return axios.put(ConstantList.API_ENPOINT + "/api/EQAProgramIntroduction/" + introduceTheProgram.id, introduceTheProgram);
};

export const getItemActive = () => axios.get(ConstantList.API_ENPOINT + "/api/EQAProgramIntroduction/getByActive");




export const searchByPageMessage = searchObject => {
  return axios.post(ConstantList.API_ENPOINT + "/api/EQAProgramAnnouncement/searchByDto", searchObject);
};

// export const getUserById = id => {
//   return axios.get("/api/user", { data: id });
// };
export const deleteItemMessage = id => {
return axios.delete(ConstantList.API_ENPOINT+"/api/EQAProgramAnnouncement/"+id);
};

export const getItemByIdMessage = id => {
return axios.get(ConstantList.API_ENPOINT + "/api/EQAProgramAnnouncement/getById/" + id);
};
export const checkCodeMessage = (id, code) => {
const config = { params: {id: id, code: code } };
var url = ConstantList.API_ENPOINT+"/api/EQAProgramAnnouncement/checkCode";
return axios.get(url, config);
};

export const addNewMessage = introduceTheProgram => {
return axios.post(ConstantList.API_ENPOINT + "/api/EQAProgramAnnouncement", introduceTheProgram);
};
export const updateMessage = introduceTheProgram => {
return axios.put(ConstantList.API_ENPOINT + "/api/EQAProgramAnnouncement/" + introduceTheProgram.id, introduceTheProgram);
};

export const getItemActiveMessage = () => axios.get(ConstantList.API_ENPOINT + "/api/EQAProgramAnnouncement/getByActive");