import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/EQAResultReport";
const API_PATH_HealthOrgRound = ConstantList.API_ENPOINT + "/api/HealthOrgEQARound";
const API_PATH_Reagent = ConstantList.API_ENPOINT + "/api/reagent";
const API_PATH_Technician = ConstantList.API_ENPOINT + "/api/technician";
const API_PATH_EQASampleTube = ConstantList.API_ENPOINT + "/api/EQASampleTube";

export const getEQASampleTubeByHealthOrgEQARoundId = id => {
  var url = API_PATH_EQASampleTube + "/getByHealthOrgEQARoundId/" + id;
  return axios.get(url);
};

export const getListHealthOrgEQARoundByEQARoundId = id => {
  var url = API_PATH_HealthOrgRound + "/getListHealthOrgEQARoundByEQARoundId/" + id;
  return axios.get(url);
};
export const getAll = () => {
  return axios.get(API_PATH);
};
export const searchByPage = (searchObject) => {						
  searchObject.typeMethod = 5;
  var url = API_PATH + "/searchByDto";
  return axios.post(url, searchObject);
};
export const searchByPageAll = (searchObject) => {
  searchObject.typeMethod = 5;
  var url = API_PATH + "/searchByDtoAll";
  return axios.post(url, searchObject)
}
export const searchByPageHealthOrgRound = (searchObject) => {
  var url = API_PATH_HealthOrgRound + "/search";
  return axios.post(url, searchObject);
};

export const getByPage = (page, pageSize) => {
  var pageIndex = page + 1;
  var params = pageIndex + "/" + pageSize;
  var url = API_PATH + params;
  return axios.get(url);
};

export const getItemById = id => {
  var url = API_PATH + "/" + id;
  return axios.get(url);
};

export const getListHealthOrgRound = (searchObject) => {
  var url = API_PATH + "/search";
  return axios.post(url, searchObject);
};


export const getListTubeHealthOrgRound = (roundId, healthOrgRoundId) => {
  var url = API_PATH_EQASampleTube+"/getByHealthOrgAdnEQARound/" + roundId+"/"+healthOrgRoundId;
  return axios.get(url);
};
export const getAllReagent = () => {
  var url = API_PATH_Reagent + "/getAll";
  return axios.get(url);
};

export const technicianSearchByPage = (searchObject) => {
  var url = API_PATH_Technician + "/searchByDto";
  return axios.post(url, searchObject);
};

export const updateResultReportConclusionBySampleTube = (dtoList, id,isFinalResult) => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/EQAResultReport/updateResultReportConclusionBySampleTube/" +
    id +"/"+isFinalResult;
  return axios.post(url, dtoList);
};
export const updateFinalResultStatus = (reportId,isFinalResult) =>{
  let url =
  ConstantList.API_ENPOINT +
  "/api/EQAResultReport/updateFinalResultStatus/" +
  reportId +"/"+isFinalResult;
  return axios.post(url);
}
export const deleteItem = id => {
  var url = API_PATH + "/" + id;
  return axios.delete(url);
};