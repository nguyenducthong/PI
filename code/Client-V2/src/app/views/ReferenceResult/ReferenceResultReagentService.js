import axios from "axios";
import ConstantList from "../../appConfig";


export const getReportHealthOrgNameByReagent = id => {
    let url =
      ConstantList.API_ENPOINT +
      "/api/EQAResultReport/getListTestResult/" +
      id;
    return axios.get(url);
  };
  export const getReportSample = id => {
    let url =
      ConstantList.API_ENPOINT +
      "/api/reagent/getReportSample/" +
      id;
    return axios.get(url);
  };
  
  export const exportToExcel = (searchObject) => {
    return axios({
      method: 'get',
      url: ConstantList.API_ENPOINT + "/api/fileDownload/exportReferenceResultToExcel/"+ searchObject.roundId +"/"+searchObject.reagentId +"/"
      + searchObject.testMethod +"/" + searchObject.sampleId,
      responseType: 'blob',
    })
  }
  export const saveReferenceResult = (searchObject) => {
    return axios({
      method: 'post',
      url: ConstantList.API_ENPOINT + "/api/referenceResult/saveReferenceResult/"+ searchObject.roundId +"/"+searchObject.reagentId +"/"
      + searchObject.testMethod +"/" + searchObject.sampleId,
      responseType: 'blob',
    })
  }
  export const getEQASample = id => {
    var url = ConstantList.API_ENPOINT + '/api/EQASample/' + 'getByRoundId/' + id;
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

  export const searchByPage = reagent => {
    return axios.post(ConstantList.API_ENPOINT + "/api/reagent/searchByDto", reagent);
  };

  export const getListTestResult = (searchObject) => {
    var url = ConstantList.API_ENPOINT + '/api/EQAResultReport/' + 'getListTestResult/' + searchObject.roundId +"/"+searchObject.reagentId +"/"
    + searchObject.testMethod +"/" + searchObject.sampleId;
    return axios.get(url);
  };