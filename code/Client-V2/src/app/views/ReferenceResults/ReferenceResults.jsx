import {
  InputAdornment,
  Input,
  Grid,
  Button,
  Select, MenuItem,
  TextField, Table, TableHead, TableRow,
  FormControlLabel, Paper, TableContainer,
  Checkbox, TableCell, FormControl, TableBody
} from "@material-ui/core";
import shortid from "shortid";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { searchByPage as getAllEQARound } from "../EQARound/EQARoundService";
// import { getListHealthOrgEQARoundByEQARoundIdAndUser } from "../EQAResultReportConclusion/EQAResultReportConclusionServices";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { exportToExcel, getListGroupReferenceResultByRoundId, getEQASample, getResultConclusionEQARoundId, getListReferenceResultByRoundId } from "./ReferenceResultsServices";
import { Helmet } from "react-helmet";
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
import ReferenceResultsDialog from "./ReferenceResultsDialog"
import Autocomplete from "@material-ui/lab/Autocomplete";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser } from "../User/UserService"
import { updateResultReportConclusionBySampleTube } from "../EQAResultReportConclusion/EQAResultReportConclusionServices";
import { getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId } from "../EQAResultReportConclusion/EQAResultReportConclusionServices";
import { getAllResultByHealthOrgManagementEQARoundId, getResultReportById, getItemById } from "../ResultsOfTheUnits/ResultsOfTheUnitsService";
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});
class ReferenceResults extends React.Component {
  state = {
    sampleTubeResultConclusionList: [],
    listEQARound: [],
    currentRound: null,
    healthOrgEQARoundList: [],
    currentHealthOrgEQARound: null,
    shouldOpenConfirmationDialog: false,
    isFinalResult: false,
    shouldOpenEQAResultReportDialog: false,
    listSample: [],
    isCheckUpdate: false,
    shouldView: false
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {


  }
  componentDidMount() {
    const searchObject = { pageIndex: 0, pageSize: 1000000 };
    getAllEQARound(searchObject).then(res => {
      this.setState({ listEQARound: res.data.content });
    }, () => {

    });
  }

  handleOpenConfirmationDialog = () => {
    const { t } = this.props;
    if (this.state.currentRound == null || this.state.currentRound.id == null) {
      toast.warn(t("EQASampleSet.please_select_eqa_round"))
      return
    }
    this.setState({
      shouldOpenConfirmationDialog: true
    });
  }
  handleDialogClose = () => {
    this.setState({
      shouldOpenConfirmationDialog: false,
      shouldOpenEQAResultReportDialog: false,
    }, () => {
      this.handleSelectEQARound(this.state.currentRound)
    });
  };

  handleSelectEQARound = value => {
    if (value != null && value != "") {
      getListGroupReferenceResultByRoundId(value.id).then(res => {
        if (res.data != null && res.data.length > 0) {
          res.data.sort((a, b) => (a.reagent.name > b.reagent.name) ? 1 : -1);
        }

        this.setState({
          currentHealthOrgEQARound: null,
          currentRound: value,
          listGroupReferenceResult: res.data,
        }, () => {
          getListReferenceResultByRoundId(value.id).then(res => {
            if (res.data != null && res.data.length > 0) {
              res.data.sort((a, b) => (a.reagent.name > b.reagent.name) ? 1 : -1);
            }
            this.setState({
              currentHealthOrgEQARound: null,
              currentRound: value,
              listReferenceResult: res.data,
            }, () => {
              getEQASample(value.id).then((data) => {
                let p = {}
                let listSample = []
                let list = [...data.data]
                list.forEach(element => {
                  p = { ...element.eqaSample }
                  listSample.push(p)
                });
                this.setState({ sample: null, listSample: list }, () => {
                })

              })
              getResultConclusionEQARoundId(value.id).then(res => {
                this.setState({
                  currentHealthOrgEQARound: null,
                  resultConclusionList: res.data,
                  currentRound: value,
                }, () => {
                });
              });
            });
          });
        })
      })


    } else {
      this.setState({
        currentRound: null,
        currentHealthOrgEQARound: null,
        healthOrgEQARoundList: [],
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
    if (source === "isFinalResult") {
      this.setState({ isFinalResult: event.target.checked })
    }

  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEQAResultReportDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationEditDialog: false,
    }, () => {
      this.handleSelectEQARound(this.state.currentRound)
    });
    // this.setPage(0);
  };

  renderRowHead() {
    let { onSelectEvent, handleDelete, handleClick } = this.props;
    let { listGroupReferenceResult } = this.state;
    let titleCell = null;
    if (listGroupReferenceResult != null && listGroupReferenceResult.length > 0) {
      listGroupReferenceResult.forEach(item => {
        if (!titleCell) {
          titleCell = <TableCell key={shortid.generate()} className="px-0" align="left">
            {this.getTypeMethodName(item.typeMethod)}
          </TableCell>
        } else {
          titleCell += <TableCell key={shortid.generate()} className="px-0" align="left" >
            {this.getTypeMethodName(item.typeMethod)}
          </TableCell>
        }
      });
    }

    return (
      <React.Fragment>
        {listGroupReferenceResult.map((item, index) => this.renderColHeadFirst(item))}
      </React.Fragment>
    )
  }
  getTypeMethodName(text, type) {
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
      return t('ReferenceResults.conclusion');
    }
  }
  renderColHeadFirst(item) {
    if (item.reagent != null) {
      item.title = this.getTypeMethodName(item.reagent.name, item.typeMethod);
    } else {
      item.title = this.getTypeMethodName("", item.typeMethod);
    }
    //item.title = this.getTypeMethodName(item.reagent.name,item.typeMethod);
    return (
      this.renderHeadCells(item)
    )
  }
  renderHeadCells(item) {
    if (item == null) {
      item = {};
    }
    // if(item.)
    let titleCell = <TableCell style={{
      backgroundColor: '#358600',
      color: '#fff', borderRightStyle: "solid", textAlign: "center"
    }}
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
    let { t } = this.props
    let sttCell = <TableCell className="px-0" align="center">
      {index + 1}
    </TableCell>
    let titleCell = <TableCell className="px-0" align="center" style={{ textAlign: "center", width: "40px" }}>
      {item ? item.code : ''}
    </TableCell>

    let { listReferenceResult, listGroupReferenceResult, resultConclusionList } = this.state;
    let listData = []
    let str = ""
    let cellContentByMethod = [];
    let reference = null
    listReferenceResult.forEach(result => {
      let content = null;
      if (result != null && result.sample != null && item && item.id == result.sample.id) {
        content = result
        cellContentByMethod.push(content);

      }

    });
    resultConclusionList && resultConclusionList.forEach(e => {
      if (e != null && e.sampleID != null && item && item.id == e.sampleID) {
        reference = e
      }
    })

    if (cellContentByMethod.length == listGroupReferenceResult.length) {
      listData = cellContentByMethod
    }
    if (cellContentByMethod.length < listGroupReferenceResult.length) {
      listGroupReferenceResult.forEach(e => {
        let p = null;
        cellContentByMethod.forEach(el => {
          if (e.reagent.id == el.reagent.id) {
            p = el
          }
        })
        listData.push(p)
      })
    }


    let resultCell = <TableCell key={shortid.generate()} className="px-0" align="center" style={{ borderRightStyle: "solid", borderRightColor: "white", width: "100px" }}>
      {
        reference?.referenceResult == 1 ? (
          <small className="border-radius-4  text-white px-8 py-2 " style={{ backgroundColor: "#f44336" }}>

            {t('result.positive')}

          </small>
        ) : (
            reference?.referenceResult == -2 ? (
              <small className="border-radius-4 bg-light-gray px-8 py-2 ">{t('result.none')}</small>
            ) : (
                reference?.referenceResult == -1 ? (
                  <small className="border-radius-4  px-8 py-2 " style={{ backgroundColor: "#3366FF" }}>{t('result.negative')}</small>
                ) : (
                    reference?.referenceResult == 0 ? (
                      <small className="border-radius-4 bg-light-gray px-8 py-2 ">{t('result.indertermine')}</small>
                    ) : (
                        reference?.referenceResult == -3 ? (
                          <small className="border-radius-4 bg-light-gray px-8 py-2 ">{t('result.noEvaluate')}</small>

                        ) : (

                            ("")
                          )
                      )
                  )
              )

          )
      }
    </TableCell>
    return (
      <React.Fragment>
        {titleCell}
        {listData.map((cell, index) => this.renderCells(cell, index))}
        {resultCell}
      </React.Fragment>
    )
  }

  renderCells(item) {
    let { t, i18n } = this.props;
    if (item == null) {
      item = {};
    }
    let contentCell = <TableCell key={shortid.generate()} className="px-0" align="center" style={{ borderRightStyle: "solid", borderRightColor: "white" }}>
      {
        item.referenceResult == 1 ? (
          <small className="border-radius-4  text-white px-8 py-2 " style={{ backgroundColor: "#f44336" }}>

            {t('result.positive')}

          </small>
        ) : (
            item.referenceResult == -2 ? (
              <small className="border-radius-4 bg-light-gray px-8 py-2 ">{t('result.none')}</small>
            ) : (
                item.referenceResult == -1 ? (
                  <small className="border-radius-4  px-8 py-2 " style={{ backgroundColor: "#3366FF" }}>{t('result.negative')}</small>
                ) : (
                    item.referenceResult == 0 ? (
                      <small className="border-radius-4 bg-light-gray px-8 py-2 ">{t('result.indertermine')}</small>
                    ) : (
                        item.referenceResult == -3 ? (
                          <small className="border-radius-4 bg-light-gray px-8 py-2 ">{t('result.noEvaluate')}</small>

                        ) : (

                            ("")
                          )
                      )
                  )
              )

          )
      }
    </TableCell>

    let officialResultCell = <TableCell key={shortid.generate()} className="px-0" align="center" style={{ borderRightStyle: "solid", borderRightColor: "white" }}>
      {
        item.officialResult == 1 ? (
          <small className="border-radius-4  text-white px-8 py-2 " style={{ backgroundColor: "#f44336" }}>

            {t('result.positive')}

          </small>
        ) : (


            item.officialResult == -2 ? (
              <small className="border-radius-4 bg-light-gray px-8 py-2 ">{t('result.none')}</small>
            ) : (
                item.officialResult == -1 ? (
                  <small className="border-radius-4  px-8 py-2 " style={{ backgroundColor: "#3366FF" }}>{t('result.negative')}</small>
                ) : (
                    item.officialResult == 0 ? (
                      <small className="border-radius-4 bg-light-gray px-8 py-2 ">{t('result.indertermine')}</small>
                    ) : (
                        item.officialResult == -3 ? (
                          <small className="border-radius-4 bg-light-gray px-8 py-2 ">{t('result.noEvaluate')}</small>

                        ) : (

                            ("")
                          )
                      )
                  )
              )

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
    if (this.state.currentRound == null || this.state.currentRound.id == "") {
      toast.warn(t("EQASampleSet.please_select_eqa_round"))
      return
    }
    exportToExcel(this.state.currentRound ? this.state.currentRound.id : "").then((res) => {
      let blob = new Blob([res.data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      saveAs(blob, 'EQAResultReport.xlsx')
    })
      .catch((err) => {
      })
  }
  render() {
    const { t, i18n } = this.props;

    const {
      listEQARound,
      currentRound,
      sampleTubeResultConclusionList,
      healthOrgEQARoundList,
      currentHealthOrgEQARound, resultConclusionList,
      shouldOpenConfirmationDialog, listGroupReferenceResult,
      isFinalResult, listSample, listResult, listReferenceResult
    } = this.state;


    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>
              {t("ReferenceResults.title")} | {t("web_site")}
            </title>
          </Helmet>
          <Breadcrumb
            routeSegments={[{ name: t("ReportResult.title"), path: "/directory/apartment" }, { name: t("ReferenceResults.title") }]}
          />
        </div>
        <Grid container spacing={2}>
          {this.state.shouldOpenConfirmationDialog && (
            <ReferenceResultsDialog t={t} i18n={i18n}
              open={this.state.shouldOpenConfirmationDialog}
              handleClose={this.handleDialogClose}
              roundId={this.state.currentRound.id}
              resultConclusionLists={this.state.resultConclusionList ? this.state.resultConclusionList : []}
              handleOKEditClose={this.handleOKEditClose}
              listGroupReferenceResult={this.state.listGroupReferenceResult}
              listReferenceResult={this.state.listReferenceResult}
              listSample={this.state.listSample}
            />
          )}
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

          {/* <Grid item md={4} sm={4} xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleOpenConfirmationDialog}
              >
                {t("EQAResultReportConclusion.update_result")}
              </Button>
          </Grid> */}
          <Grid item md={8} sm={8} xs={8} spacing={2}>
            <Button
              className ="mr-16 mb-16"
              variant="contained"
              color="primary"
              onClick={this.handleOpenConfirmationDialog}
            >
              {t("EQAResultReportConclusion.update_result")}
            </Button>
            <Button
              className="mb-16"
              variant="contained"
              color="primary"
              onClick={this.exportToExcel}
            >
              {t('general.exportToExcel')}
            </Button>
          </Grid>

          <Grid item xs={12}>
            {this.state.listSample.length == 0 && (<div>
              {/* <h3>{t("EQAResultReportConclusion.no_data")}</h3> */}
            </div>)}
            <div>
              {(this.state.listSample && this.state.listSample.length != 0) && (<Paper>
                <TableContainer style={{ maxHeight: "1000px", width: "100%" }}>
                  <Table stickyHeader aria-label="sticky table" style={{ width: "100%" }} >
                    <TableHead style={{
                      backgroundColor: '#358600',
                      color: '#fff'
                    }}>

                      <TableRow>
                        <TableCell style={{
                          backgroundColor: '#358600', width: "40px",
                          color: '#fff', borderRightStyle: "solid"
                        }}
                          rowSpan={2}>{t('ResultsOfTheUnits.set')}</TableCell>
                        <TableCell style={{
                          backgroundColor: '#358600',
                          color: '#fff', textAlign: "center", textTransform: "uppercase", borderRightStyle: "solid"
                        }}
                          colSpan={listGroupReferenceResult.length + 1}>{t('EqaResult.reagentName')}</TableCell>
                      </TableRow>
                      <TableRow>

                        {
                          (listGroupReferenceResult && this.renderRowHead())
                        }
                        <TableCell style={{
                          backgroundColor: '#358600', width: "100px",
                          color: '#fff', borderRightStyle: "solid"
                        }}
                          rowSpan={2}>{t('EQAResultReportConclusion.final_conclusion')}</TableCell>
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
        </Grid>
      </div>
    );
  }
}
export default ReferenceResults;
