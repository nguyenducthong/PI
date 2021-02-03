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
} from "./EQAResultReportSerodiaService";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ConstantList from "../../appConfig";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import HealthOrgEQARoundPopup from "../Component/HealthOrgEQARound/HealthOrgEQARoundPopup";
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
import EQAResultReportSerodiaTabs from "./EQAResultReportSerodiaTabs";
import { exportToExcel } from "./EQAResultReportSerodiaService";
import { saveAs } from "file-saver";
import EQAResultReportSerodiaPrint from "./EQAResultReportSerodiaPrint";
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
function MaterialButton(props) {
  const item = props.item;
  return (
    <div>
      <IconButton onClick={() => props.onSelect(item, 0)}>
        <Icon color="primary">edit</Icon>
      </IconButton>
      <IconButton onClick={() => props.onSelect(item, 1)}>
        <Icon color="error">Delete</Icon>
      </IconButton>
    </div>
  );
}

class EQAResultReportSerodiaEditorDialog extends Component {
  state = {
    technician: null,
    round: null,
    healthOrg: null,
    rowsPerPage: 5,
    page: 0,
    listHealthOrgRound: [],
    roundLists: [],
    details: [],
    orderTest: "",
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    listReagent: [],
    listTechnician: [],
    reagentExpiryDate: null,
    testDate: new Date(),
    reagentUnBoxDate: null,
    dateSubmitResults: null,
    isView: false,
    isRoleAdmin: false,
    typeMethod: 3,
    isViewButton: false,
    loading: false,
    checkTheStatus: false,
    shouldOpenPrintDialog: false,
  };

  listCheckValue = [
    {
      id: LocalConstants.EQAResultReportDetail_TestValue.positive,
      name: "Dương tính",
    },
    {
      id: LocalConstants.EQAResultReportDetail_TestValue.negative,
      name: "Âm tính",
    },
  ];

  listTestValue = [
    {
      id: LocalConstants.EQAResultReportDetail_TestValue.positive,
      name: "Dương tính",
    },
    {
      id: LocalConstants.EQAResultReportDetail_TestValue.indertermine,
      name: "Không xác định",
    },
    {
      id: LocalConstants.EQAResultReportDetail_TestValue.negative,
      name: "Âm tính",
    },
  ];

  listAgglomeration = [
    { id: 1, name: " - " },
    { id: 2, name: " +/- " },
    { id: 3, name: " + " },
    { id: 4, name: " ++ " },
  ];

  //positive(1),//Dương tính
  //indertermine(0),//Không xác định
  //negative(-1),//Âm tính
  //none(-2)//Không thực hiện
  Results = [
    {
      id: LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented,
      name: "Không thực hiện",
    },
    {
      id: LocalConstants.EQAResultReportDetail_TestValue.negative,
      name: "Âm tính",
    },
    {
      id: LocalConstants.EQAResultReportDetail_TestValue.indertermine,
      name: "Không xác định",
    },
    {
      id: LocalConstants.EQAResultReportDetail_TestValue.positive,
      name: "Dương tính",
    },
  ];

  constructor(props) {
    super(props);
  }

  componentDidMount() {}
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

