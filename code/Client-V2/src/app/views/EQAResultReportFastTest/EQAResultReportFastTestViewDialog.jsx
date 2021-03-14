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
  InputAdornment,
  MenuItem,
  Checkbox,Select,
  FormControlLabel
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  saveItem,
  checkReagentByHealthOrgRound,
  getEQASampleTubeByHealthOrgEQARoundId
} from "./EQAResultReportFastTestService";
import Autocomplete from '@material-ui/lab/Autocomplete';
import ConstantList from "../../appConfig";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import HealthOrgEQARoundPopup from "../Component/HealthOrgEQARound/HealthOrgEQARoundPopup";
import { searchByPage as reagentSearchByPage } from "../Reagent/ReagentService";
import Draggable from 'react-draggable';
import { Breadcrumb, ConfirmationDialog } from "egret";
import { MuiPickersUtilsProvider, DateTimePicker,KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import LocalConstants from "./Constants";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_style.scss';
import {getCurrentUser,getListHealthOrgByUser} from "../User/UserService"

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit:3
});
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

class EQAResultReportFastTestViewDialog extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    hasErrorHealthOrgRound: false,
    hasErrorEQARound: false,
    isUsingIQC: false,
    isUsingControlLine: false,
    eqaRound: '',
    healthOrg: null,
    reagentLot: '',
    orderTest: '',
    reagent: null,
    technician: null,
    personBuyReagent: '',
    details: [],
    supplyOfReagent: '',
    timeToResult: '',
    round: null,
    reagentExpiryDate: null,
    testDate: new Date(),
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenSearchEQASampleSearchDialog: false,
    listHealthOrgRound: [],
    listReagent: [],
    listEQARound: [],
    shouldOpenHealthOrgRoundPopup: false,
    isView: false,
    reagentUnBoxDate: new Date(),
    isFinalResult:false,
    dateSubmitResults: null,
    typeMethod: 2,
    isViewButton: false
  };

  //positive(1),//Dương tính
  //indertermine(0),//Không xác định
  //negative(-1),//Âm tính
  //none(-2)//Không thực hiện
  Results = [
    { id: LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented, name: "Không thực hiện" },
    { id: LocalConstants.EQAResultReportDetail_TestValue.negative, name: "Âm tính" },
    { id: LocalConstants.EQAResultReportDetail_TestValue.positive, name: "Dương tính" }
  ];

  listResult_C_T_Line = [
    { id: LocalConstants.EQAResultReportDetail_TestValue.positive, name: "Dương tính" },
    { id: LocalConstants.EQAResultReportDetail_TestValue.negative, name: "Âm tính" }
  ];

  listChooseBoolean = [
    { id: 0, value: false, name: "Không" },
    { id: 1, value: true, name: "Có" }
  ];

  handleDateChange = (date, name) => {
    this.setState({
      [name]: date
    });
  };

  handleChooseBooleanChange = (value, name) => {
    this.setState({
      [name]: value.target.value
    });
  };

  handleChange = (event, source) => {
  
  };

  handleRowDataCellChange = (rowData, event) => {
    let { details } = this.state;
 
  };

  handleFormSubmit = () => {
    let { t } = this.props;
    let isCheck = false;
    let { id,details, healthOrgRound, reagent, typeMethod } = this.state;
    if(ConstantList.CHECK_ERROR_RESULT){
      checkReagentByHealthOrgRound(id, healthOrgRound.id, reagent.id, typeMethod).then(res =>{
        if(res.data){
          toast.warning(t("EqaResult.dulicateReagent"))
        }else{
          details.forEach(el=>{
            if(el.result === null || el.result === ""){
              isCheck = true
            }
          })
          if(isCheck){
            toast.warning(t("EQAResultReportElisa.notResult"))
            return
          }
          if (id) {
            this.setState({isView: true,isRoleAdmin:false, isViewButton: true});
            saveItem({
              ...this.state
            }).then(() => {
              this.props.handleOKEditClose();
              toast.success(t('mess_edit'));
            }).catch(() =>{
              toast.warning(t("mess_edit_error"));
              this.setState({isView: false, isViewButton: false});
            });
          }
          else {
            this.setState({isView: true,isRoleAdmin:false, isViewButton: true});
            saveItem({
              ...this.state
            }).then(() => {
              this.props.handleOKEditClose();
              toast.success(t('mess_add'));
            }).catch(() =>{
              toast.warning(t("mess_add_error"));
              this.setState({isView: false, isViewButton: false});
            });
          }
        }})
    }else{
      details.forEach(el=>{
        if(el.result === null || el.result === ""){
          isCheck = true
        }
      })
      if(isCheck){
        toast.warning(t("EQAResultReportElisa.notResult"))
        return
      }
      if (id) {
        this.setState({isView: true,isRoleAdmin:false, isViewButton: true});
        saveItem({
          ...this.state
        }).then(() => {
          this.props.handleOKEditClose();
          toast.success(t('mess_edit'));
        }).catch(() =>{
          toast.warning(t("mess_edit_error"));
          this.setState({isView: false, isViewButton: false});
        });
      }
      else {
        this.setState({isView: true,isRoleAdmin:false, isViewButton: true});
        saveItem({
          ...this.state
        }).then(() => {
          this.props.handleOKEditClose();
          toast.success(t('mess_add'));
        }).catch(() =>{
          toast.warning(t("mess_add_error"));
          this.setState({isView: false, isViewButton: false});
        });
      }
    }
  };

  componentWillMount() {
    let { open, handleClose, item,isRoleAdmin,isView } = this.props;
    if(item != null && item.reagent !=  null && item.reagent.name != null){
      if(item.reagent.name === "Sinh phẩm khác"){
        item["otherReagent"] = true
      }else{
        item["otherReagent"] = false
      }
    }
    this.setState({isRoleAdmin:isRoleAdmin,isView:isView})
    if (item && item.details && item.details.length > 0) {
      item.details.sort((a, b) => (a.orderNumber > b.orderNumber) ? 1 : (a.orderNumber === b.orderNumber) ? ((a.sampleTube.code > b.sampleTube.code) ? 1 : -1) : -1);
    }
    if(item.listHealthOrgRound != null){
      this.setState({ listHealthOrgRound: item.listHealthOrgRound,
      healthOrgRound: item.listHealthOrgRound[0]},() =>{
        this.handleSelectHealthOrgRound(this.state.healthOrgRound);
      });
    }
    this.setState({
      ...item
    }, function () {
    });
  }

  handleSearchDialogClose = () => {
    this.setState({
      shouldOpenSearchDialog: false
    });
  };

  handleSearchEQARoundDialogClose = () => {
    this.setState({
      shouldOpenSearchEQARoundSearchDialog: false
    });
  };

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
              eQAResultReportDetail.cLine = '';
              eQAResultReportDetail.tLine = '';
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

  handleDialogClose =()=>{
    this.setState({shouldOpenConfirmationDialog:false})
  }

  notificationFinalResult =()=>{
    this.setState({shouldOpenConfirmationDialog:true})
  }

  handleFinalResult =()=>{
    if(this.state.isFinalResult == null || !this.state.isFinalResult){
      this.setState({isFinalResult:true, dateSubmitResults: new Date() },()=>{
      })
      this.handleDialogClose()
    }
    if(this.state.isFinalResult){
      this.setState({isFinalResult:false, dateSubmitResults: new Date() },()=>{
      })
      this.handleDialogClose()
    }
  }
  handleDialogFinalResultClose = ()=>{
    this.handleDialogClose()
  }

  render() {
    const { classes } = this.props;
    const { selected, hasErrorHealthOrgRound, hasErrorEQARound } = this.state;
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let {
      isView,
      isViewButton,
      isUsingIQC,
      dateSubmitResults,
      isUsingControlLine,
      healthOrgRound,
      healthOrg,
      reagentLot,
      otherReagent,
      noteOtherReagent,
      orderTest,
      reagent,
      technician,
      reagentExpiryDate,
      personBuyReagent,
      details,
      listHealthOrgRound,
      supplyOfReagent,
      testDate,
      timeToResult,
      round,
      listReagent,
      shouldOpenHealthOrgRoundPopup,
      reagentUnBoxDate,note,isFinalResult,isRoleAdmin
    } = this.state;

    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    let searchObjectHealthOrgRound = { pageIndex: 0, pageSize: 1000000, round: round };
    let technicianSearchObject = { pageIndex: 0, pageSize: 1000000, searchByHealthOrg: true, healthOrg: (healthOrgRound && healthOrgRound.healthOrg && healthOrgRound.healthOrg.id) ? { id: healthOrgRound.healthOrg.id } : null };
    let columns = [
      {
        title: t("EQAResultReportFastTest.sample_list.sample_code"), field: "sampleTube.code", align: "left", width: "150"
      },
      {
        title: t("EQAResultReportFastTest.cLine"),
        field: "cLine",
        width: "150",
        render: rowData =>
          <FormControl className="w-80">
            <Select
              value={rowData.cLine}
              disabled={true}
              onChange={cLine => this.handleRowDataCellChange(rowData, cLine)}
              inputProps={{
                name: "cLine",
                id: "cLine-simple"
              }}
            >
              {this.listResult_C_T_Line.map(item => {
                return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
      },
      {
        title: t("EQAResultReportFastTest.tLine"),
        field: "tLine",
        width: "150",
        render: rowData =>
          <FormControl className="w-80" disabled={isView}>
            <Select
            disabled={true}
              value={rowData.tLine}
              onChange={tLine => this.handleRowDataCellChange(rowData, tLine)}
              inputProps={{
                name: "tLine",
                id: "tLine-simple"
              }}
            >
              {/* <MenuItem value=''><em>None</em> </MenuItem> */}
              {this.listResult_C_T_Line.map(item => {
                return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
      },
      {
        title: t("EQAResultReportFastTest.sample_list.result"), field: "result", align: "left", width: "150",
        render: rowData =>
          <FormControl className="w-80">
            <Select
              value={rowData.result}
              disabled={true}
              onChange={result => this.handleRowDataCellChange(rowData, result)}
              inputProps={{
                name: "result",
                id: "result-simple"
              }}
            >
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
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'lg'} fullWidth={true}  >
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            <span className="mb-20">{t("SaveUpdate")}</span>
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
                text={isFinalResult? t("EqaResult.unFinalResultConfirm"):t("EqaResult.FinalResultConfirm")}
                Yes={t("general.Yes")}
                No={t("general.No")}
              />
            )}
          <DialogContent dividers>
            <Grid className="" container spacing={2}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Autocomplete
                  size="small"
                  id="combo-box"
                  options={listHealthOrgRound}
                  className="flex-end"
                  disabled = {true}
                  getOptionLabel={(option) => option.healthOrg.name}
                  onChange={(event, healthOrgRound)=> this.handleSelectHealthOrgRound(healthOrgRound)}
                  value={healthOrgRound}
                  renderInput={(params) => <TextField {...params}
                    label={<span className= "font">{t('EQAResultReportElisa.healthOrgName')}</span>}
                    disabled={true}
                    variant="outlined"
                    size="small"
                  />}
                />
              </Grid>
              <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className= "font">{t("EQAResultReportFastTest.order")}</span>}
                  onChange={this.handleChange}
                  type="number"
                  name="orderTest"
                  value={orderTest ? orderTest : ''}
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
                    inputVariant ="outlined"
                    margin="none"
                    id="mui-pickers-date"
                    label={<span className= "font">{t('EqaResult.testDate')}</span>}
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    value={testDate}
                    size="small"
                    disabled={true}
                    onChange={date => this.handleDateChange(date, "testDate")}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              
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
                  disabled={isView }
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <AsynchronousAutocomplete label={<span className= "font">{t("EqaResult.reagent")}</span>}
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
                  className="w-100 "
                  label={<span className= "font">{t("EQAResultReportFastTest.reagentLot")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="reagentLot"
                  value={reagentLot ? reagentLot : ''}
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
                    id="mui-pickers-date"
                    label={<span className= "font">{t('EQAResultReportFastTest.reagentExpiryDate')}</span>}
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
                    size="small"
                    fullWidth
                    margin="none"
                    id="mui-pickers-reagentExpiryDate"
                    label={<span className= "font">{t('EQAResultReportElisa.reagentUnBoxDate')}</span>}
                    inputVariant="outlined"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    value={reagentUnBoxDate}
                    disabled={true}
                    onChange={date => this.handleDateChange(date, "reagentUnBoxDate")}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className= "font">{t("EQAResultReportFastTest.supplyOfReagent")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="supplyOfReagent"
                  value={supplyOfReagent ? supplyOfReagent : ''}
                  variant="outlined"
                  size="small"
                  disabled={true}
                />
              </Grid>
              <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className= "font">{t("EQAResultReportFastTest.personBuyReagent")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="personBuyReagent"
                  value={personBuyReagent ? personBuyReagent : ''}
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
                    disabled = {true}
                    id="mui-pickers-dateSubmitResults"
                    label={<span className= "font">{t('EQAResultReportElisa.dateSubmitResults')}</span>}
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
                    variant="outlined"
                    size="small"
                    disabled = {true}
                     label={<span style={{ fontWeight : "bold"}}> {t('EQAResultReportFastTest.isFinalResult')}</span>}
                    control={<Checkbox checked={isFinalResult}
                    onClick={(isFinalResult) =>
                    this.notificationFinalResult(isFinalResult)
                    }
                    />}
                  />
              </Grid>
              <Grid item lg={12} md ={12} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className= "font">{t("SampleManagement.serum-bottle.note")}</span>}
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
              <Grid item xs={12} xs={12}>
                <MaterialTable title={""} data={details} columns={columns}
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
                      color:'#fff',
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
                />
              </Grid>
            </Grid>
         
            <div className="flex flex-end flex-middle mt-16">
            </div>
          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button variant="contained" className="mr-16" color="secondary" type="button" onClick={() => handleClose()}> {t('general.close')}</Button>
            {/* {(!isView || isRoleAdmin) && (<Button variant="contained" disabled={isViewButton} color="primary" type="submit" >
              {t('Save')}
            </Button>
            )} */}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQAResultReportFastTestViewDialog;
