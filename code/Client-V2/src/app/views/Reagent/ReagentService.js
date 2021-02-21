import axios from "axios";
import ConstantList from "../../appConfig";
export const getAllReagents = () => {
  //return axios.get("/api/user/all");
  //alert( axios.defaults.headers.common["Authorization"]);
  return axios.get(ConstantList.API_ENPOINT+"/api/reagent/simple/1/10");  
  //return axios.get(ConstantList.API_ENPOINT+"/public/animal/1/10");  
};

// export const getByPage = (page, pageSize) => {
//   //alert(pageIndex+"/"+pageSize);
//   var pageIndex = page+1;
//   var params = pageIndex+"/"+pageSize;
//   var url = ConstantList.API_ENPOINT+"/api/reagent/simple/"+params;
//   return axios.get(url);  
// };

export const searchByPage = reagent => {
    return axios.post(ConstantList.API_ENPOINT + "/api/reagent/searchByDto", reagent);
  };

export const getUserById = id => {
  return axios.get("/api/user", { data: id });
};
export const deleteItem = id => {
  return axios.delete(ConstantList.API_ENPOINT+"/api/reagent/"+id);
};

export const getItemById = id => {
  return axios.get(ConstantList.API_ENPOINT + "/api/reagent/getById/" + id);
};
export const checkCode = (id, code) => {
  const config = { params: {id: id, code: code } };
  var url = ConstantList.API_ENPOINT+"/api/reagent/checkCode";
  return axios.get(url, config);
};

export const addNewReagent = reagent => {
  return axios.post(ConstantList.API_ENPOINT + "/api/reagent", reagent);
};
export const updateReagent = reagent => {
  return axios.put(ConstantList.API_ENPOINT + "/api/reagent/" + reagent.id, reagent);
};