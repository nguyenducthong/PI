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
  import { getSampleSetByRoundID,getListResultByRoundId,getByReportReagent,exportToExcel } from "./ResultsOfUnitsByReagentGroupService";
  import { Breadcrumb, ConfirmationDialog } from "egret";
  import { Helmet } from "react-helmet";
  import { toast } from "react-toastify";
  import Autocomplete from "@material-ui/lab/Autocomplete";
  import "react-toastify/dist/ReactToastify.css";
  import {getCurrentUser} from "../User/UserService"
  import LocalConstants from "./Constants";
  import { saveAs } from 'file-saver';
//   import { updateResultReportConclusionBySampleTube } from "./EQAResultReportConclusionServices";
//   import { getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId } from "./EQAResultReportConclusionServices";
  import { getAllResultByHealthOrgEQARoundId, getResultReportById,getItemById } from "../ResultsOfTheUnits/ResultsOfTheUnitsService";
  toast.configure({
    autoClose: 1000,
    draggable: false,
    limit:3
  });
  class ResultsOfUnitsByReagentGroup extends React.Component {
    state = {
      sampleTubeResultConclusionList: [],
      listEQARound: [],
      currentRound: null,
      healthOrgEQARoundList: [],
      currentHealthOrgEQARound: null,
      shouldOpenConfirmationDialog: false,
      isFinalResult:false,
      shouldOpenEQAResultReportDialog:false,
      listSample : [],
      isCheckUpdate:false,
      listResult:[]
    };
  
    constructor(props) {
      super(props);
    }
  
    componentWillMount (){
    }
    componentDidMount() {
      const searchObject = { pageIndex: 0, pageSize: 1000000 };
      getAllEQARound(searchObject).then(res => {
        this.setState({ listEQARound: res.data.content });
      },()=>{
        
      });
    }
  
    
  
    handleDialogClose = () => {
      this.setState({
        shouldOpenConfirmationDialog: false,
        shouldOpenEQAResultReportDialog:false,
      },()=>{
        // console.log(this.state.sampleTubeResultConclusionList)
      });
    };
  
    handleSelectEQARound = value => {
      if (value != null && value != "") {

        
        getSampleSetByRoundID(value.id).then(res => {
            // console.log(res.data)
            let listSampleSetDetail =[]
            let listSampleSet = res.data
            listSampleSet.forEach(e=>{
                listSampleSetDetail = e.details
            })
            listSampleSetDetail.sort((a, b) => (a.sampleCode > b.sampleCode)  ? 1  : -1)
          this.setState({
            currentHealthOrgEQARound: null,
            sampleTubeResultConclusionList: [],
            currentRound: value,
            healthOrgEQARoundList: res.data,
            listSample: listSampleSetDetail
          },()=>{

            getByReportReagent(value.id).then(res=>{
                let list = res.data;
                list.sort((a, b) => (a.reagent > b.reagent) ? 1 : -1);
                this.setState({listReagent:res.data},()=>{
                    let {listSample,listReagent} = this.state
                    listSample.forEach(e=>{
                        let sampleCodeId = e.sampleCode
                        let result = sampleCodeId +"-result"
                        listReagent.forEach(el =>{
                            el[result] = e.sampleResult    
                            el[sampleCodeId] = e.sample.id
                                this.setState({listReagent},()=>{
                                    })
                    })
                })
                
                    
                })
            })

            getListResultByRoundId(value.id).then(res=>{
                let {listSample,listReagent} = this.state
                let {listResult}= this.state
                let listItem = [...res.data]
                listResult = listItem
                let content = {};
                let list = [...res.data]
                // listReagent.forEach(e=>{
                    
                //     listSample.forEach(el =>{
                //         let sampleCode = e.sampleCode
                //         if(e.sample != null && el.sampleId != null
                //             && e.sample.id == el.sampleId){
                //                 e[${sampleCode}] = el.result
                //                 content
                //             }
                //     })
                //     listResult.push(content)
                // })
                
                this.setState({listResult},()=>{
                // console.log(this.state.listResult)
                // console.log(this.state.listReagent)

                })
            })
          });
        });

        
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
      },()=>{
        this.handleSelectHealthOrg(this.state.currentHealthOrgEQARound)
      });
      // this.setPage(0);
    };
  
    renderRowResultHead(){
        let { onSelectEvent, handleDelete, handleClick } = this.props;
      let { listSample } = this.state;
      let titleCell = null;
      if (listSample != null && listSample.length > 0) {
        listSample.forEach(item => {
            // console.log(item)
          if (!titleCell) {
            titleCell = <TableCell key={shortid.generate()} className="px-0" align="left">
              {item.sampleResult}
            </TableCell>
          } else {
            titleCell += <TableCell key={shortid.generate()} className="px-0" align="left">
              {item.sampleResult}
            </TableCell>
          }
          
        });
        
      }
  
      return (
        <React.Fragment>
          {listSample.map((item, index) => this.renderColHeadResult(item))}
        </React.Fragment>
      )
    }



    renderRowHead() {
      let { onSelectEvent, handleDelete, handleClick } = this.props;
      let { listSample } = this.state;
      let titleCell = null;
      if (listSample != null && listSample.length > 0) {
        listSample.forEach(item => {
            // console.log(item)
          if (!titleCell) {
            titleCell = <TableCell key={shortid.generate()} className="px-0" align="left">
              {item.sampleCode}
            </TableCell>
          } else {
            titleCell += <TableCell key={shortid.generate()} className="px-0" align="left">
              {item.sampleCode}
            </TableCell>
          }
          
        });
        
      }
  
      return (
        <React.Fragment>
          {listSample.map((item, index) => this.renderColHeadFirst(item))}
        </React.Fragment>
      )
    }


    renderColHeadResult(item){
        if(item.sampleResult != null){
            if(item.sampleResult === -1 ){
                item.title = "Âm tính";
            }else if(item.sampleResult === 0){
                item.title = "Không xác định";
            }else if(item.sampleResult === 1){
                item.title = "Dương tính";
            }
            
          }
          
          return (
            this.renderHeadResultCells(item)
          )
    }

    renderColHeadFirst(item) {
      if(item.code != null){
        item.title = item.sampleCode;
      }
      
      return (
        this.renderHeadCells(item)
      )
    }

    renderHeadResultCells(item){
        if (item == null) {
            item = {};
          }
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

    renderHeadCells(item) {
      if (item == null) {
        item = {};
      }
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
      let {listResult,listSample} = this.state;
      let cellContentByMethod = [];
      let isCheck = false
      if(item.typeMethod != null){
        if(item.typeMethod === LocalConstants.EQAResultReportTypeMethod.Elisa ){
            item.title = "Elisa";
          }else if(item.typeMethod === LocalConstants.EQAResultReportTypeMethod.FastTest){
            item.title = "FastTest";
          }else if(item.typeMethod === LocalConstants.EQAResultReportTypeMethod.SERODIA){
            item.title = "Serodioa";
          }else if(item.typeMethod === LocalConstants.EQAResultReportTypeMethod.ECL){
            item.title = "Eclia";
           }
      }

      let sttCell = <TableCell className="px-0" align="center">
      {item.healthOrgCode}
    </TableCell>
    let titleCell = <TableCell className="px-0" align="left">
      { item ? item.reagent : ''}
    </TableCell>

let titleTypeMethod = <TableCell className="px-0" align="left">
{ item ? item.title : ''}
</TableCell>
listResult.forEach(el=>{
    if(item.healthOrgId == el.healthOrgId && item.typeMethod == el.typeMethod && item.reagentId == el.reagentId){
        cellContentByMethod.push(el)
    }
})
    // listSample.forEach(e =>{
    //     let sampleCodeId = e.sampleCode
    //     let result = sampleCodeId +"-result"
    //     listResult.forEach(el=>{
    //         if(item[sampleCodeId] == el.sampleId && item.typeMethod == el.typeMethod && 
    //             item.){

    //         }
    //     })
    // })  
    cellContentByMethod.sort((a, b) => (a.sampleCode > b.sampleCode)  ? 1  : -1)
    //   console.log(cellContentByMethod)
      return (
        <React.Fragment>
        {titleTypeMethod}
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
    exportToExcel = () => {
      const { t } = this.props;
      let searchObject = {}
      if(this.state.currentRound == null || this.state.currentRound.id == ""){
        toast.warn(t("EQASampleSet.please_select_eqa_round"))
        return
      }
        exportToExcel(this.state.currentRound ? this.state.currentRound.id :"").then((res) => {
          let blob = new Blob([res.data], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })
          saveAs(blob, 'ResultsOfUnitsByReagentGroup.xlsx')
        })
        .catch((err) => {
          // console.log(err)
        })
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
        isFinalResult,listSample,listResult,listReagent
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
        
      ];
  
      return (
        <div className="m-sm-30">
          <div className="mb-sm-30">
            <Helmet>
              <title>
                {t("ResultsOfUnitsByReagentGroup.title")} | {t("web_site")}
              </title>
            </Helmet>
            <Breadcrumb
              routeSegments={[{ name: t("ReportResult.title"), path: "/directory/apartment" },{ name: t("ResultsOfUnitsByReagentGroup.title") }]}
            />
          </div>

          <Grid container spacing={3}>
            <Grid item md={4} sm={4} xs={4}>
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
            
            <Grid item md={4} sm={4} xs={12}>
              <Button
                className="mb-16 align-bottom"
                variant="contained"
                color="primary"
                onClick={this.exportToExcel}
                >
                {t('general.exportToExcel')}
              </Button>
            </Grid>
            
          </Grid>
          <Grid container spacing={3}>
          <Grid item >
            {this.state.listSample.length == 0 && (<div>
              <h3>{t("EQAResultReportConclusion.no_data")}</h3>
            </div>)}
            <div>
            {(listSample && listSample.length !=0 &&this.state.listResult && this.state.listResult.length != 0) && (<Paper>
                      <TableContainer style={{ maxHeight: 1000 }}>
                        <Table >
                          <TableHead style ={{backgroundColor: '#358600',
                              color:'#fff',}} >
                            <TableRow>
                              <TableCell 
                              style ={{backgroundColor: '#358600',
                                color:'#fff',}}
                                rowSpan={2} width="50px" align="center" className="p-0">{t('ResultsOfTheUnits.STT')}</TableCell>
                              <TableCell style ={{backgroundColor: '#358600',
                                  color:'#fff',}} 
                                rowSpan={2}>{t('ResultsOfUnitsByReagentGroup.countHealthOrg')}</TableCell>
                                <TableCell style ={{backgroundColor: '#358600',
                                  color:'#fff',}} 
                                rowSpan={2}>{t('EqaResult.reagent')}</TableCell>
                              {
                                (listSample && this.renderRowHead())
                              }
                            </TableRow>
                            <TableRow>
                              {
                                (listSample && this.renderRowResultHead())
                              }
                            </TableRow>
                            {/* <TableRow>
                              {
                                (listSample && this.renderRowResultHead())
                              }
                            </TableRow> */}
                          </TableHead>
                          <TableBody>
                            {
                              (listReagent && listReagent.map((sample, index) => this.renderResultDetails(sample, index)))
                            }
                            {/* <TableRow>
                                {this.renderSample(sample, index)}
                            </TableRow> */}
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
  export default ResultsOfUnitsByReagentGroup;
  