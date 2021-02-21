import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid, InputLabel,
  FormControl,
  MenuItem, Select,
  DialogActions,
  DialogTitle,
  DialogContent, FormHelperText, Icon, IconButton,
  FormControlLabel, Checkbox
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { getUserById, updateUser, addNewEQAPlanning, updateEQAPlanning, checkCode } from "./EQAPlanningService";
import { MuiPickersUtilsProvider, DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import "date-fns";
import { getAll } from "../Personnel/PresonnelService";
import DateFnsUtils from "@date-io/date-fns";
import { generateRandomId } from "utils";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_style.scss';
import { EventAvailableTwoTone } from "@material-ui/icons";

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

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        props.onChange({
          target: {
            name: props.name,
            value: values.value,

          },
        });
      }}
      name={props.name}
      value={props.value}
      thousandSeparator
      isNumericString
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
class EQAPlanningDialog extends Component {
  constructor(props) {
    super(props);
    getAll().then(result => {
      let listPersonnel = result.data;
      this.setState({ listPersonnel: listPersonnel });
    })
  }
  state = {
    name: "",
    code: null,
    year: new Date().getFullYear(),
    type: 0,
    objectives: "",
    numberOfRound: 0,
    fee: 0,
    startDate: new Date(),
    endDate: new Date(),
    isView: false,
    personnel: "",
    isManualSetCode: false,
    listPersonnel: []
  };

  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    if (source === "isManualSetCode") {
      this.setState({ isManualSetCode: event.target.checked })
    }
    if (source === "personnel") {
      this.setState({ hasErrorPerson: false })
    }

