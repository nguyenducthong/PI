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
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  saveItem,
  checkReagentByHealthOrgRound,
  getEQASampleTubeByHealthOrgEQARoundId,
} from "./EQAResultReportFastTestService";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ConstantList from "../../appConfig";
import Draggable from "react-draggable";
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
import EQAResultReportFastTestTabs from "./EQAResultReportFastTestTabs";
import CircularProgress from "@material-ui/core/CircularProgress";
import {exportToExcel} from "./EQAResultReportFastTestService";
import { saveAs } from "file-saver";
import EQAResultReportFastTestPrint from "./EQAResultReportFastTestPrint";
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

class EQAResultReportFastTestEditorDialog extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    hasErrorHealthOrgRound: false,
    hasErrorEQARound: false,
    isUsingIQC: false,
    isUsingControlLine: false,
    eqaRound: "",
    healthOrg: null,
    reagentLot: "",
    orderTest: "",
    reagent: null,
    technician: null,
    personBuyReagent: "",
    details: [],
    supplyOfReagent: "",
    timeToResult: "",
    round: null,
    reagentExpiryDate: null,
    testDate: new Date(),
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenSearchEQASampleSearchDialog: false,
    listHealthOrgRound: [],
    listReagent: [],
    listTechnician: [],
    listEQARound: [],
    shouldOpenHealthOrgRoundPopup: false,
    isView: false,
    reagentUnBoxDate: null,
    isFinalResult: false,
    dateSubmitResults: null,
    typeMethod: 2,
    isViewButton: false,
    loading: false,
    checkTheStatus: false,
    shouldOpenPrintDialog: false,
  };

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
      id: LocalConstants.EQAResultReportDetail_TestValue.positive,
      name: "Dương tính",
    },
  ];

  listResult_C_T_Line = [
    {
      id: LocalConstants.EQAResultReportDetail_TestValue.positive,
      name: "Dương tính",
    },
    {
      id: LocalConstants.EQAResultReportDetail_TestValue.negative,
      name: "Âm tính",
    },
  ];

  listChooseBoolean = [
    { id: 0, value: false, name: "Không" },
    { id: 1, value: true, name: "Có" },
  ];

  handleDateChange = (date, name) => {
    this.setState({
      [name]: date,
    });
  };

  handleChooseBooleanChange = (value, name) => {
    this.setState({
      [name]: value.target.value,
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
          if (event.target.name == "cLine") {
            if (
              element.result ==
              LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented
            ) {
              element.result = "";
            }
            element.cLine = event.target.value;
          } else if (event.target.name == "tLine") {
            if (
              element.result ==
              LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented
            ) {
              element.result = "";
            }
            element.tLine = event.target.value;
          } else if (event.target.name == "result") {
            if (
              event.target.value ==
              LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented
            ) {
              element.cLine = "";
              element.tLine = "";
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

  handleFormSubmit = async () => {
    await this.openCircularProgress();
    let { t } = this.props;
    let isCheck = false;
    let { checkTheStatus, item } = this.state;
    let {
      id,
      details,
      healthOrgRound,
      reagent,
      typeMethod,
      otherReagent,
    } = this.state.item;
    this.setState({ loading: true });
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
            this.setState({
              isView: true,
              isRoleAdmin: false,
              isViewButton: true,
            });
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
            this.setState({
              isView: true,
              isRoleAdmin: false,
              isViewButton: true,
            });
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
        this.setState({ isView: true, isRoleAdmin: false, isViewButton: true });
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
            this.setState({ loading: false });
            toast.warning(t("mess_edit_error"));
            this.setState({ isView: false, isViewButton: false });
          });
      } else {
        this.setState({ isView: true, isRoleAdmin: false, isViewButton: true });
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
      item["typeMethod"] = 2;
      item["otherReagent"] = false;
    }

    if (listHealthOrgRound != null && listHealthOrgRound.length > 0) {
      item["healthOrgRound"] = listHealthOrgRound[0];
    }
    this.setState(
      { item: item, listHealthOrgRound: listHealthOrgRound, ...item },
      function () {}
    );
  }

  handleSearchDialogClose = () => {
    this.setState({
      shouldOpenSearchDialog: false,
    });
  };

  handleSearchEQARoundDialogClose = () => {
    this.setState({
      shouldOpenSearchEQARoundSearchDialog: false,
    });
  };

  sendResults = () => {
    let { item, checkTheStatus } = this.state;
    checkTheStatus = true;
    this.setState({ checkTheStatus: checkTheStatus }, () => {});
  };

  handleHealthOrgRoundPopupClose = () => {
    this.setState({ shouldOpenHealthOrgRoundPopup: false }, function () {});
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
                eQAResultReportDetail.cLine = "";
                eQAResultReportDetail.tLine = "";
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

  handleDialogFinalResultClose = () => {
    this.handleDialogClose();
  };
  handleExportExcel = () => {
    let { t } = this.props;
      exportToExcel(this.state.id)
        .then((res) => {
          toast.info(this.props.t('general.successExport'));
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
    });
  }
  handleClose = () => {
    this.setState({
      shouldOpenPrintDialog: false,
    });
  }

  render() {
    const { classes } = this.props;
    const { selected, hasErrorHealthOrgRound, hasErrorEQARound } = this.state;
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    let {
      isView,
      isViewButton,
      isFinalResult,
      healthOrgRound,
      round,
      isRoleAdmin,
      loading,
    } = this.state;
    return (
      <Dialog open={open} maxWidth={"lg"} fullWidth={true}>
        <div className={clsx("wrapperButton", !loading && "hidden")}>
          <CircularProgress className="buttonProgress" size={24} />
        </div>
        {this.state.shouldOpenPrintDialog && (
                <EQAResultReportFastTestPrint t={t} i18n={i18n}
                  handleClose={this.handleClose}
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
            <span className="mb-20">{t("SaveUpdate")}</span>
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
            <Grid item xs={12}>
              <EQAResultReportFastTestTabs
                t={t}
                i18n={i18n}
                item={this.state.item}
                isView={this.props.isView}
                isRoleAdmin={this.props.isRoleAdmin}
              />
            </Grid>

            <div className="flex flex-end flex-middle mt-16"></div>
          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
       
            {(!isView || isRoleAdmin) && (
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

export default EQAResultReportFastTestEditorDialog;
