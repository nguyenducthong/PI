import {
  InputAdornment,
  Input,
  Grid,
  Button,
  Select,
  TextField,Table,TableHead,TableRow,
  FormControlLabel,Paper,TableContainer,
  Checkbox,TableCell ,FormControl,TableBody
} from "@material-ui/core";
import shortid from "shortid";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { searchByPage as getAllEQARound } from "../EQARound/EQARoundService";
import { getListHealthOrgEQARoundByEQARoundIdAndUser,listHealthOrgEQARoundByEQARoundId,getHealthOrgEQARound } from "./EQAResultReportConclusionServices";
import EQAResultReportConclusionDialog from "./EQAResultReportConclusionDialog"
import EQAResultReportDialog from "./EQAResultReportDialog"
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import Autocomplete from "@material-ui/lab/Autocomplete";
import "react-toastify/dist/ReactToastify.css";
import {getCurrentUser,getListHealthOrgByUser} from "../User/UserService"
import { updateResultReportConclusionBySampleTube } from "./EQAResultReportConclusionServices";
import { getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId } from "./EQAResultReportConclusionServices";
import { getAllResultByHealthOrgEQARoundId, getResultReportById,getItemById } from "../ResultsOfTheUnits/ResultsOfTheUnitsService";
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit:3
});
class EQARound extends React.Component {
  state = {
    sampleTubeResultConclusionList: [],
    listEQARound: [],
    currentRound: null,
    healthOrgEQARoundList: [],
    currentHealthOrgEQARound: null,
    shouldOpenConfirmationDialog: false,
    isFinalResult:false,
    shouldOpenEQAResultReportDialog:false,
    shouldEQAResultReportDialog:false,
    listSample : [],
    isCheckUpdate:false,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount (){
    getCurrentUser().then(res=>{
      getListHealthOrgByUser(res.data.id).then(({data})=>{
        let checkManagementUnit = false
        let checkRoleAdmin = false
        data.forEach(item =>{
          if(item.isManagementUnit){
            checkManagementUnit = true
            this.setState({healthOrgId:item ? item.id :null})
          }
        })
        res.data.roles.forEach(el =>{
          if(el.name == "ROLE_ADMIN" || el.authority == "ROLE_ADMIN"){
            checkRoleAdmin = true
          }
        })
        if(checkRoleAdmin){
          this.setState({isRoleAdmin:true,isView: true})
        }
        if(!checkRoleAdmin){
          this.setState({isRoleAdmin:false,isView: false})
        }
        if(checkManagementUnit && checkRoleAdmin){
          this.setState({isManagementUnit:true,isRoleAdmin:true})
        }

      })
    })
  }
  componentDidMount() {
    const searchObject = { pageIndex: 0, pageSize: 1000000 };
    getAllEQARound(searchObject).then(res => {
      this.setState({ listEQARound: res.data.content });
    },()=>{
      
    });
  }

  handleOpenConfirmationDialog = () => {
    const { t } = this.props;
    let { isCheckUpdate } = this.state;
   
    if(isCheckUpdate){
      toast.warning(t("EQAResultReportFastTest.warningEdit"));
      return
    }else{
    if(this.state.currentHealthOrgEQARound == null){
      toast.warning(t("EQAResultReportConclusion.select_health_org"));
        return
    }
    
    if(this.state.listSample.length == 0){
      toast.warning(t("EQAResultReportConclusion.no_data"));
      return
    }
    if((this.state.isManagementUnit && this.state.isCheckManagementUnit) || !this.state.isRoleAdmin){
      this.setState({
        shouldOpenEQAResultReportDialog: true
      });
      return
    }

    if((this.state.isManagementUnit && !this.state.isCheckManagementUnit) || this.state.isRoleAdmin){
      this.setState({
        shouldEQAResultReportDialog: true
      });
      return
    }
    
  }
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenConfirmationDialog: false,
      shouldOpenEQAResultReportDialog:false,
      shouldEQAResultReportDialog:false,
    },()=>{
      this.handleSelectHealthOrg(this.state.currentHealthOrgEQARound)
    });
  };

  handleSelectEQARound = value => {
    if (value != null && value != "") {
      if(this.state.healthOrgId != null && this.state.isManagementUnit){
        getHealthOrgEQARound(this.state.healthOrgId,value.id).then(res=>{
          this.setState({currentHealthOrgEQARound:res.data},()=>{
            this.handleSelectHealthOrg(this.state.currentHealthOrgEQARound)
          })
        })
        listHealthOrgEQARoundByEQARoundId(value.id).then(res => {
          this.setState({
            // currentHealthOrgEQARound: null,
            sampleTubeResultConclusionList: [],
            currentRound: value,
            healthOrgEQARoundList: res.data,
            listSample: []
          });
        });
      }
      if(this.state.isRoleAdmin && !this.state.isManagementUnit){
        listHealthOrgEQARoundByEQARoundId(value.id).then(res => {
          this.setState({
            currentHealthOrgEQARound: null,
            sampleTubeResultConclusionList: [],
            currentRound: value,
            healthOrgEQARoundList: res.data,
            listSample: []
          });
        });
      }
      
      if(!this.state.isRoleAdmin && !this.state.isManagementUnit){
        getListHealthOrgEQARoundByEQARoundIdAndUser(value.id).then(res => {
          this.setState({
            currentHealthOrgEQARound: null,
            sampleTubeResultConclusionList: [],
            currentRound: value,
            healthOrgEQARoundList: res.data,
            listSample: [],
            currentHealthOrgEQARound:res.data[0]
          },()=>{
            this.handleSelectHealthOrg(this.state.currentHealthOrgEQARound)
          });
        });
      }
      
    } else {
      this.setState({
        currentRound: null,
        currentHealthOrgEQARound: null,
        healthOrgEQARoundList: [],
        sampleTubeResultConclusionList: [],
        listSample: []
        
      });
    }
  };

  handleSelectHealthOrg = value => {
    if (value != null && value != "") {
      getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId(value.id).then(
        res => {
    //      console.log(res.data);
          this.setState({
            sampleTubeResultConclusionList: res.data,
            currentHealthOrgEQARound: value,
            
          },()=>{
            let {currentHealthOrgEQARound} = this.state
            if (currentHealthOrgEQARound && currentHealthOrgEQARound.id) {
              getItemById(currentHealthOrgEQARound.id).then((data) => {
                if(data.data.healthOrg.isManagementUnit ){
                  this.setState({isCheckManagementUnit:true})
                }
                // console.log(data.data)
                this.setState({ healthOrgRound:data.data }, function () {
                  let { healthOrgRound, details } = this.state;
                  details = [];
                  getAllResultByHealthOrgEQARoundId(healthOrgRound.id).then((result) => {
                    if(result.data === null || result.data.length ===0){
                      let {listSample } = this.state;
                      listSample = []
                      this.setState({listSample})
                      return
                    }
                    if (result != null && result.data != null) {
                          if(result.data != null && result.data.length >0){
                            result.data.forEach(el =>{
                            if(el.typeMethod === 5){
                              if(el.isFinalResult){
                                this.setState({isCheckUpdate:true})
                              }else{
                                this.setState({isCheckUpdate:false})
                              }
                            }else{
                              this.setState({isCheckUpdate:false})
                            }
                          });
                          getCurrentUser().then(cur =>{
                            cur.data.roles.forEach(el =>{
                              if(el.name == "ROLE_ADMIN" || el.authority == "ROLE_ADMIN"){
                                this.setState({isCheckUpdate : false});
                              }
                            })
                          });
                        }
                        this.setState({
                          listResult: result.data
                        }, function () {
                          let { sampleSet, listSample } = healthOrgRound;
                          listSample = [];
                          if (sampleSet != null && sampleSet.details != null && sampleSet.details.length > 0) {
                            sampleSet.details.sort((a, b) => (a.orderNumber > b.orderNumber) ? 1 : (a.orderNumber === b.orderNumber) ? ((a.sampleTube.code > b.sampleTube.code) ? 1 : -1) : -1);
                            sampleSet.details.forEach(sampleSetDetail => {
                              let eQASet = {};
                              let hor ={}
                              hor.tubeID = sampleSetDetail.sample.id;
                              hor.tubeCode = sampleSetDetail.code
                              eQASet.id = sampleSetDetail.sample.id;
                              eQASet.code = sampleSetDetail.code;
                              listSample.push(eQASet);
                            });
                           // console.log(listSample)
                            this.setState({
                              listSample: listSample
                            });
                          }
                        });
                      }
                        });
                });
            });
                
              }
          });
        }
      );
    } else {
      this.setState({
        currentHealthOrgEQARound: null
      });
    }
  };

  handleChangeResult = (result, id) => {
    let { sampleTubeResultConclusionList } = this.state;
    for (let dto of sampleTubeResultConclusionList) {
      if (dto.tubeID === id) {
        dto.result = result;
      }
    }
    this.setState({
      sampleTubeResultConclusionList
    });
  };

  handleChangeNote = (note, id) => {
    let { sampleTubeResultConclusionList } = this.state;
    for (let dto of sampleTubeResultConclusionList) {
      if (dto.tubeID === id) {
        dto.note = note;
      }
    }
    this.setState({
      sampleTubeResultConclusionList
    });
  };

  handleConfirmUpdateResult = () => {
    const { t } = this.props;
    const {
      sampleTubeResultConclusionList,
      currentHealthOrgEQARound
    } = this.state;

    if (sampleTubeResultConclusionList.length === 0) {
      toast.warn(t("EQAResultReportConclusion.no_data"));
    } else {
      updateResultReportConclusionBySampleTube(
        sampleTubeResultConclusionList,
        currentHealthOrgEQARound.id
      )
        .then(res => {
          toast.success(t("EQAResultReportConclusion.update_result_success"));
        })
        .catch(err => {
          toast.error(t("EQAResultReportConclusion.update_result_error"));
        });
    }
    this.setState({
      shouldOpenConfirmationDialog: false
    });
  };

  resultValue = rowDataID => {
    const item = this.state.sampleTubeResultConclusionList.find(
      dto => dto.tubeID === rowDataID
    );
    if (typeof item != "undefined") {
      return item.result != null ? item.result : "";
    }
    return "";
  };

  noteValue = rowDataID => {
    const item = this.state.sampleTubeResultConclusionList.find(
      dto => dto.tubeID === rowDataID
    );
    if (typeof item != "undefined") {
      return item.note != null ? item.note : "";
    }
    return "";
  };
 
  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    if(source === "isFinalResult"){
      this.setState({isFinalResult:event.target.checked})
    }

  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEQAResultReportDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationEditDialog:false,
      shouldEQAResultReportDialog:false,
    },()=>{
      this.handleSelectHealthOrg(this.state.currentHealthOrgEQARound)
    });
    // this.setPage(0);
  };

  renderRowHead() {
    let { onSelectEvent, handleDelete, handleClick } = this.props;
    let { listResult } = this.state;
    let titleCell = null;
    if (listResult != null && listResult.length > 0) {
      listResult.forEach(item => {
        if (!titleCell) {
          titleCell = <TableCell key={shortid.generate()} className="px-0" align="left">
            {this.getTypeMethodName(item.typeMethod)}
          </TableCell>
        } else {
          titleCell += <TableCell key={shortid.generate()} className="px-0" align="left">
            {this.getTypeMethodName(item.typeMethod)}
          </TableCell>
        }
      });
    }

    return (
      <React.Fragment>
        {listResult.map((item, index) => this.renderColHeadFirst(item))}
      </React.Fragment>
    )
  }
  getTypeMethodName(text,type) {
    let { t } = this.props;
    if (type == 1) {
      return text;
    } else if (type == 2) {
      return text;
    } else if (type == 3) {
      return text;
    } else if (type == 4) {
      return text;
    } else if (type == 5) {
      return t('EQAResultReportConclusion.final_conclusion');
    }
  }
  renderColHeadFirst(item) {
    if(item.reagent != null){
      item.title = this.getTypeMethodName(item.reagent.name,item.typeMethod);
    }else{
      item.title = this.getTypeMethodName("",item.typeMethod);
    }
    //item.title = this.getTypeMethodName(item.reagent.name,item.typeMethod);
    return (
      this.renderHeadCells(item)
    )
  }
  renderHeadCells(item) {
    // console.log(item)
    if (item == null) {
      item = {};
    }
    // if(item.)
    let titleCell = <TableCell style ={{backgroundColor: '#358600',
    color:'#fff',}}
     key={shortid.generate()} 
     className="px-0" align="left" >
      {item.title}
    </TableCell>
    return (
      <React.Fragment>
        {titleCell}
      </React.Fragment>
    )
  }
  renderResultDetails(sample, index) {
    return (
      <React.Fragment>
        <TableRow>
          {this.renderSample(sample, index)}
        </TableRow>
      </React.Fragment>
    )
  }
  renderSample(item, index) {
    // console.log(item);

    let sttCell = <TableCell className="px-0" align="center">
      {index + 1}
    </TableCell>
    let titleCell = <TableCell className="px-0" align="left">
      { item ? item.code : ''}
    </TableCell>

    let { listResult } = this.state;
    let cellContentByMethod = [];
    listResult.forEach(result => {
      let content = null;
      if (result != null && result.details != null && result.details.length > 0 && item) {
        result.details.forEach(resultDetail => {
          if (resultDetail.sampleTube != null && resultDetail.sampleTube.eqaSample != null
            && item.id == resultDetail.sampleTube.eqaSample.id) {
            content = resultDetail;
          }
        });
      }
      cellContentByMethod.push(content);
    });

    return (
      <React.Fragment>
        {sttCell}
        {titleCell}
        {cellContentByMethod.map((cell, index) => this.renderCells(cell))}
      </React.Fragment>
    )
  }

  renderCells(item) {
    let { t, i18n } = this.props;
    if (item == null) {
      item = {};
    }
    let contentCell = <TableCell key={shortid.generate()} className="px-0" align="left">
      {
        item.result == 1 ? (
          <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
            
              {t('result.positive')}
            
          </small>
        ) : (
            <small className="border-radius-4 bg-light-gray px-8 py-2 ">
                {
                  item.result == -2 ? (
                    t('result.none')
                  ) : (
                      item.result == -1 ? (
                        t('result.negative')
                      ) : (
                          item.result == 0 ? (
                            t('result.indertermine')
                          ) : (item.result == 2 ? (
                            t('EQAResultReportElisa.Result.confirms')
                          ):(
                              ''
                            ))
                        )
                    )
                }
            </small>
          )
      }
    </TableCell>
    return (
      <React.Fragment>
        {contentCell}
      </React.Fragment>
    )
  }

  render() {
    const { t, i18n } = this.props;

    const {
      listEQARound,
      currentRound,
      sampleTubeResultConclusionList,
      healthOrgEQARoundList,
      currentHealthOrgEQARound,
      shouldOpenConfirmationDialog,
      isFinalResult,listSample,listResult
    } = this.state;

    let columns = [
      {
        title: t("SampleManagement.tube_code"),
        field: "tubeCode",
        width: "150"
      },
      {
        title: t("ReportResult.result"),
        field: "result",
        align: "left",
        width: "150",
        render: rowData => {
          return (
            <FormControl className="w-100" disabled={true}>
            <Select
              native
              value={this.resultValue(rowData.tubeID)}
              onChange={event =>
                this.handleChangeResult(event.target.value, rowData.tubeID)
              }
              inputProps={{
                name: "result"
              }}
            >
              {/* <option value={""}>{t("ReportResult.select_result")}</option> */}
              <option value={-2}>{t("result.none")}</option>
              <option value={-1}>{t("result.negative")}</option>
              <option value={0}>{t("result.indertermine")}</option>
              <option value={1}>{t("result.positive")}</option>
            </Select>
            </FormControl>
          );
        }
      },
      // {
      //   title: t("EQAResultReportConclusion.note"),
      //   field: "note",
      //   align: "left",
      //   width: "450",
      //   render: rowData => {
      //     return (
      //       <TextField
      //         style={{ width: "50%" }}
      //         label={t("EQAResultReportConclusion.note")}
      //         variant="outlined"
      //         value={this.noteValue(rowData.tubeID)}
      //         onChange={event =>
      //           this.handleChangeNote(event.target.value, rowData.tubeID)
      //         }
      //       />
      //     );
      //   }
      // }
    ];

    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>
              {t("EQAResultReportConclusion.title2")} | {t("web_site")}
            </title>
          </Helmet>
          <Breadcrumb
            routeSegments={[{ name: t("EQAResultReportConclusion.title2") }]}
          />
        </div>
        {this.state.shouldOpenEQAResultReportDialog && (
                <EQAResultReportConclusionDialog t={t} i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenEQAResultReportDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  sampleTubeResultConclusionList ={this.state.sampleTubeResultConclusionList}
                  currentHealthOrgEQARound ={this.state.currentHealthOrgEQARound}
                  currentHealthOrg = {this.state.currentHealthOrgEQARound.healthOrg}
                  item={this.state.item}
                />
              )}
              {this.state.shouldEQAResultReportDialog && (
                <EQAResultReportDialog t={t} i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldEQAResultReportDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  sampleTubeResultConclusionList ={this.state.sampleTubeResultConclusionList}
                  currentHealthOrgEQARound ={this.state.currentHealthOrgEQARound}
                  currentHealthOrg = {this.state.currentHealthOrgEQARound.healthOrg}
                  item={this.state.item}
                />
              )}
        <Grid container spacing={3}>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Autocomplete
              size="small"
              id="combo-box"
              options={listEQARound}
              className="flex-end"
              getOptionLabel={option =>
                option.code != null && typeof option.code != "undefined"
                  ? option.code
                  : ""
              }
              onChange={(event, newValue) =>
                this.handleSelectEQARound(newValue)
              }
              value={currentRound}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("EQAResultReportConclusion.select_eqa_round")}
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Autocomplete
              size="small"
              id="combo-box-2"
              options={healthOrgEQARoundList}
              className="flex-end"
              disableClearable
              getOptionLabel={option =>
                option.healthOrg?.name != null &&
                typeof option.healthOrg?.name != "undefined"
                  ? option.healthOrg?.name
                  : ""
              }
              onChange={(event, newValue) =>
                this.handleSelectHealthOrg(newValue)
              }
              onOpen={() => {
                if (currentRound == null || currentRound == "") {
                  toast.warn(
                    t(
                      "EQAResultReportConclusion.select_eqa_round_first_warning"
                    )
                  );
                } else if (healthOrgEQARoundList.length === 0) {
                  toast.warn(
                    t("EQAResultReportConclusion.no_health_org_available")
                  );
                }
              }}
              value={currentHealthOrgEQARound}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("EQAResultReportConclusion.select_health_org")}
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleOpenConfirmationDialog}
            >
              {t("EQAResultReportConclusion.update_result")}
            </Button>
          </Grid>
          
          
          <Grid item xs={12}>
          {this.state.listSample.length == 0 && (<div>
            <h3>{t("EQAResultReportConclusion.no_data")}</h3>
          </div>)}
          <div>
          {(this.state.listSample && this.state.listSample.length != 0) && (<Paper>
                    <TableContainer style={{ maxHeight: 1000 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead style ={{backgroundColor: '#358600',
                            color:'#fff',}}>
                  
                            {/* <TableRow>
                            <TableCell 
                            style ={{backgroundColor: '#358600',
                              color:'#fff',}}
                              rowSpan={2} width="50px" align="center" className="p-0">{t('ResultsOfTheUnits.STT')}</TableCell>
                            <TableCell style ={{backgroundColor: '#358600',
                                color:'#fff',}} 
                              rowSpan={2}>{t('ResultsOfTheUnits.set')}</TableCell>
                              <TableCell style ={{backgroundColor: '#358600',
                                color:'#fff',textAlign:"center",textTransform:"uppercase"}} 
                                colSpan={listResult.length}>{t('EqaResult.reagentName')}</TableCell>
                          </TableRow> */}
                          <TableRow>
                            <TableCell 
                            style ={{backgroundColor: '#358600',
                              color:'#fff',}}
                              rowSpan={2} width="50px" align="center" className="p-0">{t('ResultsOfTheUnits.STT')}</TableCell>
                            <TableCell style ={{backgroundColor: '#358600',
                                color:'#fff',}} 
                              rowSpan={2}>{t('ResultsOfTheUnits.set')}</TableCell>
                            {
                              (listResult && this.renderRowHead())
                            }
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            (listSample && listSample.map((sample, index) => this.renderResultDetails(sample, index)))
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>)}
                </div>
          
            {/* <MaterialTable
              title={t("EQAResultReportConclusion.title")}
              data={sampleTubeResultConclusionList}
              columns={columns}
              
              options={{
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false
              }}
              components={{
                Toolbar: props => <MTableToolbar {...props} />
              }}
            /> */}
          </Grid>
          <ConfirmationDialog
            title={t("confirm")}
            open={shouldOpenConfirmationDialog}
            onConfirmDialogClose={this.handleDialogClose}
            onYesClick={this.handleConfirmUpdateResult}
            text={t("EQAResultReportConclusion.confirm_update_result")}
            Yes={t("general.Yes")}
            No={t("general.No")}
          />
        </Grid>
      </div>
    );
  }
}
export default EQARound;
