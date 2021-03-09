import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogActions,
  DialogTitle,
  FormControlLabel,
  DialogContent,
  TablePagination,
  Checkbox,
  IconButton,
  Icon
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  checkCode,
  checkCodeSerum,
  addNewEQASerumBank,
  updateEQASerumBank
} from "./EQASerumBankService";
import { saveOrUpdateMultipleEQASerumBottle } from "../EQASerumBottle/EQASerumBottleService.js";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader
} from "material-table";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DateTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import LocalValue from "./Constants";
import Select from "@material-ui/core/Select";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import { toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import '../../../styles/views/_style.scss';

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
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



class EQASerumBankEditorDialog extends Component {
  state = {
    name: "",
    serumCode: "", //Mã ngân hàng huyết thanh
    originalCode: "", //Mã nguyên bản
    type: 0, //Loại mẫu:máu, huyết thanh, huyết tương, khác...; giá trị: PIConst.SerumType
    originalVolume: 0, //Dung tích ban đầu
    presentVolume: 0, //Dung tích hiện thời
    quality: null, //Chất lượng mẫu; giá trị: PIConst.SerumQuality
    hepatitisBStatus: 0, //Tình trạng nhiễm viêm gan B, âm tính hay dương tính, giá trị: PIConst.SampleStatus
    hepatitisCStatus: 0, //Tình trạng nhiễm viêm gan C, âm tính hay dương tính, giá trị: PIConst.SampleStatus
    sampledDate: new Date(), //Ngày lấy mẫu
    receiveDate: new Date(), //Ngày nhận mẫu
    storeLocation: "",
    isActive: false,
    isManualSetCode: false,
    isView: false,
    note: "",
    serumBottles: [], //Danh sach ong serum cua ngan hang
    rowsPerPage: 5,
    bottleData: {},
    page: 0
  };

  handleChange = (event, source) => {
    event.persist();
    if (source === "hivStatus") {
      this.setState({ hivStatus: event.target.value });
    }
    if (source === "originalVolume") {
      this.setState({ presentVolume: event.target.value });
    }
    if (source === "isManualSetCode") {
      this.setState({ isManualSetCode: event.target.checked })
    }

    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSampledDateChange = sampledDate => {
    this.setState({ sampledDate });
  };

  handleReceiveDateChange = receiveDate => {
    this.setState({ receiveDate });
  };

  handleDivideToBottle = () => {
    let serumBottles = [];
    let { numberBottle } = this.state;
    for (let i = 0; i < numberBottle; i++) {
      serumBottles.push({
        code:
          this.state.serumCode != ""
            ? this.state.serumCode + "-" + i + 1
            : i + 1,
        hivStatus: this.state.hivStatus,
        bottleQuality: this.state.bottleQuality,
        bottleVolume: this.state.bottleVolume,
        localSaveBottle: this.state.localSaveBottle,
        note: this.state.noteBottle
      });
    }
    this.setState({
      serumBottles: serumBottles, numberBottlesRemaining: numberBottle
    });
    // console.log(numberBottle, this.state.numberBottlesRemaining);
  };

  handleOneBottle = () => {
    let { serumBottles, numberBottle, numberBottlesRemaining } = this.state;
    let serumBottle = {};
    serumBottle.code = this.state.serumCode + "-" + (serumBottles.length + 1);
    serumBottle.hivStatus = this.state.hivStatus;
    serumBottle.bottleQuality = this.state.bottleQuality;
    serumBottle.bottleVolume = this.state.bottleVolume;
    serumBottle.localSaveBottle = this.state.localSaveBottle;
    serumBottle.note = this.state.noteBottle;
    serumBottles.push(serumBottle);
    numberBottle = serumBottles.length;
    numberBottlesRemaining = numberBottlesRemaining + 1;
    this.setState({ serumBottles, numberBottle, numberBottlesRemaining });
  };

  handleChangeSerumBottleData = (code, event) => {
    let { serumBottles } = this.state;
    if (isNaN(code)) {
      code = code.split("-");
      code = parseInt(code[code.length - 1]);
    }
    serumBottles[code - 1] = {
      ...serumBottles[code - 1],
      [event.target.name]: event.target.value
    };
    this.setState({
      serumBottles
    });
  };


  handleFormSubmit = () => {
    let { id } = this.state;
    let { originalCode, serumBottles, serumCode, isManualSetCode } = this.state;
    let { t } = this.props;
    this.setState({ isView: true });
    if (isManualSetCode) {
      checkCodeSerum(id, serumCode).then(res => {
        if (res.data) {
          toast.warning(t("EQASerumBank.duplicateSerumCode"));
          this.setState({ isView: false });
        } else {
          checkCode(id, originalCode).then(result => {
            if (result.data) {
              toast.warning(t("EQASerumBank.duplicateOriginalCode"));
              this.setState({ isView: false });
            } else {
              if (serumBottles != null && serumBottles.length > 0) {
                if (id) {
                  updateEQASerumBank({
                    ...this.state
                  }).then((response) => {
                    if (response.data != null && response.status == 200) {
                      // this.props.handleOKEditClose();
                      this.state.id = response.data.id;
                      this.setState({ ...this.state, isView: false })
                      toast.success(t("mess_edit"));
                    }
                  }).catch(() => {
                    toast.warning(t("mess_edit_error"));
                    this.setState({ isView: false });
                  });
                } else {
                  addNewEQASerumBank({
                    ...this.state
                  }).then((response) => {
                    if (response.data != null && response.status == 200) {
                      // this.props.handleOKEditClose();
                      this.state.id = response.data.id;
                      this.setState({ ...this.state, isView: false })
                      toast.success(t("mess_add"));
                    }
                  }).catch(() => {
                    toast.warning(t("mess_add_error"));
                    this.setState({ isView: false });
                  })
                }
              } else {
                toast.warning(t("SampleManagement.eqaSampleBottlesisNull"));
                this.setState({ isView: false });
              }
            }
          });
        }
      })
    } else {
      checkCode(id, originalCode).then(result => {
        if (result.data) {
          toast.warning(t("EQASerumBank.duplicateOriginalCode"));
          this.setState({ isView: false });
        } else {
          if (serumBottles != null && serumBottles.length > 0) {
            if (id) {
              updateEQASerumBank({
                ...this.state
              }).then((response) => {
                if (response.data != null && response.status == 200) {
                  // this.props.handleOKEditClose();
                  this.state.id = response.data.id;
                  this.setState({ ...this.state, isView: false })
                  toast.success(t("mess_edit"));
                }
              }).catch(() => {
                toast.warning(t("mess_edit_error"));
                this.setState({ isView: false });
              });
            } else {
              addNewEQASerumBank({
                ...this.state
              }).then((response) => {
                if (response.data != null && response.status == 200) {
                  // this.props.handleOKEditClose();
                  this.state.id = response.data.id;
                  this.setState({ ...this.state, isView: false })
                  toast.success(t("mess_add"));
                }
              }).catch(() => {
                toast.warning(t("mess_add_error"));
                this.setState({ isView: false });
              });
            }
          } else {
            toast.warning(t("SampleManagement.eqaSampleBottlesisNull"));
            this.setState({ isView: false });
          }
        }
      });
    }
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: event.target.value,
      page: 0
    });
  };

  componentWillMount() {
    //getUserById(this.props.uid).then(data => this.setState({ ...data.data }));
    let { open, handleClose, item } = this.props;
    let { numberBottle, numberBottlesRemaining } = this.state;
    if (!item.serumBottles) item.serumBottles = [];
    item.serumBottles = item.serumBottles;
    numberBottle = item.serumBottles.length;
    this.setState({
      ...item,
      numberBottle: item.numberBottle,
      numberBottlesRemaining: item.numberBottlesRemaining,
      // originalResult: item.serumBottles[0]?.originalResult,
      bottleVolume: item.serumBottles[0]?.bottleVolume,
      bottleQuality: item.serumBottles[0]?.bottleQuality,
      localSaveBottle: item.serumBottles[0]?.localSaveBottle,
      noteBottle: item.serumBottles[0]?.note
    });
  }

  render() {
    let {
      id,
      name,
      bottleData,
      isManualSetCode,
      serumCode,
      isView,
      originalCode,
      labCode,
      createBy,
      createDateTime,
      numberBottlesRemaining,
      type,
      originalVolume,
      presentVolume,
      hivStatus,
      numberBottle,
      hasLipid,
      hemolysis,
      hasHighSpeedCentrifugal,
      dialysis,
      inactivated,
      storeLocation,
      sampledDate,
      receiveDate,
      originalResult,
      bottleQuality,
      bottleVolume,
      localSaveBottle,
      serumBottles,
      page,
      note,
      noteBottle,
      rowsPerPage
    } = this.state;

    let { t, open, handleClose, handleOKEditClose } = this.props;

    const currentSerumBottleList = serumBottles;
    // if(serumBottles){
    //     currentSerumBottleList =serumBottleList.slice(
    //     page * rowsPerPage,
    //     page * rowsPerPage + rowsPerPage
    //   );
    // }
    let columns = [
      {
        title: t("general.code"),
        field: "code",
        align: "left",
        width: "50"
      },
      {
        title: t("SampleManagement.serum-bottle.bottleQuality"),
        field: "bottleQuality",
        align: "left",
        width: "150",
        render: rowData => (
          <FormControl className="w-100">
            {/* <InputLabel htmlFor="bottleQuality">
            {t("SampleManagement.serum-bottle.bottleQuality")}
          </InputLabel> */}
            <Select
              name="bottleQuality"
              value={rowData.bottleQuality ? rowData.bottleQuality : ""}
              onChange={event =>
                this.handleChangeSerumBottleData(rowData.code, event)
              }
              input={<Input id="bottleQuality" />}>
              <MenuItem value={LocalValue.EQASerumBottle_Value.yes}>{t("EQASerumBank.Yes")}</MenuItem>
              <MenuItem value={LocalValue.EQASerumBottle_Value.no} >{t("EQASerumBank.No")}</MenuItem>
            </Select>
          </FormControl>
        )
      },
      {
        title: t("SampleManagement.serum-bottle.bottleVolume"),
        field: "bottleVolume",
        align: "left",
        width: "150",
        render: rowData => (
          <TextValidator
            className="w-100"
            // label={t("SampleManagement.serum-bottle.bottleVolume")}
            onChange={event =>
              this.handleChangeSerumBottleData(rowData.code, event)
            }
            type="number"
            name="bottleVolume"
            value={rowData.bottleVolume}
            validators={["required"]}
            errorMessages={[t("general.errorMessages_required")]}
          />
        )
      },
      {
        title: t("SampleManagement.serum-bottle.localSaveBottle"),
        field: "localSaveBottle",
        align: "left",
        width: "150",
        render: rowData => (
          <TextValidator
            className="w-100"
            // label={t("SampleManagement.serum-bottle.localSaveBottle")}
            onChange={event =>
              this.handleChangeSerumBottleData(rowData.code, event)
            }
            type="number"
            name="localSaveBottle"
            value={rowData.localSaveBottle}
            validators={["required"]}
            errorMessages={[t("general.errorMessages_required")]}
          />
        )
      },
      {
        title: t("SampleManagement.serum-bottle.note"),
        field: "note",
        align: "left",
        width: "150",
        render: rowData => (
          <TextValidator
            className="w-100"
            // label={t("SampleManagement.serum-bottle.note")}
            onChange={event =>
              this.handleChangeSerumBottleData(rowData.code, event)
            }
            type="text"
            name="note"
            value={rowData.note}
          />
        )
      }
    ];

    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="mb-20 styleColor"> {(id ? t("update") : t("Add")) + " " + t("EQASerumBankTable.title")} </span>
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
            flexDirection: "column"
          }}
        >
          <DialogContent dividers>
            <Grid className="mb-16" container spacing={2}>
              <Grid item container sm={12} xs={12} spacing={2}>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("EQASerumBank.originalCode")}
                    </span>
                    }
                    onChange={this.handleChange}
                    type="text"
                    size="small"
                    variant="outlined"
                    name="originalCode"
                    value={originalCode}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                  />
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <FormControl className="w-100" variant="outlined" size="small">
                    <InputLabel htmlFor="type">
                      {<span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("EQASerumBank.type.title")}
                      </span>
                      }
                    </InputLabel>
                    <Select
                      value={type}
                      onChange={event => this.handleChange(event)}
                      inputProps={{
                        name: "type",
                        id: "type"
                      }}
                    >
                      <MenuItem value={LocalValue.EQASerumBankSample_Value.Serum}>
                        {t("EQASerumBank.type.Serum")}
                      </MenuItem>
                      <MenuItem value={LocalValue.EQASerumBankSample_Value.Plasma}>
                        {t("EQASerumBank.type.Plasma")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {/* <Grid item sm={4} xs={12}>
                <TextValidator
                  className="w-100"
                  label={t("EQASerumBank.labCode")}
                  onChange={this.handleChange}
                  type="text"
                  name="labCode"
                  value={labCode}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
                </Grid> */}
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <FormControlLabel
                    label={<span className="font">{t('EQASerumBank.isManualSetCode')}</span>}
                    control={<Checkbox checked={isManualSetCode}
                      onChange={(isManualSetCode) =>
                        this.handleChange(isManualSetCode, "isManualSetCode")
                      }
                    />}

                  />
                </Grid>
                {isManualSetCode && <Grid item lg={3} md={3} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("EQASerumBank.serumCode")}</span>}
                    onChange={this.handleChange}
                    type="text"
                    size="small"
                    name="serumCode"
                    variant="outlined"
                    value={serumCode}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                  />
                </Grid>}
              </Grid>

              <Grid item container sm={12} xs={12} spacing={2}>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("EQASerumBank.originalVolume") + "(ml)"}</span>}
                    onChange={event => this.handleChange(event, "originalVolume")}
                    type="number"
                    name="originalVolume"
                    size="small"
                    variant="outlined"
                    value={originalVolume}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                  />
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("EQASerumBank.presentVolume") + "(ml)"}</span>}
                    onChange={this.handleChange}
                    type="number"
                    variant="outlined"
                    size="small"
                    name="presentVolume"
                    value={presentVolume}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                  />
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      className="w-100"
                      margin="none"
                      id="mui-pickers-date"
                      label={<span className="font">{t("EQASerumBank.sampledDate")}</span>}
                      inputVariant="outlined"
                      type="text"
                      size="small"
                      autoOk={true}
                      format="dd/MM/yyyy"
                      invalidDateMessage={t("Invalid_Date_Format")}
                      value={new Date(sampledDate)}
                      onChange={this.handleSampledDateChange}
                      fullWidth
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      className="w-100"
                      margin="none"
                      id="mui-pickers-date"
                      label={<span className="font">{t("EQASerumBank.receiveDate")}</span>}
                      inputVariant="outlined"
                      type="text"
                      size="small"
                      autoOk={true}
                      format="dd/MM/yyyy"
                      value={new Date(receiveDate)}
                      onChange={this.handleReceiveDateChange}
                      fullWidth
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("EQASerumBank.storeLocation")}</span>}
                    onChange={this.handleChange}
                    type="text"
                    size="small"
                    variant="outlined"
                    name="storeLocation"
                    value={storeLocation}
                  />
                </Grid>

                {createBy != null && (<Grid item lg={3} md={3} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("SampleManagement.serum-bottle.createBy")}</span>}
                    onChange={this.handleChange}
                    type="text"
                    size="small"
                    variant="outlined"
                    name="createBy"
                    value={createBy}
                    disabled={true}
                  />
                </Grid>)}

                {/* <Grid item sm={4} xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    className="w-100"
                    margin="none"
                    id="mui-pickers-date"
                    label={t("SampleManagement.serum-bottle.createDate")}
                    inputVariant="standard"
                    type="text"
                    disabled={true}
                    // format={moment(createDate).format("DD/MM/YYYY")}
                    value={moment(createDate).format("DD/MM/YYYY")}
                  />
                </MuiPickersUtilsProvider>
              </Grid> */}
                {createDateTime != null && (<Grid item lg={3} md={3} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("SampleManagement.serum-bottle.createDate")}</span>}
                    type="text"
                    size="small"
                    name="createDateTime"
                    variant="outlined"
                    value={moment(createDateTime).format("DD/MM/YYYY")}
                    disabled={true}
                  />
                </Grid>)}
                {(createBy) ? (<Grid item lg={12} md={12} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("SampleManagement.serum-bottle.note")}</span>}
                    onChange={this.handleChange}
                    type="text"
                    size="small"
                    variant="outlined"
                    name="note"
                    value={note}
                  />
                </Grid>) : (<Grid item lg={9} md={9} sm={12} xs={12}>
                  <TextValidator
                    className="w-100"
                    label={<span className="font">{t("SampleManagement.serum-bottle.note")}</span>}
                    onChange={this.handleChange}
                    type="text"
                    size="small"
                    variant="outlined"
                    name="note"
                    value={note}
                  />
                </Grid>)}
              </Grid>

              <fieldset className="mt-16" style={{ width: "100%" }}>
                <legend>{<span className="styleColor">{t("EQASerumBank.Details")}</span>}</legend>
                <Grid item container sm={12} xs={12} spacing={2}>
                  <Grid item lg={4} md={4} sm={12} xs={12}>
                    <FormControl className="w-100" variant="outlined" size="small">
                      <InputLabel htmlFor="result">
                        {<span className="font">{t("EQASerumBank.hivStatus")}</span>}
                      </InputLabel>
                      <Select
                        // name="hivStatus"
                        value={typeof hivStatus == "undefined" ? '' : hivStatus}
                        onChange={hivStatus => this.handleChange(hivStatus, "hivStatus")}
                        // input={<Input id="hivStatus" />}
                        inputProps={{
                          name: "hivStatus",
                          id: "hivStatus"
                        }}
                      >
                        <MenuItem value={LocalValue.EQAResult_Value.negative}>
                          {t("SampleManagement.sample-list.Result.negative")}
                        </MenuItem>
                        <MenuItem value={LocalValue.EQAResult_Value.positive}>
                          {t("SampleManagement.sample-list.Result.positive")}
                        </MenuItem>
                        <MenuItem value={LocalValue.EQAResult_Value.indertermine}>
                          {t("SampleManagement.sample-list.Result.indertermine")}
                        </MenuItem>
                        <MenuItem value={LocalValue.EQAResult_Value.Not_Implemented}>
                          {t("SampleManagement.sample-list.Result.none")}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item lg={4} md={4} sm={12} xs={12}>
                    <FormControl className="w-100" variant="outlined" size="small">
                      <InputLabel htmlFor="hasLipid">
                        {<span className="font">{t("EQASerumBank.hasLipid")}</span>}
                      </InputLabel>
                      <Select
                        // name="hasLipid"
                        value={typeof hasLipid == "undefined" ? '' : hasLipid}
                        onChange={event => this.handleChange(event)}
                        // input={<Input id="hasLipid" />}
                        inputProps={{
                          name: "hasLipid",
                          id: "hasLipid"
                        }}
                      >
                        <MenuItem value={LocalValue.EQAStatusSample_value.yes}>{t("Yes")}</MenuItem>
                        <MenuItem value={LocalValue.EQAStatusSample_value.no}>{t("No")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={4} md={4} sm={12} xs={12}>
                    <FormControl className="w-100" variant="outlined" size="small">
                      <InputLabel htmlFor="hemolysis">
                        {<span className="font">{t("EQASerumBank.hemolysis")}</span>}
                      </InputLabel>
                      <Select
                        // name="hemolysis"
                        value={typeof hemolysis == "undefined" ? '' : hemolysis}
                        onChange={event => this.handleChange(event)}
                        // input={<Input id="hemolysis" />}
                        inputProps={{
                          name: "hemolysis",
                          id: "hemolysis"
                        }}
                      >
                        <MenuItem value={LocalValue.EQAStatusSample_value.yes}>{t("Yes")}</MenuItem>
                        <MenuItem value={LocalValue.EQAStatusSample_value.no}>{t("No")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={4} md={4} sm={12} xs={12}>
                    <FormControl className="w-100" variant="outlined" size="small">
                      <InputLabel htmlFor="hasHighSpeedCentrifugal">
                        {<span className="font">{t("EQASerumBank.hasHighSpeedCentrifugal")}</span>}
                      </InputLabel>
                      <Select
                        // name="hasHighSpeedCentrifugal"
                        value={hasHighSpeedCentrifugal == "undefined" ? '' : hasHighSpeedCentrifugal}
                        onChange={event => this.handleChange(event)}
                        // input={<Input id="hasHighSpeedCentrifugal" />}
                        inputProps={{
                          name: "hasHighSpeedCentrifugal",
                          id: "hasHighSpeedCentrifugal"
                        }}
                      >
                        <MenuItem value={LocalValue.EQAStatusSample_value.yes}>{t("Yes")}</MenuItem>
                        <MenuItem value={LocalValue.EQAStatusSample_value.no}>{t("No")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={4} md={4} sm={12} xs={12}>
                    <FormControl className="w-100" variant="outlined" size="small">
                      <InputLabel htmlFor="dialysis">
                        {<span className="font">{t("EQASerumBank.dialysis")}</span>}
                      </InputLabel>
                      <Select
                        // name="dialysis"
                        value={typeof dialysis == "undefined" ? '' : dialysis}
                        onChange={event => this.handleChange(event)}
                        // input={<Input id="dialysis" />}
                        inputProps={{
                          name: "dialysis",
                          id: "dialysis"
                        }}
                      >
                        <MenuItem value={LocalValue.EQAStatusSample_value.yes}>{t("Yes")}</MenuItem>
                        <MenuItem value={LocalValue.EQAStatusSample_value.no}>{t("No")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={4} md={4} sm={12} xs={12}>
                    <FormControl className="w-100" variant="outlined" size="small">
                      <InputLabel htmlFor="inactivated">
                        {<span className="font">{t("EQASerumBank.inactivated")}</span>}
                      </InputLabel>
                      <Select

                        value={typeof inactivated == "undefined" ? '' : inactivated}
                        onChange={event => this.handleChange(event)}
                        // input={<Input id="inactivated" />}
                        inputProps={{
                          name: "inactivated",
                          id: "inactivated"
                        }}
                      >
                        <MenuItem value={LocalValue.EQAStatusSample_value.yes}>{t("Yes")}</MenuItem>
                        <MenuItem value={LocalValue.EQAStatusSample_value.no}>{t("No")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </fieldset>

              <fieldset className="mt-16" style={{ width: "100%" }}>
                <legend>{<span className="styleColor">{t("EQASerumBank.divideBottle")}</span>}</legend>
                <Grid item className="mt-8" container sm={12} xs={12} spacing={2}>
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <TextValidator
                      className="w-100"
                      label={<span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("EQASerumBank.numberBottle")}
                      </span>
                      }
                      size="small"
                      onChange={this.handleChange}
                      type="number"
                      variant="outlined"
                      name="numberBottle"
                      value={numberBottle}
                      validators={["required"]}
                      errorMessages={[t("general.errorMessages_required")]}
                    />
                  </Grid>
                  {/* <Grid item sm={4} xs={12}>
                    <FormControl className="w-100">
                      <InputLabel htmlFor="originalResult">
                        {t(
                          "SampleManagement.serum-bottle.OriginnalResult.title"
                        )}
                      </InputLabel>
                      <Select
                        name="originalResult"
                        value={typeof originalResult == "undefined" ? '' : originalResult}
                        onChange={event => this.handleChange(event)}
                        input={<Input id="originalResult" />}
                      >
                        <MenuItem value = {LocalValue.EQAResult_Value.negative}>
                          {t(
                            "SampleManagement.serum-bottle.OriginnalResult.positive"
                          )}
                        </MenuItem>
                        <MenuItem value = {LocalValue.EQAStatusSample_value.no}>
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
                          {t(
                            "SampleManagement.serum-bottle.OriginnalResult.none"
                          )}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <FormControl fullWidth={true} variant="outlined" size="small">
                      <InputLabel htmlFor="bottleQuality">
                        {<span className="font">
                          <span style={{ color: "red" }}> * </span>
                          {t("SampleManagement.serum-bottle.bottleQuality")}
                        </span>
                        }
                      </InputLabel>
                      <Select

                        value={bottleQuality}
                        onChange={event => this.handleChange(event)}
                        // input={<Input id="bottleQuality" />}
                        inputProps={{
                          name: "bottleQuality",
                          id: "bottleQuality"
                        }}
                      >
                        <MenuItem value={LocalValue.EQASerumBottle_Value.yes}>{t("EQASerumBank.Yes")}</MenuItem>
                        <MenuItem value={LocalValue.EQASerumBottle_Value.no}>{t("EQASerumBank.No")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <TextValidator
                      className="w-100"
                      label={<span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("SampleManagement.serum-bottle.bottleVolume")}
                      </span>
                      }
                      size="small"
                      onChange={this.handleChange}
                      type="number"
                      variant="outlined"
                      name="bottleVolume"
                      value={bottleVolume}
                      validators={["required"]}
                      errorMessages={[t("general.errorMessages_required")]}
                    />
                  </Grid>
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <TextValidator
                      className="w-100"
                      label={<span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("SampleManagement.serum-bottle.localSaveBottle")}
                      </span>
                      }
                      size="small"
                      onChange={this.handleChange}
                      type="number"
                      variant="outlined"
                      value={localSaveBottle}
                      name="localSaveBottle"
                      validators={["required"]}
                      errorMessages={[t("general.errorMessages_required")]}
                    />
                  </Grid>
                  <Grid item sm={12} xs={12}>
                    <TextValidator
                      className="w-100"
                      label={<span className="font">{t("SampleManagement.serum-bottle.note")}</span>}
                      onChange={this.handleChange}
                      type="text"
                      size="small"
                      variant="outlined"
                      name="noteBottle"
                      value={noteBottle}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12}>
                    <Button
                      className="mb-16 mr-16"
                      variant="contained"
                      color="primary"
                      onClick={
                        id ? this.handleOneBottle : this.handleDivideToBottle
                      }
                    >
                      {id ? t("EQASerumBank.divideABottlte") : t("EQASerumBank.divideBottle")}
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <MaterialTable
                    title={<span className="font">{t("SampleManagement.serum-bottle.title")}</span>}
                    columns={columns}
                    data={currentSerumBottleList}
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
                        color: '#fff',
                      },
                      padding: 'dense',
                      toolbar: false
                    }}
                    components={{
                      Toolbar: props => (
                        <div
                          style={{
                            witdth: "100%"
                          }}
                        >
                          <MTableToolbar {...props} />
                        </div>
                      )
                    }}
                    onSelectionChange={rows => {
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
              </fieldset>
            </Grid>
          </DialogContent>

          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.props.handleClose()}
            >
              {t("Cancel")}
            </Button>
            <Button variant="contained" color="primary" type="submit" disabled={isView}>
              {t("Save")}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQASerumBankEditorDialog;
