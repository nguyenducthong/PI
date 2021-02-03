import axios from "axios";
import ConstantList from "../../appConfig";

export const getListSampleTubeByHealthOrgEQARoundId = id => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/EQASampleTube/getByHealthOrgEQARoundId/" +
    id;
  return axios.get(url);
};

export const getListHealthOrgEQARoundByEQARoundId = id => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/HealthOrgEQARound/getListHealthOrgEQARoundByEQARoundId/" +
    id;
  return axios.get(url);
};

export const updateResultReportConclusionBySampleTube = (dtoList, id,isFinalResult) => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/EQAResultReport/updateResultReportConclusionBySampleTube/" +
    id +"/"+isFinalResult;
  return axios.post(url, dtoList);
};

export const getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId = id => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/EQAResultReport/getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId/" +
    id;
  return axios.get(url);
};

export const getListHealthOrgEQARoundByEQARoundIdAndUser = roundID => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/HealthOrgEQARound/getListHealthOrgManagementEQARoundByEQARoundId/" +
    roundID;
  return axios.get(url);
};
export const exportToExcel = (id) => {
  return axios({
    method: 'get',
    url: ConstantList.API_ENPOINT + "/api/fileDownload/exportReferenceResultsToExcel" + "/"+ id,
    responseType: 'blob',
  })
};

export const getListReferenceResultByRoundId = id => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/referenceResult/getListReferenceResultByRoundId/" +
    id;
  return axios.get(url);
};

export const getEQASample = id => {
  var url = ConstantList.API_ENPOINT + '/api/EQASample/' + 'getByRoundId/' + id;
  return axios.get(url);
};

export const getListGroupReferenceResultByRoundId = id => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/referenceResult/getListGroupReferenceResultByRoundId/" +
    id;
  return axios.get(url);
};

export const getResultConclusionEQARoundId = id => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/referenceResult/getResultConclusionEQARoundId/" +
    id;
  return axios.get(url);
};

export const updateReferenceResultConclusion = dto => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/referenceResult/updateReferenceResultConclusion";
  return axios.post(url,dto);
};