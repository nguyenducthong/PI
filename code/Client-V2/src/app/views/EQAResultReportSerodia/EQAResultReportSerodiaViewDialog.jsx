import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  TextField,
  Icon,
  IconButton,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  FormHelperText,
  MenuItem,
  Checkbox, Select,
  FormControlLabel
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  technicianSearchByPage,
  saveItem,
  checkReagentByHealthOrgRound,
  getEQASampleTubeByHealthOrgEQARoundId
} from "./EQAResultReportSerodiaService";
import Autocomplete from '@material-ui/lab/Autocomplete';
import ConstantList from "../../appConfig";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import HealthOrgEQARoundPopup from "../Component/HealthOrgEQARound/HealthOrgEQARoundPopup";
import { searchByPage as reagentSearchByPage } from "../Reagent/ReagentService";
import Draggable from 'react-draggable';
import { Breadcrumb, ConfirmationDialog } from "egret";
import { MuiPickersUtilsProvider, DateTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import LocalConstants from "./Constants";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_style.scss';
import { getCurrentUser, getListHealthOrgByUser } from "../User/UserService"

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
function MaterialButton(props) {
  const item = props.item;
  return <div>
    <IconButton onClick={() => props.onSelect(item, 0)}>
      <Icon color="primary">edit</Icon>
    </IconButton>
    <IconButton onClick={() => props.onSelect(item, 1)}>
      <Icon color="error">Delete</Icon>
    </IconButton>
  </div>;
}

class EQAResultReportSerodiaViewDialog extends Component {
  state = {
    technician: null,
    round: null,
    healthOrg: null,
    rowsPerPage: 5,
    page: 0,
    listHealthOrgRound: [],
    roundLists: [],
    details: [],
    orderTest: '',
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    listReagent: [],
    listTechnician: [],
    reagentExpiryDate: null,
    testDate: new Date(),
    reagentUnBoxDate: null,
    dateSubmitResults: null,
    isView: false,
    isFinalResult: false,
    isRoleAdmin: false,
    typeMethod: 3,
    isViewButton: false
  };

  listCheckValue = [
    { id: LocalConstants.EQAResultReportDetail_TestValue.positive, name: "Dương tính" },
    { id: LocalConstants.EQAResultReportDetail_TestValue.negative, name: "Âm tính" }
  ];

  listTestValue = [
    { id: LocalConstants.EQAResultReportDetail_TestValue.positive, name: "Dương tính" },
    { id: LocalConstants.EQAResultReportDetail_TestValue.indertermine, name: "Không xác định" },
    { id: LocalConstants.EQAResultReportDetail_TestValue.negative, name: "Âm tính" }
  ];

  listAgglomeration = [
    { id: 1, name: " - " },
    { id: 2, name: " +/- " },
    { id: 3, name: " + " },
    { id: 4, name: " ++ " }
  ];

  //positive(1),//Dương tính
  //indertermine(0),//Không xác định
  //negative(-1),//Âm tính
  //none(-2)//Không thực hiện
  Results = [
    { id: LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented, name: "Không thực hiện" },
    { id: LocalConstants.EQAResultReportDetail_TestValue.negative, name: "Âm tính" },
    { id: LocalConstants.EQAResultReportDetail_TestValue.indertermine, name: "Không xác định" },
    { id: LocalConstants.EQAResultReportDetail_TestValue.positive, name: "Dương tính" },
  ];

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }
  handleDialogClose = () => {
    this.setState({ shouldOpenConfirmationDialog: false, })
  }
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

  handleRowDataCellChange = (rowData, event) => {
    let { details } = this.state;
    if (details != null && details.length > 0) {
      details.forEach(element => {
        if (element.tableData != null && rowData != null && rowData.tableData != null
          && element.tableData.id == rowData.tableData.id) {

          if (event.target.name == "checkValue") {
            if (event.target.value != "" && event.target.value != null)
              if (element.result == LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented) {
                element.result = ""
              }
            element.checkValue = event.target.value;
          }
          else if (event.target.name == "testValue") {
            if (event.target.value != "" && event.target.value != null)
              if (element.result == LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented) {
                element.result = ""
              }
            element.testValue = event.target.value;
          }
          else if (event.target.name == "agglomeration") {
            if (event.target.value != "" && event.target.value != null)
              if (element.result == LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented) {
                element.result = ""
              }
            element.agglomeration = event.target.value;
          }
          else if (event.target.name == "result") {
            if (event.target.value == LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented) {
              element.agglomeration = ""
              element.testValue = ""
              element.checkValue = ""
            }
            element.result = event.target.value;
          }
        }
      });
      this.setState({ details: details });
    }
  };

  handleFormSubmit = () => {
    let { t } = this.props;
    let { id, details, healthOrgRound, reagent, typeMethod } = this.state;
    let isCheck = false;
    if (ConstantList.CHECK_ERROR_RESULT) {
      checkReagentByHealthOrgRound(id, healthOrgRound.id, reagent.id, typeMethod).then(res => {
        if (res.data) {
          toast.warning(t("EqaResult.dulicateReagent"))
        } else {
          details.forEach(el => {
            if (el.result === "" || el.result === null) {
              isCheck = true
            }
          })
          if (isCheck) {
            toast.warning(t("EQAResultReportElisa.notResult"))
            return
          }

          if (id) {
            this.setState({ isView: true, isViewButton: true });
            saveItem({
              ...this.state
            }).then(() => {
              this.props.handleOKEditClose();
              toast.success(t('mess_edit'));
            }).catch(() => {
              toast.warning(t("mess_edit_error"));
              this.setState({ isView: false, isViewButton: false });
            });
          }
          else {
            this.setState({ isView: true, isViewButton: true });
            saveItem({
              ...this.state
            }).then(() => {
              this.props.handleOKEditClose();
              toast.success(t('mess_add'));
            }).catch(() => {
              toast.warning(t("mess_add_error"));
              this.setState({ isView: false, isViewButton: false });
            });
          }
        }
      })
    }
    else {
      details.forEach(el => {
        if (el.result === "" || el.result === null) {
          isCheck = true
        }
      })
      if (isCheck) {
        toast.warning(t("EQAResultReportElisa.notResult"))
        return
      }

      if (id) {
        this.setState({ isView: true, isViewButton: true });
        saveItem({
          ...this.state
        }).then(() => {
          this.props.handleOKEditClose();
          toast.success(t('mess_edit'));
        }).catch(() => {
          toast.warning(t("mess_edit_error"));
          this.setState({ isView: false, isViewButton: false });
        });
      }
      else {
        this.setState({ isView: true, isViewButton: true });
        saveItem({
          ...this.state
        }).then(() => {
          this.props.handleOKEditClose();
          toast.success(t('mess_add'));
        }).catch(() => {
          toast.warning(t("mess_add_error"));
          this.setState({ isView: false, isViewButton: false });
        });
      }
    }

  };

  componentWillMount() {
    let { open, handleClose, item, isRoleAdmin, isView } = this.props;
    this.setState({ isRoleAdmin: isRoleAdmin, isView: isView })
    if(item != null && item.reagent !=  null && item.reagent.name != null){
      if(item.reagent.name === "Sinh phẩm khác"){
        item["otherReagent"] = true
      }else{
        item["otherReagent"] = false
      }
    }
    if (item && item.details && item.details.length > 0) {
      item.details.sort((a, b) => (a.orderNumber > b.orderNumber) ? 1 : (a.orderNumber === b.orderNumber) ? ((a.sampleTube.code > b.sampleTube.code) ? 1 : -1) : -1);
    }
    if (item.listHealthOrgRound != null) {
      this.setState({
        listHealthOrgRound: item.listHealthOrgRound,
        healthOrgRound: item.listHealthOrgRound[0]
      }, () => {
        this.handleSelectHealthOrgRound(this.state.healthOrgRound);
      });
    }
    this.setState({
      ...item
    }, function () {
    });
  }

  handleDateChange = (date, name) => {
    this.setState({
      [name]: date
    });
  };

  handleStartDateChange = startDate => {
    this.setState({ startDate });
  };

  selectTechnician = (technician) => {
    if (technician != null && technician.id != null) {
      this.setState({ technician: technician }, function () {
      });
    }
  }

  selectReagent = (reagent) => {
    if (reagent != null && reagent.id != null) {
      this.setState({ reagent: reagent }, function () {
      });
    }
  }

  handleHealthOrgRoundPopupClose = () => {
    this.setState({ shouldOpenHealthOrgRoundPopup: false }, function () {
    });
  }

  handleSelectHealthOrgRound = (healthOrgRound) => {
    if (healthOrgRound && healthOrgRound.id) {
      this.setState({ healthOrgRound }, function () {
        let { healthOrgRound, details } = this.state;
        details = [];
        getEQASampleTubeByHealthOrgEQARoundId(healthOrgRound.id).then((result) => {
          let listEQASampleTube = result.data;
          if (listEQASampleTube != null && listEQASampleTube.length > 0) {
            listEQASampleTube.forEach(tube => {
              let eQAResultReportDetail = {};
              eQAResultReportDetail.sampleTube = tube;
              eQAResultReportDetail.checkValue = '';
              eQAResultReportDetail.testValue = '';
              eQAResultReportDetail.agglomeration = '';
              eQAResultReportDetail.result = '';
              details.push(eQAResultReportDetail);
            });
            this.setState({ details });
          }
        });
      });
    }
    this.handleHealthOrgRoundPopupClose();
  }

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
    // this.setState({isFinalResult:false, dateSubmitResults: null},()=>{
    // })
    this.handleDialogClose()
  }

  render() {
    let {
      isView,
      isViewButton,
      id,
      isRoleAdmin,
      supplyOfReagent,
      round,
      healthOrgRound,
      reagent,
      personBuyReagent,
      testDate,
      reagentLot,
      details,
      reagentUnBoxDate,
      reagentExpiryDate,
      orderTest,
      noteOtherReagent,
      otherReagent,
      incubationPeriod,
      technician,
      listHealthOrgRound,
      shakingMethod,
      shakingNumber,
      listTechnician,
      shakingTimes, note,
      shouldOpenHealthOrgRoundPopup,
      isCheck, isFinalResult,
      dateSubmitResults
    } = this.state;

    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    let technicianSearchObject = { pageIndex: 0, pageSize: 1000000, searchByHealthOrg: true, healthOrg: (healthOrgRound && healthOrgRound.healthOrg && healthOrgRound.healthOrg.id) ? { id: healthOrgRound.healthOrg.id } : null };
    let { open, handleClose, classes, t, i18n } = this.props;
    let columns = [
      {
        title: t("EQAResultReportFastTest.sample_list.sample_code"), field: "sampleTube.code", align: "left", width: "150"
      },
      {
        title: t("EQAResultReportSerodia.checkValue"),
        field: "supplyOfReagent",
        width: "150",
        render: rowData =>
          <FormControl className="w-80">
            <Select
              value={rowData.checkValue}
              disabled={true}
              onChange={checkValue => this.handleRowDataCellChange(rowData, checkValue)}
              inputProps={{
                name: "checkValue",
                id: "checkValue-simple"
              }}
            >
              <MenuItem value={null}><em>None</em> </MenuItem>
              {this.listCheckValue.map(item => {
                return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
      },
      {
        title: t("EQAResultReportSerodia.testValue"),
        field: "supplyOfReagent",
        width: "150",
        render: rowData =>
          <FormControl className="w-80">
            <Select
              value={rowData.testValue}
              disabled={true}
              onChange={testValue => this.handleRowDataCellChange(rowData, testValue)}
              inputProps={{
                name: "testValue",
                id: "testValue-simple"
              }}
            >
              <MenuItem value={null}><em>None</em> </MenuItem>
              {this.listTestValue.map(item => {
                return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
      },
      {
        title: t("EQAResultReportSerodia.agglomeration"),
        field: "supplyOfReagent",
        width: "150",
        render: rowData =>
          <FormControl className="w-80">
            <Select
              value={rowData.agglomeration}
              disabled={true}
              onChange={agglomeration => this.handleRowDataCellChange(rowData, agglomeration)}
              inputProps={{
                name: "agglomeration",
                id: "agglomeration-simple"
              }}
            >
              {/* <MenuItem value={null}><em>None</em> </MenuItem> */}
              {this.listAgglomeration.map(item => {
                return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
      },
      {
        title: t("EQAResultReportSerodia.Result.title"),
        field: "supplyOfReagent",
        width: "150",
        render: rowData =>
          <FormControl className="w-80" required={this.state.isCheck} error={this.state.isCheck}  >
            <Select
              value={rowData.result}
              disabled={true}
              onChange={result => this.handleRowDataCellChange(rowData, result)}
              inputProps={{
                name: "result",
                id: "result-simple"
              }}
            >
              {/* <MenuItem value={null}><em>None</em> </MenuItem> */}
              {this.Results.map(item => {
                return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
      },
      {
        title:t("SampleManagement.serum-bottle.note"),
        field: "note",
        width: "150",
        headerStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData =>
          <TextValidator
            className="w-100"
            onChange={note => this.handleRowDataCellChange(rowData, note)}
            type="textarea"
            multiLine
            rowsMax={4}
            name="note"
            value={rowData.note ? rowData.note : ''}
            disabled={true}
          />
      }
    ];
    return (
      <Dialog open={open} maxWidth={"lg"}>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            <span className="mb-20">{!isView ? t("SaveUpdate") : t("Details")}</span>
            <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
          </DialogTitle>
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
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Autocomplete
                  size="small"
                  id="combo-box"
                  options={listHealthOrgRound}
                  className="flex-end"
                  disabled={true}
                  getOptionLabel={(option) => option.healthOrg.name}
                  onChange={(event, healthOrgRound) => this.handleSelectHealthOrgRound(healthOrgRound)}
                  value={healthOrgRound}
                  renderInput={(params) => <TextField {...params}
                    label={<span className="font">{t('EQAResultReportElisa.healthOrgName')}</span>}
                    disabled={true}
                    variant="outlined"
                    size="small"
                  />}
                />
              </Grid>
              <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">{t("EQAResultReportFastTest.order")}</span>}
                  onChange={this.handleChange}
                  type="number"
                  name="orderTest"
                  value={orderTest}
                  variant="outlined"
                  size="small"
                  disabled={true}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="w-100"
                    margin="none"
                    id="mui-pickers-testDate"
                    label={<span className="font">{t('EQAResultReportSerodia.testDate')}</span>}
                    inputVariant="outlined"
                    type="text"
                    autoOk={true}
                    format="dd/MM/yyyy"
                    value={testDate}
                    size="small"
                    disabled={true}
                    onChange={date => this.handleDateChange(date, "testDate")}
                    fullWidth
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <AsynchronousAutocomplete label={<span className="font">{t("EQAResultReportFastTest.technicianName")}</span>}
                  variant="outlined"
                  size="small"
                  disabled={true}
                  searchFunction={technicianSearchByPage}
                  searchObject={technicianSearchObject}
                  defaultValue={technician}
                  value={technician}
                  valueTextValidator={technician}
                  displayLable={'displayName'}
                  onSelect={this.selectTechnician}
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <AsynchronousAutocomplete label={<span className="font">{t("EqaResult.reagent")}</span>}
                  variant="outlined"
                  size="small"
                  disabled={true}
                  searchFunction={reagentSearchByPage}
                  searchObject={searchObject}
                  defaultValue={reagent}
                  value={reagent}
                  displayLable={'name'}
                  valueTextValidator={reagent}
                  validators={["required"]}
                  errorMessages={t('general.errorMessages_required')}
                  onSelect={this.selectReagent}
                />
              </Grid>
              <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">{t("EQAResultReportFastTest.reagentLot")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="reagentLot"
                  value={reagentLot}
                  variant="outlined"
                  size="small"
                  disabled={true}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    fullWidth
                    margin="none"
                    id="mui-pickers-reagentExpiryDate"
                    label={<span className="font">{t('EQAResultReportFastTest.reagentExpiryDate')}</span>}
                    inputVariant="outlined"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    value={reagentExpiryDate}
                    size="small"
                    disabled={true}
                    onChange={date => this.handleDateChange(date, "reagentExpiryDate")}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    fullWidth
                    margin="none"
                    id="mui-pickers-reagentUnBoxDate"
                    label={<span className="font">{t('EQAResultReportSerodia.reagentUnBoxDate')}</span>}
                    inputVariant="outlined"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    value={reagentUnBoxDate}
                    size="small"
                    disabled={true}
                    onChange={date => this.handleDateChange(date, "reagentUnBoxDate")}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">{t("EQAResultReportSerodia.supplyOfReagent")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="supplyOfReagent"
                  value={supplyOfReagent}
                  variant="outlined"
                  size="small"
                  disabled={true}
                />
              </Grid>
              <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAResultReportSerodia.personBuyReagent")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="personBuyReagent"
                  value={personBuyReagent}
                  variant="outlined"
                  size="small"
                  disabled={true}
                />
              </Grid>
              {isFinalResult && (<Grid item lg={3} md={3} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    size="small"
                    fullWidth
                    margin="none"
                    disabled={true}
                    id="mui-pickers-dateSubmitResults"
                    label={<span className="font">{t('EQAResultReportElisa.dateSubmitResults')}</span>}
                    inputVariant="outlined"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    value={dateSubmitResults}
                    disabled={true}
                  />
                </MuiPickersUtilsProvider>
              </Grid>)}
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <FormControlLabel
                  variant="outlined"
                  size="small"
                  disabled={true}
                  label={<span style={{ fontWeight: "bold" }}> {t('EQAResultReportFastTest.isFinalResult')}</span>}
                  control={<Checkbox checked={isFinalResult}
                    onClick={(isFinalResult) =>
                      this.notificationFinalResult(isFinalResult)
                    }
                  />}

                />
              </Grid>

              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">{t("SampleManagement.serum-bottle.note")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="note"
                  value={note}
                  disabled={true}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              {otherReagent && (<Grid item lg={12} md ={12} sm={12} xs={12}>
                <TextValidator
                  disabled ={true}
                  className="w-100"
                  label={<span className="font">{t("reagent.note")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  size = "small"
                  variant = "outlined"
                  name="noteOtherReagent"
                  value={noteOtherReagent}
                  validators={["required"]}
                  errorMessages={t('general.errorMessages_required')}
                />
              </Grid>)}

              {/* <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={t("EQAResultReportSerodia.shakingMethod")}
                  onChange={this.handleChange}
                  type="text"
                  name="shakingMethod"
                  value={shakingMethod}
                  size="small"
                  disabled={isView}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={t("EQAResultReportSerodia.shakingNumber")}
                  onChange={this.handleChange}
                  type="number"
                  name="shakingNumber"
                  value={shakingNumber}
                  size="small"
                  disabled={isView}
                />
              </Grid>
              <Grid item sm={2} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={t("EQAResultReportSerodia.shakingTimes")}
                  onChange={this.handleChange}
                  type="number"
                  name="shakingTimes"
                  value={shakingTimes}
                  size="small"
                  disabled={isView}
                />
              </Grid>
              <Grid item sm={2} xs={12}>
                <TextValidator
                  className="w-100"
                  label={t("EQAResultReportSerodia.incubationPeriod")}
                  onChange={this.handleChange}
                  type="number"
                  name="incubationPeriod"
                  value={incubationPeriod}
                  size="small"
                  disabled={isView}
                />
              </Grid> */}
              <Grid item sm={12} xs={12}>
                <MaterialTable
                  title=""
                  data={details}
                  columns={columns}
                  options={{
                    selection: false,
                    actionsColumnIndex: -1,
                    paging: false,
                    search: false,
                    rowStyle: (rowData, index) => ({
                      backgroundColor: (index % 2 === 1) ? '#EEE' : '#FFF',
                    }),
                    headerStyle: {
                    backgroundColor: '#358600',
                    color: '#fff',
                    },
                    padding: 'dense',
                    toolbar: false
                  }}
                  components={{
                    Toolbar: props => (
                      <MTableToolbar {...props} />
                    ),
                  }}
                  onSelectionChange={(rows) => {
                    this.data = rows;
                    // this.setState({selectedItems:rows});
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button variant="contained" className="mr-16" color="secondary" onClick={() => handleClose()}> {t('Cancel')}</Button>
            {/* {(!isView || this.state.isRoleAdmin) && (<Button variant="contained" disabled={isViewButton} color="primary" type="submit" >
              {t('Save')}
            </Button>
            )} */}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQAResultReportSerodiaViewDialog;
