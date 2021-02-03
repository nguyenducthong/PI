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
  InputAdornment,
  MenuItem,
  Checkbox,
  Select,
  FormControlLabel,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  technicianSearchByPage,
  saveItem,
  getEQASampleTubeByHealthOrgEQARoundId,
  checkReagentByHealthOrgRound,
} from "./EQAResultReportElisaService";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ConstantList from "../../appConfig";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import HealthOrgEQARoundPopup from "../Component/HealthOrgEQARound/HealthOrgEQARoundPopup";
import { searchByPage as reagentSearchByPage } from "../Reagent/ReagentService";
import Draggable from "react-draggable";
import { Breadcrumb, ConfirmationDialog } from "egret";
import {
  MuiPickersUtilsProvider,
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
import EQAResultReportElisaTabs from "./EQAResultReportElisaTabs";
import { exportToExcel } from "./EQAResultReportElisaService";
import { saveAs } from "file-saver";
import EQAResultReportElisaPrint from "./EQAResultReportElisaPrint";
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3,
});
// function PaperComponent(props) {
//   return (
//     <Draggable handle="#draggable-dialog" cancel={'[class*="MuiDialogContent-root"]'}>
//       <Paper {...props} />
//     </Draggable>
//   );
// }
function MaterialButton(props) {
  const item = props.item;
  return (
    <div>
      <IconButton onClick={() => props.onSelect(item)}>
        <Icon color="error">delete</Icon>
      </IconButton>
    </div>
  );
}

function TableODColumn(props) {
  let item = props.item;
  return (
    <div>
      <TextField
        disabled={props.isView}
        className="w-80"
        onChange={(event) => props.onChange(event, item)}
        type="number"
        value={item.oDvalue}
        name="itemODvalue"
      />
    </div>
  );
}

function TableCOColumn(props) {
  let item = props.item;
  return (
    <div>
      <TextField
        disabled={props.isView}
        className="w-80"
        value={item.cutOff}
        onChange={(event) => props.onChange(event, item)}
        type="number"
        name="itemcutOff"
      />
    </div>
  );
}

function TableODDeviceCOColumn(props) {
  let item = props.item;
  return (
    <div>
      <TextField
        disabled={props.isView}
        className="w-80"
        value={item.ratioOdAndCutOff}
        type="number"
        name="itemRatioOdAndCutOff"
      />
    </div>
  );
}

