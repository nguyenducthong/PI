import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogActions,
  FormControlLabel,
  InputAdornment, Checkbox,FormHelperText, Icon, IconButton
} from "@material-ui/core";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import {
  ValidatorForm,
  TextValidator,
  TextField,
  SelectValidator,
} from "react-material-ui-form-validator";
import {getCurrentUser} from "../page-layouts/UserProfileService";
import authService from "../../services/jwtAuthService";
import {searchByPage as getHealthOrg} from "../EQAHealthOrg/EQAHealthOrgService";
import {checkEmail, saveItem, getItemById} from "../EQAHealthOrg/EQAHealthOrgService";
import { toast } from 'react-toastify';

class LaboratoryInformation extends Component {
    state = {
        name: "",
        taxCodeOfTheUnit: "",
        code: "", specifyTestPurpose: "",
        address: "",
        specifyLevel: "",
        positiveAffirmativeRight: true,
        shouldOpenSearchDialog: false,
        shouldOpenConfirmationDialog: false,
        qualificationSelect: [],
        qualification: {}, officerPosion: "", unitCodeOfProgramPEQAS: "",
        testpurposeSelect: [],
        testPurpose1: {},
        testPurpose2: {},
        testPurpose3: {},
        testPurpose4: {},
        levelHealOrg: [],
        healthOrgTypeSelect: [],
        healthOrgType: [],
        administrativeUnit: "",
        fax: "",
        isView: true,
        shouldOpenAdministrativeUnitsPopup: false,
        level: {}, sampleReceiptDate: new Date(),
        sampleRecipient: "", specifySampleStatus: "", specifyQualification: "",
        isManualSetCode: false,
        hasErrorLever:false,
        levelId: "",
        loading: false
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
  handleChangetestpurpose1 = (event, source) => {
    let { testpurposeSelect } = this.state;
    this.setState({
      testPurpose1: testpurposeSelect.find(item => item.id == event.target.value),
      testPurpose1Id: event.target.value
    })
  }
  handleChangetestpurpose2 = (event, source) => {
    let { testpurposeSelect } = this.state;
    this.setState({
      testPurpose2: testpurposeSelect.find(item => item.id == event.target.value),
      testPurpose2Id: event.target.value
    })
  }
  handleChangetestpurpose3 = (event, source) => {
    let { testpurposeSelect } = this.state;
    this.setState({
      testPurpose3: testpurposeSelect.find(item => item.id == event.target.value),
      testPurpose3Id: event.target.value
    })
  }
  handleChangetestpurpose4 = (event, source) => {
    let { testpurposeSelect } = this.state;
    this.setState({
      testPurpose4: testpurposeSelect.find(item => item.id == event.target.value),
      testPurpose4Id: event.target.value
    })
  }
  handleChangelevel = (event, source) => {
    let { levelHealOrg } = this.state;
    this.setState({
      level: levelHealOrg.find(item => item.id == event.target.value),
      levelId: event.target.value,
      hasErrorLever : false
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

    // if(levelId == "" ){
    //   this.setState({hasErrorLever: true, loading:false});
    //   return
    // }
    if (email != null) {
      checkEmail(id, email).then(res => {
        if (res.data) {
          toast.warning(t("sign_up.duplicate_email"));
          this.setState({ loading: false });
          return
        } else {
            if (id) {
              saveItem({
                ...this.state
              }).then(() => {
                // this.props.handleOKEditClose();
                this.setState({ loading: false, isView: true });
                toast.success(t('mess_edit'));
              });

            }
            // console.log(123)
        }
      })
    } 

    // console.log(this.state);
  }

  componentWillMount() {
    getHealthOrg({pageSize: 1000000, pageIndex: 0}).then((res) => {
      getItemById(res.data.content[0].id).then((data) => {
        this.setState({
          ...data.data
        })
      })
    })
  

    
  }
  componentDidMount() {

    
    
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
    // console.log(this.state)
    let { t } = this.props;
    let {
        id,
        name,
        code,
        isManualSetCode,
        address,
        isView,
        contactName, levelId, shouldOpenAdministrativeUnitsPopup,
        contactPhone, levelHealOrg,
        shouldOpenSearchOrgTypeDialog,
        shouldOpenConfirmationDialog, isManagementUnit,
        shouldOpenSearchDialog, sampleReceiptDate,
        administrativeUnit, testPurpose1Id, testPurpose2Id, testPurpose3Id, testPurpose4Id,
        email, qualificationId, qualificationSelect, testpurposeSelect, specifyQualification, officerPosion, unitCodeOfProgramPEQAS, fax,
        sampleStatus, healthOrgTypeSelect, healthOrgType, healthOrgTypeId,
        technician, specifyTechnician, positiveAffirmativeRight, sampleRecipient, specifySampleStatus, specifyTestPurpose, specifyLevel, taxCodeOfTheUnit,
        hasErrorLever, loading
      } = this.state;
    return (
      <div>
          <Grid style={{marginBottom: 40}}>
            <span className="mb-20 styleColor"> Thông tin phòng xét nghiệm </span>
          </Grid>
          <Grid driver>
            <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} >
            <Grid className="" container spacing={2}>
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
                  disabled={this.state.isView}
                  value={name}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAHealthOrg.Code")}</span>}
                  onChange={this.handleChange}
                  disabled={true}
                  type="text"
                  name="code"
                  value={code}
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
                      {t("EQAHealthOrg.Address")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="address"
                  value={address}
                  disabled={this.state.isView}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
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
                  disabled={this.state.isView}
                  value={contactPhone ? contactPhone :""}
                  variant="outlined"
                  size="small"
                // validators={[ "matchRegexp:^[0-9]*$", "isLengthNumber"]}
                // errorMessages={[ t("general.errorMessages_phone_number_invalid"),
                // t("general.errorMessages_phone_number_invalid")]}
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
                  disabled={this.state.isView}
                  value={email? email:""}
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
                <TextValidator
                  className="w-100 "
                  label={<span className="font">{t("EQAHealthOrg.ContactName")}</span>}
                  onChange={this.handleChange}
                  type="text"
                  name="contactName"
                  disabled={this.state.isView}
                  value={contactName ? contactName : ""}
                  variant="outlined"
                  size="small"
                  validators={["required"]}
                  errorMessages={[
                    t("general.errorMessages_required")
                  ]}
                />
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <FormControlLabel
                  disabled
                  variant="outlined"
                  size="small"
                  label={<span style={{fontSize: "115%"}} className="font">{t('EQAHealthOrg.positiveAffirmativeRight')}</span>}
                  control={<Checkbox checked={positiveAffirmativeRight}
                    onChange={(positiveAffirmativeRight) =>
                      this.handleChange(positiveAffirmativeRight, "positiveAffirmativeRight")
                      // this.handleChange(isFinalResult, 'isFinalResult')
                    }
                  />}
                />
              </Grid>
            </Grid>
            <Grid className="flex flex-end flex-middle" container spacing={4}>
              {this.state.isView && (
                <Button
                className="mr-12"
                onClick={() => this.setState({isView: false})}
                variant="contained"
                color="primary">
                {t('Edit')}
              </Button>
              )}
              {!this.state.isView && (
                <Button
                variant="contained"
                color="primary"
                type="submit">
                {t('update')}
              </Button>
              )}
              
            </Grid>
            </ValidatorForm>
          </Grid>
      </div>
    );
  }
}

export default LaboratoryInformation;
