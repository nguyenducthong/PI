import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  DialogActions,
  FormHelperText, Icon, IconButton
} from "@material-ui/core";

import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { ValidatorForm, TextValidator, TextField } from "react-material-ui-form-validator";
import { getAllQualification, getAllHealthOrg, saveItem, getItemById } from "./TechnicianService";
import { searchByPage as searchByPageHealthOrg } from "../EQAHealthOrg/EQAHealthOrgService";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { el } from "date-fns/locale";
import EQAHealthOrgSearchDialog from './EQAHealthOrgSearchDialog';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_style.scss';

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
class TechnicianEditorDialog extends Component {
  constructor(props) {
    super(props);
    getAllQualification().then((result) => {
      let listQualification = result.data;
      this.setState({ listQualification: listQualification });
    });
    // getAllHealthOrg().then((result) => {
    //   let listHealthOrg = result.data;
    //   this.setState({ listHealthOrg: listHealthOrg });
    // });
  }

  state = {
    firstName: '',
    lastName: '',
    displayName: '',
    gender: '',
    qualification: '',
    healthOrg:[],
    birthDate: null,
    phoneNumber:'',
    idNumber:'',
    email:'',
    isView: false,
    address:[],
    listQualification: [],
    listHealthOrg: [],
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenSearchEQAHealthOrgSearchDialog: false,
  };

