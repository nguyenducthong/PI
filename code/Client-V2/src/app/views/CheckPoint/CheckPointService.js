import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/HealthOrgEQARound/";
const API_PATH_EQARound = ConstantList.API_ENPOINT + "/api/EQARound/";
export const getItemById = id => {
    var url = API_PATH + id;
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
export const searchByDto = searchDto => {
    var url = API_PATH + 'searchByPage';
    return axios.post(url, searchDto);
};

export const updateStatusSentResults = (healthOrgId, roundId) => {
  var url = API_PATH + "updateStatusSentResults" +"/"+healthOrgId + "/" + roundId;
  return axios.get(url);
};
// export const checkPoint = id => {
//     var url = ConstantList.API_ENPOINT + "/api/EQAResultReport/checkPoint" +"/"+id;
//     return axios.get(url);
//   };
  export const checkPoint = (id, healthOrgId) => {
    var url = ConstantList.API_ENPOINT + "/api/EQAResultReport/checkPoints" +"/"+id + "/" + healthOrgId;
    return axios.post(url);
  };
  
  export const getListCheckScores = id => {
    var url = ConstantList.API_ENPOINT + "/api/CheckScores/getListCheckScores" +"/"+id;
    return axios.get(url);
  };

  export const getListCheckScoresByRoundId = id => {
    var url = ConstantList.API_ENPOINT + "/api/CheckScores/getListCheckScoresByRoundId" +"/"+id;
    return axios.get(url);
  };

  export const getListGroupCheckScoresByRoundId = id => {
    var url = ConstantList.API_ENPOINT + "/api/CheckScores/getListGroupCheckScoresByRoundId" +"/"+id;
    return axios.get(url);
  };

  export const exportToExcel = (searchObject) => {
    return axios({
      method: 'post',
      url: ConstantList.API_ENPOINT + "/api/fileDownload/exportSummaryResultsToExcel",
      data: searchObject,
      responseType: 'blob',
    })
  }

  export const checkPointByHealthOrgEQARound = (roundID,id) => {
    var url = ConstantList.API_ENPOINT + "/api/EQAResultReport/checkPoint" +"/"+roundID + "/" +id;
    return axios.get(url);
  };