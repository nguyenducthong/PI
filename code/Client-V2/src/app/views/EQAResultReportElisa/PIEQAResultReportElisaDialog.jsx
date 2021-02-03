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
  technicianSearchByPage,
  saveItem,
  checkReagentByHealthOrgRound,
  getEQASampleTubeByHealthOrgEQARoundId
} from "./EQAResultReportElisaService";
import Autocomplete from '@material-ui/lab/Autocomplete';
import ConstantList from "../../appConfig";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import HealthOrgEQARoundPopup from "../Component/HealthOrgEQARound/HealthOrgEQARoundPopup";
import { searchByPage as reagentSearchByPage } from "../Reagent/ReagentService";
import Draggable from 'react-draggable';
import { Breadcrumb, ConfirmationDialog } from "egret";
import { MuiPickersUtilsProvider, KeyboardDatePicker,KeyboardDateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import LocalConstants from "./Constants";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getCurrentUser,getListHealthOrgByUser} from "../User/UserService";
import '../../../styles/views/_loadding.scss';
import '../../../styles/views/_style.scss';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit:3
});
// function PaperComponent(props) {
//   return (
//     <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
//       <Paper {...props} />
//     </Draggable>
//   );
// }
function MaterialButton(props) {
  const item = props.item;
  return <div>
    <IconButton onClick={() => props.onSelect(item)}>
      <Icon color="error">delete</Icon>
    </IconButton>
  </div>;
}

function TableODColumn(props) {
  let item = props.item;
  return <div>
    <TextField
      disabled={props.isView}
      className="w-80"
      onChange={(event) => props.onChange(event, item)}
      type="number"
      value={item.oDvalue}
      name="itemODvalue"
    />
  </div>;
}

function TableCOColumn(props) {
  let item = props.item;
  return <div>
    <TextField
      disabled={props.isView}
      className="w-80"
      value={item.cutOff}
      onChange={(event) => props.onChange(event, item)}
      type="number"
      name="itemcutOff"
    />
  </div>;
}

function TableODDeviceCOColumn(props) {

  let item = props.item;
  return <div>
    <TextField
      disabled={props.isView}
      className="w-80"
      value={item.ratioOdAndCutOff}
      type="number"
      name="itemRatioOdAndCutOff"
    />
  </div>;
}