  listGender = [
    { id: 1, name: 'Nam' },
    { id: 2, name: 'Nữ' },
    { id: 3, name: 'Không xác định' }
  ]

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
    if (source === "firstName") {
      let { lastName } = this.state;
      let displayName = event.target.value.trim() + " " + (lastName ? lastName : '');
      this.setState({ firstName: event.target.value, displayName: displayName });
      return;
    }
    else if (source === "lastName") {
      let { firstName } = this.state;
      let displayName = firstName.trim() + " " + (event.target.value.trim() ? event.target.value.trim() : '');
      this.setState({ lastName: event.target.value, displayName: displayName });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = () => {
    this.setState({ hasErrorEQAHealthOrg: false, hasErrorQualification: false});
    let {healthOrg} = this.state;
    let { t } = this.props;
    if (!this.state.healthOrg || this.state.healthOrg <= 0) {
      this.setState({ hasErrorEQAHealthOrg: true });
      return;
    }
    else if (!this.state.qualification || this.state.qualification <= 0) {
      this.setState({ hasErrorQualification: true });
      return;
    }else{
      let { qualification, id } = this.state;
      let { listQualification } = this.state;
      this.setState({isView: true});
      let objQualification = listQualification.find(item => item.id == qualification);
      this.setState({ qualification: objQualification }, function () {
        if (id) {
          saveItem({
            ...this.state
          }).then((response) => {
            if(response.data != null && response.status == 200){
              this.state.qualification = response.data.qualification.id
              this.setState({...this.state, isView: false})
              toast.success(t('mess_edit'));
            }
          });
        }
        else {
          saveItem({
            ...this.state
          }).then((response) => {
            if(response.data != null && response.status == 200){
              this.state.id = response.data.id
              this.state.qualification = response.data.qualification.id
              this.setState({...this.state, isView: false})
              toast.success(t('mess_add'));
            }
          });
        }
      });

    }
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    this.setState({
      ...this.props.item
    }, function () {
      let { qualification } = this.state;
      if (qualification != null && qualification.id != null) {
        this.setState({ qualification: qualification.id });
      }
    });
  }

  handleSearchDialogClose = () => {
    this.setState({
      shouldOpenSearchDialog: false
    });
  };

  deleteTechnicianDetail(eQASampleSetDetail) {
    let index = null;
    let { details } = this.state;
    if (details != null && details.length > 0) {
      details.forEach(element => {
        if (element != null && element.sample != null && eQASampleSetDetail.sample != null && element.sample.id == eQASampleSetDetail.sample.id) {
          if (index == null) {
            index = 0;
          }
          else {
            index++;
          }
        }
      });

      details.splice(index, 1);
      this.setState({ details });
    }
  };
  
  handleSearchEQAHealthOrgDialogClose = () => {
    this.setState({
      shouldOpenSearchEQAHealthOrgSearchDialog: false
    });
  };
  handleSelectEQAHealthOrg = (item) => {
    this.setState({ healthOrg: item });
    this.handleSearchEQAHealthOrgDialogClose();
  }

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let searchObject = { pageIndex: 1, pageSize: 100000, text:"" };
    let {
      id,
      firstName,
      lastName,
      displayName,
      qualification,
      gender,
      listQualification,
      healthOrg,
      listHealthOrg,
      birthDate,
      phoneNumber,
      idNumber,
      email,
      address,
      isView,
      hasErrorEQAHealthOrg,
      hasErrorQualification,
      shouldOpenSearchEQAHealthOrgSearchDialog
    } = this.state;

    return (
      <Dialog  open={open} PaperComponent={PaperComponent} maxWidth={'md'} fullWidth={true} >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        <span className="mb-20 styleColor"> {(id ? t("update") : t("Add")) + " " + t("Technician.title")} </span>
        <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
        </DialogTitle>
        
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
          <DialogContent dividers>
          <Grid className="" container spacing={2}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <AsynchronousAutocomplete 
                    label={<span className="font"><span style={{ color: "red" }}> * </span>
                      {t("EQAHealthOrg.title")}
                      </span>}
                    size="small"
                    searchFunction={searchByPageHealthOrg}
                    searchObject={searchObject}
                    defaultValue={healthOrg}
                    value={healthOrg}
                    displayLable={'name'}
                    valueTextValidator={healthOrg}
                    onSelect={this.handleSelectEQAHealthOrg}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    variant="outlined"
                    size="small"
                  />
              </Grid> 
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <FormControl fullWidth={true} error={hasErrorQualification} variant="outlined" size="small">
                  <InputLabel htmlFor="qualification-simple">{<span className="font"><span style={{ color: "red" }}> * </span>{t('Qualification.title')}</span>}</InputLabel>
                  <Select
                    value={qualification ? qualification : ''}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "qualification",
                      id: "qualification-simple"
                    }}
                  >
                    {listQualification.map(item => {
                      return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
                    })}
                  </Select>
                  {hasErrorQualification && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={<span className="font">{t("general.phoneNumber")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber}
                  validators={['isNumber']}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
            <Grid className="" container spacing={2}>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font"><span style={{ color: "red" }}> * </span>
                      {t("general.firstName")}
                      </span>}
                  onChange={value => this.handleChange(value, 'firstName')}
                  type="text"
                  name="firstName"
                  value={firstName}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font"><span style={{ color: "red" }}> * </span>
                      {t("general.lastName")}
                      </span>}
                  onChange={value => this.handleChange(value, 'lastName')}
                  type="text"
                  name="lastName"
                  value={lastName}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  disabled={true}
                  className="w-100"
                  label={<span className="font">{t("general.displayName")}</span>}
                  type="text"
                  name="displayName"
                  value={displayName}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <FormControl fullWidth={true} variant="outlined" size="small">
                  <InputLabel htmlFor="gender-simple">{<span className="font">{t('general.gender')}</span>}</InputLabel>
                  <Select
                    value={gender ? gender : ''}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "gender",
                      id: "gender-simple"
                    }}
                  >
                    {this.listGender.map(item => {
                      return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
              </Grid>
          
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">{t("general.idNumber")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="idNumber"
                  value={idNumber}
                  validators={['isNumber']}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={<span className="font">{t("general.email")}</span>}
                  onChange={this.handleChange}
                  placeholder='example@gmail.com'
                  type="email"
                  name="email"
                  value={email}
                  validators={['isEmail']}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item lg={3} md={3} sm={12} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    fullWidth
                    margin="none"
                    id="mui-pickers-date"
                    label={<span className="font">{t('general.birthDate')}</span>}
                    inputVariant="standard"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    value={birthDate}
                    onChange={date => this.handleDateChange(date, "birthDate")}
                    inputVariant="outlined"
                    size="small"
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
 	        </DialogContent>
            
            <DialogActions spacing={4} className="flex flex-end flex-middle">
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => this.props.handleClose()}>
                  {t('Cancel')}
              </Button>
              <Button
                disabled = {isView}
                variant="contained"    
                color="primary" 
                type="submit">
                  {t('Save')}
              </Button>
            </DialogActions>
          </ValidatorForm> 
      </Dialog>
    );
  }
}

export default TechnicianEditorDialog;
