import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/HealthOrgEQARound/";
const API_PATH_EQARound = ConstantList.API_ENPOINT + "/api/EQARound/";
const API_PATH_EQAResultReport = ConstantList.API_ENPOINT + "/api/EQAResultReport/";

export const searchByPage = searchDto => {
    var url = API_PATH + 'search';
    return axios.post(url, searchDto);
};

export const getAllResultByHealthOrgEQARoundId = id => {
    var url = API_PATH_EQAResultReport + 'getAllResultByHealthOrgEQARoundId/' + id;
    return axios.get(url);
};

export const getAllResultByHealthOrgManagementEQARoundId = id => {
    var url = API_PATH_EQAResultReport + 'getAllResultByHealthOrgManagementEQARoundId/' + id;
    return axios.get(url);
};
export const getItemById = id => {
    var url = API_PATH + id;
    return axios.get(url);
};

export const getResultReportById = id => {
    var url = API_PATH_EQAResultReport + id;
    return axios.get(url);
};

export const getEQARoundsByYear = year => {
    var url = API_PATH_EQARound + 'getEQARoundsByYear/' + year;
    return axios.get(url);
};

export const search = searchObject => {
    const API_PATH_PLANNING = ConstantList.API_ENPOINT + "/api/EQAPlanning";
    var url = API_PATH_PLANNING + "/searchByDto";
    return axios.post(url, searchObject);
};

export const getEQARoundsByPlanning = id => {
    var url = API_PATH_EQARound + 'getEQARoundsByPlanning/' + id;
    return axios.get(url);
};
export const exportToExcel = (id) => {
    return axios({
      method: 'post',
      url: ConstantList.API_ENPOINT + "/api/fileDownload/eQAResultReport" + "/"+ id,
      responseType: 'blob',
    })
  };
  export const searchByDto = searchDto => {
    var url = API_PATH + 'searchByPage';
    return axios.post(url, searchDto);
};