function TableResultColumn(props) {
  const { t, i18n } = useTranslation();
  let item = props.item;
  return (
    <div>
      <FormControl className="w-100">
        <Select
          disabled={props.isView}
          value={item.result}
          onChange={(event) => props.onChange(event, item)}
          inputProps={{
            name: "result",
          }}
        >
          {/* <MenuItem value=''><em>None</em> </MenuItem> */}
          <MenuItem
            value={
              LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented
            }
          >
            {t("EQAResultReportElisa.Result.none")}
          </MenuItem>
          <MenuItem
            value={LocalConstants.EQAResultReportDetail_TestValue.negative}
          >
            {t("EQAResultReportElisa.Result.negative")}
          </MenuItem>
          <MenuItem
            value={LocalConstants.EQAResultReportDetail_TestValue.indertermine}
          >
            {t("EQAResultReportElisa.Result.indertermine")}
          </MenuItem>
          <MenuItem
            value={LocalConstants.EQAResultReportDetail_TestValue.positive}
          >
            {t("EQAResultReportElisa.Result.positive")}
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
function TableNoteColumn(props) {
  let item = props.item;
  return <div></div>;
}
class EQAResultReportElisaEditorDialog extends Component {
  state = {
    rowsPerPage: 1000,
    page: 0,
    // isView: false,
    typeMethod: 1,
    healthOrg: [],
    listHealthOrgRound: [],
    reagent: null,
    technician: null,
    details: [],
    healthOrg: null,
    reagentExpiryDate: null,
    testDate: new Date(),
    reagentUnBoxDate: null,
    dateSubmitResults: null,
    roundLists: [],
    eqaRoundRegister: [],
    roundId: "",
    listReagent: [],
    reagentId: "",
    healthOrgRound: null,
    round: null,
    orderTest: "",
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenHealthOrgRoundPopup: false,
    // isCheck:false,
    isViewButton: false,
    isFinalResult: false,
    isRoleAdmin: false,
    typeMethod: 1,
    loading: false,
    checkTheStatus: false,
    shouldOpenPrintDialog: false,
  };

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
    let { t } = this.props;
    if (details != null && details.length > 0) {
      details.forEach((element) => {
        if (
          element.tableData != null &&
          rowData != null &&
          rowData.tableData != null &&
          element.tableData.id == rowData.tableData.id
        ) {
          if (event.target.name == "oDvalue") {
            if (element.oDvalue == "") {
              element.cutOff = "";
              element.ratioOdAndCutOff = "";
              element.result = "";
            }
            element.oDvalue = event.target.value;
            if (
              parseFloat(element.cutOff) > 0 &&
              parseFloat(element.oDvalue) > 0
            ) {
              element.ratioOdAndCutOff = (
                parseFloat(element.oDvalue) / parseFloat(element.cutOff)
              ).toFixed(2);
            }
          } else if (event.target.name == "cutOff") {
            if (element.oDvalue == "" || element.oDvalue == null) {
              toast.warning(t("EQAResultReportElisa.notODvalue"));
              return;
            }
            element.cutOff = event.target.value;
            if (
              parseFloat(element.cutOff) > 0 &&
              parseFloat(element.oDvalue) > 0
            ) {
              element.ratioOdAndCutOff = (
                parseFloat(element.oDvalue) / parseFloat(element.cutOff)
              ).toFixed(2);
            }
          } else if (event.target.name == "result") {
            if (
              event.target.value !==
                LocalConstants.EQAResultReportDetail_TestValue
                  .Not_Implemented &&
              (element.oDvalue === "" || element.oDvalue === null)
            ) {
              toast.warning(t("EQAResultReportElisa.notODvalue"));
              element.result = null;
              return;
            }
            //Check od/co < 1 ket luan am
            // if(event.target.value ===LocalConstants.EQAResultReportDetail_TestValue.negative){
            //   if(element.ratioOdAndCutOff != '' && element.ratioOdAndCutOff != null && element.ratioOdAndCutOff < 1){
            //     toast.warning(t("EQAResultReportElisa.warningResult"))
            //   element.result = null
            //   return
            //   }
            // }
            if (
              event.target.value ===
              LocalConstants.EQAResultReportDetail_TestValue.Not_Implemented
            ) {
              element.oDvalue = "";
              element.cutOff = "";
              element.ratioOdAndCutOff = "";
            }

            element.result = event.target.value;
          }
        }
      }); //forEach
      this.setState({ details: details }, () => {});
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
      this.setState({ isView: false, isViewButton: false, loading: false });
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
      this.setState({ isView: false, isViewButton: false, loading: false });
      return;
    }
    if (ConstantList.CHECK_HEALTH_ORG && !otherReagent) {
      checkReagentByHealthOrgRound(
        id,
        healthOrgRound.id,
        reagent.id,
        typeMethod
      ).then((res) => {
        if (res.data) {
          toast.warning(t("EqaResult.dulicateReagent"));
          this.setState({ isView: false, isViewButton: false, loading: false });
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
              .then((res) => {
                this.state.item.id = res?.data?.id;
                this.setState({ ...this.state.item }, () => {});
                toast.success(t("mess_edit"));
                // this.props.handleOKEditClose();
                this.setState({
                  isView: false,
                  isViewButton: false,
                  loading: false,
                });
              })
              .catch(() => {
                toast.warning(t("mess_edit_error"));
                this.setState({
                  isView: false,
                  isViewButton: false,
                  loading: false,
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
              .then((res) => {
                toast.success(t("mess_add"));
                this.state.item.id = res?.data?.id;
                this.setState({ ...this.state.item }, () => {});

                this.setState({
                  isView: false,
                  isViewButton: false,
                  loading: false,
                });
                // this.props.handleOKEditClose();
              })
              .catch(() => {
                toast.warning(t("mess_add_error"));
                this.setState({
                  isView: false,
                  isViewButton: false,
                  loading: false,
                });
              });
          }
        }
      });
    } else {
      // details.forEach(el=>{
      //   if(el.result === null || el.result === ""){
      //     isCheck = true
      //   }
      // })
      // if(isCheck){
      //   toast.warning(t("EQAResultReportElisa.notResult"));
      //   this.setState({isView: false, isViewButton: false, loading:false});;
      //   return
      // }

      if (id) {
        this.setState({ isView: true, isRoleAdmin: false, isViewButton: true });
        saveItem({
          ...this.state.item,
        })
          .then((res) => {
            // this.props.handleOKEditClose();
            this.state.item.id = res?.data?.id;
            this.setState({ ...this.state.item }, () => {});
            toast.success(t("mess_edit"));
            this.setState({
              isView: false,
              isViewButton: false,
              loading: false,
            });
          })
          .catch(() => {
            toast.warning(t("mess_edit_error"));
            this.setState({
              isView: false,
              isViewButton: false,
              loading: false,
            });
          });
      } else {
        this.setState({ isView: true, isRoleAdmin: false, isViewButton: true });
        saveItem({
          ...this.state.item,
        })
          .then((res) => {
            this.state.item.id = res?.data?.id;
            this.setState({ ...this.state.item }, () => {});
            // this.props.handleOKEditClose();
            toast.success(t("mess_add"));
            this.setState({
              isView: false,
              isViewButton: false,
              loading: false,
            });
          })
          .catch(() => {
            toast.warning(t("mess_add_error"));
            this.setState({
              isView: false,
              isViewButton: false,
              loading: false,
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
      item["typeMethod"] = 1;
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

  handleDateChange = (date, name) => {
    this.setState({
      [name]: date,
    });
  };

  selectTechnician = (technician) => {
    if (technician != null && technician.id != null) {
      this.setState({ technician: technician }, function () {});
    }
  };

  selectReagent = (reagent) => {
    if (reagent != null && reagent.id != null) {
      this.setState({ reagent: reagent }, function () {});
    }
  };

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
                if (
                  tube.eqaSampleSetDetail &&
                  tube.eqaSampleSetDetail.orderNumber
                ) {
                  eQAResultReportDetail.orderNumber =
                    tube.eqaSampleSetDetail.orderNumber;
                }
                eQAResultReportDetail.cutOff = "";
                eQAResultReportDetail.oDvalue = "";
                eQAResultReportDetail.ratioOdAndCutOff = "";
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
  notificationFinalResult = () => {
    if (!this.state.isFinalResult || this.state.isFinalResult == null) {
      this.setState({ shouldOpenConfirmationDialog: true });
    }
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
      });
  };
  handleExportPDF = () => {
    this.setState({
      shouldOpenPrintDialog: true,
    });
  };
  handleOKEditClose = () => {
    this.setState({
      shouldOpenPrintDialog: false,
    });
  };
  render() {
    let {
      isRoleAdmin,
      isView,
      isCheck,
      id,
      isViewButton,
      healthOrgRound,
      isFinalResult,
      isManagementUnit,
      loading,
    } = this.state;
    let searchObject = { pageIndex: 0, pageSize: 1000000, testType: 1 };
    let technicianSearchObject = {
      pageIndex: 0,
      pageSize: 1000000,
      searchByHealthOrg: true,
      healthOrg:
        healthOrgRound &&
        healthOrgRound.healthOrg &&
        healthOrgRound.healthOrg.id
          ? { id: healthOrgRound.healthOrg.id }
          : null,
    };

    let { open, handleClose, classes, t, i18n } = this.props;

    return (
      <Dialog open={open} maxWidth={"lg"} scroll={"paper"} fullWidth={true}>
        <div className={clsx("wrapperButton", !loading && "hidden")}>
          <CircularProgress className="buttonProgress" size={24} />
        </div>
        {this.state.shouldOpenPrintDialog && (
          <EQAResultReportElisaPrint
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
              <EQAResultReportElisaTabs
                t={t}
                i18n={i18n}
                item={this.state.item}
                isView={this.props.isView}
                isRoleAdmin={this.props.isRoleAdmin}
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
              className=""
              color="secondary"
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

export default EQAResultReportElisaEditorDialog;
