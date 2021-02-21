import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  InputAdornment,
  TablePagination,
  IconButton,
  Icon,
} from "@material-ui/core";
import {
  getByPage,
  deleteItem,
  saveItem,
  handleCancelRegistration,
  reRegisterEQARound,
  getItemById,
  searchByPage,
  handleCancelRegistrationFromDialog,
} from "./HealthOrgRegisterFormService";
import {
  ValidatorForm,
  TextValidator,
  TextField,
} from "react-material-ui-form-validator";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader,
} from "material-table";
import EQARoundSearchDialog from "./EQARoundSearchDialog";
import DialogContent from "@material-ui/core/DialogContent";
import {
  getHealthOrgByUserId,
  getCurrentUser,
  registerEQARound,
  searchEQARoundByPage,
} from "./HealthOrgRegisterFormService";
// import {searchByPage as searchByEQARound} from "../EQARound/EQARoundService";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DialogActions from "@material-ui/core/DialogActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/views/_style.scss";
import { saveItem as saveItemHealthOrg } from "../EQAHealthOrg/EQAHealthOrgService";
import {getItemById as getItemByIdHealthOrg } from "../EQAHealthOrg/EQAHealthOrgService";
import { forEach } from "lodash";
import { Breadcrumb, ConfirmationDialog } from "egret";
toast.configure({
  autoClose: 3000,
  draggable: false,
  limit: 3,
});

function MaterialButton(props) {
  const item = props.item;
  return (
    <div>
      <IconButton
        onClick={() => props.onSelect(item, 1)}
        title="Xoá đơn vị này khỏi danh sách đăng ký"
        disabled={item.status === -1}
      >
        <Icon color={item.status === -1 ? "disabled" : "error"}>cancel</Icon>
      </IconButton>
    </div>
  );
}

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
const styles = (theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});
class EQAHealthOrgPlanningRegisterDialog extends Component {
  state = {
    status: 0,
    healthOrg: null,
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenHealthOrgSearchMultipleDialog: false,
    listHealthOrgs: [],
    selectedHealthOrg: [],
    totalElements: 0,
    sampleSet: {},
    feeStatus: 0,
    status: 0,
    selectedItem: {},
    isRunning: true,
    listHealthOrgRounds: [],
    itemHealthOrg: {},
  };
  handleChange = (event, source) => {
    event.persist();
    let {itemHealthOrg} = this.state;
    if (source === "name") {
      itemHealthOrg["name"] = event.target.value;
      this.setState({ itemHealthOrg: itemHealthOrg });
    }
    if (source === "email") {
      itemHealthOrg["email"] = event.target.value;
      this.setState({ itemHealthOrg: itemHealthOrg });
    }
    if (source === "taxCodeOfTheUnit") {
      itemHealthOrg["taxCodeOfTheUnit"] = event.target.value;
      this.setState({ itemHealthOrg: itemHealthOrg });
    }
    if (source === "unitCodeOfProgramPEQAS") {
      itemHealthOrg["unitCodeOfProgramPEQAS"] = event.target.value;
      this.setState({ itemHealthOrg: itemHealthOrg });
    }
    if (source === "contactName") {
      itemHealthOrg["contactName"] = event.target.value;
      this.setState({ itemHealthOrg: itemHealthOrg });
    }
    if (source === "contactPhone") {
      itemHealthOrg["contactPhone"] = event.target.value;
      this.setState({ itemHealthOrg: itemHealthOrg });
    }
    if (source === "officerPosion") {
      itemHealthOrg["officerPosion"] = event.target.value;
      this.setState({ itemHealthOrg: itemHealthOrg });
    }
    if (source === "fax") {
      itemHealthOrg["fax"] = event.target.value;
      this.setState({ itemHealthOrg: itemHealthOrg });
    }
    if (source === "address") {
      itemHealthOrg["address"] = event.target.value;
      this.setState({ itemHealthOrg: itemHealthOrg });
    }
    this.setState({
      [event.target.name]: event.target.value,
    });

  };

