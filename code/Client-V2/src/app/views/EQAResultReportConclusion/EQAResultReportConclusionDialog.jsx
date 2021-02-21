import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  Select,
  InputAdornment,
  FormControl,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  FormControlLabel,
  Checkbox, TableBody, TableCell,
  TableContainer, Table, TableRow,
  TableHead, Icon, IconButton
} from "@material-ui/core";
import shortid from "shortid";
import PropTypes from "prop-types";
import ConstantList from "../../appConfig";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { ValidatorForm, TextValidator, TextField } from "react-material-ui-form-validator";
import { updateResultReportConclusionBySampleTube } from "./EQAResultReportConclusionServices";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import { searchByPage as reagentSearchByPage } from "../Reagent/ReagentService";
import { searchByPage as getAllEQARound } from "../EQARound/EQARoundService";
import { getListHealthOrgEQARoundByEQARoundIdAndUser } from "./EQAResultReportConclusionServices";
import EQAResultReportElisaDialog from "../EQAResultReportElisa/EQAResultReportElisaDialog";
import EQAResultReportFastTestEditorDialog from "../EQAResultReportFastTest/EQAResultReportFastTestEditorDialog";
import EQAResultReportSerodiaDialog from "../EQAResultReportSerodia/EQAResultReportSerodiaDialog";
import EQAResultReportEcliaEditorDialog from "../EQAResultReportEclia/EQAResultReportEcliaEditorDialog";
import { getAllResultByHealthOrgEQARoundId, getResultReportById, getItemById } from "../ResultsOfTheUnits/ResultsOfTheUnitsService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_loadding.scss';
import '../../../styles/views/_style.scss';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';

