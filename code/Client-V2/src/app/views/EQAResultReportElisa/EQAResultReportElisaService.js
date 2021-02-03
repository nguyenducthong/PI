import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/EQAResultReport";
const API_PATH_HealthOrgRound = ConstantList.API_ENPOINT + "/api/HealthOrgEQARound";
const API_PATH_Reagent = ConstantList.API_ENPOINT + "/api/reagent";
const API_PATH_Technician = ConstantList.API_ENPOINT + "/api/technician";
const API_PATH_EQASampleTube = ConstantList.API_ENPOINT + "/api/EQASampleTube";
const EXCEL_PATH =
  ConstantList.API_ENPOINT + "/api/fileDownload/exportResultsReportToExcel";

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
	//Elisa(1),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Elisa
	//FastTest(2),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Xét Nghiệm Nhanh
	//SERODIA(3)//Kết Quả Xét Nghiệm Bằng Kỹ Thuật SERODIA
	//ECLIA(4)//KẾT QUẢ ĐIỆN/HÓA PHÁT QUANG							
  searchObject.typeMethod = 1;
  var url = API_PATH + "/searchByDto";
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
export const deleteItem = id => {
  var url = API_PATH + "/" + id;
  return axios.delete(url);
};
export const saveItem = 
item => {
	//Elisa(1),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Elisa
	//FastTest(2),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Xét Nghiệm Nhanh
	//SERODIA(3)//Kết Quả Xét Nghiệm Bằng Kỹ Thuật SERODIA
	//ECLIA(4)//KẾT QUẢ ĐIỆN/HÓA PHÁT QUANG
  //item.typeMethod = 1;
  var url = API_PATH;
  if (item.id) {
    return axios.put(url + "/" + item.id, item);
  }
  return axios.post(url, item);
};

export const checkCode = (id, code) => {
  const config = { params: { id: id, code: code } };
  var url = API_PATH + "/checkCode";
  return axios.get(url, config);
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

export const checkReagentByHealthOrgRound = (id, healthOrgRoundId, reagentId, typeMethod) => {
  const config = { params: { id: id, idHealthOrgRound: healthOrgRoundId, idReagent: reagentId, typeMethod: typeMethod } };
  var url = API_PATH + "/checkReagentByHealthOrgRound";
  return axios.get(url, config);
};
export const exportToExcel = id => {
  return axios({
    method: 'get',
    url: EXCEL_PATH + "/" + id,
    responseType: 'blob',
  })
}



