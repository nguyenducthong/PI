import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH=ConstantList.API_ENPOINT+"/api/EQASample";
export const getAll = () => {
  return axios.get(API_PATH);  
};
export const searchByPage = (searchObject) => {
  var url = API_PATH + "/searchByDto";
  return axios.post(url,searchObject);  
};

// export const getByPage = (page, pageSize) => {
//   var pageIndex = page+1;
//   var params = pageIndex+"/"+pageSize;
//   var url = API_PATH+params;
//   return axios.get(url);  
// };
// countByRoundId/{id}
export const countByRoundId = id => {
  var url = API_PATH+"/countByRoundId/"+id;
  return axios.get(url);
};
export const getItemById = id => {
  var url = API_PATH+"/getById/"+id;
  return axios.get(url);
};
export const deleteItem = id => {
  var url = API_PATH+"/"+id;
  return axios.delete(url);
};
export const saveItem = item => {
  var url = API_PATH;
  if (item.id) {
    return axios.put(url+"/"+item.id, item);
  }
  return axios.post(url, item);
};

export const checkCode = (id, code) => {
  const config = { params: {id: id, code: code } };
  var url = ConstantList.API_ENPOINT+"/api/EQASample/checkCode";
  return axios.get(url, config);
};

export const downloadDocument = id => {
  var url = ConstantList.API_ENPOINT + "/api/fileDownload/document/"+id;
  return axios.get(url);
};
// export const addNewEQASampleList = eQAPlanning => {
//   return axios.post(ConstantList.API_ENPOINT + "/api/healthOrgType", eQAPlanning);
// };
// export const updateEQASampleList = eQAPlanning => {
//   return axios.put(ConstantList.API_ENPOINT + "/api/healthOrgType/" + eQAPlanning.id, eQAPlanning);
// };
