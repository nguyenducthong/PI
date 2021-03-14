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
  saveItem,
  checkReagentByHealthOrgRound,
  getEQASampleTubeByHealthOrgEQARoundId
} from "./EQAResultReportEcliaService";
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

class EQAResultReportViewDialog extends Component {
  constructor(props) {
    super(props);
  }

  state = {
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
    dateSubmitResults: null,
    personBuyReagent: '',
    details: [],
    supplyOfReagent: '',
    timeToResult: '',
    reagentExpiryDate: null,
    testDate: new Date().getTime(),
    reagentUnBoxDate: null,
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenSearchEQASampleSearchDialog: false,
    listHealthOrgRound: [],
    listReagent: [],
    listEQARound: [],
    isFinalResult: false,
    isRoleAdmin: false,
    isViewButton: false,
    typeMethod: 4
  };

  handleDateChange = (date, name) => {
    this.setState({
      [name]: date
    });
  };
  handleDialogClose = () => {
    this.setState({
      shouldOpenConfirmationDialog: false,
    });
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

  handleHealthOrgRoundChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
  };

  handleRowDataCellChange = (rowData, event) => {
    let { details } = this.state;
    let { t } = this.props;
    if (details != null && details.length > 0) {
      details.forEach(element => {
        if (element.tableData != null && rowData != null && rowData.tableData != null
          && element.tableData.id == rowData.tableData.id) {
          if (event.target.name == "sCOvalue") {
            if (element.sCOvalue == '') {
              element.result = "";
            }
            element.sCOvalue = event.target.value;
          }
          else if (event.target.name == "result") {
            if (element.sCOvalue == '') {
              if (event.target.value === LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented) {
                element.sCOvalue = '';
                element.result = event.target.value;
              }
              toast.warning(t("EQAResultReportEclia.notScOvalue"));
            } else {
              if (event.target.value === LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented) {
                element.sCOvalue = '';
              }
              element.result = event.target.value;
            }
          }else if(event.target.name == "note"){
            element.note = event.target.value
          }
        }
      });
      this.setState({ details: details });
    }
  };

