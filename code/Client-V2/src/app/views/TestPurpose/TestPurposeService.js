import axios from "axios";
import ConstantList from "../../appConfig";
export const getAllTestPurposes = () => {
  //return axios.get("/api/user/all");
  //alert( axios.defaults.headers.common["Authorization"]);
  return axios.get(ConstantList.API_ENPOINT+"/api/testPurpose/getAll");  
  //return axios.get(ConstantList.API_ENPOINT+"/public/animal/1/10");  
};

// export const getByPage = (page, pageSize) => {
//   //alert(pageIndex+"/"+pageSize);
//   var pageIndex = page+1;
//   var params = pageIndex+"/"+pageSize;
//   var url = ConstantList.API_ENPOINT+"/api/testPurpose/simple/"+params;
//   return axios.get(url);  
// };

export const searchByPage = testPurpose => {
    return axios.post(ConstantList.API_ENPOINT + "/api/testPurpose/searchByDto", testPurpose);
  };

export const getUserById = id => {
  return axios.get("/api/user", { data: id });
};
export const deleteItem = id => {
  return axios.delete(ConstantList.API_ENPOINT+"/api/testPurpose/"+id);
};

export const getItemById = id => {
  return axios.get(ConstantList.API_ENPOINT + "/api/testPurpose/getById/" + id);
};
export const checkCode = (id, code) => {
  const config = { params: {id: id, code: code } };
  var url = ConstantList.API_ENPOINT+"/api/testPurpose/checkCode";
  return axios.get(url, config);
};

export const addNewTestPurpose = testPurpose => {
  return axios.post(ConstantList.API_ENPOINT + "/api/testPurpose", testPurpose);
};
export const updateTestPurpose = testPurpose => {
  return axios.put(ConstantList.API_ENPOINT + "/api/testPurpose/" + testPurpose.id, testPurpose);
};