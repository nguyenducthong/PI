import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  DialogActions,
  DialogTitle,
  DialogContent, Icon, IconButton
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { saveItem } from "./EQAHealthOrgRoundRegisterService";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
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

class SampleTransferStatusEditorDialog extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    shippingUnit: "",
    deliveryDate: null,
    sampleTransferStatus: 1,
    isActive: false,
    listSampleTransferStatus: [
      {
        id: 1,
        name: this.props.t("EQAHealthOrgSampleTransferStatus.wait_for_transfer")
      },
      {
        id: 2,
        name: this.props.t("EQAHealthOrgSampleTransferStatus.delivered")
      },
      {
        id: 3,
        name: this.props.t("EQAHealthOrgSampleTransferStatus.received")
      },
      {
        id: -1,
        name: this.props.t(
          "EQAHealthOrgSampleTransferStatus.no_sample_received"
        )
      }
    ],
    listSampleTransferStatusRef: [
      {
        id: 1,
        name: this.props.t("EQAHealthOrgSampleTransferStatus.delivered_pi")
      },
      {
        id: 2,
        name: this.props.t("EQAHealthOrgSampleTransferStatus.received_health_org")
      },
      {
        id: 3,
        name: this.props.t("EQAHealthOrgSampleTransferStatus.sample_resend_unit")
      },
      {
        id: 4,
        name: this.props.t("EQAHealthOrgSampleTransferStatus.received_pi")
      }
    ]
  };

  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    if (event && event.target && event.target.name === "sampleTransferStatus") {
      let { deliveryDate, sampleReceivingDate } = this.state;
      if (event.target.value == 2 && !deliveryDate) {
        deliveryDate = new Date();
      }
      // if (event.target.value  == 3 && !sampleReceivingDate){
      //   sampleReceivingDate = new Date();
      // }
      this.setState({ deliveryDate, sampleReceivingDate });
    }
    if (event && event.target && event.target.name === "sampleTransferStatusRef") {
      let { sampleReceivingDateRef } = this.state;

      if (event.target.value == 4 && !sampleReceivingDateRef) {
        sampleReceivingDateRef = new Date();
      }
      this.setState({ sampleReceivingDateRef });
    }

    this.setState(
      {
        [event.target.name]: event.target.value
      },
      function () {
      }
    );
  };

  handleFormSubmit = () => {
    let { id, code } = this.state;
    let { t } = this.props;
    let item = {};
    item["id"] = id;
    item["billOfLadingCode"] = this.state.billOfLadingCode;
    item["deliveryDate"] = this.state.deliveryDate;
    item["sampleReceivingDateRef"] = this.state.sampleReceivingDateRef;
    item["sampleTransferStatus"] = this.state.sampleTransferStatus;
    item["sampleTransferStatusRef"] = this.state.sampleTransferStatusRef;
    item["shippingUnit"] = this.state.shippingUnit;
    item["sampleSet"] = this.state.sampleSet;
    item["healthOrg"] = this.state.healthOrg;
    item["round"] = this.state.round;
    item["feeStatus"] = this.state.feeStatus;
    item["sampleRef"] = this.state.sampleRef;
    item["status"] = this.state.status;
    item['hasResult'] = this.state.hasResult;
    item["isCancelRegistration"] = this.state.isCancelRegistration;
    item["isDuplicateHealthOrg"] = this.state.isDuplicateHealthOrg;
    item["isRegistered"] = this.state.isRegistered;
    item["shippingUnit"] = this.state.shippingUnit;
    this.setState({ item: item })
    saveItem(this.state.item).then(respone => {
      if (respone.data.isDuplicateHealthOrg) {
        toast.warning(
          t("EQAHealthOrgRoundRegister.notify.duplicatedHealthOrg")
        );
      } else if (!respone.data.isDuplicateHealthOrg && respone.status == 200) {
        toast.info(t("EQAHealthOrgRoundRegister.notify.updateSuccess"));
        // this.props.handleOKEditClose();
      } else {
        toast.error(t("EQAHealthOrgRoundRegister.notify.addFail"));
      }
    });
  };

  handleStartDateChange = (event, source) => {
    let {t} = this.props;
    if (source === "deliveryDate") {
      this.setState({ deliveryDate: event });
    }
    if (source === "sampleReceivingDateRef") {
      this.setState({ sampleReceivingDateRef: event });
    }
    if (source === "deliveryDateRef") {
      toast.warning(t("general.notAccess"))
    }
    if (source === "sampleReceivingDate") {
      toast.warning(t("general.notAccess"))
    }
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    if (!item.sampleTransferStatus) {
      item.sampleTransferStatus = 1;
    }
    this.setState(item);
    this.setState({ ...item });
  }

  render() {
    const { t, i18n } = this.props;
    let {
      listSampleTransferStatus,
      listSampleTransferStatusRef,
      sampleTransferStatus,
      sampleTransferStatusRef,
      deliveryDate,
      sampleReceivingDate,
      sampleReceivingDateRef,
      billOfLadingCode,
      billOfLadingCodeRef,
      shippingUnit,
      shippingUnitRef,
      sampleRef,
      deliveryDateRef,
      sampleTransferStatusRes
    } = this.state;
    let { open, handleClose } = this.props;

    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"md"}
        fullWidth={true}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <div className="mb-20 styleColor">
            {" "}
            {t("EQAHealthOrgSampleTransferStatus.title")}{" "}
          </div>
          <div className="mb-20 styleColor">
            {" "}
            {this.state.healthOrg.name + " - " + this.state.healthOrg.code}{" "}
          </div>
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
            <Grid className="mb-16" container spacing={4}>
              <fieldset className="mb-8" style={{ width: "100%" }}>
                <legend><span className="styleColor">{t("EQAHealthOrgRoundRegister.tubeMain")}</span> </legend>
                <Grid className="mt-8" container spacing={2}>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <FormControl className="w-100" size="small" variant="outlined">
                      <InputLabel htmlFor="status" >
                        <span className="font"> {t("EQAHealthOrgSampleTransferStatus.tubeMain")}</span>
                      </InputLabel>
                      <Select
                        value={sampleTransferStatus}
                        onChange={event => this.handleChange(event)}
                        inputProps={{
                          name: "sampleTransferStatus",
                          id: "sampleTransferStatus"
                        }}
                      >
                        {listSampleTransferStatus &&
                          listSampleTransferStatus.length > 0 &&
                          listSampleTransferStatus.map(item => {
                            return (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <TextValidator
                      size="small"
                      variant="outlined"
                      className="w-100"
                      label={<span className="font"> {t("EQAHealthOrgSampleTransferStatus.billOfLadingCode")}</span>}
                      onChange={this.handleChange}
                      type="text"
                      name="billOfLadingCode"
                      value={billOfLadingCode}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        className="w-100"
                        margin="none"
                        name="deliveryDate"
                        id="mui-pickers-date"
                        label={<span className="font">{t("EQAHealthOrgSampleTransferStatus.delivery_date")}</span>}
                        inputVariant="outlined"
                        size="small"
                        invalidDateMessage={t("Invalid_Date_Format")}
                        type="text"
                        autoOk={true}
                        format="dd/MM/yyyy"
                        value={deliveryDate}
                        onChange={event => this.handleStartDateChange(event, "deliveryDate")}
                        validators={
                          sampleTransferStatus && sampleTransferStatus > 1
                            ? ["required"]
                            : ""
                        }
                        errorMessages={
                          sampleTransferStatus && sampleTransferStatus > 1
                            ? ["this field is required"]
                            : ""
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        className="w-100"
                        margin="none"
                        name="sampleReceivingDate"
                        id="mui-pickers-date"
                        invalidDateMessage={t("Invalid_Date_Format")}
                        label={<span className="font"> {t("EQAHealthOrgSampleTransferStatus.sample_receiving_date")}</span>}
                        inputVariant="outlined"
                        size="small"
                        type="text"
                        autoOk={true}
                        format="dd/MM/yyyy"
                        value={sampleReceivingDate}
                        isActive={false}
                        onChange={event => this.handleStartDateChange(event, "sampleReceivingDate")}
                        validators={
                          sampleTransferStatus && sampleTransferStatus > 1
                            ? ["required"]
                            : ""
                        }
                        errorMessages={
                          sampleTransferStatus && sampleTransferStatus > 1
                            ? ["this field is required"]
                            : ""
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item sm={12} xs={12}>
                    <TextValidator
                      className="w-100"
                      label={<span className="font"> {t("EQAHealthOrgSampleTransferStatus.shipping_unit")}</span>}
                      onChange={this.handleChange}
                      type="text"
                      size="small"
                      variant="outlined"
                      name="shippingUnit"
                      value={shippingUnit}
                    />
                  </Grid>
                </Grid>
              </fieldset>

              {(sampleRef != null && sampleRef == true) &&
                <fieldset className="mt-8" style={{ width: "100%" }}>
                  <legend>{<span className="styleColor"> {t("EQAHealthOrgRoundRegister.tubeReference")}</span>}</legend>
                  <Grid item className="mt-8" container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <FormControl className="w-100" size="small" variant="outlined">
                        <InputLabel htmlFor="status">
                          {<span className="font"> {t("EQAHealthOrgSampleTransferStatus.tubeReference")}</span>}
                        </InputLabel>
                        <Select
                          value={sampleTransferStatusRef}
                          onChange={event => this.handleChange(event)}
                          inputProps={{
                            name: "sampleTransferStatusRef",
                            id: "sampleTransferStatusRef"
                          }}
                        >
                          {listSampleTransferStatusRef &&
                            listSampleTransferStatusRef.length > 0 &&
                            listSampleTransferStatusRef.map(item => {
                              return (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <TextValidator
                        size="small"
                        className="w-100"
                        label={<span className="font"> {t("EQAHealthOrgSampleTransferStatus.billOfLadingCodeRef")}</span>}
                        // onChange={this.handleChange}
                        variant="outlined"
                        type="text"
                        name="billOfLadingCodeRef"
                        value={billOfLadingCodeRef}
                      />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          className="w-100"
                          margin="none"
                          name="deliveryDateRef"
                          id="mui-pickers-date"
                          label={<span className="font"> {t("EQAHealthOrgSampleTransferStatus.delivered_date_ref")}</span>}
                          inputVariant="outlined"
                          size="small"
                          type="text"
                          invalidDateMessage={t("Invalid_Date_Format")}
                          autoOk={true}
                          format="dd/MM/yyyy"
                          value={deliveryDateRef}
                          onChange={event => this.handleStartDateChange(event, "deliveryDateRef")}
                          validators={
                            sampleTransferStatusRes && sampleTransferStatusRes > 0
                              ? ["required"]
                              : ""
                          }
                          errorMessages={
                            sampleTransferStatusRes && sampleTransferStatusRes > 0
                              ? ["this field is required"]
                              : ""
                          }
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          className="w-100"
                          margin="none"
                          name="sampleReceivingDateRef"
                          id="mui-pickers-date"
                          label={<span className="font"> {t("EQAHealthOrgSampleTransferStatus.sample_receiving_date_ref")}</span>}
                          inputVariant="outlined"
                          size="small"
                          type="text"
                          autoOk={true}
                          format="dd/MM/yyyy"
                          invalidDateMessage={t("Invalid_Date_Format")}
                          value={sampleReceivingDateRef}
                          onChange={event => this.handleStartDateChange(event, "sampleReceivingDateRef")}
                          validators={
                            sampleTransferStatusRes && sampleTransferStatusRes > 0
                              ? ["required"]
                              : ""
                          }
                          errorMessages={
                            sampleTransferStatusRes && sampleTransferStatusRes > 0
                              ? ["this field is required"]
                              : ""
                          }
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item sm={12} xs={12}>
                      <TextValidator
                        className="w-100"
                        label={<span className="font"> {t("EQAHealthOrgSampleTransferStatus.shipping_unit")}</span>}
                        // onChange={this.handleChange}
                        size="small"
                        variant="outlined"
                        type="text"
                        name="shippingUnitRef"
                        value={shippingUnitRef}
                      />
                    </Grid>
                  </Grid>
                </fieldset>
              }
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
            <Button variant="contained" color="primary" type="submit">
              {t("Save")}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default SampleTransferStatusEditorDialog;