  componentWillMount() {
    let { open, handleClose, isRoleAdmin, item, isView } = this.props;
    // this.setState({isRoleAdmin:isRoleAdmin,isView:isView})
    if (item && item.details && item.details.length > 0) {
      item.details.sort((a, b) => (a.orderNumber > b.orderNumber) ? 1 : (a.orderNumber === b.orderNumber) ? ((a.sampleTube.code > b.sampleTube.code) ? 1 : -1) : -1);
    }
    if (item && item.details && item.details.length > 0) {
      item.details.sort((a, b) => (a.orderNumber > b.orderNumber) ? 1 : (a.orderNumber === b.orderNumber) ? ((a.sampleTube.code > b.sampleTube.code) ? 1 : -1) : -1);
    }
    if(item != null && item.reagent !=  null && item.reagent.name != null){
      if(item.reagent.name === "Sinh phẩm khác"){
        item["otherReagent"] = true
      }else{
        item["otherReagent"] = false
      }
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
              eQAResultReportDetail.sCOvalue = 0;
              eQAResultReportDetail.result = '';
              details.push(eQAResultReportDetail);
            });
          }
          this.setState({ details });
        });
      });
    }
    this.handleHealthOrgRoundPopupClose();
  }

  selectReagent = (reagent) => {
    if (reagent != null && reagent.id != null) {
      this.setState({ reagent: reagent }, function () {
      });
    }
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
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let {
      id,
      isRoleAdmin,
      isViewButton,
      healthOrgRound,
      reagentLot,
      reagent,
      technician,
      reagentExpiryDate,
      orderTest,
      otherReagent,
      supplyOfReagent,
      personBuyReagent,
      dateSubmitResults,
      reagentUnBoxDate,
      details,
      noteOtherReagent,
      listHealthOrgRound,
      hasErrorResult,
      testDate, note,
      shouldOpenHealthOrgRoundPopup,
      isFinalResult, isView
    } = this.state;

    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    let technicianSearchObject = { pageIndex: 0, pageSize: 1000000, searchByHealthOrg: true, healthOrg: (healthOrgRound && healthOrgRound.healthOrg && healthOrgRound.healthOrg.id) ? { id: healthOrgRound.healthOrg.id } : null };

    let columns = [
      {
        title: t("EQAResultReportEclia.sample_code"), 
        field: "sampleTube.code", 
        align: "left", 
        width: "50",
        headerStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("EQAResultReportEclia.sCOvalue"),
        field: "sCOvalue",
        width: "50",
        headerStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData =>
          <TextValidator
            className="w-40"
            onChange={sCOvalue => this.handleRowDataCellChange(rowData, sCOvalue)}
            type="number"
            name="sCOvalue"
            value={rowData.sCOvalue ? rowData.sCOvalue : ''}
            disabled={true}
            step={0.0001}
          />
      },
      {
        title: t("EQAResultReportEclia.result"), 
        field: "result", 
        align: "left", 
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData =>
          <FormControl className="w-80" error={hasErrorResult}>
            <Select
              value={rowData.result}
              disabled={true}
              onChange={result => this.handleRowDataCellChange(rowData, result)}
              inputProps={{
                name: "result",
                id: "result-simple"
              }}
            >
              {/* <MenuItem value=''><em>None</em> </MenuItem> */}
              <MenuItem value={LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented}>{t("EQAResultReportElisa.Result.none")}</MenuItem>
              <MenuItem value={LocalConstants.EQAResultReportDetail_TestValue.negative}>{t("EQAResultReportElisa.Result.negative")}</MenuItem>
              <MenuItem value={LocalConstants.EQAResultReportDetail_TestValue.indertermine}>{t("EQAResultReportElisa.Result.indertermine")}</MenuItem>
              <MenuItem value={LocalConstants.EQAResultReportDetail_TestValue.positive}>{t("EQAResultReportElisa.Result.positive")}</MenuItem>
            </Select>
            {hasErrorResult && <FormHelperText>This is required!</FormHelperText>}
          </FormControl>
      },
      {
        title:t("SampleManagement.serum-bottle.note"),
        field: "note",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData =>
          <TextValidator
            className="w-100"
            onChange={note => this.handleRowDataCellChange(rowData, note)}
            type="textarea"
            disabled={true}
            multiLine
            rowsMax={4}
            name="note"
            value={rowData.note ? rowData.note : ''}
            // disabled={isRoleAdmin}
          />
      }
    ];
    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'lg'} fullWidth={true} >
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
            <Grid container spacing={2}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Autocomplete
                  disabled={true}
                  size="small"
                  options={listHealthOrgRound}
                  className="flex-end"
                  getOptionLabel={(option) => option.healthOrg.name}
                  onChange={(event, healthOrgRound) => this.handleSelectHealthOrgRound(healthOrgRound)}
                  value={healthOrgRound}
                  renderInput={(params) => <TextField {...params}
                    disabled={true}
                    label={<span className="font">{t('EQAResultReportElisa.healthOrgName')}</span>}
                    variant="outlined"
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
                  size="small"
                  variant = "outlined"
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
                    id="mui-pickers-date"
                    label={<span className="font">{t('EQAResultReportEclia.testDate')}</span>}
                    inputVariant="outlined"
                    size="small"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    value={testDate}
                    disabled={true}
                    onChange={date => this.handleDateChange(date, "testDate")}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  variant = "outlined"
                  className="w-100"
                  label={<span className="font">{t("EQAResultReportElisa.technician")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="technician"
                  value={technician}
                  disabled={true}
                />
            </Grid>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <AsynchronousAutocomplete label={<span className="font">{t("EqaResult.reagent")}</span>}
                  size="small"
                  variant = "outlined"
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
                  label={<span className="font">{t("EQAResultReportEclia.reagentLot")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  variant = "outlined"
                  size="small"
                  name="reagentLot"
                  value={reagentLot}
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
                    id="mui-pickers-date"
                    label={<span className="font">{t('EQAResultReportEclia.reagentExpiryDate')}</span>}
                    inputVariant="outlined"
                    size="small"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    value={reagentExpiryDate}
                    disabled={true}
                    onChange={date => this.handleDateChange(date, "reagentExpiryDate")}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disabled={true}
                    fullWidth
                    margin="none"
                    id="mui-pickers-reagentUnBoxDate"
                    label={<span className="font">{t('EQAResultReportEclia.reagentUnBoxDate')}</span>}
                    inputVariant="outlined"
                    size="small"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    value={reagentUnBoxDate}
                    //   disabled={isView}
                    onChange={date => this.handleDateChange(date, "reagentUnBoxDate")}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">{t("EQAResultReportEclia.supplyOfReagent")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="supplyOfReagent"
                  value={supplyOfReagent}
                  size="small"
                  variant = "outlined"
                  disabled={true}
                />
              </Grid>
              <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAResultReportEclia.personBuyReagent")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="personBuyReagent"
                  value={personBuyReagent}
                  size="small"
                  variant = "outlined"
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
                  />
                </MuiPickersUtilsProvider>
              </Grid>)}
              <Grid item lg={3} md={3} sm={12} xs={12}>

                <FormControlLabel
                  disabled={true}
                  label={<span className = "font" style={{ fontWeight: "bold" }}> {t('EQAResultReportFastTest.isFinalResult')}</span>}
                  control={<Checkbox checked={isFinalResult}
                    onClick={(isFinalResult) =>
                      this.notificationFinalResult(isFinalResult)
                      // this.handleChange(isFinalResult, 'isFinalResult')
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
                  variant = "outlined"
                  size="small"
                  value={note}
                  disabled={true}
                />
              </Grid>
              {otherReagent && (<Grid item lg={12} md ={12} sm={12} xs={12}>
                <TextValidator
                  disabled ={isRoleAdmin}
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

              <Grid item xs={12}>
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
                      <div style={{ witdth: "100%" }}>
                        <MTableToolbar {...props} />
                      </div>
                    ),
                  }}
                  onSelectionChange={(rows) => {
                    this.data = rows;
                  }}
                  localization={{
                    body: {
                      emptyDataSourceMessage: `${t(
                        "general.emptyDataMessageTable"
                      )}`,
                    },
              }}
                />
              </Grid>
            </Grid>

          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button variant="contained" color="secondary" type="button" onClick={() => handleClose()}> {t('general.close')}</Button>
            {/* {((!isView || isRoleAdmin) && <Button variant="contained" disabled={isViewButton} color="primary" type="submit" >
              {t('Save')}
            </Button>
            )} */}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQAResultReportViewDialog;