    this.setState({
      [event.target.name]: event.target.value
    });
  };


  handleChangeFormatNumber = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  handleDateChange = (event, name) => {
    event.setHours("00");
    event.setMinutes("00");
    event.setSeconds("00");
    // Date.prototype.getTimezoneOffset = function () {return -0;};
    this.setState({
      [name]: event
    });
  };
  handleFormSubmit = () => {
    let { id, code, personnel, listPersonnel, isManualSetCode } = this.state;

    let { t } = this.props;
    if (personnel != "") {
      let objPersonnel = listPersonnel.find(item => item.id == personnel);
      personnel = objPersonnel;
      this.setState({ personnel: personnel }, function () {
        if (isManualSetCode) {
          checkCode(id, code).then(res => {
            if (res.data) {
              toast.warning(t("EQAPlanning.duplicateCode"));
            } else {
              if (id) {
                this.setState({ isView: true });
                updateEQAPlanning({
                  ...this.state
                }).then((response) => {
                  this.state.id = response?.data?.id;
                  this.state.personnel = response?.data?.personnel?.id
                  this.setState({ ...this.state, isView: false })
                  // this.props.handleClose();
                  toast.success(t('mess_edit'));
                }).catch(() => {
                  this.setState({ isView: false });
                });
              } else {
                this.setState({ isView: true });
                addNewEQAPlanning({
                  ...this.state
                }).then((response) => {
                  // this.props.handleClose();
                  this.state.id = response?.data?.id;
                  this.state.personnel = response?.data?.personnel?.id
                  this.setState({ ...this.state, isView: false })
                  toast.success(t('mess_add'));
                }).catch(() => {
                  this.setState({ isView: false })
                });
              }
            }
          })
        } else {
          if (id) {
            this.setState({ isView: true });
            updateEQAPlanning({
              ...this.state
            }).then((response) => {
              // this.props.handleClose();
              this.state.id = response?.data?.id;
              this.state.personnel = response?.data?.personnel?.id
              this.setState({ ...this.state, isView: false })
              toast.success(t('mess_edit'));
            }).catch(() => {
              this.setState({ isView: false });
            });
          } else {
            this.setState({ isView: true });
            addNewEQAPlanning({
              ...this.state
            }).then((response) => {
              // this.props.handleClose();
              this.state.id = response?.data?.id;
              this.state.personnel = response?.data?.personnel?.id
              this.setState({ ...this.state, isView: false })
              toast.success(t('mess_add'));
            }).catch(() => {
              this.setState({ isView: false });
            });
          }
        }
      })
    } else {
      this.setState({ hasErrorPerson: true, isView: false })
    }
  };
  handleChangeDetailPlanning = (number, event, name) => {
    let { detailPlanning } = this.state;
    let p = {}
    if (name === "startDate" || name === "endDate") {
        if (name === "startDate" && event != null) {
            event.setHours("00");
            event.setMinutes("00");
            event.setSeconds("00");
        }
        if (name === "endDate" && event != null) {
            event.setHours("23");
            event.setMinutes("59");
            event.setSeconds("00");
        }
        p = {
            ...detailPlanning[number],
            [name]: event,
        };
        p.type = number
    } else {
        p = {
            ...detailPlanning[number],
            [event.target.name]: event.target.value,
        };
        p.type = number
    }
    detailPlanning.splice(number, 1, p)
    this.setState({ detailPlanning })
}

  handleStartDateChange = (event) => {
    if (event != null) {
      event.setHours("00");
      event.setMinutes("00");
      event.setSeconds("00");
    }

    // Date.prototype.setTimezoneOffset = function () {return -0;};
    this.setState({ startDate: event });
    ;
  };

  handleEndDateChange = (event) => {
    if (event != null) {
      event.setHours("23");
      event.setMinutes("59");
      event.setSeconds("00");
    }

    // Date.prototype.getTimezoneOffset = function () {return -0;};
    this.setState({ endDate: event });
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    let { detailPlanning } = item;

    if (typeof detailPlanning === "undefined"){
      let detailPlanning = [];
      for(var i= 0 ; i < 13 ; i++){
        detailPlanning.push({
          type: i
        });
      }
      this.setState({detailPlanning: detailPlanning})
    }
    
    this.setState({...this.props.item}, function () {
      let { personnel } = this.state;
      if (personnel != null && personnel.id != null) {
        personnel = personnel.id;
      }
      // console.log(detailPlanning);

      
      this.setState({ personnel: personnel });
    });
  }

  render() {
    const { t, i18n } = this.props;
    let { id,
      code,
      name,
      year,
      type,
      listPersonnel,
      personnel,
      hasErrorPerson,
      numberOfRound,
      startDate,
      endDate,
      fee,
      isView,
      isManualSetCode
    } = this.state;
    let { open, handleClose } = this.props;

    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'md'} fullWidth={true}>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20 styleColor"> {(id ? t("update") : t("Add")) + " " + t("EQAPlanning.title")} </span>
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
            <Grid className="mb-16" container spacing={2}>
              <Grid item container spacing={2}>
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("EQAPlanning.name")}
                      </span>
                    }
                    onChange={this.handleChange}
                    type="text"
                    name="name"
                    value={name}
                    variant="outlined"
                    size="small"
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                  />
                </Grid>

                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <FormControlLabel
                    label={<span className="font">{t('EQAPlanning.isManualSetCode')}</span>}
                    control={<Checkbox checked={isManualSetCode}
                      onChange={(isManualSetCode) =>
                        this.handleChange(isManualSetCode, "isManualSetCode")
                      }
                    />}
                  />
                </Grid>

                {isManualSetCode && <Grid item lg={4} md={4} sm={6} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("EQAPlanning.code")}</span>}
                    onChange={this.handleChange}
                    type="text"
                    size="small"
                    name="code"
                    variant="outlined"
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                    value={code}
                  />
                </Grid>}
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <TextValidator
                  className="w-100"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("Year")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="year"
                  value={year}
                  variant="outlined"
                  size="small"
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <TextValidator
                  className="w-100"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EQAPlanning.numberOfRound")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="numberOfRound"
                  value={numberOfRound}
                  variant="outlined"
                  size="small"
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <TextValidator
                  className="w-100"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EQAPlanning.fee")}
                    </span>
                  }
                  onChange={this.handleChangeFormatNumber}
                  name="fee"
                  value={fee}
                  variant="outlined"
                  size="small"
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="w-100"
                    margin="none"
                    id="mui-pickers-date"
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("StartDate")}
                      </span>
                    }
                    inputVariant="outlined"
                    size="small"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    invalidDateMessage={t("Invalid_Date_Format")}
                    value={startDate}
                    onChange={event => this.handleStartDateChange(event)}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="w-100"
                    margin="none"
                    id="mui-pickers-date"
                    label={
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("EndDate")}
                      </span>
                    }
                    inputVariant="outlined"
                    size="small"
                    type="text"
                    autoOk={false}
                    format="dd/MM/yyyy"
                    invalidDateMessage={t("Invalid_Date_Format")}
                    value={endDate}
                    onChange={event => this.handleEndDateChange(event)}
                  // fullWidth
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <FormControl fullWidth={true} error={hasErrorPerson} variant="outlined"
                  size="small">
                  <InputLabel htmlFor="personnel-simple">{<span className="font"><span style={{ color: "red" }}> * </span> {t('EQAPlanning.detail.responsible_by')} </span>}</InputLabel>
                  <Select
                    label={<span className="font"><span style={{ color: "red" }}> * </span> {t('EQAPlanning.detail.responsible_by')} </span>}
                    value={personnel}
                    onChange={event => this.handleChange(event, "personnel")}
                    inputProps={{
                      name: "personnel",
                      id: "personnel-simple"
                    }}
                  >
                    {listPersonnel.map(item => {
                      return <MenuItem key={item.id} value={item.id}>{item.displayName}</MenuItem>;
                    })}
                  </Select>
                  {hasErrorPerson && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid container sm={12}>
                <fieldset className="mt-8 mb-8" style={{ width: "100%" }}>
                  <span  className="title">{t("EQAPlanning.time")}</span>
                  <Grid container className="mt-8 mb-8" sm={12} xs={12} spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundOne")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(0, event)}
                            variant="outlined"
                            size="small"
                            type="text"
                            multiline
                            rowsMax={4}
                            name="data"
                            value={this.state?.detailPlanning[0] ? this.state?.detailPlanning[0].data ?  this.state?.detailPlanning[0].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundTwo")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(1, event)}
                            variant="outlined"
                            size="small"
                            multiline
                            rowsMax={4}
                            type="text"
                            name="data"
                            value={this.state?.detailPlanning[1] ? this.state?.detailPlanning[1].data ?  this.state?.detailPlanning[1].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                  </Grid>
          
                  <span  className="title">{t("EQAPlanning.modelNumber")}</span>
                  <Grid container className="mt-8 mb-8" sm={12} xs={12} spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundOne")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(2, event)}
                            variant="outlined"
                            size="small"
                            type="number"
                            name="data"
                            value={this.state?.detailPlanning[2] ? this.state?.detailPlanning[2].data ?  this.state?.detailPlanning[2].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundTwo")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(3, event)}
                            variant="outlined"
                            size="small"
                            type="number"
                            name="data"
                            value={this.state?.detailPlanning[3] ? this.state?.detailPlanning[3].data ?  this.state?.detailPlanning[3].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                  </Grid>
             
                  <span  className="title">{t("EQAPlanning.volumeOfOneSample")}</span>
                  <Grid container className="mt-8 mb-8" sm={12} xs={12} spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundOne")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(4, event)}
                            variant="outlined"
                            size="small"
                            type="float"
                            name="data"
                            value={this.state?.detailPlanning[4] ? this.state?.detailPlanning[4].data ?  this.state?.detailPlanning[4].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundTwo")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(5, event)}
                            variant="outlined"
                            size="small"
                            type="float"
                            name="data"
                            value={this.state?.detailPlanning[5] ? this.state?.detailPlanning[5].data ?  this.state?.detailPlanning[5].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                  </Grid>
            
                  <span  className="title">{t("EQAPlanning.designTemplateSet")}</span>
                  <Grid container className="mt-8 mb-8" sm={12} xs={12} spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundOne")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(6, event)}
                            variant="outlined"
                            size="small"
                            multiline
                            rowsMax={4}
                            type="text"
                            name="data"
                            value={this.state?.detailPlanning[6] ? this.state?.detailPlanning[6].data ?  this.state?.detailPlanning[6].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundTwo")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(7, event)}
                            variant="outlined"
                            multiline
                            rowsMax={4}
                            size="small"
                            type="text"
                            name="data"
                            value={this.state?.detailPlanning[7] ? this.state?.detailPlanning[7].data ?  this.state?.detailPlanning[7].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                  </Grid>
             
                  <span  className="title">{t("EQAPlanning.numberOfReagentsTestedAtPI(type)")}</span>
                  <Grid container className="mt-8 mb-8" sm={12} xs={12} spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundOne")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(8, event)}
                            variant="outlined"
                            size="small"
                            type="number"
                            name="data"
                            value={this.state?.detailPlanning[8] ? this.state?.detailPlanning[8].data ?  this.state?.detailPlanning[8].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundTwo")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(9, event)}
                            variant="outlined"
                            size="small"
                            type="number"
                            name="data"
                            value={this.state?.detailPlanning[9] ? this.state?.detailPlanning[9].data ?  this.state?.detailPlanning[9].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                  </Grid>
        
                 <span  className="title">{t("EQAPlanning.numberOfRefundedSamples")}</span>
                  <Grid container className="mt-8 mb-8" sm={12} xs={12} spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundOne")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(10, event)}
                            variant="outlined"
                            size="small"
                            multiline
                            rowsMax={4}
                            type="text"
                            name="data"
                            value={this.state?.detailPlanning[10] ? this.state?.detailPlanning[10].data ?  this.state?.detailPlanning[10].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundTwo")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(11, event)}
                            variant="outlined"
                            size="small"
                            multiline
                            rowsMax={4}
                            type="text"
                            name="data"
                            value={this.state?.detailPlanning[11] ? this.state?.detailPlanning[11].data ?  this.state?.detailPlanning[11].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                  </Grid>
        
                  <span className="title">{t("EQAPlanning.numberOfGroupsOfUnits(set)TheLawOfDivision")}</span>
                  <Grid container className="mt-8 mb-8" sm={12} xs={12} spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundOne")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(12, event)}
                            variant="outlined"
                            size="small"
                            multiline
                            rowsMax={4}
                            type="text"
                            name="data"
                            value={this.state?.detailPlanning[12] ? this.state?.detailPlanning[12].data ?  this.state?.detailPlanning[12].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TextValidator
                            className="w-100"
                            label={
                                <span className="font">
                                    <span style={{ color: "red" }}> * </span>
                                    {t("EQAPlanning.roundTwo")}
                                </span>
                            }
                            onChange={event => this.handleChangeDetailPlanning(13, event)}
                            variant="outlined"
                            multiline
                            rowsMax={4}
                            size="small"
                            type="text"
                            name="data"
                            value={this.state?.detailPlanning[13] ? this.state?.detailPlanning[13].data ?  this.state?.detailPlanning[13].data : null : null}
                            validators={["required"]}
                            errorMessages={[t("general.errorMessages_required")]}
                        />
                    </Grid>
                  </Grid>
                </fieldset>
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
            {(!isView && <Button
              variant="contained"
              color="primary"
              type="submit">
              {t('Save')}
            </Button>)}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQAPlanningDialog;