  handleFormSubmit = () => {
    let { t } = this.props;
    let {
      sampleSet,
      hasRegister,
      feeStatus,
      status,
      selectedHealthOrg
    } = this.state;
    let healthOrgRoundRegisterList = [];
    this.state.selectedHealthOrg.forEach((el) => {
      let healthOrg = el.healthOrg;
      let round = el.round;
      healthOrgRoundRegisterList.push({
        healthOrg,
        round,
        sampleSet,
        hasRegister,
        feeStatus,
        status,
      });
    });

    saveItemHealthOrg(this.state.itemHealthOrg).then((res) => {
      registerEQARound([...healthOrgRoundRegisterList]).then((response) => {
        if (response.data.errorCode == 1) {
          //đơn vị đã đăng ký
          toast.warning(response.data.message);
        } else {
          if (
            healthOrgRoundRegisterList != null &&
            healthOrgRoundRegisterList.length > 0
          ) {
            toast.info(t("EQAHealthOrgRoundRegister.notify.addSuccess"));
          } else {
            toast.info(t("mess_edit"));
          }
          // this.props.handleClose();
          this.componentDidMount();
        }
      });
    });
  };
  handleRoundSearchDialogClose = () => {
    this.setState({
      shouldOpenRoundSearchDialog: false,
    });
  };
  handleSelectRound = (item) => {
    this.setState({ round: item });
    this.handleRoundSearchDialogClose();
  };
  componentWillMount() {
    let { open, handleClose, item } = this.props;
    let searchObject = {};
    searchObject.text = "";
    if (this.props.item != null) {
      searchObject.planningId = this.props.item.id;
    }
    searchObject.isRunning = this.state.isRunning;
    searchObject.pageIndex = 1;
    searchObject.pageSize = 1000000;
    searchEQARoundByPage(searchObject).then((res) => {
      this.setState({ listRound: [...res.data.content] }, () => {});
    });

    this.setState({ planning: this.props.item });
  }
  handleHealthOrgSearchDialogClose = () => {
    this.setState({
      shouldOpenHealthOrgSearchDialog: false,
    });
  };
  handleSelectHealthOrg = (item) => {
    this.setState({ healthOrg: item });
    this.handleHealthOrgSearchDialogClose();
  };

  handleSampleSetSearchDialogClose = () => {
    this.setState({
      shouldOpenSampleSetSearchDialog: false,
    });
  };
  handleSelectSampleSet = (item) => {
    this.setState({ sampleSet: item });
    this.handleSampleSetSearchDialogClose();
  };
  handleDateChange = (date, name) => {
    this.setState({
      [name]: date,
    });
  };
  handleDialogClose = () => {
    this.setState({
      shouldOpenHealthOrgSearchMultipleDialog: false,
      shouldOpenConfirmationDialog: false,
    });
  };
  componentDidMount() {
    let searchObject = {};
    searchObject.text = "";
    if (this.props.item != null) {
      searchObject.planningId = this.props.item.id;
    }
    searchObject.pageIndex = 1;
    searchObject.pageSize = 1000000;
    

    searchByPage(searchObject).then(({ data }) => {
      let registeredList = data.content;
      getHealthOrgByUserId(0).then(({ data }) => {
        this.setState({
          id: data[0].id,
        });
        getItemByIdHealthOrg(this.state.id).then((re) => {
          this.setState({
            itemHealthOrg: re.data
          })
        })
        let listHealthOrgs = data;
        let listItem = [];
        let { listRound } = this.state;
        listRound.forEach((e) => {
          listHealthOrgs.forEach((el) => {
            let p = {};
            p.healthOrg = el;
            p.round = e;
            p.status = -1;
            listItem.push(p);
          });
        });
        listItem.forEach((e) => {
          registeredList.forEach((el) => {
            if (
              e.round.id == el.round.id &&
              e.healthOrg.id == el.healthOrg.id
            ) {
              e.status = el.status;
            }
          });
        });

        this.setState(
          {
            listHealthOrgRounds: listItem.map((healthOrg) =>
              healthOrg.status != -1
                ? { ...healthOrg, tableData: { checked: true } }
                : healthOrg
            ),
          },
          () => {
            
          }
        );
      }).catch((err) => {
        window.location.reload();
      });
    });
    ValidatorForm.addValidationRule("isLengthNumber", (value) => {
      if (value.length > 10) {
        return false;
      }
      return true;
    });
    
  }

