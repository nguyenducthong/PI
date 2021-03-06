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
  InputAdornment,
  MenuItem,
  Checkbox,Select,
  FormControlLabel
} from "@material-ui/core";
import {
  technicianSearchByPage,
  saveItem,
  checkReagentByHealthOrgRound,
  getEQASampleTubeByHealthOrgEQARoundId
} from "./EQAResultReportEcliaService";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Autocomplete from '@material-ui/lab/Autocomplete';
import ConstantList from "../../appConfig";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import HealthOrgEQARoundPopup from "../Component/HealthOrgEQARound/HealthOrgEQARoundPopup";
import { searchByPage as reagentSearchByPage } from "../Reagent/ReagentService";
import Draggable from 'react-draggable';
import { Breadcrumb, ConfirmationDialog } from "egret";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
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
//     <Draggable handle="#draggable-dialog" cancel={'[class*="MuiDialogContent-root"]'}>
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
      disabled={props.isRoleAdmin}
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
      disabled={props.isRoleAdmin}
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
      disabled={props.isRoleAdmin}
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
        disabled={props.isRoleAdmin}
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
class EQAResultReportElisaInformation extends Component {
  state = {
    isRoleAdminButton: false,
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
    testDate: null,
    reagentUnBoxDate: null,
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmation: false,
    shouldOpenSearchEQASampleSearchDialog: false,
    listHealthOrgRound: [],
    listReagent: [],
    listTechnician: [],
    listEQARound: [],
    isFinalResult: false,
    isRoleAdmin: false,
    typeMethod: 4, loading: false
  };

  constructor(props) {
    super(props);
  }

  handleDateChange = (date, name) => {
    this.setState({
      [name]: date
    });
  }; 

  componentDidMount() {
  }
  handleDialogClose =()=>{
    this.setState({shouldOpenConfirmationDialog: false, shouldOpenConfirmation: false})
  }
  handleChange = (event, source) => {
    let {item} = this.state
    if(item == null){
      item = {}
    }
    let name = event.target.name
    let value = event.target.value
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    if(source === "isFinalResult"){
      item["isFinalResult"] = event.target.checked
      this.setState({item:item})
    }
    item[name] = value
    this.setState({
      item: item
    });

  };

