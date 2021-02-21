import axios from "axios";
import ConstantList from "../../appConfig";
export const getAllEQASerumBanks = () => {
  //return axios.get("/api/user/all");
  //alert( axios.defaults.headers.common["Authorization"]);
  return axios.get(ConstantList.API_ENPOINT + "/api/eQASerumBank/simple/1/10");
  //return axios.get(ConstantList.API_ENPOINT+"/public/animal/1/10");
};

// export const getByPage = (page, pageSize) => {
//   //alert(pageIndex+"/"+pageSize);
//   var pageIndex = page+1;
//   var params = pageIndex+"/"+pageSize;
//   var url = ConstantList.API_ENPOINT+"/api/eQASerumBank/simple/"+params;
//   return axios.get(url);
// };

export const getByPage = eQASerumBank => {
  return axios.post(
    ConstantList.API_ENPOINT + "/api/eQASerumBank/searchByDto",
    eQASerumBank
  );
};

export const getUserById = id => {
  return axios.get("/api/user", { data: id });
};
export const deleteEQASerumBank = id => {
  return axios.delete(ConstantList.API_ENPOINT + "/api/eQASerumBank/" + id);
};

export const getById = id => {
  return axios.get(
    ConstantList.API_ENPOINT + "/api/eQASerumBank/getById/" + id
  );
};
export const checkCode = (id, code) => {
  const config = { params: { id: id, code: code } };
  var url = ConstantList.API_ENPOINT + "/api/eQASerumBank/checkCode";
  return axios.get(url, config);
};

export const checkCodeSerum = (id, code) => {
  const config = { params: { id: id, code: code } };
  var url = ConstantList.API_ENPOINT + "/api/eQASerumBank/checkCodeSerum";
  return axios.get(url, config);
};

export const addNewEQASerumBank = eQASerumBank => {
  return axios.post(
    ConstantList.API_ENPOINT + "/api/eQASerumBank",
    eQASerumBank
  );
};
export const updateEQASerumBank = eQASerumBank => {
  return axios.put(
    ConstantList.API_ENPOINT + "/api/eQASerumBank/" + eQASerumBank.id,
    eQASerumBank
  );
};
export const searchByPage = (searchObject) => {
  var url = ConstantList.API_ENPOINT + "/api/eQASerumBank" + "/searchByDto";
  return axios.post(url,searchObject);  
};

