import {
  InputAdornment,
  Input,
  Grid, Icon, IconButton,
  Button, MenuItem,
  Select, Dialog, DialogActions,
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
import { exportToExcel, getEQASample, getListGroupReferenceResultByRoundId, getListReferenceResultByRoundId, updateReferenceResultConclusion } from "./ReferenceResultsServices";
import { Helmet } from "react-helmet";
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser } from "../User/UserService"
import { updateResultReportConclusionBySampleTube } from "../EQAResultReportConclusion/EQAResultReportConclusionServices";
import { getEQASampleTubeResultConclusionDtoByHealthOrgEQARoundId } from "../EQAResultReportConclusion/EQAResultReportConclusionServices";
import { getAllResultByHealthOrgManagementEQARoundId, getResultReportById, getItemById } from "../ResultsOfTheUnits/ResultsOfTheUnitsService";
import '../../../styles/views/_style.scss';

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
class ReferenceResultsDialog extends React.Component {
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
    let { roundId, resultConclusionLists, listGroupReferenceResult, listSample, listReferenceResult } = this.props
    //this.setState({ roundId: roundId, resultConclusionLists: resultConclusionLists, listGroupReferenceResult: listGroupReferenceResult, listReferenceResult: listReferenceResult, listSample: listSample })
    this.setState({...this.props}, ()=>{
      // console.log(this.state)
    })

  }


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

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEQAResultReportDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationEditDialog: false,
    }, () => {
      this.handleSelectHealthOrg(this.state.currentHealthOrgEQARound)
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
      color: '#fff', borderRightStyle: "solid", textAlign: "center", width: "300px"
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

    let { resultConclusionLists } = this.state
    let { t } = this.props
    let sttCell = <TableCell className="px-0" align="center">
      {index + 1}
    </TableCell>
    let titleCell = <TableCell className="px-0" align="center" style={{ textAlign: "center" }}>
      {item ? item.code : ''}
    </TableCell>
    let resultTableAll = <TableCell className="px-0" align="center">
      <FormControl className="w-100">
        <Select
          style={{ textAlign: "left" }}
          value={resultConclusionLists[index] ? resultConclusionLists[index].referenceResult : null}
          onChange={(result) => this.handleRowDataResultCellChange(result, index, item)}
          inputProps={{
            name: "result",
            id: "result-simple"
          }}
        >
          <MenuItem value={-3}><small className="border-radius-4 bg-light-gray px-8 py-2 ">{t('result.noEvaluate')}</small></MenuItem>
          <MenuItem value={-1}><small className="border-radius-4  px-8 py-2 " style={{ backgroundColor: "#3366FF" }}>{t("EQAResultReportElisa.Result.negative")}</small></MenuItem>
          <MenuItem value={0}>{t("EQAResultReportElisa.Result.indertermine")}</MenuItem>
          <MenuItem value={1}><small className="border-radius-4  text-white px-8 py-2 " style={{ backgroundColor: "#f44336" }}>

            {t('result.positive')}

          </small></MenuItem>
        </Select>
      </FormControl>
    </TableCell>
    let { listReferenceResult, listGroupReferenceResult } = this.state;
    let listData = []
    let cellContentByMethod = [];
    listReferenceResult.forEach(result => {
      let content = null;
      if (result != null && result.sample != null && item && item.id == result.sample.id) {
        content = result
        cellContentByMethod.push(content);
      }

    });
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
      // for(let i= cellContentByMethod.length -1; i <listGroupReferenceResult.length-1;i++  ){
      //   cellContentByMethod.push(null)
      // }
    }
    return (
      <React.Fragment>
        {/* {sttCell} */}
        {titleCell}
        {listData.map((cell, index) => this.renderCells(cell, index, item))}
        {resultTableAll}
      </React.Fragment>
    )
  }

  renderCells(item, index, sample) {
    let { t, i18n } = this.props;
    if (item == null) {
      item = {};
    }
    item.sampleId = sample.id
    item.sample = sample
    let resultTable = <TableCell key={shortid.generate()} style={{ width: "auto" }} className="px-0" align="center">
      <FormControl className="w-100" disabled={item.referenceResult ? true : false}>
        <Select
          style={{ textAlign: "left" }}
          value={item.referenceResult ? item.referenceResult : item.officialResult}
          onChange={(result) => this.handleRowDataResultChange(result, index, item)}
          inputProps={{
            name: "result",
            id: "result-simple"
          }}
        >
          <MenuItem value={-3}><small className="border-radius-4 bg-light-gray px-8 py-2 ">{t('result.noEvaluate')}</small></MenuItem>
          <MenuItem value={-1}><small className="border-radius-4  px-8 py-2 " style={{ backgroundColor: "#3366FF" }}>{t("EQAResultReportElisa.Result.negative")}</small></MenuItem>
          <MenuItem value={0}>{t("EQAResultReportElisa.Result.indertermine")}</MenuItem>
          <MenuItem value={1}><small className="border-radius-4  text-white px-8 py-2 " style={{ backgroundColor: "#f44336" }}>

            {t('result.positive')}

          </small></MenuItem>
        </Select>
      </FormControl>
    </TableCell>
    let contentCell = <TableCell key={shortid.generate()} style={{ width: "auto" }} className="px-0" align="center" style={{ borderRightStyle: "solid", borderRightColor: "white" }}>
      {
        item.referenceResult == 1 ? (
          <small className="border-radius-4  text-white px-8 py-2 " style={{ backgroundColor: "#f44336" }}>

            {t('result.positive')}

          </small>
        ) : (
            <small className="border-radius-4 bg-light-gray px-8 py-2 ">
              {
                item.referenceResult == -2 ? (
                  t('result.none')
                ) : (
                    item.referenceResult == -1 ? (
                      t('result.negative')
                    ) : (
                        item.referenceResult == 0 ? (
                          t('result.indertermine')
                        ) : (
                            item.referenceResult == -3 ? (
                              t('result.noEvaluate')
                            ) : (
                                ""
                              )
                          )
                      )
                  )
              }
            </small>
          )
      }
    </TableCell>
    return (
      <React.Fragment>
        {/* {contentCell} */}
        { resultTable}
      </React.Fragment>
    )
  }

  handleRowDataResultCellChange = (event, index, item) => {
    let { resultConclusionLists } = this.state
    if (resultConclusionLists == null) {
      resultConclusionLists = []
    }
    let p = resultConclusionLists[index]
    if (p == null) {
      p = {}
    }
    p.referenceResult = event.target.value
    p.roundID = this.state.roundId
    p.sampleID = item.id
    p.typeMethod = 5
    resultConclusionLists.splice(index, 1, p)
    this.setState({ resultConclusionLists }, () => {

    })
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

  handleFormSubmit = () => {
    const { t } = this.props;
    let { resultConclusionLists, listResultByReagent } = this.state
    if (resultConclusionLists != null && resultConclusionLists.length > 0) {
      updateReferenceResultConclusion(resultConclusionLists).then((data) => {
        if (listResultByReagent != null && listResultByReagent.length > 0) {
          updateReferenceResultConclusion(listResultByReagent).then((res) => {
            this.props.handleOKEditClose();
            toast.success(t("EQAResultReportConclusion.update_result_success"));
          })
        } else {
          this.props.handleOKEditClose();
          toast.success(t("EQAResultReportConclusion.update_result_success"));
        }

      })
    } else {
      if (listResultByReagent != null && listResultByReagent.length > 0) {
        updateReferenceResultConclusion(listResultByReagent).then((res) => {
          this.props.handleOKEditClose();
          toast.success(t("EQAResultReportConclusion.update_result_success"));
        })
      }
    }

  }
  handleRowDataResultChange = (event, index, item) => {
    let isCheck = false
    let referenceResult = {}
    let { listResultByReagent, listGroupReferenceResult, listReferenceResult } = this.state
    if (listResultByReagent == null || listResultByReagent.length == 0) {
      listResultByReagent = []
    }
    if (listResultByReagent != null && listResultByReagent.length > 0) {
      listResultByReagent.forEach(el => {
        if (el.referenceResultID == item.id) {
          isCheck = true
        }
      })
    }
    if (isCheck) {
      if (item.id == null) {
        let p = {}
        if (item.id != null) {
          p.referenceResultID = item.id
        }

        p.officialResult = event.target.value
        referenceResult.officialResult = event.target.value
        p.roundID = this.state.roundId
        p.sampleID = item.sampleId
        referenceResult.sample = item.sample
        referenceResult.round = this.state.currentRound
        if (item.typeMethod != null) {
          p.typeMethod = item.typeMethod
          referenceResult.typeMethod = item.typeMethod
        } else {
          p.typeMethod = 1;
        }
        if (item.reagent != null && item.reagent.id != null) {
          p.reagentID = item.reagent.id
          referenceResult.reagent = item.reagent
        } else {
          p.reagentID = listGroupReferenceResult[index].reagent.id
          referenceResult.reagent = listGroupReferenceResult[index].reagent
        }

        p.priority = 2
        referenceResult.priority = 2
        listResultByReagent.push(p)
        listReferenceResult.push(referenceResult)
        if (listReferenceResult != null && listReferenceResult.length > 0) {
          listReferenceResult.sort((a, b) => (a.reagent.name > b.reagent.name) ? 1 : -1);
        }
      }
    } else {
      let p = {}
      if (item.id != null) {
        p.referenceResultID = item.id
      }

      p.officialResult = event.target.value
      // referenceResult.officialResult = event.target.value//them
      p.roundID = this.state.roundId
      p.sampleID = item.sampleId
      // referenceResult.sample = item.sample//them
      // referenceResult.round = this.state.currentRound//them
      if (item.typeMethod != null) {
        p.typeMethod = item.typeMethod
        referenceResult.typeMethod = item.typeMethod
      } else {
        p.typeMethod = 1;
      }
      if (item.reagent != null && item.reagent.id != null) {
        p.reagentID = item.reagent.id
        // referenceResult.reagent = item.reagent//them
      } else {
        p.reagentID = listGroupReferenceResult[index].reagent.id
        // referenceResult.reagent = listGroupReferenceResult[index].reagent//them
      }

      p.priority = 2
      listResultByReagent.push(p)
      // listReferenceResult.push(referenceResult)
      listReferenceResult.forEach(e => {
        if (e.id == item.id) {
          e.priority = 2
          e.officialResult = event.target.value;
        }
      })
    }

    this.setState({ listResultByReagent, listReferenceResult }, () => {

    })
  }
  render() {
    const { t, i18n, handleClose, open } = this.props;

    const {
      listEQARound,
      currentRound,
      sampleTubeResultConclusionList,
      healthOrgEQARoundList,
      listGroupReferenceResult,
      shouldOpenConfirmationDialog,
      isFinalResult, listSample, listResult, listReferenceResult
    } = this.state;

    return (
      <Dialog onClose={handleClose} open={open} PaperComponent={PaperComponent} maxWidth={'lg'} fullWidth={true} >
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            <span className="mb-20 styleColor">{t("SaveUpdate")}</span>
            <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>


              <Grid item xs={12}>
                {this.state.listSample.length == 0 && (<div>
                  {/* <h3>{t("EQAResultReportConclusion.no_data")}</h3> */}
                </div>)}
                <div>
                  {(this.state.listSample && this.state.listSample.length != 0) && (<Paper>
                    <TableContainer style={{ maxHeight: 1000 }}>
                      <Table stickyHeader aria-label="sticky table" style={{ width: "125%" }}>
                        <TableHead style={{
                          backgroundColor: '#358600',
                          color: '#fff'
                        }}>

                          <TableRow>
                            {/* <TableCell 
                              style ={{backgroundColor: '#358600',
                                color:'#fff',}}
                                rowSpan={2} width="50px" align="center" className="p-0">{t('ResultsOfTheUnits.STT')}</TableCell> */}
                            <TableCell style={{
                              backgroundColor: '#358600',
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
                              backgroundColor: '#358600',
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
          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button variant="contained" color="secondary" type="button" onClick={() => handleClose()}> {t('Cancel')}</Button>
            <Button variant="contained" color="primary" type="submit" >
              {t('Save')}
            </Button>

          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}
export default ReferenceResultsDialog;