   handleRowDataCellChange = (rowData, event) => {
    let { item } = this.state;
    let { t } = this.props;
    if (item.details != null && item.details.length > 0) {
      item.details.forEach(element => {
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
              } else {
                toast.warning(t("EQAResultReportEclia.notScOvalue"));
              }
            } else {
              if (event.target.value === LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented) {
                element.sCOvalue = '';
              }
              element.result = event.target.value;
            }
          } else if(event.target.name == "note"){
            element.note = event.target.value
          }
        }
      });
      this.setState({ item: item });
    }
  };


  openCircularProgress = () => {
    this.setState({ loading: true });
  };

  componentWillMount() {
    let { open, handleClose, item ,isRoleAdmin, listHealthOrgRound } = this.props;
    if(item != null && item.reagent !=  null && item.reagent.name != null){
      if(item.reagent.name === "Sinh phẩm khác"){
        item["otherReagent"] = true
      }else{
        item["otherReagent"] = false
      }
    }
    this.setState({item: item}, ()=>{
      if(item.listHealthOrgRound != null){
        this.setState({ listHealthOrgRound: item.listHealthOrgRound,
        healthOrgRound: item.listHealthOrgRound[0]},() =>{
          this.handleSelectHealthOrgRound(this.state.healthOrgRound);
        });
      }
    });
    this.setState({isRoleAdmin:isRoleAdmin})

  }

  handleDateChange = (date, name) => {
    let {item} = this.state
    if(item == null){
      item = {}
    }
    item[name] = date
    this.setState({
      item: item
    });
  };

  selectReagent = (reagent) => {
    let {item} = this.state
    
    if(item == null){
      item = {}
    }
    if (reagent != null && reagent.id != null) {
      if(reagent.name === "Sinh phẩm khác"){
        this.setState ({shouldOpenConfirmation: true});
        item["otherReagent"] = true
      }else{
        item["otherReagent"] = false
      }
      item["reagent"] = reagent
      this.setState({ item: item }, function () {
      });
    }
  }

  handleHealthOrgRoundPopupClose = () => {
    this.setState({ shouldOpenHealthOrgRoundPopup: false }, function () {
    });
  }

  handleSelectHealthOrgRound = healthOrgRound => {
    let {item} = this.state
    if(item == null){
      item = {}
    }
    if (healthOrgRound && healthOrgRound.id) {
      item["healthOrgRound"] = healthOrgRound
      this.setState({ item: item }, function () {
        let { item } = this.state;
        let  details = this.state.item?.details;
        details = [];
        getEQASampleTubeByHealthOrgEQARoundId(this.state.item?.healthOrgRound.id).then((result) => {
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
          item["details"] = details
          this.setState({ item:item });
        });
      });
    }
    this.handleHealthOrgRoundPopupClose();
  }
  notificationFinalResult =()=>{
    this.setState({shouldOpenConfirmationDialog:true})
  }
  handleFinalResult =()=>{
    let {item} = this.state
    if(item.isFinalResult == null || !item.isFinalResult){
      item["isFinalResult"] = true;
      item["dateSubmitResults"] = new Date();
      this.setState({item:item },()=>{
      })
      this.handleDialogClose();
      return
    }
    if(item.isFinalResult){
      item["isFinalResult"] = false;
      item["dateSubmitResults"] = null;
      this.setState({item :item },()=>{
      })
      this.handleDialogClose();
      return
    }
  }
  handleDialogFinalResultClose = ()=>{
    this.handleDialogClose()
  }
  render() {
    let {
      isRoleAdmin,
      isCheck,
      id,
      isRoleAdminButton,
      supplyOfReagent,
      shouldOpenHealthOrgRoundPopup,
      personBuyReagent,
      reagent,
      listHealthOrgRound,
      reagentLot,
      orderTest,
      reagentExpiryDate,
      testDate,
      dateSubmitResults,
      technician,
      healthOrgRound,
      incubationTemp,
      incubationPeriod,
      incubationTempWithPlus,
      incubationPeriodWithPlus,
      incubationTempWithSubstrate,
      incubationPeriodWithSubstrate,
      details,note,isFinalResult,isManagementUnit,
      reagentUnBoxDate, loading,item
    } = this.state;
    let searchObject = { pageIndex: 0, pageSize: 1000000, testType: 4 };
    let technicianSearchObject = { pageIndex: 0, pageSize: 1000000, searchByHealthOrg: true, healthOrg: (this.state.item?.healthOrgRound && this.state.item?.healthOrgRound.healthOrg && this.state.item?.healthOrgRound.healthOrg.id) ? { id: this.state.item?.healthOrgRound.healthOrg.id } : null };
    
    let { open, handleClose, classes, t, i18n } = this.props;
 
    let columns = [
      {
        title: t("EQAResultReportEclia.sample_code"), 
        field: "sampleTube.code", 
        align: "left", 
        width: "50",
        headerStyle: {
          minWidth: "80px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: {
          minWidth: "80px",
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
          minWidth: "40px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: {
          minWidth: "40px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData =>
          <TextValidator
            className="w-60"
            onChange={sCOvalue => this.handleRowDataCellChange(rowData, sCOvalue)}
            //type="number"
            type="text"
            validators={['isFloat']}
            errorMessages={t('general.isFloat')}
            name="sCOvalue"
            value={rowData.sCOvalue ? rowData.sCOvalue : ''}
            disabled={isRoleAdmin}
            step={0.0001}
          />
      },
      {
        title: <span><span style={{ color: "red" }}> * </span>
          {t("EQAResultReportEclia.result")}
        </span>, 
        field: "result", 
        align: "left", 
        width: "150",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData =>
          <FormControl className="w-80" error={this.state.item?.hasErrorResult}>
            <Select
              value={rowData.result}
              disabled={isRoleAdmin}
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
            {this.state.item?.hasErrorResult && <FormHelperText>This is required!</FormHelperText>}
          </FormControl>
      }, {
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
    // console.log(item);
    return (
        <React.Fragment>
          {this.state.shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                title={t("confirm")}
                open={this.state.shouldOpenConfirmationDialog}
                onConfirmDialogClose={this.handleDialogFinalResultClose}
                onYesClick={this.handleFinalResult}
                text={this.state.item?.isFinalResult? t("EqaResult.unFinalResultConfirm"):t("EqaResult.FinalResultConfirm")}
                Yes={t("general.Yes")}
                No={t("general.No")}
              />
            )}

            {this.state.shouldOpenConfirmation && (
              <ConfirmationDialog
                title = {t("general.noti")}
                open={this.state.shouldOpenConfirmation}
                onYesClick = {this.handleDialogFinalResultClose}
                text={t("general.otherReagent")}
                Yes = {t("general.Yes")}

              />
            )}
            <Grid container spacing={2}>
              <Grid item  lg={4} md={4} sm={12} xs={12}>
                <Autocomplete
                  size="small"
                  id="combo-box"
                  options={this.props.listHealthOrgRound}
                  className="flex-end"
                  disabled = {isRoleAdmin}
                  getOptionLabel={(option) => option.healthOrg.name}
                  onChange={(event, healthOrgRound)=> this.handleSelectHealthOrgRound(healthOrgRound)}
                  value={this.state.item?.healthOrgRound}
                  renderInput={(params) => <TextField {...params}
                    label={<span className="font">{t('EQAResultReportElisa.healthOrgName')}</span>}
                    variant = "outlined"
                    disabled={isRoleAdmin}
                  />}
                />
              </Grid>
              <Grid item  lg={2} md={2} sm={12} xs={12}>
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
                  value={this.state.item?.orderTest}
                  disabled={isRoleAdmin}
                  validators={["required"]}
                  errorMessages={t('general.errorMessages_required')}
                />
              </Grid>
              <Grid item  lg={3} md={3} sm={12} xs={12}>
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
                    value={this.state.item?.testDate ? this.state.item?.testDate : null}
                    disabled={isRoleAdmin }
                    onChange={date => this.handleDateChange(date, "testDate")}
                    fullWidth
                    validators={["required"]}
                    errorMessages={t('general.errorMessages_required')}
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
                />
            </Grid>

              <Grid item  lg={4} md={4} sm={12} xs={12}>
                <AsynchronousAutocomplete
                 label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EqaResult.reagent")}
                    </span>
                    }
                  size="small"
                  variant = "outlined"
                  disabled={isRoleAdmin }
                  searchFunction={reagentSearchByPage}
                  searchObject={searchObject}
                  defaultValue={this.state.item?.reagent}
                  value={this.state.item?.reagent}
                  displayLable={'name'}
                  valueTextValidator={this.state.item?.reagent}
                  validators={["required"]}
                  errorMessages={t('general.errorMessages_required')}
                  onSelect={this.selectReagent}
                />
              </Grid>
              <Grid item  lg={2} md={2} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  variant = "outlined"
                  className="w-100"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EQAResultReportElisa.reagentLot")}
                    </span>
                    }
                  onChange={this.handleChange}
                  type="text"
                  name="reagentLot"
                  value={this.state.item?.reagentLot}
                  disabled={isRoleAdmin }
                  validators={["required"]}
                  errorMessages={t('general.errorMessages_required')}
                />
              </Grid>
              <Grid item container spacing={2} lg={6} md={6} sm={12} xs={12}>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("reagent.expirationDay")}</span>}
                    onChange={this.handleChange}
                    type="text"
                    name="dayReagentExpiryDate"
                    disabled={isRoleAdmin}
                    value={this.state.item?.dayReagentExpiryDate}
                    variant="outlined"
                    size="small"
                    validators={["required"]}
                    errorMessages={t('general.errorMessages_required')}
                  />
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("reagent.expirationMonth")}</span>}
                    onChange={this.handleChange}
                    type="text"
                    name="monthReagentExpiryDate"
                    value={this.state.item?.monthReagentExpiryDate}
                    disabled={isRoleAdmin}
                    variant="outlined"
                    size="small"
                    
                  />
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("reagent.expirationYear")}</span>}
                    onChange={this.handleChange}
                    type="text"
                    name="yeahReagentExpiryDate"
                    value={this.state.item?.yeahReagentExpiryDate}
                    disabled={isRoleAdmin}
                    variant="outlined"
                    size="small"
                    validators={["required"]}
                    errorMessages={t('general.errorMessages_required')}
                  />
                </Grid>
                
              </Grid>
              <Grid item  lg={3} md={3} sm={12} xs={12}>
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
                    value={this.state.item?.reagentUnBoxDate}
                    disabled={isRoleAdmin }
                    onChange={date => this.handleDateChange(date, "reagentUnBoxDate")}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item  lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  variant = "outlined"
                  className="w-100"
                  label={<span className="font">{t("EQAResultReportElisa.supplyOfReagent")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="supplyOfReagent"
                  value={this.state.item?.supplyOfReagent}
                  disabled={isRoleAdmin }
                />
              </Grid>

              <Grid item  lg={5} md={5} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  variant = "outlined"
                  className="w-100 "
                  label={<span className="font">{t("EQAResultReportElisa.personBuyReagent")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="personBuyReagent"
                  value={this.state.item?.personBuyReagent}
                  disabled={isRoleAdmin }
                />
              </Grid>
              {this.state.item?.isFinalResult && (
              <Grid item  lg={3} md={3} sm={12} xs={12}>
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
                    value={this.state.item?.dateSubmitResults}
                  />
                </MuiPickersUtilsProvider>
              </Grid>)} 
              {this.state.item?.isFinalResult && (
              <Grid item  lg={3} md={3} sm={12} xs={12}>
              <FormControlLabel
                      label={<span className="font" style={{ fontWeight : "bold"}}> {t('EQAResultReportFastTest.isFinalResult')}</span>}
                      control={<Checkbox checked={this.state.item.isFinalResult ? true : false} 
                      onClick={(isFinalResult) =>
                        this.notificationFinalResult(isFinalResult)
                      // this.handleChange(isFinalResult, 'isFinalResult')
                        }
                        />}
                        
                      />
              </Grid>)}
              <Grid item  lg={12} md ={12} sm={12} xs={12}>
                <TextValidator
                  disabled ={isRoleAdmin }
                  className="w-100"
                  label={<span className="font">{t("SampleManagement.serum-bottle.note")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  size = "small"
                  variant = "outlined"
                  name="note"
                  value={this.state.item?.note}
                />
              </Grid>
              {this.state.item?.otherReagent && (<Grid item  lg={12} md ={12} sm={12} xs={12}>
                <TextValidator
                  disabled ={isRoleAdmin}
                  className="w-100"
                  label={<span className="font">{t("reagent.note")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  size = "small"
                  variant = "outlined"
                  name="noteOtherReagent"
                  value={this.state.item?.noteOtherReagent}
                  validators={["required"]}
                  errorMessages={t('general.errorMessages_required')}
                />
              </Grid>)}
              <Grid item sm={12} xs={12}>
                <MaterialTable
                  title={""}
                  data={this.state.item?.details ? this.state.item?.details :[]}
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
      </React.Fragment>
    );
  }
}

export default EQAResultReportElisaInformation;
