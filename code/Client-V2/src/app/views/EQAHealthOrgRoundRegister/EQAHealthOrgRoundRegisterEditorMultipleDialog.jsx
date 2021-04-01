import React, { Component } from "react";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  InputAdornment,
  Checkbox,
  TablePagination,
  IconButton,
  FormHelperText,
  Icon,
  Tabs
} from "@material-ui/core";
import {
  ValidatorForm,
  TextValidator,
  TextField
} from "react-material-ui-form-validator";
import {
  getByPage,
  deleteItem,
  getItemById,
  addMultiple,
  saveItem
} from "./EQAHealthOrgRoundRegisterService";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader
} from "material-table";
import EQARoundSearchDialog from "./EQARoundSearchDialog";
import EQAHealthOrgSearchMultipleDialog from "./EQAHealthOrgSearchMultipleDialog";
import EQASampleSetSearchDialog from "./EQASampleSetSearchDialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import LocalConstants from "./Constants";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { searchByPage as searchByPageSet } from "../EQASampleSet/EQASampleSetService";
import DialogActions from "@material-ui/core/DialogActions";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { round } from "lodash";
import '../../../styles/views/_style.scss';

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
      <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
        <Icon fontSize="small" color="error">delete</Icon>
      </IconButton>
    </div>
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

class EQAHealthOrgRoundRegisterEditorMultipleDialog extends Component {
  state = {
    status: 0,
    feeStatus: 0,
    hasResult: false,
    selectedHealthOrg: [],
    page: 0,
    rowsPerPage: 5,
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenHealthOrgSearchMultipleDialog: false,
    round: [],
    eqaRoundId: "",
    isView: false,
    sampleRef: false
  };