  handleDelete = (rowData) => {
    let { listHealthOrgs } = this.state;
    if (listHealthOrgs != null && listHealthOrgs.length > 0) {
      for (let index = 0; index < listHealthOrgs.length; index++) {
        if (listHealthOrgs && listHealthOrgs[index].id == rowData.id) {
          listHealthOrgs.splice(index, 1);
          break;
        }
      }
    }
    this.setState({ listHealthOrgs }, function () {});
  };
  handleOpenConfirmationDialog = (rowData) => {
    this.setState(
      {
        shouldOpenConfirmationDialog: true,
        selectedItem: rowData,
      },
      () => {
        
      }
    );
  };

  handleConfirmationResponse = () => {
    let { t } = this.props;
    const { selectedItem } = this.state;
    let { listHealthOrgRounds, selectedHealthOrg } = this.state;
    listHealthOrgRounds.forEach((el) => {
      if (
        el.round.id === selectedItem.round.id &&
        el.healthOrg.id === selectedItem.healthOrg.id
      ) {
        // console.log(el)
        handleCancelRegistrationFromDialog(
          selectedItem.healthOrg.id,
          el.round.id
        )
          .then(() => {
            let { listHealthOrgRounds, selectedHealthOrg } = this.state;
            listHealthOrgRounds.forEach((healthOrg) => {
              if (
                healthOrg.healthOrg.id === selectedItem.healthOrg.id &&
                healthOrg.round.id === selectedItem.round.id
              ) {
                healthOrg.status = -1;
                healthOrg.tableData.checked = false;
              }
            });
            this.setState({
              selectedHealthOrg,
              listHealthOrgRounds,
              shouldOpenConfirmationDialog: false,
            });
            toast.info(
              t("EQAHealthOrgRoundRegister.notify.unsubscribeSuccessfully")
            );
          })
          .catch(() => {
            toast.error(t("EQAHealthOrgRoundRegister.notify.error"));
            this.handleDialogClose();
          });
      }
    });
  };
  render() {
    let {
      shouldOpenHealthOrgSearchDialog,
      shouldOpenRoundSearchDialog,
      shouldOpenSampleSetSearchDialog,
      shouldOpenHealthOrgSearchMultipleDialog,
      healthOrg,
      round,
      sampleSet,
      status,
      feeStatus,
      hasRegister,
      listHealthOrgs,
      selectedHealthOrg,
      itemHealthOrg,
    } = this.state;
    // console.log(itemHealthOrg);
    let {
      open,
      handleClose,
      handleOKEditClose,
      t,
      i18n,
      item,
      isView,
    } = this.props;
    //const currentSelectedHealthOrg = listHealthOrgs.slice();
    let columns = [
      // {
      //   title: t("HealthOrgRegisterForm.unregister"),
      //   field: "healthOrg.custom",
      //   align: "left",
      //   width: "250",
      //   headerStyle: {
      //     minWidth: "150px",
      //     paddingLeft: "10px",
      //     paddingRight: "0px",
      //   },
      //   cellStyle: {
      //     minWidth: "150px",
      //     paddingLeft: "10px",
      //     paddingRight: "0px",
      //     textAlign: "center",
      //   },
      //   cellStyle: { whiteSpace: "nowrap" },
      //   render: (rowData) => (
      //     <MaterialButton
      //       item={rowData}
      //       onSelect={(rowData, method) => {
      //         if (method === 1) {
      //           this.handleOpenConfirmationDialog(rowData);
      //         } else {
      //           alert("Call Selected Here:" + rowData.id);
      //         }
      //       }}
      //     />
      //   ),
      // },
      // {
      //   title: t("EQAHealthOrg.Name"),
      //   field: "healthOrg.name",
      //   width: "150",
      //   headerStyle: {
      //     minWidth: "150px",
      //     paddingLeft: "10px",
      //     paddingRight: "0px",
      //   },
      //   cellStyle: {
      //     minWidth: "150px",
      //     paddingLeft: "10px",
      //     paddingRight: "0px",
      //     textAlign: "center",
      //   },
      // },
      {
        title: t("EQAHealthOrg.Code"),
        field: "healthOrg.code",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: t("EQARound.Name"),
        field: "round.name",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: t("EQARound.Code"),
        field: "round.code",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },

      {
        title: t("Status"),
        field: "healthOrg.hasRegister",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
        render: (rowData) =>
          rowData.status != -1 ? (
            <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
              {t("HealthOrgRegisterForm.IsRegister.Yes")}
            </small>
          ) : (
            <small
              className="border-radius-4 bg-dark px-8 py-2 "
              style={{ backgroundColor: "#f44336" }}
            >
              {t("HealthOrgRegisterForm.IsRegister.No")}
            </small>
          ),
      },
    ];
    return (
      <Dialog
        scroll={"paper"}
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"md"}
        fullWidth={true}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {
            <span className="styleColor">
              {" "}
              {t("HealthOrgRegisterForm.title_planning")}
            </span>
          }
          <IconButton
            style={{ position: "absolute", right: "10px", top: "10px" }}
            onClick={() => handleClose()}
          >
            <Icon color="error" title={t("close")}>
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
            flexDirection: "column",
          }}
        >
          <DialogContent dividers>
            <Grid className="mb-16" container spacing={2}>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextValidator
                  size="small"
                  className="w-100"
                  variant="outlined"
                  label={
                    <span>
                      <span style={{ color: "red" }}> * </span>
                      {t("sign_up.healthOrgName")}
                    </span>
                  }
                  onChange={(e) => this.handleChange(e, "name")}
                  type="text"
                  name="name"
                  value={itemHealthOrg.name ? itemHealthOrg.name : ""}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextValidator
                  size="small"
                  className="w-100"
                  variant="outlined"
                  label={
                    <span>
                      <span style={{ color: "red" }}> * </span>
                      {t("Email")}
                    </span>
                  }
                  onChange={(e) => this.handleChange(e, "email")}
                  type="email"
                  name="email"
                  value={itemHealthOrg.email ? itemHealthOrg.email : ""}
                  validators={["required", "isEmail"]}
                  errorMessages={[
                    t("general.errorMessages_required"),
                    t("general.errorMessages_email_valid"),
                  ]}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextValidator
                  size="small"
                  variant="outlined"
                  className="w-100"
                  label={
                    <span>
                      <span style={{ color: "red" }}> * </span>
                      {t("sign_up.taxCodeOfTheUnit")}
                    </span>
                  }
                  onChange={(e) => this.handleChange(e, "taxCodeOfTheUnit")}
                  type="text"
                  name="taxCodeOfTheUnit"
                  value={itemHealthOrg.taxCodeOfTheUnit ? itemHealthOrg.taxCodeOfTheUnit : ""}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextValidator
                  size="small"
                  variant="outlined"
                  className="w-100"
                  label={
                    <span>
                      <span style={{ color: "red" }}> * </span>
                      {t("sign_up.unitCodeOfProgramPEQAS")}
                    </span>
                  }
                  onChange={(e) => this.handleChange(e, "unitCodeOfProgramPEQAS")}
                  type="text"
                  name="unitCodeOfProgramPEQAS"
                  value={itemHealthOrg.unitCodeOfProgramPEQAS ? itemHealthOrg.unitCodeOfProgramPEQAS : ""}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextValidator
                  size="small"
                  variant="outlined"
                  className="w-100"
                  label={
                    <span>
                      <span style={{ color: "red" }}> * </span>
                      {t("sign_up.contactName")}
                    </span>
                  }
                  onChange={(e) => this.handleChange(e, "contactName")}
                  type="text"
                  name="contactName"
                  value={itemHealthOrg.contactName ? itemHealthOrg.contactName : ""}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>

              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextValidator
                  size="small"
                  variant="outlined"
                  className="w-100"
                  label={
                    <span>
                      <span style={{ color: "red" }}> * </span>
                      {t("sign_up.officerPosion")}
                    </span>
                  }
                  onChange={(e) => this.handleChange(e, "officerPosion")}
                  type="text"
                  name="officerPosion"
                  value={itemHealthOrg.officerPosion ? itemHealthOrg.officerPosion : ""}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextValidator
                  size="small"
                  variant="outlined"
                  className="w-100"
                  label={
                    <span>
                      <span style={{ color: "red" }}> * </span>
                      {t("sign_up.contactPhone")}
                    </span>
                  }
                  onChange={(e) => this.handleChange(e, "contactPhone")}
                  type="text"
                  name="contactPhone"
                  value={itemHealthOrg.contactPhone ? itemHealthOrg.contactPhone : ""}
                  validators={[
                    "required",
                    "matchRegexp:^[0-9]*$",
                    "isLengthNumber",
                  ]}
                  errorMessages={[
                    t("general.errorMessages_required"),
                    t("general.errorMessages_phone_number_invalid"),
                    t("general.errorMessages_phone_number_invalid"),
                  ]}
                />
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TextValidator
                  size="small"
                  variant="outlined"
                  className="w-100"
                  label={t("sign_up.fax")}
                  onChange={(e) => this.handleChange(e, "fax")}
                  type="text"
                  name="fax"
                  value={itemHealthOrg.fax ? itemHealthOrg.fax : ""}
                />
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  variant="outlined"
                  className="w-100"
                  label={
                    <span>
                      <span style={{ color: "red" }}> * </span>
                      {t("sign_up.address")}
                    </span>
                  }
                  onChange={(e) => this.handleChange(e, "address")}
                  name="address"
                  value={itemHealthOrg.address ? itemHealthOrg.address : ""}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <TextValidator
                  label={<span className="font">{t("EQAPlanning.title")}</span>}
                  placeholder={t("EQAPlanning.title")}
                  size="small"
                  variant="outlined"
                  id="round"
                  className="w-100 mb-16 mr-16 stylePlaceholder"
                  value={
                    this.state.planning != null ? this.state.planning.name : ""
                  }
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                  disabled={true}
                />
              </Grid>
              {shouldOpenRoundSearchDialog && (
                <EQARoundSearchDialog
                  open={this.state.shouldOpenRoundSearchDialog}
                  handleSelect={this.handleSelectRound}
                  selectedItem={round != null ? round : {}}
                  handleClose={this.handleRoundSearchDialogClose}
                  t={t}
                  i18n={i18n}
                />
              )}
              {this.state.shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  title={t("confirm")}
                  open={this.state.shouldOpenConfirmationDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationResponse}
                  Yes={t("general.Yes")}
                  No={t("general.No")}
                  text={t("HealthOrgRegisterForm.unregister_confirmation")}
                />
              )}
              <fieldset style={{ width: "100%", padding: "0" }}>
                <Grid item xs={12}>
                  <MaterialTable
                    title={t("HealthOrgRegisterForm.title_table")}
                    columns={columns}
                    data={this.state.listHealthOrgRounds}
                    options={{
                      selection: true,
                      actionsColumnIndex: -1,
                      paging: false,
                      search: false,
                      rowStyle: (rowData, index) => ({
                        backgroundColor: index % 2 === 1 ? "#EEE" : "#FFF",
                      }),
                      headerStyle: {
                        backgroundColor: "#358600",
                        color: "#fff",
                      },
                      padding: "dense",
                      toolbar: false,
                    }}
                    onSelectionChange={(rows) => {
                      this.setState({
                        selectedHealthOrg: rows,
                      });
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
          <DialogActions>
            <Button
              className="mb-16 mr-8 align-bottom"
              variant="contained"
              color="secondary"
              onClick={() => handleClose()}
            >
              {t("general.close")}
            </Button>

            <Button
              className="mb-16 mr-8 align-bottom"
              variant="contained"
              color="primary"
              type="submit"
            >
              {t("general.confirm")}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}
export default EQAHealthOrgPlanningRegisterDialog;
