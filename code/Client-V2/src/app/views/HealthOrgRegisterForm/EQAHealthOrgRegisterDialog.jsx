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
  Icon
} from "@material-ui/core";
import {
  getByPage,
  deleteItem,
  saveItem,
  handleCancelRegistration,
  reRegisterEQARound,
  getItemById,
  searchByPage,
  handleCancelRegistrationFromDialog
} from "./HealthOrgRegisterFormService";
import {
  ValidatorForm,
  TextValidator,
  TextField
} from "react-material-ui-form-validator";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader
} from "material-table";
import EQARoundSearchDialog from "./EQARoundSearchDialog";
import DialogContent from "@material-ui/core/DialogContent";
import {
  getHealthOrgByUserId,
  getCurrentUser,
  registerEQARound
} from "./HealthOrgRegisterFormService";
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
import { forEach } from "lodash";
import { Breadcrumb, ConfirmationDialog } from "egret";
import '../../../styles/views/_style.scss';

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit:3
});

function MaterialButton(props) {
  const item = props.item;
  return (
    <div>
      <IconButton size="small"
        onClick={() => props.onSelect(item, 1)}
        title="Xoá đơn vị này khỏi danh sách đăng ký"
        disabled={
          typeof item.hasRegister === "undefined" ? true : !item.hasRegister
        }
      >
        <Icon fontSize="small"
          color={
            typeof item.hasRegister === "undefined" || !item.hasRegister
              ? "disabled"
              : "error"
          }
        >
          cancel
        </Icon>
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
const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});
class EQAHealthOrgRegisterDialog extends Component {
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
    selectedItem: {}
  };
  handleChange = (event, source) => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = () => {
    let { t } = this.props;
    let { round, sampleSet, hasRegister, feeStatus, status } = this.state;
    let healthOrgRoundRegisterList = [];
    for (let healthOrg of this.state.selectedHealthOrg) {
      if (!healthOrg.hasRegister) {
        healthOrgRoundRegisterList.push({
          healthOrg,
          round,
          sampleSet,
          hasRegister,
          feeStatus,
          status
        });
      }
    }
    registerEQARound([...healthOrgRoundRegisterList]).then(response => {
      if (response.data.errorCode == 1) {
        //đơn vị đã đăng ký
        toast.warning(response.data.message);
      } else {
        toast.info(t("EQAHealthOrgRoundRegister.notify.addSuccess"));
        this.props.handleClose();
      }
    });
  };
  handleRoundSearchDialogClose = () => {
    this.setState({
      shouldOpenRoundSearchDialog: false
    });
  };
  handleSelectRound = item => {
    this.setState({ round: item });
    this.handleRoundSearchDialogClose();
  };
  componentWillMount() {
    let { open, handleClose, item } = this.props;
    this.setState({ round: this.props.item });
  }
  handleHealthOrgSearchDialogClose = () => {
    this.setState({
      shouldOpenHealthOrgSearchDialog: false
    });
  };
  handleSelectHealthOrg = item => {
    this.setState({ healthOrg: item });
    this.handleHealthOrgSearchDialogClose();
  };

  handleSampleSetSearchDialogClose = () => {
    this.setState({
      shouldOpenSampleSetSearchDialog: false
    });
  };
  handleSelectSampleSet = item => {
    this.setState({ sampleSet: item });
    this.handleSampleSetSearchDialogClose();
  };
  handleDateChange = (date, name) => {
    this.setState({
      [name]: date
    });
  };
  handleDialogClose = () => {
    this.setState({
      shouldOpenHealthOrgSearchMultipleDialog: false,
      shouldOpenConfirmationDialog: false
    });
  };
  // updatePageData = () => {

  //   var searchObject = {};
  //   searchObject.text = "";
  //   if (this.props.round != null) {
  //     searchObject.roundId = this.props.round.id;
  //   }
  //   searchObject.pageIndex = 1;
  //   searchObject.pageSize = 1000000;
  //   searchByPage(searchObject, 1, 1000000).then(({ data }) => {
  //     return data.content;
  //   })
  // };
  componentDidMount() {
    let searchObject = {};
    searchObject.text = "";
    if (this.props.round != null) {
      searchObject.roundId = this.props.round.id;
    }
    searchObject.pageIndex = 1;
    searchObject.pageSize = 1000000;
    searchByPage(searchObject).then(({ data }) => {
      let registeredList = data.content;
        getHealthOrgByUserId(0).then(({ data }) => {
          let roundTab2 = [];
          for (let i = 0; i < registeredList?.length; i++) {
            let childItemList = registeredList[i];
            roundTab2.push(childItemList);
          }
        if(data.length ===1 ){
            let listHealthOrgs = data;
            for (let i = 0; i < listHealthOrgs.length; i++) {
              let heItem = listHealthOrgs[i];
              for (let i = 0; i < roundTab2.length; i++) {
                let heOrgRound = roundTab2[i];
                if (this.state.round.id === heOrgRound.round.id) {
                  if (heItem.id == heOrgRound.healthOrg.id) {
                    if (heOrgRound.status !== -1) {
                      heItem.hasRegister = true;
                    }
                  }
                }
              }
            }
            this.setState({
                  listHealthOrgs:data.map(healthOrg =>
                    healthOrg
                      ? { ...healthOrg, tableData: { checked: true } }
                      : healthOrg
                  )
                },()=>{
                  let {selectedHealthOrg} = this.state
                  selectedHealthOrg =this.state.listHealthOrgs
                  this.setState({selectedHealthOrg})
                })
                return
          }
          let childListHealthOrgsId = [];
          let listHealthOrgs = data;
          for (let i = 0; i < listHealthOrgs.length; i++) {
            let heItem = listHealthOrgs[i];
            for (let i = 0; i < roundTab2.length; i++) {
              let heOrgRound = roundTab2[i];
              if (this.state.round.id === heOrgRound.round.id) {
                if (heItem.id == heOrgRound.healthOrg.id) {
                  if (heOrgRound.status !== -1) {
                    heItem.hasRegister = true;
                  }
                }
              }
            }
          }
          this.setState({
            listHealthOrgs: listHealthOrgs.map(healthOrg =>
              healthOrg.hasRegister
                ? { ...healthOrg, tableData: { checked: true } }
                : healthOrg
            )
          });
        });
    });
  }
  // handleSelectHealthOrg = item => {
  //   const data = item.map(row => ({ ...row, tableData: { checked: false } }));
  //   this.setState({ selectedHealthOrg: data });
  //   this.handleDialogClose();
  // };
  handleDelete = rowData => {
    let { listHealthOrgs } = this.state;
    if (listHealthOrgs != null && listHealthOrgs.length > 0) {
      for (let index = 0; index < listHealthOrgs.length; index++) {
        if (listHealthOrgs && listHealthOrgs[index].id == rowData.id) {
          listHealthOrgs.splice(index, 1);
          break;
        }
      }
    }
    this.setState({ listHealthOrgs }, function() {});
  };
  handleOpenConfirmationDialog = rowData => {
    this.setState({
      shouldOpenConfirmationDialog: true,
      selectedItem: rowData
    });
  };

  handleConfirmationResponse = () => {
    let { t } = this.props;
    const { selectedItem } = this.state;
    handleCancelRegistrationFromDialog(
      selectedItem.id,
      this.state.round.id
    ).then(() => {
      let { listHealthOrgs, selectedHealthOrg } = this.state;
      listHealthOrgs.forEach(healthOrg => {
        if (healthOrg.id === selectedItem.id) {
          healthOrg.hasRegister = false;
          healthOrg.tableData.checked = false;
        }
      });
      selectedHealthOrg = selectedHealthOrg.filter(
        item => item.id != selectedItem.id
      );
      this.setState({
        selectedHealthOrg,
        listHealthOrgs,
        shouldOpenConfirmationDialog: false
      });
    }).catch(()=>{
      toast.error(t("EQAHealthOrgRoundRegister.notify.error"));
      this.handleDialogClose();
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
      selectedHealthOrg
    } = this.state;
    let {
      open,
      handleClose,
      handleOKEditClose,
      t,
      i18n,
      item,
      isView
    } = this.props;
    //const currentSelectedHealthOrg = listHealthOrgs.slice();
    let columns = [
      { title: t("Name"), field: "name", width: "150" },
      { title: t("Code"), field: "code", align: "left", width: "150" },
      {
        title: t("HealthOrgRegisterForm.unregister"),
        field: "custom",
        align: "left",
        width: "250",
        cellStyle: { whiteSpace: "nowrap" },
        render: rowData => (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 1) {
                this.handleOpenConfirmationDialog(rowData);
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        )
      },
      {
        title: t("Status"),
        field: "hasRegister",
        width: "150",
        render: rowData =>
          rowData.hasRegister == true ? (
            <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
              {t("HealthOrgRegisterForm.IsRegister.Yes")}
            </small>
          ) : (
            <small className="border-radius-4 bg-dark px-8 py-2 " style={{ backgroundColor: "#f44336" }}>
              {t("HealthOrgRegisterForm.IsRegister.No")}
            </small>
          )
      }
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
          {<span className="styleColor">{t("HealthOrgRegisterForm.title")}</span>}
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
              <Grid item md={12} sm={12} xs={12}>
                <TextValidator
                  label={t("EQAHealthOrgRoundRegister.RoundName")}
                  placeholder={t("EQAHealthOrgRoundRegister.RoundName")}
                  id="round"
                  size="small"
                  variant="outlined"
                  className="w-100 mb-16 mr-16 stylePlaceholder"
                  value={round != null ? round.name : ""}
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
              <fieldset style={{ width: "100%", padding:"0" }}>
                  <Grid item xs={12}>
                    <MaterialTable
                      title={t("HealthOrgRegisterForm.title_table")}
                      columns={columns}
                      data={listHealthOrgs}
                      options={{
                        selection: true,
                        actionsColumnIndex: -1,
                        paging: false,
                        search: false,
                        rowStyle: (rowData, index) => ({
                          backgroundColor: (index % 2 === 1) ? '#EEE' : '#FFF',
                        }), 
                        headerStyle: {
                          backgroundColor: '#358600',
                          color:'#fff',
                        },
                        padding: 'dense',
                        toolbar: false
                      }}
                      onSelectionChange={rows => {
                        this.setState({
                          selectedHealthOrg: rows
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
            {listHealthOrgs.length > 0 && (
              <Button
                className="mb-16 mr-16 align-bottom"
                variant="contained"
                color="primary"
                type="submit"
              >
                {t("general.confirm")}
              </Button>
            )}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}
export default EQAHealthOrgRegisterDialog;
