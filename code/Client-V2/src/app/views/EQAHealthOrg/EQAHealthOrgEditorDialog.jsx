import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogActions,
  FormControlLabel,
  InputAdornment, Checkbox, FormHelperText, Icon, IconButton
} from "@material-ui/core";
import {
  KeyboardDatePicker
} from "@material-ui/pickers";
import { ValidatorForm, TextValidator, TextField, SelectValidator } from "react-material-ui-form-validator";
import { getByPage, deleteItem, saveItem, getItemById, checkCode, checkEmail } from "./EQAHealthOrgService";
import { getAllEQAhealthOrgLevels } from "../HealthOrgLevel/HealthOrgLevelService"
import { searchByPage } from "../EQAHealthOrgType/EQAHealthOrgTypeService";
import { getAllQualifications, getQualificationById } from '../Qualification/QualificationService';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import AdministrativeUnitsPopup from './AdministrativeUnitSearchDialog';
import { searchByPage as getAllHealthOrgType } from "../EQAHealthOrgType/EQAHealthOrgTypeService";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import EQAPlanningSearchDialog from './EQAPlanningSearchDialog';
import EQAPOrgTypeSearchDialog from './EQAPOrgTypeSearchDialog';
import EQAHealthOrg from "./EQAHealthOrg";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAll } from "../AllocationSampleSet/AllocationSampleSetService";
import '../../../styles/views/_loadding.scss';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../../../styles/views/_style.scss';

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
class EQAHealthOrgEditorDialog extends Component {
  state = {
    name: "",
    taxCodeOfTheUnit: "",
    code: "",
    specifyLevel: "",
    positiveAffirmativeRight: true,
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    qualificationSelect: [],
    qualification: {}, officerPosion: "", unitCodeOfProgramPEQAS: "",
    levelHealOrg: [],
    healthOrgTypeSelect: [],
    healthOrgType: [],
    administrativeUnit: "",
    fax: "",
    isView: false,
    shouldOpenAdministrativeUnitsPopup: false,
    level: {}, sampleReceiptDate: new Date(),
    sampleRecipient: "", specifySampleStatus: "", specifyQualification: "",
    isManualSetCode: false,
    hasErrorLever: false,
    levelId: "",
    loading: false
  };
  handleDateChange = date => {
    this.setState({ sampleReceiptDate: date });
  };
  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    if (source === "isManagementUnit") {
      this.setState({ isManagementUnit: event.target.checked });
      return;
    }

    if (source === "positiveAffirmativeRight") {
      this.setState({ positiveAffirmativeRight: event.target.checked });
      return;
    }