  handleRowDataCellChange = (rowData, event) => {
    let { details } = this.state;
    if (details != null && details.length > 0) {
      details.forEach((element) => {
        if (
          element.tableData != null &&
          rowData != null &&
          rowData.tableData != null &&
          element.tableData.id == rowData.tableData.id
        ) {
          if (event.target.name == "checkValue") {
            if (event.target.value != "" && event.target.value != null)
              if (
                element.result ==
                LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented
              ) {
                element.result = "";
              }
            element.checkValue = event.target.value;
          } else if (event.target.name == "testValue") {
            if (event.target.value != "" && event.target.value != null)
              if (
                element.result ==
                LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented
              ) {
                element.result = "";
              }
            element.testValue = event.target.value;
          } else if (event.target.name == "agglomeration") {
            if (event.target.value != "" && event.target.value != null)
              if (
                element.result ==
                LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented
              ) {
                element.result = "";
              }
            element.agglomeration = event.target.value;
          } else if (event.target.name == "result") {
            if (
              event.target.value ==
              LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented
            ) {
              element.agglomeration = "";
              element.testValue = "";
              element.checkValue = "";
            }
            element.result = event.target.value;
          }
        }
      });
      this.setState({ details: details });
    }
  };
  openCircularProgress = () => {
    this.setState({ loading: true });
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

  handleFormSubmit = async () => {
    await this.openCircularProgress();
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
    let isCheck = false;
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
      this.setState({ loading: false });
      return;
    }
    if (checkTheStatus) {
      item["isFinalResult"] = true;
      item["dateSubmitResults"] = new Date();
      this.setState({ item: item });
    }
    //Check null du lieu
    if (
      healthOrgRound == null ||
      healthOrgRound.id == null ||
      reagent == null ||
      reagent.id == null
    ) {
      toast.info(t("EQAResultReportElisa.notData"));
      this.setState({ loading: false });
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
          this.setState({ loading: false });
        } else {
          if (id) {
            this.setState({ isView: true, isViewButton: true });
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
                    isView: false,
                    isViewButton: false,
                  });
                }
              })
              .catch(() => {
                toast.warning(t("mess_edit_error"));
                this.setState({
                  loading: false,
                  isView: false,
                  isViewButton: false,
                });
              });
          } else {
            this.setState({ isView: true, isViewButton: true });
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
                    isView: false,
                    isViewButton: false,
                  });
                }
              })
              .catch(() => {
                toast.warning(t("mess_add_error"));
                this.setState({
                  loading: false,
                  isView: false,
                  isViewButton: false,
                });
              });
          }
        }
      });
    } else {
      if (id) {
        this.setState({ isView: true, isViewButton: true });
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
                isView: false,
                isViewButton: false,
              });
            }
          })
          .catch(() => {
            toast.warning(t("mess_edit_error"));
            this.setState({
              loading: false,
              isView: false,
              isViewButton: false,
            });
          });
      } else {
        this.setState({ isView: true, isViewButton: true });
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
                isView: false,
                isViewButton: false,
              });
            }
          })
          .catch(() => {
            this.setState({
              loading: false,
              isView: false,
              isViewButton: false,
            });
            toast.warning(t("mess_add_error"));
          });
      }
    }
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
    if (item == null) {
      item = {};
    }
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
      item["typeMethod"] = 3;
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
  sendResults = () => {
    let { item, checkTheStatus } = this.state;
    checkTheStatus = true;
    this.setState({ checkTheStatus: checkTheStatus }, () => {});
  };

  handleSelectHealthOrgRound = (healthOrgRound) => {
    if (healthOrgRound && healthOrgRound.id) {
      this.setState({ healthOrgRound }, function () {
        let { healthOrgRound, details } = this.state;
        details = [];
        getEQASampleTubeByHealthOrgEQARoundId(healthOrgRound.id).then(
          (result) => {
            let listEQASampleTube = result.data;
            if (listEQASampleTube != null && listEQASampleTube.length > 0) {
              listEQASampleTube.forEach((tube) => {
                let eQAResultReportDetail = {};
                eQAResultReportDetail.sampleTube = tube;
                eQAResultReportDetail.checkValue = "";
                eQAResultReportDetail.testValue = "";
                eQAResultReportDetail.agglomeration = "";
                eQAResultReportDetail.result = "";
                details.push(eQAResultReportDetail);
              });
              this.setState({ details });
            }
          }
        );
      });
    }
    this.handleHealthOrgRoundPopupClose();
  };
  handleExportPDF = () => {
    this.setState({
      shouldOpenPrintDialog: true
    })
  }

  render() {
    let {
      isView,
      isViewButton,
      isRoleAdmin,
      healthOrgRound,
      loading,
    } = this.state;
    let { open, handleClose, classes, handleOKEditClose, t, i18n } = this.props;

    return (
      <Dialog open={open} maxWidth={"lg"} fullWidth={true}>
        <div className={clsx("wrapperButton", !loading && "hidden")}>
          <CircularProgress className="buttonProgress" size={24} />
        </div>
        {this.state.shouldOpenPrintDialog && (
          <EQAResultReportSerodiaPrint
            t={t}
            i18n={i18n}
            handleClose={this.handleDialogClose}
            open={this.state.shouldOpenPrintDialog}
            handleOKEditClose={handleOKEditClose}
            item={this.state.item}
            pdf={true}
            // isRoleAdmin={this.state.isRoleAdmin}
            // isView={this.state.isView}
          />
        )}
        <ValidatorForm
          ref="form"
          onSubmit={this.handleFormSubmit}
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            <span className="mb-20">
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
          {/* {this.state.shouldOpenConfirmationDialog && (
            <ConfirmationDialog
              title={t("confirm")}
              open={this.state.shouldOpenConfirmationDialog}
              onConfirmDialogClose={this.handleDialogFinalResultClose}
              onYesClick={this.handleFinalResult}
              text={isFinalResult ? t("EqaResult.unFinalResultConfirm") : t("EqaResult.FinalResultConfirm")}
              Yes={t("general.Yes")}
              No={t("general.No")}
            />
          )} */}
          <DialogContent dividers>
            <Grid item xs={12}>
              <EQAResultReportSerodiaTabs
                t={t}
                i18n={i18n}
                item={this.state.item}
                isView={this.props.isView}
                isRoleAdmin={this.props.isRoleAdmin}
              />
            </Grid>
          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
          
            {(!isView || this.state.isRoleAdmin) && (
              <Button
                variant="contained"
                type="submit"
                color="inherit"
                onClick={() => this.sendResults()}
                style={{ backgroundColor: "#4caf50", color: "#fff" }}
              >
                {t("EQAResultReportFastTest.sendResult")}
              </Button>
            )}
            <Button
              variant="contained"
              className="mr-16"
              color="secondary"
              onClick={() => handleClose()}
            >
              {" "}
              {t("Cancel")}
            </Button>
            {(!isView || this.state.isRoleAdmin) && (
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

export default EQAResultReportSerodiaEditorDialog;
