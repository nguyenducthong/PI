import React, { Component } from "react";
import {
  Dialog,
  Button,
  DialogActions,
  Grid,
  Checkbox,
  FormControlLabel,
  DialogTitle,
  TextField,
  DialogContent,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  FormHelperText
} from "@material-ui/core";
import { TextValidator } from "react-material-ui-form-validator";
import { checkCode, addNewReagent, updateReagent } from "./ReagentService";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocalConstants from "./Constants";
import DateFnsUtils from "@date-io/date-fns";
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

class ReagentInformation extends Component {
  state = {
    name: "",
    code: "",
    description: "",
    registrationNumber: "",//Số đăng ký
    dateOfIssue: new Date(), //Ngày cấp
    expirationDate: new Date(), //Ngày hết hạn
    activeIngredients: "", //Hoạt chất
    dosageForms: "", //Dạng bào chế
    packing: "", //Quy cách đóng gói
    registeredFacilityName: "", //Tên cơ sở đăng ký
    productionFacilityName: "", //Tên cơ sở sản xuất
    healthDepartmentDirectory: true, //thuộc bộ y tế
    testType: null, //Thuộc phương pháp xét nghiệm nào
    isActive: false,
    isView: false,
    hasTestType: false
  };

  handleChange = (event, source) => {
    event.persist();
    let { item } = this.state
    if (source === "switch") {
      item["isActive"] = event.target.checked
      this.setState({ item: item });
      return;
    }
    if (source === "active") {
      item["healthDepartmentDirectory"] = event.target.checked
      this.setState({ item: item });
      return;
    }
    if (source === "testType") {
      item["testType"] = event.target.value
      item["hasTestType"] = false
      this.setState({ item: item });
    }
    const name = event.target.name;
    const value = event.target.value;
    item[name] = value
    this.setState({
      item: item
    });
    // this.setState({
    //   [event.target.name]: event.target.value
    // });
  };

  handleDateChange = (date, name) => {
    let { item } = this.state
    if (name === "dateOfIssue") {
      item["dateOfIssue"] = date
    }
    if (name === "expirationDate") {
      item["expirationDate"] = date
    }

    this.setState({
      item: item
    });
  };
  handleDateOfIssueChange = (date) => {
    let { item } = this.state
    item["dateOfIssue"] = date
    this.setState({
      item: item
    });
  }

  handleExpirationDateChange = (date) => {
    let { item } = this.state
    item["expirationDate"] = date
    this.setState({
      item: item
    });
  }

  list() {
    let listMethod = [
      { value: LocalConstants.EQAResultReportTypeMethod.Elisa, name: "Elisa" },
      { value: LocalConstants.EQAResultReportTypeMethod.FastTest, name: "Test nhanh" },
      { value: LocalConstants.EQAResultReportTypeMethod.ECL, name: "Điện hóa phát quang" },
      { value: LocalConstants.EQAResultReportTypeMethod.SERODIA, name: "Serodia" },
    ]
    // console.log(listMethod);
    this.setState({ listMethod: listMethod });
  }


  componentWillMount() {
    let { open, handleClose, item } = this.props;
    if (item == null) {
      item = {}
    }
    this.setState({ item: item });
    this.list();


    // ValidatorForm.addValidationRule('checkMaxLength', (value) => {
    //   if (value.length > 1020) {
    //     return false;
    //   }
    //   return true;
    // });

    // ValidatorForm.addValidationRule('checkBox', (value) => {
    //   if (this.state.healthDepartmentDirectory == true) {
    //     if (value.length == 0) {
    //       return false;
    //     }
    //   }
    //   return true;
    // });
  }

