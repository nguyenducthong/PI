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
    "/api/HealthOrgEQARound/getListHealthOrgEQARoundByEQARoundIdAndUser/" +
    roundID;
  return axios.get(url);
};

export const listHealthOrgEQARoundByEQARoundId = id => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/HealthOrgEQARound/listHealthOrgEQARoundByEQARoundId/" +
    id;
  return axios.get(url);
};

export const getHealthOrgEQARound = (healthOrgId,roundId) => {
  let url =
    ConstantList.API_ENPOINT +
    "/api/HealthOrgEQARound/getHealthOrgEQARound/" +
    healthOrgId + "/" + roundId;
  return axios.get(url);
};