    if (source === "isManualSetCode") {
      this.setState({ isManualSetCode: event.target.checked });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleChangeAdministrativeUnitPopupClose = () => {
    this.setState({ shouldOpenAdministrativeUnitsPopup: false }, function () {
    });
  }

  handleSelectAdministrativeUnit = (administrativeUnit) => {
    if (administrativeUnit && administrativeUnit.id) {
      this.setState({ administrativeUnit });
      this.handleChangeAdministrativeUnitPopupClose();
    }
  }
  handleChangeQualification = (event, source) => {
    let { qualificationSelect } = this.state;
    this.setState({
      qualification: qualificationSelect.find(item => item.id == event.target.value),
      qualificationId: event.target.value
    })
  }

  handleChangelevel = (event, source) => {
    let { levelHealOrg } = this.state;
    this.setState({
      level: levelHealOrg.find(item => item.id == event.target.value),
      levelId: event.target.value,
      hasErrorLever: false
    })
  }

  handleChangeType = (event, source) => {
    let { healthOrgTypeSelect } = this.state;
    this.setState({
      healthOrgType: healthOrgTypeSelect.find(item => item.id == event.target.value),
      healthOrgTypeId: event.target.value
    })
  }

  handleFormSubmit = () => {
    let { id, code, isManualSetCode, email, hasErrorLever, levelId } = this.state;
    let { t } = this.props;
    this.setState({ loading: true });

    if (levelId == "") {
      this.setState({ hasErrorLever: true, loading: false });
      return
    }
    if (email != null) {
      checkEmail(id, email).then(res => {
        if (res.data) {
          toast.warning(t("sign_up.duplicate_email"));
          this.setState({ loading: false });
          return
        } else {
          if (isManualSetCode) {
            checkCode(id, code).then(result => {
              if (result.data) {
                toast.warning(t("EQAHealthOrg.duplicateCode"));
                this.setState({ loading: false });
              } else {
                if (id) {
                  saveItem({
                    ...this.state
                  }).then(() => {
                    toast.success(t('mess_edit'));
                    this.setState({ loading: false });
                  });
                } else {
                  saveItem({
                    ...this.state
                  }).then((response) => {
                    if (response.data != null && response.status == 200) {
                      this.state.id = response.data.id;
                      toast.success(t('mess_add'));
                      this.setState({ ...this.state, loading: false });
                    }
                  });
                }
              }
            })
          } else {
            if (id) {
              saveItem({
                ...this.state
              }).then(() => {
                // this.props.handleOKEditClose();
                this.setState({ loading: false });
                toast.success(t('mess_edit'));
              });

            } else {
              saveItem({
                ...this.state
              }).then((response) => {
                if (response.data != null && response.status == 200) {
                  this.state.id = response.data.id;
                  toast.success(t('mess_add'));
                  this.setState({ ...this.state, loading: false });
                }
              });
            }
          }
        }
      })
    } else {
      if (isManualSetCode) {
        checkCode(id, code).then(result => {
          if (result.data) {
            toast.warning(t("EQAHealthOrg.duplicateCode"));
            this.setState({ loading: false });
          } else {
            if (id) {
              saveItem({
                ...this.state
              }).then(() => {
                // this.props.handleOKEditClose();
                toast.success(t('mess_edit'));
                this.setState({ loading: false });
              });
            } else {
              saveItem({
                ...this.state
              }).then((response) => {
                if (response.data != null && response.status == 200) {
                  this.state.id = response.data.id;
                  toast.success(t('mess_add'));
                  this.setState({ ...this.state, loading: false });
                }
              });
            }
          }
        })
      } else {
        if (id) {
          saveItem({
            ...this.state
          }).then(() => {
            // this.props.handleOKEditClose();
            toast.success(t('mess_edit'));
            this.setState({ loading: false });
          });

        } else {
          saveItem({
            ...this.state
          }).then((response) => {
            if (response.data != null && response.status == 200) {
              this.state.id = response.data.id;
              toast.success(t('mess_add'));
              this.setState({ ...this.state, loading: false });
            }
          });
        }
      }
    }
  }

  componentWillMount() {
    let { open, handleClose, item, isHealthOrg } = this.props;
    this.setState({
      ...this.props.item, isHealthOrg: isHealthOrg
    }, function () {
      let { qualification, level, healthOrgType } = this.state;
      if (healthOrgType != null && healthOrgType.id != null) {
        this.setState({ healthOrgTypeId: healthOrgType.id })
      }
      if (qualification != null && qualification.id != null) {
        this.setState({ qualificationId: qualification.id })
      }

      if (level != null && level.id != null) {
        this.setState({ levelId: level.id })
      }
    }
    );
  }
  componentDidMount() {

    getAllQualifications().then((data) => {
      let qualificationSelect = data.data;
      this.setState({ qualificationSelect: qualificationSelect });
    });


    getAllEQAhealthOrgLevels().then((data) => {
      let levelHealOrg = data.data;
      this.setState({ levelHealOrg: levelHealOrg })
    });
    ValidatorForm.addValidationRule("isLengthNumber", value => {
      if (value.length > 10) {
        return false;
      }
      return true;
    });
  }

  handleSearchDialogClose = () => {
    this.setState({
      shouldOpenSearchDialog: false
    });
  };
  handleSearchOrgTypeDialogClose = () => {
    this.setState({
      shouldOpenSearchOrgTypeDialog: false
    });
  };
  handleSelectHealthOrgType = (item) => {
    this.setState({ healthOrgType: item });
    this.handleSearchOrgTypeDialogClose();
  }
  handleSelectAdministrativeUnitType = (item) => {
    this.setState({ administrativeUnit: item });
    this.handleSearchDialogClose();
  }

  render() {
    let {
      id,
      name,
      publishDate,
      code,
      description,
      isManualSetCode,
      address,
      isView,
      contactName, levelId, shouldOpenAdministrativeUnitsPopup,
      contactPhone, levelHealOrg,
      shouldOpenSearchOrgTypeDialog,
      shouldOpenConfirmationDialog, isManagementUnit,
      shouldOpenSearchDialog, sampleReceiptDate,
      administrativeUnit,
      email, qualificationId, qualificationSelect, specifyQualification, officerPosion, unitCodeOfProgramPEQAS, fax,
      sampleStatus, healthOrgTypeSelect, healthOrgType, healthOrgTypeId,
      technician, specifyTechnician, positiveAffirmativeRight, sampleRecipient, specifySampleStatus, specifyLevel, taxCodeOfTheUnit,
      hasErrorLever, loading
    } = this.state;
    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    let { open, handleClose, handleOKEditClose, t, i18n, isHealthOrg } = this.props;

    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth="lg" fullWidth={true}>
        <div className={clsx("wrapperButton", !loading && 'hidden')} >
          <CircularProgress className="buttonProgress" size={24} />
        </div>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20 styleColor"> {(id ? t("update") : t("Add")) + " " + t("EQAHealthOrg.title")} </span>
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
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <AsynchronousAutocomplete
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EQAHealthOrg.HealthOrgType")}
                    </span>
                  }
                  size="small"
                  searchFunction={getAllHealthOrgType}
                  searchObject={searchObject}
                  defaultValue={healthOrgType}
                  value={healthOrgType}
                  displayLable={'name'}
                  valueTextValidator={healthOrgType}
                  onSelect={this.handleSelectHealthOrgType}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAHealthOrg.taxCodeOfTheUnit")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="taxCodeOfTheUnit"
                  value={taxCodeOfTheUnit}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAHealthOrg.unitCodeOfProgramPEQAS")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="unitCodeOfProgramPEQAS"
                  value={unitCodeOfProgramPEQAS}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EQAHealthOrg.Name")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              {!isHealthOrg && (<Grid item lg={4} md={4} sm={6} xs={12}>
                <FormControlLabel
                  variant="outlined"
                  size="small"
                  label={<span className="font">{t('EQAHealthOrg.isManualSetCode')}</span>}
                  control={<Checkbox checked={isManualSetCode}
                    onChange={(isManualSetCode) =>
                      this.handleChange(isManualSetCode, "isManualSetCode")
                    }
                  />}
                />
              </Grid>)}
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAHealthOrg.Code")}</span>}
                  onChange={this.handleChange}
                  disabled={!isManualSetCode}
                  type="text"
                  name="code"
                  value={code}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item lg={4} md={4} sm={12} xs={12}>
                <FormControlLabel
                  variant="outlined"
                  size="small"
                  disabled={isHealthOrg}
                  label={<span style={{ fontSize: "115%" }} className="font">{t('EQAHealthOrg.positiveAffirmativeRight')}</span>}
                  control={<Checkbox checked={positiveAffirmativeRight}
                    onChange={(positiveAffirmativeRight) =>
                      this.handleChange(positiveAffirmativeRight, "positiveAffirmativeRight")
                    }
                  />}
                />
       
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  className="w-100 "
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EQAHealthOrg.AdministrativeUnit")}
                    </span>
                  }
                  name="administrativeUnit"
                  value={administrativeUnit ? administrativeUnit.name : ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          size={'small'}
                          disabled={isView}
                          className="align-bottom"
                          variant="contained"
                          color="primary"
                          onClick={() => this.setState({ shouldOpenAdministrativeUnitsPopup: true })}
                        >
                          {t('Select')}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
                {shouldOpenAdministrativeUnitsPopup && (
                  <AdministrativeUnitsPopup
                    open={shouldOpenAdministrativeUnitsPopup}
                    handleSelect={this.handleSelectAdministrativeUnit}
                    item={administrativeUnit}
                    handleClose={this.handleChangeAdministrativeUnitPopupClose}
                    t={t} i18n={i18n}
                  ></AdministrativeUnitsPopup>
                )
                }
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EQAHealthOrg.Address")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="address"
                  value={address}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAHealthOrg.fax")}</span>}
                  onChange={this.handleChange}
                  type="fax"
                  name="fax"
                  value={fax}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAHealthOrg.ContactName")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="contactName"
                  value={contactName}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAHealthOrg.officerPosion")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="officerPosion"
                  value={officerPosion}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAHealthOrg.contactPhone")}</span>}
                  onChange={this.handleChange}
                  type="number"
                  name="contactPhone"
                  value={contactPhone}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EQAHealthOrg.email")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="email"
                  value={email}
                  validators={["required", "isEmail"]}
                  errorMessages={[
                    t("general.errorMessages_required"),
                    t("general.errorMessages_email_valid")
                  ]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <FormControl className="w-100" variant="outlined" size="small">
                  <InputLabel htmlFor="qualification">{<span className="font">{t("EQAHealthOrg.qualification")}</span>}</InputLabel>
                  <Select
                    value={qualificationId}
                    onChange={event => this.handleChangeQualification(event)}
                    inputProps={{
                      name: "qualification",
                      id: "qualification"
                    }}

                  >
                    {qualificationSelect.map(type => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>

                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAHealthOrg.specifyQualification") + "(" + t("if") + ")"}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="specifyQualification"
                  value={specifyQualification}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <FormControl className="w-100" error={hasErrorLever} variant="outlined" size="small">
                  <InputLabel htmlFor="levelHealOrg"><span className="font">
                    <span style={{ color: "red" }}> * </span>
                    {t("EQAHealthOrg.levelHealOrg")}
                  </span></InputLabel>
                  <Select
                    value={levelId}
                    onChange={event => this.handleChangelevel(event)}
                    inputProps={{
                      name: "level",
                      id: "level"
                    }}
                  >{levelHealOrg.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}

                  </Select>
                  {hasErrorLever && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAHealthOrg.specifyLevel")}</span>}
                  name="specifyLevel"
                  onChange={this.handleChange}
                  value={specifyLevel}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>

          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleClose()}>
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

export default EQAHealthOrgEditorDialog;