  render() {
    let {
      id,
      name,
      code,
      isView,
      registrationNumber,//Số đăng ký
      dateOfIssue, //Ngày cấp
      expirationDate, //Ngày hết hạn
      activeIngredients, //Hoạt chất
      dosageForms, //Dạng bào chế
      packing, //Quy cách đóng gói
      registeredFacilityName, //Tên cơ sở đăng ký
      productionFacilityName, //Tên cơ sở sản xuất
      healthDepartmentDirectory,
      testType,
      listMethod,
      description,
      hasTestType
    } = this.state;

    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    return (
      <React.Fragment>
        <Grid className="mb-16" container spacing={2}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextValidator
              className="w-100"
              label={<span className="font"><span style={{ color: "red" }}> * </span>
                {t("reagent.name")}
              </span>}
              onChange={this.handleChange}
              type="text"
              name="name"
              value={this.state.item?.name}
              validators={["required"]}
              errorMessages={[t("general.errorMessages_required")]}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextValidator
              className="w-100"
              label={<span className="font"><span style={{ color: "red" }}> * </span>
                {t("Code")}
              </span>}
              onChange={this.handleChange}
              type="text"
              name="code"
              value={this.state.item?.code}
              validators={["required"]}
              errorMessages={[t("general.errorMessages_required")]}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextValidator
              className="w-100"
              label={<span className="font">{t("Description")}</span>}
              onChange={this.handleChange}
              type="text"
              multiline
              rowsMax={4}
              name="description"
              value={this.state.item?.description}
              validators={["checkMaxLength"]}
              errorMessages={[t('MaxLength')]}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextValidator
              className="w-100"
              label={<span className="font"><span style={{ color: "red" }}> * </span>
                {t("reagent.activeIngredients")}
              </span>}
              onChange={this.handleChange}
              type="text"
              name="activeIngredients"
              multiline
              rowsMax={4}
              value={this.state.item?.activeIngredients}
              validators={["required"]}
              errorMessages={[t("general.errorMessages_required")]}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextValidator
              className="w-100"
              label={<span className="font">{t("reagent.dosageForms")}</span>}
              onChange={this.handleChange}
              type="text"
              name="dosageForms"
              value={this.state.item?.dosageForms}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>

            <TextValidator
              className="w-100"
              label={<span className="font">{t("reagent.packing")}</span>}
              onChange={this.handleChange}
              type="text"
              name="packing"
              value={this.state.item?.packing}
              variant="outlined"
              size="small"
            />

          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                className="w-100"
                margin="none"
                id="mui-pickers-date"
                label={<span className="font">{t("reagent.dateOfIssue")}</span>}
                inputVariant="standard"
                type="text"
                autoOk={false}
                format="dd/MM/yyyy"
                value={this.state.item?.dateOfIssue ? this.state.item?.dateOfIssue : new Date()}
                onChange={this.handleDateOfIssueChange}
                validators={["required"]}
                errorMessages={[t("general.errorMessages_required")]}
                inputVariant="outlined"
                size="small"
              />
            </MuiPickersUtilsProvider>
          </Grid>


          <Grid item lg={6} md={6} sm={12} xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                className="w-100"
                margin="none"
                id="mui-pickers-date"
                label={<span className="font">{t("reagent.expirationDate")}</span>}
                inputVariant="standard"
                type="text"
                autoOk={false}
                format="dd/MM/yyyy"
                value={this.state.item?.expirationDate ? this.state.item?.expirationDate : new Date()}
                onChange={this.handleExpirationDateChange}
                validators={["required"]}
                errorMessages={[t("general.errorMessages_required")]}
                inputVariant="outlined"
                size="small"
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextValidator
              className="w-100"
              label={<span className="font"><span style={{ color: "red" }}> * </span>
                {t("reagent.registrationNumber")}
              </span>}
              onChange={this.handleChange}
              type="text"
              name="registrationNumber"
              value={this.state.item?.registrationNumber}
              validators={["checkBox"]}
              errorMessages={[t("general.errorMessages_required")]}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextValidator
              className="w-100"
              label={<span className="font"><span style={{ color: "red" }}> * </span>
                {t("reagent.registeredFacilityName")}
              </span>}
              onChange={this.handleChange}
              type="textarea"
              multiline
              rowsMax={4}
              name="registeredFacilityName"
              value={this.state.item?.registeredFacilityName}
              validators={["required"]}
              errorMessages={[t("general.errorMessages_required")]}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TextValidator
              className="w-100"
              label={<span className="font"><span style={{ color: "red" }}> * </span>
                {t("reagent.productionFacilityName")}
              </span>}
              onChange={this.handleChange}
              multiline
              rowsMax={4}
              type="text"
              name="productionFacilityName"
              value={this.state.item?.productionFacilityName}
              validators={["required"]}
              errorMessages={[t("general.errorMessages_required")]}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <FormControl className="w-100" error={this.state.item?.hasTestType} variant="outlined" size="small">
              <InputLabel htmlFor="testType">{<span className="font"><span style={{ color: "red" }}> * </span>
                {t("reagent.reagentType")}
              </span>}</InputLabel>
              <Select
                value={this.state.item?.testType}
                onClick={event => this.handleChange(event, "testType")}
                inputProps={{
                  name: "testType",
                  id: "testType"
                }}

              >
                {listMethod.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.name}
                  </MenuItem>

                ))}
              </Select>
              {this.state.item?.hasTestType && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* <Grid item lg={6} md={6} sm={12} xs={12}>
            <FormControlLabel
              variant="outlined"
              size="small"
              value={this.state.item?.healthDepartmentDirectory}
              className="mb-16"
              name="healthDepartmentDirectory"
              onChange={healthDepartmentDirectory => this.handleChange(healthDepartmentDirectory, "active")}
              control={<Checkbox
                checked={this.state.item?.healthDepartmentDirectory}
              />}
              label={<span className="font">{t("reagent.healthDepartmentDirectory")}</span>}
            />
          </Grid> */}
        </Grid>
      </React.Fragment>
    );
  }
}

export default ReagentInformation;
