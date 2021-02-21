import axios from "axios";
import ConstantList from "../../appConfig";

export const getSampleSetByRoundID = id => {
    var url = ConstantList.API_ENPOINT + "/api/EQASampleSet" + "/getSampleSetByRoundID/" + id;
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

  export const exportToExcel = (id) => {
    return axios({
      method: 'post',
      url: ConstantList.API_ENPOINT + "/api/fileDownload/exportResultsOfUnitsByReagentGroupToExcel" + "/"+ id,
      responseType: 'blob',
    })
  }