toast.configure({
  autoClose: 3000,
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

class EQAResultReportConclusionDialog extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    isViewButton: false,
    hasErrorHealthOrgRound: false,
    hasErrorEQARound: false,
    isUsingIQC: false,
    isUsingControlLine: false,
    eqaRound: '',
    healthOrgRound: '',
    reagentLot: '',
    order: '',
    reagent: null,
    technician: null,
    personBuyReagent: '',
    details: [],
    supplyOfReagent: '',
    timeToResult: '',
    reagentExpiryDate: null,
    testDate: new Date(),
    reagentUnBoxDate: null,
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenSearchEQASampleSearchDialog: false,
    shouldOpenViewDialogElisa: false,
    shouldOpenViewDialogFastTest: false,
    shouldOpenViewDialogSerodia: false,
    shouldOpenViewDialogEclia: false,
    isFinalResult: false,
    view: false,
    sampleTubeResultConclusionList: [],
    loading: false
  };

  handleDateChange = (date, name) => {
    this.setState({
      [name]: date
    });
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
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleHealthOrgRoundChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenViewDialogElisa: false,
      shouldOpenViewDialogFastTest: false,
      shouldOpenViewDialogSerodia: false,
      shouldOpenViewDialogEclia: false,
      shouldOpenConfirmationDialog: false,
    });
  };

  componentWillMount() {
    let { open, handleClose, item, sampleTubeResultConclusionList, currentHealthOrgEQARound, currentHealthOrg } = this.props;
    if (sampleTubeResultConclusionList != null && currentHealthOrgEQARound != null) {
      this.setState({
        sampleTubeResultConclusionList, currentHealthOrgEQARound, currentHealthOrg
      }, function () {
        let { currentHealthOrgEQARound } = this.state
        if (currentHealthOrgEQARound && currentHealthOrgEQARound.id) {
          getItemById(currentHealthOrgEQARound.id).then((data) => {
            this.setState({ healthOrgRound: data.data }, function () {
              let { healthOrgRound, details } = this.state;
              details = [];
              getAllResultByHealthOrgEQARoundId(healthOrgRound.id).then((result) => {
                if (result != null && result.data != null) {
                  this.checkResult(result.data);
                  if (result.data != null) {
                    result.data.forEach(el => {
                      if (el.typeMethod === 5) {
                        this.setState({ isFinalResult: el.isFinalResult })
                      }
                    })
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
                        let hor = {}
                        hor.tubeID = sampleSetDetail.sample.id;
                        hor.tubeCode = sampleSetDetail.code
                        eQASet.id = sampleSetDetail.sample.id;
                        eQASet.code = sampleSetDetail.code;
                        listSample.push(eQASet);
                      });
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
      })
    }
    if (item && item.details && item.details.length > 0) {
      item.details.sort((a, b) => (a.orderNumber > b.orderNumber) ? 1 : (a.orderNumber === b.orderNumber) ? ((a.sampleTube.code > b.sampleTube.code) ? 1 : -1) : -1);
    }
    this.setState({
      ...item, hasErrorResult: false
    }, function () {
    });
  }

  handleHealthOrgRoundPopupClose = () => {
    this.setState({ shouldOpenHealthOrgRoundPopup: false }, function () {
    });
  }
  checkResult = (list) => {
    let isCheck = true;
    if (list != null && list.length > 0) {
      list.forEach(item => {
        if (item.typeMethod != null && item.typeMethod == 5) {
          isCheck = false;
        }
      });
    }
    if (isCheck) {
      this.setState({ view: true });
    }
  }
  handleRowDataCellChange = (event, index) => {
    let { sampleTubeResultConclusionList } = this.state
    let p = sampleTubeResultConclusionList[index]
    // console.log(index)
    // console.log(p)
    p.result = event.target.value
    // console.log(p)
    sampleTubeResultConclusionList.splice(index, 1, p)
    this.setState({ sampleTubeResultConclusionList }, () => {
      // console.log(this.state.sampleTubeResultConclusionList)
    })
  }
  renderRowHead() {
    let isCheck = false;
    let { onSelectEvent, handleDelete, handleClick } = this.props;
    let { listResult, view } = this.state;
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
  renderColHeadFirst(item) {

    if (item.reagent != null) {
      item.title = this.getTypeMethodName(item.reagent.name, item.typeMethod);
    }
    else if (item.typeMethod == 5) {
      item.title = this.getTypeMethodName("", item.typeMethod);
    }
    return (
      this.renderHeadCells(item)
    )
  }
  renderHeadCells(item) {
    if (item == null) {
      item = {};
    }
    let titleCell = <TableCell key={shortid.generate()} className="px-0" align="left">
      {item.title}
    </TableCell>
    return (
      <React.Fragment>
        {titleCell}
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
      return t('EQAResultReportConclusion.final_conclusion');
    }
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
    let { sampleTubeResultConclusionList } = this.state
    let { t } = this.props
    let sttCell = <TableCell className="px-0" align="center">
      {index + 1}
    </TableCell>
    let titleCell = <TableCell className="px-0" align="left">
      {item ? item.code : ''}
    </TableCell>
    let resultTableAll = <TableCell className="px-0" align="center">
      <FormControl className="w-100">
        <Select
          style={{ textAlign: "left" }}
          value={sampleTubeResultConclusionList[index] ? sampleTubeResultConclusionList[index].result : null}
          onChange={(result) => this.handleRowDataCellChange(result, index)}
          inputProps={{
            name: "result",
            id: "result-simple"
          }}
        >
          <MenuItem value={-2}>{t("EQAResultReportElisa.Result.none")}</MenuItem>
          <MenuItem value={-1}>{t("EQAResultReportElisa.Result.negative")}</MenuItem>
          <MenuItem value={0}>{t("EQAResultReportElisa.Result.indertermine")}</MenuItem>
          <MenuItem value={1}>{t("EQAResultReportElisa.Result.positive")}</MenuItem>
          <MenuItem value={2}>{t("EQAResultReportElisa.Result.confirms")}</MenuItem>
        </Select>
      </FormControl>
    </TableCell>
    let resultTable = <TableCell className="px-0" align="center">
      <FormControl className="w-100">
        <Select
          style={{ textAlign: "left" }}
          value={sampleTubeResultConclusionList[index] ? sampleTubeResultConclusionList[index].result : null}
          onChange={(result) => this.handleRowDataCellChange(result, index)}
          inputProps={{
            name: "result",
            id: "result-simple"
          }}
        >
          <MenuItem value={-2}>{t("EQAResultReportElisa.Result.none")}</MenuItem>
          <MenuItem value={-1}>{t("EQAResultReportElisa.Result.negative")}</MenuItem>
          <MenuItem value={0}>{t("EQAResultReportElisa.Result.indertermine")}</MenuItem>
          <MenuItem value={1}>{t("EQAResultReportElisa.Result.positive")}</MenuItem>
        </Select>
      </FormControl>
    </TableCell>

    let result = <TableCell className="px-0" align="center">
      <FormControl className="w-100">
        <Select
          style={{ textAlign: "left" }}
          value={sampleTubeResultConclusionList[index] ? sampleTubeResultConclusionList[index].result : null}
          onChange={(result) => this.handleRowDataCellChange(result, index)}
          inputProps={{
            name: "result",
            id: "result-simple"
          }}
        >
          <MenuItem value={-2}>{t("EQAResultReportElisa.Result.none")}</MenuItem>
          <MenuItem value={-1}>{t("EQAResultReportElisa.Result.negative")}</MenuItem>
          <MenuItem value={0}>{t("EQAResultReportElisa.Result.indertermine")}</MenuItem>
          <MenuItem value={2}>{t("EQAResultReportElisa.Result.confirms")}</MenuItem>
        </Select>
      </FormControl>
    </TableCell>

    let { listResult, currentHealthOrg } = this.state;
    let cellContentByMethod = [];
    // let {sampleTubeResultConclusionList} = this.state
    listResult.forEach(result => {
      let content = null;
      if (result != null && result.details != null && result.details.length > 0 && item) {
        result.details.forEach(resultDetail => {
          if (resultDetail.sampleTube != null && resultDetail.sampleTube.eqaSample != null
            && item.id == resultDetail.sampleTube.eqaSample.id) {
            if (result.typeMethod != 5) {
              content = resultDetail;
              cellContentByMethod.push(content);
            }
          }
        });
      }
    });

    return (
      <React.Fragment>
        {sttCell}
        {titleCell}
        {cellContentByMethod.map((cell, index) => this.renderCells(cell))}
        {/* {ConstantList.CHECK_HEALTH_ORG ? (currentHealthOrg.positiveAffirmativeRight ? resultTable :result) : resultTableAll} */}
        {resultTableAll}
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
            <a href="#" onClick={() => this.openDialogDetailCellContent(item)}>
              {t('result.positive')}
            </a>
          </small>
        ) : (
            <small className="border-radius-4 bg-light-gray px-8 py-2 ">
              <a href="#" onClick={() => this.openDialogDetailCellContent(item)}>
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
                          ) : (
                              ''
                            ))
                        )
                    )
                }
              </a>
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
  openDialogDetailCellContent(resultReportDetail) {
    if (resultReportDetail != null && resultReportDetail.resultReport != null && resultReportDetail.resultReport.id != null) {
      getResultReportById(resultReportDetail.resultReport.id).then((result) => {
        let item = result.data;
        item.isView = true;
        this.setState({ item: item }, function () {
          //Elisa(1),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Elisa
          //FastTest(2),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Xét Nghiệm Nhanh
          //SERODIA(3)//Kết Quả Xét Nghiệm Bằng Kỹ Thuật SERODIA
          //ECLIA(4)//KẾT QUẢ ĐIỆN/HÓA PHÁT QUANG
          if (item.typeMethod == 1) {
            this.setState({ shouldOpenViewDialogElisa: true });
          } else if (item.typeMethod == 2) {
            this.setState({ shouldOpenViewDialogFastTest: true });
          } else if (item.typeMethod == 3) {
            this.setState({ shouldOpenViewDialogSerodia: true });
          } else if (item.typeMethod == 4) {
            this.setState({ shouldOpenViewDialogEclia: true });
          }
        });
      });
    }
  }

  openCircularProgress = () => {
    this.setState({ loading: true });
  };

  // handleSubmit = async () => {
  //   await this.openCircularProgress();
  //   var time = setTimeout(() => {
  //     this.handleFormSubmit()
  //   }, 500);
  // }


  handleFormSubmit = async () => {
    await this.openCircularProgress();
    const { t } = this.props;
    const {
      sampleTubeResultConclusionList,
      currentHealthOrgEQARound,
      isFinalResult
    } = this.state;
    if (sampleTubeResultConclusionList.length === 0) {
      toast.warn(t("EQAResultReportConclusion.no_data"));
    } else {
      updateResultReportConclusionBySampleTube(
        sampleTubeResultConclusionList,
        currentHealthOrgEQARound.id,
        isFinalResult
      )
        .then(res => {
          // this.props.handleOKEditClose();
          toast.success(t("EQAResultReportConclusion.update_result_success"));
          this.setState({ loading: false });
        })
        .catch(err => {
          toast.error(t("EQAResultReportConclusion.update_result_error"));
          this.setState({ loading: false });
        });
    }

  };

  notificationFinalResult = () => {
    this.setState({ shouldOpenConfirmationDialog: true })
  }
  handleFinalResult = () => {
    if (this.state.isFinalResult == null || !this.state.isFinalResult) {
      this.setState({ isFinalResult: true, dateSubmitResults: new Date() }, () => {
      })
      this.handleDialogClose()
    }
    if (this.state.isFinalResult) {
      this.setState({ isFinalResult: false, dateSubmitResults: new Date() }, () => {
      })
      this.handleDialogClose()
    }
  }
  handleDialogFinalResultClose = () => {
    // this.setState({isFinalResult:false},()=>{
    // })
    this.handleDialogClose()
  }
  render() {
    let { open, handleClose, handleOKEditClose, isView, t, i18n } = this.props;
    let {
      id,
      isViewButton,
      healthOrgRound,
      reagentLot,
      reagent,
      technician,
      reagentExpiryDate,
      orderTest,
      view,
      item,
      personBuyReagent,
      reagentUnBoxDate,
      details,
      hasErrorResult,
      testDate, note,
      shouldOpenHealthOrgRoundPopup,
      isFinalResult, listSample, listResult, loading
    } = this.state;

    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    let technicianSearchObject = { pageIndex: 0, pageSize: 1000000, searchByHealthOrg: true, healthOrg: (healthOrgRound && healthOrgRound.healthOrg && healthOrgRound.healthOrg.id) ? { id: healthOrgRound.healthOrg.id } : null };

    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'lg'} fullWidth={true} >
        <div className={clsx("wrapperButton", !loading && 'hidden')} >
          <CircularProgress className="buttonProgress" size={24} />
        </div>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            <span className="mb-20 styleColor">{!isView ? t("SaveUpdate") : t("Details")}</span>
            <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {this.state.shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                title={t("confirm")}
                open={this.state.shouldOpenConfirmationDialog}
                onConfirmDialogClose={this.handleDialogFinalResultClose}
                onYesClick={this.handleFinalResult}
                text={isFinalResult ? t("EqaResult.unFinalResultConfirm") : t("EqaResult.FinalResultConfirm")}
                Yes={t("general.Yes")}
                No={t("general.No")}
              />
            )}
            <Grid className="" container spacing={2}>
              <Grid item md={8} sm={8} xs={8}>
                <TextValidator
                  size="small"
                  variant="outlined"
                  disabled={isView}
                  label={<span className="font">{t("EQAResultReportElisa.healthOrgName")}</span>}
                  placeholder={t("EQAResultReportElisa.healthOrgName")}
                  id="healthOrgRound"
                  className="w-100 stylePlaceholder"
                  value={(healthOrgRound != null && healthOrgRound.healthOrg) ? healthOrgRound.healthOrg.name : ''}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item md={4} sm={4} xs={4}>
                <FormControlLabel
                  label={<span className="font" style={{ fontWeight: "bold" }}> {t('EQAResultReportFastTest.isFinalResult')}</span>}
                  control={<Checkbox checked={isFinalResult}
                    onClick={(isFinalResult) =>
                      this.notificationFinalResult(isFinalResult)
                      // this.handleFinalResult(isFinalResult, 'isFinalResult')
                    }
                  />}

                />
              </Grid>
              {/* <Grid item md={8} sm={6} xs={12}>
                <TextValidator
                  className="w-100"
                  label={t("SampleManagement.serum-bottle.note")}
                  onChange={this.handleChange}
                  type="text"
                  name="note"
                  value={note}
                />
              </Grid> */}


              <Grid item xs={12} className="mt-10">
                <div>
                  {listSample && (<Paper>
                    <TableContainer style={{ maxHeight: 1000 }} >
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell width="50px" align="center" className="p-0">{t('ResultsOfTheUnits.STT')}</TableCell>
                            <TableCell>{t('ResultsOfTheUnits.set')}</TableCell>
                            {
                              (listResult && this.renderRowHead())

                            }
                            {(view && <TableCell>{t('EQAResultReportConclusion.final_conclusion')}</TableCell>)}
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
                {this.state.shouldOpenViewDialogElisa && (
                  <EQAResultReportElisaDialog t={t} i18n={i18n}
                    handleClose={this.handleDialogClose}
                    open={this.state.shouldOpenViewDialogElisa}
                    handleOKEditClose={this.handleOKEditClose}
                    item={item}
                  />
                )}
                {this.state.shouldOpenViewDialogFastTest && (
                  <EQAResultReportFastTestEditorDialog t={t} i18n={i18n}
                    handleClose={this.handleDialogClose}
                    open={this.state.shouldOpenViewDialogFastTest}
                    handleOKEditClose={this.handleOKEditClose}
                    item={item}
                  />
                )}
                {this.state.shouldOpenViewDialogSerodia && (
                  <EQAResultReportSerodiaDialog t={t} i18n={i18n}
                    handleClose={this.handleDialogClose}
                    open={this.state.shouldOpenViewDialogSerodia}
                    handleOKEditClose={this.handleOKEditClose}
                    item={item}
                  />
                )}
                {this.state.shouldOpenViewDialogEclia && (
                  <EQAResultReportEcliaEditorDialog t={t} i18n={i18n}
                    handleClose={this.handleDialogClose}
                    open={this.state.shouldOpenViewDialogEclia}
                    handleOKEditClose={this.handleOKEditClose}
                    item={item}
                  />
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button variant="contained" color="secondary" type="button" onClick={() => handleClose()}> {t('Cancel')}</Button>
            {(!isViewButton && <Button variant="contained" color="primary" type="submit" >
              {t('Save')}
            </Button>
            )}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQAResultReportConclusionDialog;
