import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  TextField,
  Icon,
  IconButton,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  FormHelperText,
  MenuItem,
  Checkbox,
  Select,
  FormControlLabel,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  technicianSearchByPage,
  saveItem,
  checkReagentByHealthOrgRound,
  getEQASampleTubeByHealthOrgEQARoundId,
} from "./EQAResultReportEcliaService";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ConstantList from "../../appConfig";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import HealthOrgEQARoundPopup from "../Component/HealthOrgEQARound/HealthOrgEQARoundPopup";
import EQAResultReportEcliaTabs from "./EQAResultReportEcliaTabs";
import { searchByPage as reagentSearchByPage } from "../Reagent/ReagentService";
import Draggable from "react-draggable";
import { Breadcrumb, ConfirmationDialog } from "egret";
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import LocalConstants from "./Constants";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader,
} from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCurrentUser, getListHealthOrgByUser } from "../User/UserService";
import "../../../styles/views/_loadding.scss";
import "../../../styles/views/_style.scss";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import { exportToExcel } from "./EQAResultReportEcliaService";
import { saveAs } from "file-saver";
import EQAResultReportEcliaPrint from "./EQAResultReportEcliaPrint";

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3,
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

class EQAResultReportEcliaEditorDialog extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    isViewButton: false,
    hasErrorHealthOrgRound: false,
    hasErrorEQARound: false,
    isUsingIQC: false,
    isUsingControlLine: false,
    eqaRound: "",
    healthOrgRound: "",
    reagentLot: "",
    order: "",
    reagent: null,
    technician: null,
    dateSubmitResults: null,
    personBuyReagent: "",
    details: [],
    supplyOfReagent: "",
    timeToResult: "",
    reagentExpiryDate: null,
    testDate: new Date(),
    reagentUnBoxDate: null,
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenSearchEQASampleSearchDialog: false,
    listHealthOrgRound: [],
    listReagent: [],
    listTechnician: [],
    listEQARound: [],
    isFinalResult: false,
    isRoleAdmin: false,
    typeMethod: 4,
    loading: false,
    checkTheStatus: false,
    shouldOpenPrintDialog: false,
  };

  handleDateChange = (date, name) => {
    this.setState({
      [name]: date,
    });
  };
  handleDialogClose = () => {
    this.setState({
      shouldOpenConfirmationDialog: false,
      shouldOpenPrintDialog: false,
    });
  };
  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    if (source === "isFinalResult") {
      this.setState({ isFinalResult: event.target.checked });
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleHealthOrgRoundChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
  };

  handleRowDataCellChange = (rowData, event) => {
    let { details } = this.state;
    let { t } = this.props;
    if (details != null && details.length > 0) {
      details.forEach((element) => {
        if (
          element.tableData != null &&
          rowData != null &&
          rowData.tableData != null &&
          element.tableData.id == rowData.tableData.id
        ) {
          if (event.target.name == "sCOvalue") {
            if (element.sCOvalue == "") {
              element.result = "";
            }
            element.sCOvalue = event.target.value;
          } else if (event.target.name == "result") {
            if (element.sCOvalue == "") {
              if (
                event.target.value ===
                LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented
              ) {
                element.sCOvalue = "";
                element.result = event.target.value;
              } else {
                toast.warning(t("EQAResultReportEclia.notScOvalue"));
              }
            } else {
              if (
                event.target.value ===
                LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented
              ) {
                element.sCOvalue = "";
              }
              element.result = event.target.value;
            }
          }
        }
      });
      this.setState({ details: details });
    }
  };

  openCircularProgress = () => {
    this.setState({ loading: true });
  };

  handleFormSubmit = async () => {
    await this.openCircularProgress();
    let isCheck = false;
    let { t } = this.props;
    let { checkTheStatus, item } = this.state;
    let {
      id,
      details,
      healthOrgRound,
      reagent,
      typeMethod,
      otherReagent,
    } = this.state.item;
    this.setState({ isView: true, isRoleAdmin: false, isViewButton: true });
    //Check null ket qua
    if (details != null && details.length > 0) {
      details.forEach((el) => {
        if (el.result === null || el.result === "") {
          isCheck = true;
        }
      });
    } else {
      isCheck = true;
    }
    if (isCheck) {
      toast.info(t("EQAResultReportElisa.notResult"));
      this.setState({
        loading: false,
        isRoleAdmin: true,
        isView: false,
        isViewButton: false,
      });
      return;
    }

    //Check null du lieu
    if (
      healthOrgRound == null ||
      healthOrgRound.id == null ||
      reagent == null ||
      reagent.id == null
    ) {
      toast.info(t("EQAResultReportElisa.notData"));
      this.setState({
        loading: false,
        isRoleAdmin: true,
        isView: false,
        isViewButton: false,
      });
      return;
    }
    if (ConstantList.CHECK_ERROR_RESULT && !otherReagent) {
      checkReagentByHealthOrgRound(
        id,
        healthOrgRound.id,
        reagent.id,
        typeMethod
      ).then((res) => {
        if (res.data) {
          toast.warning(t("EqaResult.dulicateReagent"));
          this.setState({
            loading: false,
            isRoleAdmin: true,
            isView: false,
            isViewButton: false,
          });
        } else {
          if (checkTheStatus) {
            item["isFinalResult"] = true;
            item["dateSubmitResults"] = new Date();
            this.setState({ item: item });
          }
          if (id) {
            saveItem({
              ...this.state.item,
            })
              .then((response) => {
                if (response.data != null && response.status == 200) {
                  this.setState({ ...this.state.item });
                  // this.props.handleOKEditClose();
                  toast.success(t("mess_edit"));
                  this.setState({
                    loading: false,
                    isRoleAdmin: true,
                    isView: false,
                    isViewButton: false,
                  });
                }
              })
              .catch(() => {
                toast.warning(t("mess_edit_error"));
                this.setState({
                  loading: false,
                  isRoleAdmin: true,
                  isView: false,
                  isViewButton: false,
                });
              });
          } else {
            saveItem({
              ...this.state.item,
            })
              .then((response) => {
                if (response.data != null && response.status == 200) {
                  this.state.item.id = response.data.id;
                  this.setState({ ...this.state.item });
                  // this.props.handleOKEditClose();
                  toast.success(t("mess_add"));
                  this.setState({
                    loading: false,
                    isRoleAdmin: true,
                    isView: false,
                    isViewButton: false,
                  });
                }
              })
              .catch(() => {
                toast.warning(t("mess_add_error"));
                this.setState({
                  loading: false,
                  isRoleAdmin: true,
                  isView: false,
                  isViewButton: false,
                });
              });
          }
        }
      });
    } else {
      if (id) {
        if (checkTheStatus) {
          item["isFinalResult"] = true;
          item["dateSubmitResults"] = new Date();
          this.setState({ item: item });
        }
        saveItem({
          ...this.state.item,
        })
          .then((response) => {
            if (response.data != null && response.status == 200) {
              this.setState({ ...this.state.item });
              // this.props.handleOKEditClose();
              toast.success(t("mess_edit"));
              this.setState({
                loading: false,
                isRoleAdmin: true,
                isView: false,
                isViewButton: false,
              });
            }
          })
          .catch(() => {
            toast.warning(t("mess_edit_error"));
            this.setState({
              loading: false,
              isRoleAdmin: true,
              isView: false,
              isViewButton: false,
            });
          });
      } else {
        saveItem({
          ...this.state.item,
        })
          .then((response) => {
            if (response.data != null && response.status == 200) {
              this.state.item.id = response.data.id;
              this.setState({ ...this.state.item });
              // this.props.handleOKEditClose();
              toast.success(t("mess_add"));
              this.setState({
                loading: false,
                isRoleAdmin: true,
                isView: false,
                isViewButton: false,
              });
            }
          })
          .catch(() => {
            toast.warning(t("mess_add_error"));
            this.setState({
              loading: false,
              isRoleAdmin: true,
              isView: false,
              isViewButton: false,
            });
          });
      }
    }
  };
  sendResults = () => {
    let { item, checkTheStatus } = this.state;
    checkTheStatus = true;
    this.setState({ checkTheStatus: checkTheStatus }, () => {});
  };

  componentWillMount() {
    let {
      open,
      handleClose,
      item,
      isRoleAdmin,
      isView,
      listHealthOrgRound,
    } = this.props;
    this.setState({ isRoleAdmin: isRoleAdmin, isView: isView });
    if (item && item.details && item.details.length > 0) {
      item.details.sort((a, b) =>
        a.orderNumber > b.orderNumber
          ? 1
          : a.orderNumber === b.orderNumber
          ? a.sampleTube.code > b.sampleTube.code
            ? 1
            : -1
          : -1
      );
    }
    if (item.id == null) {
      item["id"] = null;
      item["typeMethod"] = 4;
      item["otherReagent"] = false;
    }

    if (listHealthOrgRound != null && listHealthOrgRound.length > 0) {
      item["healthOrgRound"] = listHealthOrgRound[0];
    }
    this.setState({ item: item, listHealthOrgRound: listHealthOrgRound });
    this.setState(
      {
        ...item,
      },
      function () {}
    );
  }

  handleHealthOrgRoundPopupClose = () => {
    this.setState({ shouldOpenHealthOrgRoundPopup: false }, function () {});
  };

  handleSelectHealthOrgRound = (healthOrgRound) => {
    if (healthOrgRound && healthOrgRound.id) {
      this.setState({ healthOrgRound: healthOrgRound }, function () {
        let { healthOrgRound, details } = this.state;
        details = [];
        getEQASampleTubeByHealthOrgEQARoundId(healthOrgRound.id).then(
          (result) => {
            let listEQASampleTube = result.data;
            if (listEQASampleTube != null && listEQASampleTube.length > 0) {
              listEQASampleTube.forEach((tube) => {
                let eQAResultReportDetail = {};
                eQAResultReportDetail.sampleTube = tube;
                eQAResultReportDetail.sCOvalue = 0;
                eQAResultReportDetail.result = "";
                details.push(eQAResultReportDetail);
              });
            }
            this.setState({ details });
          }
        );
      });
    }
    this.handleHealthOrgRoundPopupClose();
  };

  selectReagent = (reagent) => {
    if (reagent != null && reagent.id != null) {
      this.setState({ reagent: reagent }, function () {});
    }
  };

  selectTechnician = (technician) => {
    if (technician != null && technician.id != null) {
      this.setState({ technician: technician }, function () {});
    }
  };
  notificationFinalResult = () => {
    this.setState({ shouldOpenConfirmationDialog: true });
  };
  handleFinalResult = () => {
    if (this.state.isFinalResult == null || !this.state.isFinalResult) {
      this.setState(
        { isFinalResult: true, dateSubmitResults: new Date() },
        () => {}
      );
      this.handleDialogClose();
    }
    if (this.state.isFinalResult) {
      this.setState(
        { isFinalResult: false, dateSubmitResults: new Date() },
        () => {}
      );
      this.handleDialogClose();
    }
  };
  handleDialogFinalResultClose = () => {
    // this.setState({isFinalResult:false, dateSubmitResults: null},()=>{
    // })
    this.handleDialogClose();
  };

  handleExportExcel = () => {
    let { t } = this.props;
    exportToExcel(this.state.id)
      .then((res) => {
        toast.info(this.props.t("general.successExport"));
        let blob = new Blob([res.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "Ketqua.xlsx");
      })
      .catch((err) => {
        // console.log(err);
      });
    // console.log(this.state);
  };
  handleExportPDF = () => {
    this.setState({
      shouldOpenPrintDialog: true,
    })
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenPrintDialog: false,
    })
  }

  render() {
    let { open, handleClose, handleOKEditClose, isView, t, i18n } = this.props;
    let { id, isRoleAdmin, isViewButton, isFinalResult, loading } = this.state;

    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <div className={clsx("wrapperButton", !loading && "hidden")}>
          <CircularProgress className="buttonProgress" size={24} />
        </div>
        {this.state.shouldOpenPrintDialog && (
          <EQAResultReportEcliaPrint
            t={t}
            i18n={i18n}
            handleClose={this.handleDialogClose}
            open={this.state.shouldOpenPrintDialog}
            handleOKEditClose={this.handleOKEditClose}
            item={this.state.item}
            pdf={true}
            // isRoleAdmin={this.state.isRoleAdmin}
            // isView={this.state.isView}
          />
        )}
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            <span className="mb-20 styleColor">
              {!isView ? t("SaveUpdate") : t("Details")}
            </span>
            <IconButton
              style={{ position: "absolute", right: "10px", top: "10px" }}
              onClick={() => handleClose()}
            >
              <Icon color="error" title={t("close")}>
                close
              </Icon>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {this.state.shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                title={t("confirm")}
                open={this.state.shouldOpenConfirmationDialog}
                onConfirmDialogClose={this.handleDialogFinalResultClose}
                onYesClick={this.handleFinalResult}
                text={
                  isFinalResult
                    ? t("EqaResult.unFinalResultConfirm")
                    : t("EqaResult.FinalResultConfirm")
                }
                Yes={t("general.Yes")}
                No={t("general.No")}
              />
            )}
            <Grid item xs={12}>
              <EQAResultReportEcliaTabs
                t={t}
                i18n={i18n}
                item={this.state.item}
                isView={this.props.isView}
                isRoleAdmin={this.props.isRoleAdmin}
                listHealthOrgRound={this.props.listHealthOrgRound}
              />
            </Grid>
          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            {/* <Button
                variant="contained"
                // disabled={isViewButton}
                color="primary"
                type="button"
                onClick={this.handleExportExcel}
              >
                {t("exportExcel")}
              </Button> */}
         
            <Button
              variant="contained"
              type="submit"
              color="inherit"
              onClick={() => this.sendResults()}
              style={{ backgroundColor: "#4caf50", color: "#fff" }}
            >
              {t("EQAResultReportFastTest.sendResult")}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={() => handleClose()}
            >
              {" "}
              {t("Cancel")}
            </Button>
            {(!isView || isRoleAdmin) && (
              <Button
                variant="contained"
                disabled={isViewButton}
                color="primary"
                type="submit"
              >
                {t("Save")}
              </Button>
            )}
            {this.state.id && (
              <Button
                variant="contained"
                // disabled={isViewButton}
                color="primary"
                type="button"
                onClick={this.handleExportPDF}
              >
                {t("Xuất PDF")}
              </Button>
            )}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQAResultReportEcliaEditorDialog;
