import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogActions,
  FormControlLabel,
  Switch,
  Checkbox, Icon, IconButton
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  DateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {
  ValidatorForm,
  TextValidator,
  TextField,
} from "react-material-ui-form-validator";
import { deleteItem, saveItem, getItemById } from "./EQASerumBottleService";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import EQASerumBankSearchDialog from "./EQASerumBankSearchDialog";
import { searchByPage as searchByPageSerumBank } from "../EQASerumBank/EQASerumBankService";
import Input from "@material-ui/core/Input";
import LocalValue from "./Constants";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import Select from "@material-ui/core/Select";
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
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
class EQASerumBottleViewDialog extends Component {
  state = {
    shouldOpenConfirmationDialog: false,
    eqaSerumBank: [],
    hivStatus:'',
    hcvStatus:"",
    hbvStatus: "",
    isView: false,
    bottleQuality: "",
    resultBottle: false
  };

  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    if(source === "resultBottle"){
      this.setState({resultBottle: event.target.checked});
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleFormSubmit = () => {
    let {t} = this.props;
    let { id } = this.state;
   
    if (id) {
      this.setState({isView: true});
      saveItem({
        ...this.state,
      }).then(() => {
        this.props.handleOKEditClose();
      });
      toast.success(t('mess_edit'));
    }
    else {
      this.setState({isView: true});
      saveItem({
        ...this.state,
      }).then(() => {
        this.props.handleOKEditClose();
      });
      toast.success(t('mess_add'));
    }
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    this.setState({
      ...this.props.item,
    });
  }

  handleSearchSerumBankDialogClose = () => {
    this.setState({
      shouldOpenSearchSerumBankDialog: false,
    });
  };
  handleSelectSerumBank = (item, source) => {
    this.setState({ eqaSerumBank: item });
    if (source === "active" && item != null) {
      this.setState({ hivStatus: item.hivStatus,
        hcvStatus: item.hcvStatus, hbvStatus: item.hbvStatus });
    }
  };
  handleSelectAdministrativeUnitType = (item) => {
    //alert('Test');
    this.setState({ administrativeUnit: item });
    this.handleSearchDialogClose();
  };
  handleThrombinAddedDateChange = (date) => {
    this.setState({
      thrombinAddedDate: date,
    });
  };
  handleRemoveFibrinDateChange = (date) => {
    this.setState({
      removeFibrinDate: date,
    });
  };
  handleCentrifugeDateChange = (date) => {
    this.setState({
      centrifugeDate: date,
    });
  };

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let {
      id,
      code,
      hivStatus,
      hcvStatus,
      hbvStatus,
      bottleQuality,
      bottleVolume,
      localSaveBottle,
      isView,
      eqaSerumBank,
      resultBottle,
      shouldOpenSearchSerumBankDialog,
      shouldOpenConfirmationDialog,note
    } = this.state;
    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    
    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        <span className="mb-20 styleColor"> { t("view") + " " + t("SampleManagement.serum-bottle.title")} </span>
        <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
        </DialogTitle>
        <ValidatorForm
          ref="form"
          onSubmit={this.handleFormSubmit}
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DialogContent dividers>
            <Grid className="mb-16" container spacing={2}>
              <Grid item  lg={6} md={6} sm={12} xs={12}>
                <AsynchronousAutocomplete label={<span className="font"><span style={{ color: "red" }}> * </span>
                  {t("SampleManagement.serum-bottle.eqaSerumBank")}
                </span>}
                  size="small"
                  searchFunction={searchByPageSerumBank}
                  searchObject={searchObject}
                  defaultValue={eqaSerumBank}
                  value={eqaSerumBank}
                  variant = "outlined"
                  displayLable={'serumCode'}
                  valueTextValidator={eqaSerumBank}
                  onSelect={(event) => this.handleSelectSerumBank(event, "active")}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  disabled ="true"
                />
              </Grid>
              <Grid item  lg={6} md={6} sm={12} xs={12}>
                <FormControl className="w-100" disabled ="true" size = "small"
                  variant = "outlined">
                  <InputLabel htmlFor="hivStatus">
                  {<span className="font">{t("SampleManagement.serum-bottle.OriginnalResult.hivStatus")}</span>}
                  </InputLabel>
                  <Select
                    // name="hivStatus"
                    value={typeof hivStatus == "undefined" ? '' : hivStatus}
                    onChange={(event) => this.handleChange(event)}
                    // input={<Input id="hivStatus" />}
                    inputProps = {{
                      id: "hivStatus",
                      name: "hivStatus"
                    }}
                  >
                    <MenuItem value = {LocalValue.EQAResult_Value.positive}>
                      {t(
                        "SampleManagement.serum-bottle.OriginnalResult.positive"
                      )}
                    </MenuItem>
                    <MenuItem value = {LocalValue.EQAResult_Value.indertermine}>
                      {t(
                        "SampleManagement.serum-bottle.OriginnalResult.indertermine"
                      )}
                    </MenuItem>
                    <MenuItem value = {LocalValue.EQAResult_Value.negative}>
                      {t(
                        "SampleManagement.serum-bottle.OriginnalResult.negative"
                      )}
                    </MenuItem>
                    <MenuItem value = {LocalValue.EQAResult_Value.Not_Implemented}>
                      {t("SampleManagement.serum-bottle.OriginnalResult.none")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item  lg={6} md={6} sm={12} xs={12}>
                <FormControl className="w-100" disabled ="true" size = "small"
                  variant = "outlined">
                  <InputLabel htmlFor="hcvStatus">
                  {<span className="font">{t("SampleManagement.serum-bottle.OriginnalResult.hcvStatus")}</span>}
                  </InputLabel>
                  <Select
                    // name="hcvStatus"
                    value={typeof hcvStatus == "undefined" ? '' : hcvStatus}
                    onChange={(event) => this.handleChange(event)}
                    // input={<Input id="hcvStatus" />}
                    inputProps = {{
                      id: "hcvStatus",
                      name: "hcvStatus"
                    }}

                  >
                    <MenuItem value = {LocalValue.EQAResult_Value.positive}>
                      {t(
                        "SampleManagement.serum-bottle.OriginnalResult.positive"
                      )}
                    </MenuItem>
                    <MenuItem value = {LocalValue.EQAResult_Value.indertermine}>
                      {t(
                        "SampleManagement.serum-bottle.OriginnalResult.indertermine"
                      )}
                    </MenuItem>
                    <MenuItem value = {LocalValue.EQAResult_Value.negative}>
                      {t(
                        "SampleManagement.serum-bottle.OriginnalResult.negative"
                      )}
                    </MenuItem>
                    <MenuItem value = {LocalValue.EQAResult_Value.Not_Implemented}>
                      {t("SampleManagement.serum-bottle.OriginnalResult.none")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item  lg={6} md={6} sm={12} xs={12}>
                <FormControl className="w-100" disabled ="true" size = "small"
                  variant = "outlined">
                  <InputLabel htmlFor="hbvStatus">
                  {<span className="font">{t("SampleManagement.serum-bottle.OriginnalResult.hbvStatus")}</span>}
                  </InputLabel>
                  <Select
                    // name="hbvStatus"
                    value={typeof hbvStatus == "undefined" ? '' : hbvStatus}
                    onChange={(event) => this.handleChange(event)}
                    // input={<Input id="hbvStatus" />}
                    inputProps={{
                      id:"hbvStatus",
                      name: "hbvStatus"
                    }}
                  >
                    <MenuItem value = {LocalValue.EQAResult_Value.positive}>
                      {t(
                        "SampleManagement.serum-bottle.OriginnalResult.positive"
                      )}
                    </MenuItem>
                    <MenuItem value = {LocalValue.EQAResult_Value.indertermine}>
                      {t(
                        "SampleManagement.serum-bottle.OriginnalResult.indertermine"
                      )}
                    </MenuItem>
                    <MenuItem value = {LocalValue.EQAResult_Value.negative}>
                      {t(
                        "SampleManagement.serum-bottle.OriginnalResult.negative"
                      )}
                    </MenuItem>
                    <MenuItem value = {LocalValue.EQAResult_Value.Not_Implemented}>
                      {t("SampleManagement.serum-bottle.OriginnalResult.none")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item  lg={6} md={6} sm={12} xs={12}>
                <FormControl className="w-100" disabled ="true" size = "small"
                  variant = "outlined">
                      <InputLabel htmlFor="bottleQuality">
                      {<span className="font">{t("SampleManagement.serum-bottle.bottleQuality")}</span>}
                      </InputLabel>
                      <Select
                        // name="bottleQuality"
                        value = {typeof bottleQuality == "undefined" ? '' : bottleQuality}
                        // value={bottleQuality ? "Đạt" : "Chưa Đạt"}
                        onChange={event => this.handleChange(event)}
                        // input = {<Input id = "bottleQuality"/>}
                        inputProps={{
                          id: "bottleQuality",
                          name: "bottleQuality"
                        }}
                        >
                          <MenuItem value={LocalValue.EQASerumBottle_Value.yes}>{t("EQASerumBank.Yes")}</MenuItem>
                          <MenuItem value= {LocalValue.EQASerumBottle_Value.no}>{t("EQASerumBank.No")}</MenuItem>
                        </Select>
                    </FormControl>
                {/* <TextValidator
                  className="w-100"
                  label={t("SampleManagement.serum-bottle.bottleQuality")}
                  onChange={this.handleChange}
                  type="text"
                  name="bottleQuality"
                  value={bottleQuality}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                /> */}
              </Grid>
              <Grid item  lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  disabled ="true"
                  className="w-100"
                  label={<span className="font"><span style={{ color: "red" }}> * </span>
                    {t("SampleManagement.serum-bottle.bottleVolume") + "(ml)"}
                  </span>}
                  onChange={this.handleChange}
                  type="number"
                  size = "small"
                  variant = "outlined"
                  name="bottleVolume"
                  value={bottleVolume}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item  lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  disabled ="true"
                  className="w-100"
                  label={<span className="font"><span style={{ color: "red" }}> * </span>
                    {t("SampleManagement.serum-bottle.localSaveBottle")}
                  </span>}
                  onChange={this.handleChange}
                  type="number"
                  size = "small"
                  variant = "outlined"
                  name="localSaveBottle"
                  value={localSaveBottle}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item  lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  disabled ="true"
                  className="w-100"
                  size = "small"
                  variant = "outlined"
                  label={<span className="font">{t("SampleManagement.serum-bottle.note")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="note"
                  value={note}
                />
              </Grid>
              <Grid item md ={6} sm={12} xs={12}>
                <FormControlLabel
                      disabled ="true"
                      label={<span className="font">{t('SampleManagement.serum-bottle.resultBottle')}</span>}
                      control={<Checkbox checked={resultBottle}
                      onChange={(resultBottle) =>
                      this.handleChange(resultBottle, 'resultBottle')
                        }
                        />}
                        
                      />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.props.handleClose()}
            >
              {t("general.close")}
            </Button>
            {/* <Button variant="contained" color="primary" type="submit" disabled={isView}>
              {t("Save")}
            </Button> */}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQASerumBottleViewDialog;
