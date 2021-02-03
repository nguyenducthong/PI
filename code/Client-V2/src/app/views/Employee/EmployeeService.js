import axios from "axios";

export const getAllEmployees = () => {
  //return axios.get("/api/user/all");
  //alert( axios.defaults.headers.common["Authorization"]);
  return axios.get("http://localhost:8081/shop/api/employees");  
};
export const getUserById = id => {
  return axios.get("/api/user", { data: id });
};
export const deleteUser = User => {
  return axios.post("/api/user/delete", User);
};
export const addNewUser = User => {
  return axios.post("/api/user/add", User);
};
export const updateUser = User => {
  return axios.post("/api/user/update", User);
};