  handleChange = (event, source) => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
    if (source === "hasResult") {
      this.setState({ hasErrorResult: false });
    }
    if (source === "sampleRef") {
      this.setState({ sampleRef: event.target.checked });
    }
  };

  handleSearchEQARoundDialogClose = () => {
    this.setState({
      shouldOpenSearchEQARoundSearchDialog: false
    });
  };
  handleSelectEQARound = item => {
    this.setState({ round: item });
    if (item != null) {
      this.setState({ eqaRoundId: item.id });
    }
    this.handleSearchEQARoundDialogClose();
  };

  handleFormSubmit = () => {
    const { round, sampleSet, hasResult, feeStatus, status, sampleRef } = this.state;
    const { t } = this.props;
    let healthOrgRoundRegisterList = [];
    for (let healthOrg of this.state.selectedHealthOrg) {
      healthOrgRoundRegisterList.push({
        healthOrg,
        round,
        sampleSet,
        sampleRef,
        hasResult,
        feeStatus,
        status
      });
    }
    if (this.state.hasResult == null) {
      this.setState({ hasErrorResult: true });
      return
    } else if (healthOrgRoundRegisterList != null && healthOrgRoundRegisterList.length > 0) {
      this.setState({ isView: true });
      addMultiple(healthOrgRoundRegisterList)
        .then(response => {
          if (response.data.errorCode == 1) {
            //đơn vị đã đăng ký
            this.props.toast.warning(response.data.message);
          } else {
            this.props.toast.info(
              t("EQAHealthOrgRoundRegister.notify.addMultipleSuccess")
            );
            // console.log(response);
            // this.props.handleOKEditClose();
          }
        })
        .catch(() => {
          this.props.toast.error(
            t("EQAHealthOrgRoundRegister.notify.addMultipleError")
          );
          this.setState({ isView: false });
        });
    } else {
      this.props.toast.warning(t("EQAHealthOrgRoundRegister.notify.noData"));
    }
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    this.setState({
      ...this.props.item, hasErrorResult: false
    });
  }

  handleDialogClose = () => {
    this.setState({
      shouldOpenHealthOrgSearchMultipleDialog: false,
      shouldOpenRoundSearchDialog: false,
      shouldOpenConfirmationDialog: false
    });
  };

  handleSelectHealthOrg = item => {
    const data = item.map(row => ({ ...row, tableData: { checked: false } }));
    this.setState({ selectedHealthOrg: data });
    this.handleDialogClose();
  };
  handleDialogCancel = () => {
    this.setState({
      shouldOpenHealthOrgSearchMultipleDialog: false
    });
  };
  handleSampleSetSearchDialogClose = () => {
    this.setState({
      shouldOpenSampleSetSearchDialog: false
    });
  };
  handleSelectSampleSet = item => {
    this.setState({ sampleSet: item, sampleSetRes: item });
    this.handleSampleSetSearchDialogClose();
  };
  handleDateChange = (date, name) => {
    this.setState({
      [name]: date
    });
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

  handleDelete = id => {
    let selectedHealthOrg = this.state.selectedHealthOrg;
    selectedHealthOrg = selectedHealthOrg.filter(row => row.id !== id);
    this.setState({
      selectedHealthOrg
    });
  };

  handleDeleteAll = data => {
    const deleteIdList = data.map(row => row.id);
    this.setState({
      deleteIdList,
      shouldOpenConfirmationDialog: true
    });
  };

  handleConfirmationResponse = () => {
    const selectedHealthOrg = this.state.selectedHealthOrg.filter(
      row => !this.state.deleteIdList.includes(row.id)
    );
    this.setState({
      selectedHealthOrg,
      shouldOpenConfirmationDialog: false
    });
  };

  render() {
    let {
      id,
      shouldOpenHealthOrgSearchMultipleDialog,
      shouldOpenRoundSearchDialog,
      shouldOpenSampleSetSearchDialog,
      selectedHealthOrg,
      eqaRoundId,
      sampleSet,
      status,
      feeStatus,
      hasResult,
      page,
      hasErrorResult,
      rowsPerPage,
      round,
      isView,
      sampleRef
    } = this.state;
    let {
      open,
      handleClose,
      handleOKEditClose,
      t,
      i18n,
      item,
    } = this.props;
    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    let searchObjectSet = { pageIndex: 0, pageSize: 100, eqaRoundId };
    const currentSelectedHealthOrg = selectedHealthOrg.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    let sampleColumns = [
      {
        title: t("SampleManagement.sample-list.Name"),
        field: "sample.name",
        width: "150"
      },
      {
        title: t("SampleManagement.sample-list.Code"),
        field: "sample.code",
        align: "left",
        width: "150"
      },
      {
        title: t("SampleManagement.sample-list.Result.title"),
        field: "status",
        align: "left",
        width: "150",
        render: rowData =>
          rowData.status == 1 ? (
            <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
              {t("SampleManagement.sample-list.Result.positive")}
            </small>
          ) : (
              <small className="border-radius-4 bg-light-gray px-8 py-2 ">
                {t("SampleManagement.sample-list.Result.negative")}
              </small>
            )
      },
      {
        title: t("SampleManagement.sample-list.AdditiveThrombin"),
        field: "sample.additiveThrombin",
        align: "left",
        width: "150"
      },
      {
        title: t("SampleManagement.sample-list.VolumeAfterRemoveFibrin"),
        field: "sample.volumeAfterRemoveFibrin",
        align: "left",
        width: "150"
      },
      {
        title: t("SampleManagement.sample-list.VolumeAfterCentrifuge"),
        field: "sample.volumeAfterCentrifuge",
        align: "left",
        width: "150"
      },
      {
        title: t("SampleManagement.sample-list.VolumeOfProclinAdded"),
        field: "sample.volumeOfProclinAdded",
        align: "left",
        width: "150"
      }
    ];
    let columns = [
      { title: t("Name"), field: "name", width: "150" },
      { title: t("Code"), field: "code", align: "left", width: "150" },
      {
        title: t("Action"),
        field: "custom",
        align: "left",
        width: "250",
        cellStyle: { whiteSpace: "nowrap" },
        render: rowData => (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 1) {
                this.handleDelete(rowData.id);
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
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
          <span className="mb-20 styleColor"> {(id ? t("update") : t("Add")) + " " + t("EQAHealthOrgRoundRegister.title")} </span>
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
              {/* <Grid item container spacing={2}> */}
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <AsynchronousAutocomplete
                  label={<span className="font"><span style={{ color: "red" }}> * </span>
                    {t("EQARound.title")}
                  </span>}
                  size="small"
                  variant="outlined"
                  searchFunction={searchByPageEQARound}
                  searchObject={searchObject}
                  defaultValue={round}
                  value={round}
                  displayLable={"code"}
                  valueTextValidator={round}
                  onSelect={this.handleSelectEQARound}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              {eqaRoundId != "" && round != null && (
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <AsynchronousAutocomplete
                    label={<span className="font">{t("EQAHealthOrgRoundRegister.SetName")}</span>}
                    size="small"
                    variant="outlined"
                    searchFunction={searchByPageSet}
                    searchObject={searchObjectSet}
                    defaultValue={sampleSet}
                    value={sampleSet}
                    displayLable={"name"}
                    valueTextValidator={sampleSet}
                    onSelect={this.handleSelectSampleSet}
                  />
                </Grid>
              )}
              {/* {eqaRoundId != "" && round != null && sampleSet != null && sampleSet != "" && (
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <FormControlLabel
                    label={<span className="font">{t('EQAHealthOrgRoundRegister.sendMore')}</span>}
                    control={<Checkbox checked={sampleRef}
                      onChange={(sampleRef) =>
                        this.handleChange(sampleRef, 'sampleRef')
                      }
                    />}

                  />
                </Grid>
              )} */}
              {/* </Grid> */}

              <Grid item lg={4} md={4} sm={12} xs={12}>
                <FormControl className="w-100" error={hasErrorResult} size="small" variant="outlined">
                  <InputLabel htmlFor="hasResult">
                    {<span className="font"><span style={{ color: "red" }}> * </span>
                      {t("EQAHealthOrgRoundRegister.HasResult.title")}
                    </span>}
                  </InputLabel>
                  <Select
                    // name="hasResult"
                    value={typeof hasResult == "undefined" ? '' : hasResult}
                    defaultValue={{ value: false }}
                    onChange={event => this.handleChange(event, "hasResult")}
                    // input={<Input id="hasResult" />}
                    inputProps={{
                      id: "hasResult",
                      name: "hasResult"
                    }
                    }
                  >
                    <MenuItem value={LocalConstants.EQAStatusResult_value.no}>
                      {t("EQAHealthOrgRoundRegister.HasResult.No")}
                    </MenuItem>
                    <MenuItem value={LocalConstants.EQAStatusResult_value.yes}>
                      {t("EQAHealthOrgRoundRegister.HasResult.Yes")}
                    </MenuItem>
                  </Select>
                  {hasErrorResult && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <FormControl className="w-100" size="small" variant="outlined">
                  <InputLabel htmlFor="feeStatus">
                    {<span className="font">{t("EQAHealthOrgRoundRegister.FeeStatus.title")}</span>}
                  </InputLabel>
                  <Select
                    // name="feeStatus"
                    value={feeStatus}
                    // value={typeof feeStatus == "undefined" ? '' : feeStatus}
                    defaultValue={{ value: 0 }}
                    onChange={event => this.handleChange(event)}
                    // input={<Input id="feeStatus" />}
                    inputProps={{
                      id: "feeStatus",
                      name: "feeStatus"
                    }}
                  >
                    <MenuItem value={LocalConstants.EQAFeeStatus_Value.no}>
                      {t("EQAHealthOrgRoundRegister.FeeStatus.No")}
                    </MenuItem>
                    <MenuItem value={LocalConstants.EQAFeeStatus_Value.yes}>
                      {t("EQAHealthOrgRoundRegister.FeeStatus.Yes")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <FormControl className="w-100" size="small" variant="outlined">
                  <InputLabel htmlFor="status">
                    {<span className="font">{t("EQAHealthOrgRoundRegister.status")}</span>}
                  </InputLabel>
                  <Select
                    // name="status"
                    value={status}
                    defaultValue={{ value: 0 }}
                    onChange={event => this.handleChange(event)}
                    // input={<Input id="status" />}
                    inputProps={{
                      id: "status",
                      name: "status"
                    }}
                  >
                    <MenuItem value={LocalConstants.EQAHealthOrgRoundRegister_Value.new}>
                      {t("EQAHealthOrgRoundRegister.Status.New")}
                    </MenuItem>
                    <MenuItem value={LocalConstants.EQAHealthOrgRoundRegister_Value.confirmed}>
                      {t("EQAHealthOrgRoundRegister.Status.Confirmed")}
                    </MenuItem>
                    <MenuItem value={LocalConstants.EQAHealthOrgRoundRegister_Value.cancel_Registration}>
                      {t(
                        "EQAHealthOrgRoundRegister.Status.Cancel_Registration"
                      )}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <fieldset style={{ width: "100%" }}>
                <legend><span className="styleColor">{t("EQAHealthOrgRoundRegister.HealthOrgName")}</span></legend>
                <Grid item container spacing={3} sm={12} xs={12}>
                  <Grid item xs={12}>
                    <Button
                      className="align-bottom"
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        this.setState({
                          shouldOpenHealthOrgSearchMultipleDialog: true
                        })
                      }
                    >
                      {t("Select")}
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <MaterialTable
                      title={t("EQAHealthOrgRoundRegister.title")}
                      columns={columns}
                      data={currentSelectedHealthOrg}
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
                          color: '#fff',
                        },
                        padding: 'dense',
                        toolbar: false
                      }}
                      onSelectionChange={rows => {
                        this.data = rows;
                      }}
                      actions={[
                        {
                          tooltip: "Remove All Selected Users",
                          icon: "delete",
                          onClick: (evt, data) => {
                            this.handleDeleteAll(data);
                          }
                        }
                      ]}
                      localization={{
                        body: {
                          emptyDataSourceMessage: `${t(
                            "general.emptyDataMessageTable"
                          )}`,
                        },
                      }}
                    />
                    <ConfirmationDialog
                      title={t("confirm")}
                      open={this.state.shouldOpenConfirmationDialog}
                      onConfirmDialogClose={this.handleDialogClose}
                      onYesClick={this.handleConfirmationResponse}
                      text={t("DeleteConfirm")}
                      Yes={t("general.Yes")}
                      No={t("general.No")}
                    />
                    <TablePagination
                      align="left"
                      className="px-16"
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      labelRowsPerPage={t('general.rows_per_page')}
                      labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
                      count={selectedHealthOrg.length}
                      rowsPerPage={this.state.rowsPerPage}
                      page={this.state.page}
                      backIconButtonProps={{
                        "aria-label": "Previous Page"
                      }}
                      nextIconButtonProps={{
                        "aria-label": "Next Page"
                      }}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                  </Grid>
                </Grid>
              </fieldset>
              {shouldOpenHealthOrgSearchMultipleDialog && (
                <EQAHealthOrgSearchMultipleDialog
                  open={this.state.shouldOpenHealthOrgSearchMultipleDialog}
                  selectedHealthOrg={selectedHealthOrg}
                  handleSelect={this.handleSelectHealthOrg}
                  handleClose={this.handleDialogCancel}
                  eqaRoundId={eqaRoundId}
                  t={t}
                  i18n={i18n}
                />
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              className="mr-36 align-bottom"
              variant="contained"
              color="secondary"
              onClick={() => handleClose()}
            >
              {t("general.cancel")}
            </Button>
            <Button
              className="mr-16 align-bottom"
              variant="contained"
              color="primary"
              type="submit"
              disabled={isView}
            >
              {t("general.save")}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}
export default EQAHealthOrgRoundRegisterEditorMultipleDialog;
