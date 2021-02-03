import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH_EQASampleTube = ConstantList.API_ENPOINT + "/api/EQASampleTube";
export const getByReportSimilarityReagent = id => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/reagent/getByReportSimilarityReagent/" +
    id;
  return axios.get(url);
};

export const exportToExcel = (id) => {
  return axios({
    method: 'post',
    url: ConstantList.API_ENPOINT + "/api/fileDownload/exportReportSimilarityReagentToExcelTable" + "/"+ id,
    responseType: 'blob',
  })
}


export const searchByPage = dto => {
  let url =
    ConstantList.API_ENPOINT + "/api/HealthOrgEQARound/" + "searchByPage";
  return axios.post(url,dto);
};

export const getEQASampleTubeByHealthOrgEQARoundId = id => {
  var url = ConstantList.API_ENPOINT + "/api/EQASampleTube" + "/getByHealthOrgEQARoundId/" + id;
  return axios.get(url);
};

export const searchPlanning = searchObject => {
  const API_PATH_PLANNING = ConstantList.API_ENPOINT + "/api/EQAPlanning";
  var url = API_PATH_PLANNING + "/searchByDto";
  return axios.post(url, searchObject);
};

export const getEQARoundsByPlanning = id => {
  var url = ConstantList.API_ENPOINT + '/api/EQARound/' + 'getEQARoundsByPlanning/' + id;
  return axios.get(url);
};

export const getEQASample = id => {
  var url = ConstantList.API_ENPOINT + '/api/EQASample/' + 'getByRoundId/' + id;
  return axios.get(url);
};