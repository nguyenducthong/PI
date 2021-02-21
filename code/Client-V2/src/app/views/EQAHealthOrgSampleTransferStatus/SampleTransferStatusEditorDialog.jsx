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
  DialogContent
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { saveItem } from "../EQAHealthOrgRoundRegister/EQAHealthOrgRoundRegisterService";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

class SampleTransferStatusEditorDialog extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    shippingUnit: "",
    deliveryDate: null,
    deliveryDateRef: null,
    sampleTransferStatusRef: 3,
    isActive: false,
  };

  handleStartDateChange = (event, source) => {
    if(source === "deliveryDateRef"){
      this.setState({ deliveryDateRef: event });
    }
    // if(source === "sampleReceivingDateRef"){
    //   this.setState({ sampleReceivingDateRef: event });
    // }
  };


  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    
    this.setState(
      {
        [event.target.name]: event.target.value
      },
      function() {
      }
    );
  };

  handleFormSubmit = () => {
    let { id, code } = this.state;
    let { t } = this.props;
    saveItem({ ...this.state }).then(respone => {
      if (respone.data.isDuplicateHealthOrg) {
        toast.warning(
          t("EQAHealthOrgRoundRegister.notify.duplicatedHealthOrg")
        );
      } else if (!respone.data.isDuplicateHealthOrg && respone.status == 200) {
        toast.info(t("EQAHealthOrgRoundRegister.notify.updateSuccess"));
        this.props.handleOKEditClose();
      } else {
        toast.error(t("EQAHealthOrgRoundRegister.notify.addFail"));
      }
    });
  };
  componentWillMount() {
    let { open, handleClose, item } = this.props;
    if (!item.sampleTransferStatus) {
      item.sampleTransferStatusRef = 3;
    }
    this.setState(item);
  }

  render() {
    const { t, i18n } = this.props;
    let {
      billOfLadingCodeRef,
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
        maxWidth={"sm"}
        fullWidth={true}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="mb-20">
            {" "}
            {t("confirm")}{" "}
          </span>
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
            <h5 className="ml-16">{t("EQAHealthOrgSampleTransferStatus.confirm_update_status")}</h5>
              {(sampleRef!=null && sampleRef == true) && 
                  <Grid item  className="mb-16" container spacing={1}>
                    <Grid item sm={12} xs={12}>
                      <TextValidator
                        size="small"
                        className="w-100 mb-16"
                        label={t("EQAHealthOrgSampleTransferStatus.billOfLadingCodeRef")}
                        onChange={this.handleChange}
                        type="text"
                        name="billOfLadingCodeRef"
                        value={billOfLadingCodeRef}
                      />
                    </Grid>
                    <Grid item sm={12} xs={12}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        className="w-100 mb-16"
                        margin="none"
                        name = "deliveryDateRef"
                        id="mui-pickers-date"
                        label={t("EQAHealthOrgSampleTransferStatus.delivered_date_ref")}
                        inputVariant="standard"
                        type="text"
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
                    <Grid item sm={12} xs={12}>
                      <TextValidator
                        className="w-100 mb-16"
                        label={t("EQAHealthOrgSampleTransferStatus.shipping_unit")}
                        onChange={this.handleChange}
                        type="text"
                        name="shippingUnitRef"
                        value={shippingUnitRef}
                      />
                    </Grid>
                  </Grid>
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
              {t("confirm")}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default SampleTransferStatusEditorDialog;
