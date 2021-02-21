import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/EQAResultReport";

export const getAllResultConclusionByRoundId = roundId => {
  const url = API_PATH + "/round-conclusions/" + roundId;
  return axios.get(url);
};

export const getListResultByRoundId = id => {
  var url = ConstantList.API_ENPOINT + "/api/EQAResultReport" + "/getListResultByRoundId/" + id;
  return axios.get(url);
};
export const getByReportReagent = id => {
  var url = ConstantList.API_ENPOINT + "/api/reagent" + "/getByReportReagent/" + id;
  return axios.get(url);
};
export const getSampleSetByRoundID = id => {
    var url = ConstantList.API_ENPOINT + "/api/EQASampleSet" + "/getSampleSetByRoundID/" + id;
    return axios.get(url);
  };