function TableResultColumn(props) {
  const { t, i18n } = useTranslation();
  let item = props.item;
  return <div>
    <FormControl className="w-100">
      <Select
        disabled={props.isView}
        value={item.result}
        onChange={(event) => props.onChange(event, item)}
        inputProps={{
          name: "result",
        }}
      >
        {/* <MenuItem value=''><em>None</em> </MenuItem> */}
        <MenuItem value={LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented}>{t("EQAResultReportElisa.Result.none")}</MenuItem>
        <MenuItem value={LocalConstants.EQAResultReportDetail_TestValue.negative}>{t("EQAResultReportElisa.Result.negative")}</MenuItem>
        <MenuItem value={LocalConstants.EQAResultReportDetail_TestValue.indertermine}>{t("EQAResultReportElisa.Result.indertermine")}</MenuItem>
        <MenuItem value={LocalConstants.EQAResultReportDetail_TestValue.positive}>{t("EQAResultReportElisa.Result.positive")}</MenuItem>
      </Select>
    </FormControl>
  </div>;
}
function TableNoteColumn(props) {
  let item = props.item;
  return <div>

  </div>;
}
class PIEQAResultReportElisaDialog extends Component {
  state = {
    rowsPerPage: 1000,
    page: 0,
    // isView: false,
    typeMethod: 1, healthOrg: [],
    listHealthOrgRound: [],
    reagent: null,
    technician: null,
    details: [],
    healthOrg: null,
    reagentExpiryDate: null,
    testDate: new Date(),
    reagentUnBoxDate: null,
    roundLists: [],
    eqaRoundRegister: [],
    roundId: "",
    listReagent: [],
    reagentId: '',
    healthOrgRound: null,
    round: null,
    orderTest: '',
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenHealthOrgRoundPopup: false,
    // isCheck:false,
    isViewButton:false,
    isFinalResult:false,
    isRoleAdmin:false,
    typeMethod: 1, loading: false
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }
  handleDialogClose =()=>{
    this.setState({shouldOpenConfirmationDialog: false,})
  }
  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    if(source === "isFinalResult"){
      this.setState({isFinalResult:event.target.checked})
    }
    this.setState({
      [event.target.name]: event.target.value
    });

  };

  handleRowDataCellChange = (rowData, event) => {
    let {details} = this.state;
    let { t } = this.props;
    if (details != null && details.length > 0) {
      details.forEach(element =>{
        if(element.tableData != null && rowData != null && rowData.tableData != null &&  element.tableData.id == rowData.tableData.id){
          if(event.target.name == "oDvalue"){
            if(element.oDvalue == ''){
              element.cutOff = '';
              element.ratioOdAndCutOff = '';
              element.result = '';
            }
            element.oDvalue = event.target.value;
            if(parseFloat(element.cutOff) > 0 && parseFloat(element.oDvalue)>0){
             element.ratioOdAndCutOff = (parseFloat(element.oDvalue) / parseFloat(element.cutOff)).toFixed(2);
            }
          }else if(event.target.name == "cutOff"){
            if(element.oDvalue =="" ||element.oDvalue == null){
              toast.warning(t("EQAResultReportElisa.notODvalue"))
              return
            }
            element.cutOff = event.target.value;
            if (parseFloat(element.cutOff) > 0 && parseFloat(element.oDvalue) > 0) {
              element.ratioOdAndCutOff = (parseFloat(element.oDvalue) / parseFloat(element.cutOff)).toFixed(2);
            }
          }else if(event.target.name == "result"){
            if(event.target.value !== LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented && (element.oDvalue ==='' || element.oDvalue === null)){
              toast.warning(t("EQAResultReportElisa.notODvalue"))
              element.result = null
              return
            }
            if(event.target.value === LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented){
              element.oDvalue = '';   
              element.cutOff = '';
              element.ratioOdAndCutOff = '';
            }
            
            element.result = event.target.value;
          } else if(event.target.name == "note"){
            element.note =  event.target.value
          }
        }
      });//forEach
      this.setState({ details: details });
    }
  };
  openCircularProgress =   () => {
    this.setState({ loading: true });
  };

  // handleSubmit = async () => {
  //   await this.openCircularProgress();
  //   var time = setTimeout(() => {
  //     this.handleFormSubmit()
  //   }, 500);
  // }

  handleFormSubmit = async  () => {
    await this.openCircularProgress();
    let { t } = this.props;
    let isCheck = false;
    let { id,details, healthOrgRound, reagent, typeMethod } = this.state;
    if(ConstantList.CHECK_HEALTH_ORG){
      checkReagentByHealthOrgRound(id, healthOrgRound.id, reagent.id, typeMethod).then(res =>{
        if(res.data){
          toast.warning(t("EqaResult.dulicateReagent"));
          this.setState({loading:false});
        }else{
          details.forEach(el=>{
            if(el.result === null || el.result === ""){
              isCheck = true
            }
          })
          if(isCheck){
            toast.warning(t("EQAResultReportElisa.notResult"));
            this.setState({loading:false});
            return
          }
          if (id) {
          this.setState({isView: true,isRoleAdmin:false, isViewButton: true})
            saveItem({
              ...this.state
            }).then(() => {
              this.props.handleOKEditClose();
              toast.success(t('mess_edit'));
              this.setState({loading:false});
            }).catch(() =>{
              toast.warning(t("mess_edit_error"));
              this.setState({isView: false, isViewButton: false, loading: false});
            });
            
          }
          else {
            this.setState({isView: true,isRoleAdmin:false, isViewButton: true})
            saveItem({
              ...this.state
            }).then(() => {
              this.props.handleOKEditClose();
              toast.success(t('mess_add'));
              this.setState({loading:false})
            }).catch(() =>{
              toast.warning(t("mess_add_error"));
              this.setState({isView: false, isViewButton: false, loading: false});
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
        toast.warning(t("EQAResultReportElisa.notResult"));
        this.setState({loading:false});
        return
      }
      if (id) {
      this.setState({isView: true,isRoleAdmin:false, isViewButton: true})
        saveItem({
          ...this.state
        }).then(() => {
          this.props.handleOKEditClose();
          toast.success(t('mess_edit'));
          this.setState({loading:false})
        }).catch(() =>{
          toast.warning(t("mess_edit_error"));
          this.setState({isView: false, isViewButton: false, loading: false});
        });
        
      }
      else {
        this.setState({isView: true,isRoleAdmin:false, isViewButton: true})
        saveItem({
          ...this.state
        }).then(() => {
          this.props.handleOKEditClose();
          toast.success(t('mess_add'));
          this.setState({loading:false})
        }).catch(() =>{
          toast.warning(t("mess_add_error"));
          this.setState({isView: false, isViewButton: false, loading: false});
        });
      }
    }
  }

  componentWillMount() {
    let { open, handleClose, item,isView,isRoleAdmin } = this.props;
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
    if(item.listHealthOrgRound != null){
      this.setState({ listHealthOrgRound: item.listHealthOrgRound,
      healthOrgRound: item.listHealthOrgRound[0]},() =>{
        this.handleSelectHealthOrgRound(this.state.healthOrgRound);
      });
    }
    this.setState({
      ...item,
    }, function () {
    });
  }

  handleDateChange = (date, name) => {
    this.setState({
      [name]: date
    });
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

  handleSelectHealthOrgRound = healthOrgRound => {
    if (healthOrgRound != null && healthOrgRound.id != null) {
      this.setState({ healthOrgRound: healthOrgRound }, function () {
        let { healthOrgRound, details } = this.state;
        details = [];
        getEQASampleTubeByHealthOrgEQARoundId(healthOrgRound.id).then((result) => {
          let listEQASampleTube = result.data;
          if (listEQASampleTube != null && listEQASampleTube.length > 0) {
            listEQASampleTube.forEach(tube => {
              let eQAResultReportDetail = {};
              eQAResultReportDetail.sampleTube = tube;
              if (tube.eqaSampleSetDetail && tube.eqaSampleSetDetail.orderNumber) {
                eQAResultReportDetail.orderNumber = tube.eqaSampleSetDetail.orderNumber;
              }
              eQAResultReportDetail.cutOff = '';
              eQAResultReportDetail.oDvalue = '';
              eQAResultReportDetail.ratioOdAndCutOff = '';
              eQAResultReportDetail.result = '';
              details.push(eQAResultReportDetail);
            });
          }
          this.setState({ details });
        });
      });
    }
    // this.handleHealthOrgRoundPopupClose();
  }
  notificationFinalResult =()=>{
    this.setState({shouldOpenConfirmationDialog:true})
  }
  handleFinalResult =()=>{
    if(this.state.isFinalResult == null || !this.state.isFinalResult){
      this.setState({isFinalResult:true, dateSubmitResults: new Date() },()=>{
      })
      this.handleDialogClose();
      return
    }
    if(this.state.isFinalResult){
      this.setState({isFinalResult:false, dateSubmitResults: new Date() },()=>{
      })
      this.handleDialogClose();
      return
    }
  }
  handleDialogFinalResultClose = ()=>{
    // this.setState({isFinalResult:false},()=>{
    // })
    this.handleDialogClose()
  }
  render() {
    let {
      isRoleAdmin,
      isView,
      isViewButton,
      isCheck,
      id,
      item,
      supplyOfReagent,
      shouldOpenHealthOrgRoundPopup,
      personBuyReagent,
      reagent,
      listHealthOrgRound,
      reagentLot,
      orderTest,
      reagentExpiryDate,
      testDate,
      otherReagent,
      technician,
      noteOtherReagent,
      healthOrgRound,
      incubationTemp,
      incubationPeriod,
      incubationTempWithPlus,
      incubationPeriodWithPlus,
      incubationTempWithSubstrate,
      incubationPeriodWithSubstrate,dateSubmitResults,
      details,note,isFinalResult,isManagementUnit,
      reagentUnBoxDate, loading
    } = this.state;
    let searchObject = { pageIndex: 0, pageSize: 1000000, testType: 1 };
    let technicianSearchObject = { pageIndex: 0, pageSize: 1000000, searchByHealthOrg: true, healthOrg: (healthOrgRound && healthOrgRound.healthOrg && healthOrgRound.healthOrg.id) ? { id: healthOrgRound.healthOrg.id } : null };

    let { open, handleClose, classes, t, i18n } = this.props;
    let columns = [
      { title: t("EQAResultReportElisa.sampleCode"), field: "sampleTube.code", width: "150px" },
      {
        title: t("EQAResultReportElisa.ODvalue"),
        field: "oDvalue",
        align: "left", width: "200px",
       render: rowData => <TextValidator
          disabled={isView}
          className="w-80"
          onChange={(oDvalue) => this.handleRowDataCellChange(rowData, oDvalue)}
          type="number"
          value={rowData.oDvalue ? rowData.oDvalue: ''}
          name="oDvalue"
          validators={['isFloat']}  
          errorMessages={t('general.isFloat')}   
          step={0.0001}
        />
      },
      {
        title: t("EQAResultReportElisa.cutOff"),
        field: "cutOff",
        align: "left",
        width: "200px",
        render: rowData => 
          <TextValidator
            disabled={isView}
            className="w-80"
            value={rowData.cutOff ? rowData.cutOff : ''}
            onChange={(cutOff) => this.handleRowDataCellChange(rowData, cutOff)}
            type="number"
            name="cutOff"
            validators={['isFloat']}  
            errorMessages={t('general.isFloat')}   
            step = {0.0001}
        />
      },
      {
        title: t("EQAResultReportElisa.ratioOdAndCutOff"),
        field: "ratioOdAndCutOff",
        align: "left",
        width: "200px",
        render: rowData => 
        // <TableODDeviceCOColumn item={rowData} isView={isView} />
          <TextValidator
            disabled={isView}
            className="w-80"
            value={rowData.ratioOdAndCutOff ? rowData.ratioOdAndCutOff : ''}
            type="number"
            name="itemRatioOdAndCutOff"
            validators={['isFloat']}  
            errorMessages={t('general.isFloat')}   
            step = {0.0001}
        />
      },
      {
        title:<span><span style={{ color: "red" }}> * </span>
        { t("EQAResultReportElisa.Result.title")}
      </span>,
        field: "result",
        width: "200px",
        render: rowData => 
          <FormControl className="w-100">
            <Select
              disabled={isView}
              value={rowData.result}
              onChange={(result) => this.handleRowDataCellChange(rowData, result)}
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
            disabled={isRoleAdmin}
          />
      }
    ];
    return (
      <Dialog open={open}  maxWidth={"lg"} scroll={'paper'} >
        <div className={clsx("wrapperButton", !loading && 'hidden')} >
          <CircularProgress className="buttonProgress" size={24} />
        </div>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
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
                text={isFinalResult? t("EqaResult.unFinalResultConfirm"):t("EqaResult.FinalResultConfirm")}
                Yes={t("general.Yes")}
                No={t("general.No")}
              />
            )}
            <Grid container spacing={2}>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Autocomplete
                  size="small"
                  id="combo-box"
                  options={listHealthOrgRound}
                  className="flex-end"
                  getOptionLabel={(option) => option.healthOrg.name}
                  onChange={(event, healthOrgRound)=> this.handleSelectHealthOrgRound(healthOrgRound)}
                  value={healthOrgRound}
                  renderInput={(params) => <TextField {...params}
                    label={<span className="font">{t('EQAResultReportElisa.healthOrgName')}</span>}
                    variant = "outlined"
                  />}
                />
              </Grid>
                  
              <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  variant = "outlined"
                  className="w-100"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EQAResultReportElisa.order")}
                    </span>
                    }
                  onChange={this.handleChange}
                  type="text"
                  name="orderTest"
                  value={orderTest}
                  disabled={isView}
                  validators={["required"]}
                  errorMessages={t('general.errorMessages_required')}
                />
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    size="small"
                    className="w-100"
                    margin="none"
                    id="mui-pickers-testDate"
                    label={<span className="font">{t("EQAResultReportElisa.testDate")}</span>}
                    inputVariant="outlined"
                    type="text"
                    autoOk={true}
                    format="dd/MM/yyyy"
                    value={new Date(testDate)}
                    disabled={isView}
                    onChange={date => this.handleDateChange(date, "testDate")}
                    fullWidth
                    validators={["required"]}
                    errorMessages={t('general.errorMessages_required')}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <AsynchronousAutocomplete label={<span className="font">{t("EQAResultReportElisa.technician")}</span>}
                  size="small"
                  variant = "outlined"
                  disabled={isView}
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
                <AsynchronousAutocomplete 
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EqaResult.reagent")}
                    </span>
                    }
                  size="small"
                  variant = "outlined"
                  disabled={isView}
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
                  size="small"
                  variant = "outlined"
                  className="w-100"
                  label={
                    <span className= "font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EQAResultReportElisa.reagentLot")}
                    </span>
                    }
                  onChange={this.handleChange}
                  type="text"
                  name="reagentLot"
                  value={reagentLot}
                  disabled={isView}
                  validators={["required"]}
                  errorMessages={t('general.errorMessages_required')}
                />
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    size="small"
                    fullWidth
                    margin="none"
                    id="mui-pickers-reagentExpiryDate"
                    label={<span className="font">{t('EQAResultReportElisa.reagentExpiryDate')}</span>}
                    inputVariant="outlined"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    value={reagentExpiryDate}
                    disabled={isView}
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
                    label={<span className="font">{t('EQAResultReportElisa.reagentUnBoxDate')}</span>}
                    inputVariant="outlined"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    value={reagentUnBoxDate}
                    disabled={isView}
                    onChange={date => this.handleDateChange(date, "reagentUnBoxDate")}
                  />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  variant = "outlined"
                  className="w-100"
                  label={<span className="font">{t("EQAResultReportElisa.supplyOfReagent")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="supplyOfReagent"
                  value={supplyOfReagent}
                  disabled={isView}
                />
              </Grid>

              <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  variant = "outlined"
                  className="w-100 "
                  label={<span className="font">{t("EQAResultReportElisa.personBuyReagent")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="personBuyReagent"
                  value={personBuyReagent}
                  disabled={isView}
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
                        label={<span className="font" style={{ fontWeight : "bold"}}> {t('EQAResultReportFastTest.isFinalResult')}</span>}
                      control={<Checkbox checked={isFinalResult}
                      onClick={(isFinalResult) =>
                        this.notificationFinalResult(isFinalResult)
                      // this.handleChange(isFinalResult, 'isFinalResult')
                        }
                        />}
                        
                      />
              </Grid>
              <Grid item lg={12} md ={12} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">{t("SampleManagement.serum-bottle.note")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  variant = "outlined"
                  size="small"
                  name="note"
                  value={note}
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
              <Grid item sm={12} xs={12}>
                <MaterialTable
                  title={""}
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
                      color:'#fff',
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
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button variant="contained" className="" color="secondary" onClick={() => handleClose()}> {t('Cancel')}</Button>
            {((!isView || isRoleAdmin || isManagementUnit) && <Button variant="contained" disabled={isViewButton} color="primary" type="submit" >
              {t('Save')}
            </Button>
            )}
            {((!isView || isRoleAdmin || isManagementUnit) && <Button variant="contained" disabled={isViewButton} color="primary" type="submit" >
              {t('Gửi kết quả')}
            </Button>
            )}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default PIEQAResultReportElisaDialog;
