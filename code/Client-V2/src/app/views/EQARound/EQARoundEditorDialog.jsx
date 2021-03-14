import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,
  Switch, InputAdornment,
  Icon, IconButton
} from "@material-ui/core";
import { search as searchByPage } from "../EQAPlanning/EQAPlanningService";
import { ValidatorForm, TextValidator, TextField } from "react-material-ui-form-validator";
import { getByPage, deleteItem, saveItem, getItemById } from "./EQARoundService";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import { MuiPickersUtilsProvider, DatePicker,DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import '../../../styles/views/_style.scss';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
class EQARoundEditorDialog extends Component {
  state = {
    name: "",
    code: "",
    level: 0,
    parent: {},
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    startDate: new Date(),//thời gian bắt đầu vòng ngoại kiểm
    endDate: new Date(),//thời gian kết thúc vòng ngoại kiểm
    registrationStartDate: new Date(),//thời gian bắt đầu đăng ký tham gia vòng ngoại kiểm
    registrationExpiryDate: new Date(),//thời gian kết thúc đăng ký tham gia vòng ngoại kiểm
    eqaPlanning: [],
    sampleNumber: "",//số mẫu
    sampleSetNumber: "",//số bộ mẫu
    executionTime: new Date(),//thời gian thực hiện
    healthOrgNumber: "",//Số đơn vị m=tham gia
    isActive: false,
    isView: false
  };
  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = () => {
    let { item, id } = this.state;
    let { t } = this.props;
      if (id) {
        this.setState({isView:true});
        saveItem({
          ...this.state
        }).then(() => {
          this.props.handleOKEditClose();
          toast.success(t('mess_edit'));
        });
      }
      else {
        this.setState({isView:true});
        saveItem({
          ...this.state
        }).then(() => {
          this.props.handleOKEditClose();
          toast.success(t('mess_add'));
        });
      }
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    this.setState({
      ...this.props.item
    });
  }
  handleSelectPlaning = (results) => {
    this.setState({ eqaPlanning: results, shouldPlanningSearchDialog: false });
  }
  handleSearchDialogClose = () => {
    this.setState({
      shouldPlanningSearchDialog: false
    });
  };
  handleSelect = (item) => {
    this.setState({ eqaPlanning: item });
    this.handleSearchDialogClose();
  }
  handleDateChange = (date, name) => {
    this.setState({
      [name]: date
    });
  };

  render() {
    let {
      id,
      name,
      code,
      level,
      isActive,
      isView,
      startDate,
      endDate,
      registrationStartDate,
      registrationExpiryDate,
      parent,
      shouldOpenDialog,
      shouldPlanningSearchDialog,
      shouldOpenSearchDialog,
      eqaPlanning
    } = this.state;
    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'lg'} fullWidth={true}>
        <div>
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20"> {(id ? t("update") : t("Add")) + " " + t("EQARound.title")} </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
              <Grid className="mb-16" container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <AsynchronousAutocomplete 
                    label={ <span>
                      <span style={{ color: "red" }}> *</span>
                      { t("EQARound.ChoosePlaning")}
                    </span>
                    }
                    size="small"
                    searchFunction={searchByPage}
                    searchObject={searchObject}
                    defaultValue={eqaPlanning}
                    value={eqaPlanning}
                    displayLable={'name'}
                    valueTextValidator={eqaPlanning}
                    variant="outlined"
                    onSelect={this.handleSelect}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                  />
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <TextValidator
                    className="w-100 mb-16"
                    label="Code"
                    onChange={this.handleChange}
                    type="text"
                    name="code"
                    variant="outlined"
                    value={code}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                  />
                </Grid>

                <Grid item md={8} sm={12} xs={12}>
                  <TextValidator
                    className="w-100 mb-16"
                    label="Name"
                    onChange={this.handleChange}
                    type="text"
                    name="name"
                    variant="outlined"
                    value={name}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      margin="none"
                      id="mui-pickers-date"
                      label={t('EQARound.startDate')}
                      inputVariant="standard"
                      type="text"
                      autoOk={false}
                      format="dd/MM/yyyy HH:mm:ss"
                      value={startDate}
                      onChange={date => this.handleDateChange(date, "startDate")}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item sm={6} xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      margin="none"
                      id="mui-pickers-date"
                      label={t('EQARound.endDate')}
                      inputVariant="standard"
                      type="text"
                      autoOk={false}
                      format="dd/MM/yyyy HH:mm:ss"
                      value={endDate}
                      onChange={date => this.handleDateChange(date, "endDate")}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      className="mt-16"
                      margin="none"
                      id="mui-pickers-date"
                      label={t('EQARound.registrationStartDate')}
                      inputVariant="standard"
                      type="text"
                      autoOk={false}
                      disabled={true}
                      format="dd/MM/yyyy HH:mm:ss"
                      name={'registrationStartDate'}
                      value={registrationStartDate}
                      onChange={date => this.handleDateChange(date, "registrationStartDate")}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      className="mt-16"
                      margin="none"
                      id="mui-pickers-date"
                      label={t('EQARound.registrationExpiryDate')}
                      inputVariant="standard"
                      type="text"
                      autoOk={false}
                      disabled={true}
                      format="dd/MM/yyyy HH:mm:ss"
                      name={'registrationExpiryDate'}
                      value={registrationExpiryDate}
                      onChange={date => this.handleDateChange(date, "registrationExpiryDate")}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
              
              <div className="flex flex-space-between flex-middle">
                <Button variant="contained" color="primary" type="submit">
                  OK
              </Button>
                <Button variant="contained" color="secondary" onClick={() => handleClose()}>Cancel</Button>
              </div>
            </ValidatorForm>
          </DialogContent>

        </div>
      </Dialog>
    );
  }
}

export default EQARoundEditorDialog;
