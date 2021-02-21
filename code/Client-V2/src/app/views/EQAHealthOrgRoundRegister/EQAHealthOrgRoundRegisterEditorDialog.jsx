import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  Checkbox,
  FormHelperText,
  FormControlLabel,
  Switch, InputAdornment,
  Icon, IconButton
} from "@material-ui/core";
import { TabList, Tabs, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ValidatorForm, TextValidator, TextField } from "react-material-ui-form-validator";
import { getByPage, deleteItem, saveItem, getItemById, getTubeById } from "./EQAHealthOrgRoundRegisterService";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import EQARoundSearchDialog from "./EQARoundSearchDialog";
import EQAHealthOrgSearchDialog from "./EQAHealthOrgSearchDialog";
import EQASampleSetSearchDialog from "./EQASampleSetSearchDialog";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import LocalConstants from "./Constants";
import DialogActions from '@material-ui/core/DialogActions';
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import { searchByPage as searchByPageSet } from "../EQASampleSet/EQASampleSetService";
import { toast } from 'react-toastify';
import moment from "moment";
import '../../../styles/views/_style.scss';
import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
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
class EQAHealthOrgRoundRegisterEditorDialog extends Component {
  state = {
    status: 0,
    healthOrg: null,
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false,
    eqaSampleTubes: [],
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

  handleFormSubmit = () => {
    let { t } = this.props;
    if (this.state.hasResult == null) {
      this.setState({ hasErrorResult: true });
      return
    } else {
      saveItem({ ...this.state }).then((respone) => {

        if (respone.data.isDuplicateHealthOrg) {
          toast.warning(t('EQAHealthOrgRoundRegister.notify.duplicatedHealthOrg'));
        }
        else if (!respone.data.isDuplicateHealthOrg && respone.status == 200) {
          toast.success(t('EQAHealthOrgRoundRegister.notify.updateSuccess'));
          // this.props.handleOKEditClose();
        } else {
          toast.error(t('EQAHealthOrgRoundRegister.notify.addFail'));
        }
      });
    }
  };

  handleRoundSearchDialogClose = () => {
    this.setState({
      shouldOpenRoundSearchDialog: false
    });
  };
  handleSelectRound = (item) => {
    //alert('Test');
    this.setState({ round: item });
    if (item != null) {
      this.setState({ eqaRoundId: item.id });
    }
    this.handleRoundSearchDialogClose();
  }
  componentWillMount() {
    let { open, handleClose, item, roundId } = this.props;
    this.setState({
      ...item
    });
    if (item != null && item.sampleTransferStatus != null) {
      if (item.sampleTransferStatus == 2 || item.sampleTransferStatus == 3) {
        this.setState({ isView: true });
      }
    }
  }

  componentDidMount() {
    getTubeById(this.props.item.id).then(({ data }) => {
      let eqaSampleTubeMain = [];
      let eqaSampleTubeReference = [];
      data.forEach(element => {
        if (element != null) {
          if (element.type == 0) {
            eqaSampleTubeReference.push(element);
          } else {
            eqaSampleTubeMain.push(element);
          }
        }
      });
      this.setState({
        eqaSampleTubes: data,
        eqaSampleTubeReference,
        eqaSampleTubeMain
      })
      let { round } = this.state;
      if (round != null) {
        this.setState({ eqaRoundId: round.id });
      }
    });
    this.setState({
      hasErrorResult: false
    }, function () {
    });
  }
  handleHealthOrgSearchDialogClose = () => {
    this.setState({
      shouldOpenHealthOrgSearchDialog: false
    });
  };
  handleSelectHealthOrg = (item) => {
    //alert('Test');
    this.setState({ healthOrg: item });
    this.handleHealthOrgSearchDialogClose();
  }

  //Set mau
  handleSampleSetSearchDialogClose = () => {
    this.setState({
      shouldOpenSampleSetSearchDialog: false
    });
  };
  handleSelectSampleSet = (item) => {
    //alert('Test');
    this.setState({ sampleSet: item, sampleSetRes: item });
    this.handleSampleSetSearchDialogClose();
  }
  handleDateChange = (date, name) => {
    this.setState({
      [name]: date
    });
  };

  render() {
    let {
      id,
      shouldOpenHealthOrgSearchDialog,
      healthOrg,
      round,
      eqaRoundId,
      sampleSet,
      status,
      feeStatus,
      hasErrorResult,
      hasResult,
      sampleRef,
      isView
    } = this.state;
    let { open, handleClose, handleOKEditClose, t, i18n, item } = this.props;
    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    let searchObjectSet = { pageIndex: 0, pageSize: 100, eqaRoundId };
    let sampleColumns = [
      {
        title: t("SampleManagement.sample-list.Code"), field: "code", align: "left", width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("SampleManagement.sample-list.Result.title"), field: "eqaSample.result", align: "left", width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => rowData.eqaSample.result == 1 ? (
          <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
            {t("SampleManagement.sample-list.Result.positive")}
          </small>
        ) : rowData.eqaSample.result == 0 ? (
          <small className="border-radius-4 bg-light-gray px-8 py-2 ">
            {t("SampleManagement.sample-list.Result.indertermine")}
          </small>
        ) : rowData.eqaSample.result == -1 ? (
          <small className="border-radius-4 bg-light-gray px-8 py-2 ">
            {t("SampleManagement.sample-list.Result.negative")}
          </small>
        ) : (<small className="border-radius-4 bg-light-gray px-8 py-2 ">
          {t("SampleManagement.sample-list.Result.none")}
        </small>
              )
      },
      // {
      //   title: t("SampleManagement.sample-list.AdditiveThrombin"), field: "additiveThrombin", width: "150"
      // },
      {
        title: t("SampleManagement.sample-list.InactiveVirus.title"), field: "inactiveVirus", align: "left", width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => rowData.eqaSample.inactiveVirus == true ? (
          <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
            {t("SampleManagement.sample-list.InactiveVirus.Yes")}
          </small>
        ) : (
            <small className="border-radius-4 bg-light-gray px-8 py-2 ">
              {t("SampleManagement.sample-list.InactiveVirus.No")}
            </small>
          )
      },
      {
        title: t("SampleManagement.sample-list.dilutionLevel"), field: "eqaSample.dilutionLevel", width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("SampleManagement.sample-list.dilution"), field: "eqaSample.dilution", width: "150",
        headerStyle: {
          minWidth: "175px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "175px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("SampleManagement.sample-list.performer"), field: "eqaSample.personnel.displayName", width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("SampleManagement.sample-list.endDate"), field: "", width: "150",
        headerStyle: {
          minWidth: "175px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "175px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => rowData.eqaSample.endDate ? (
          <span>{moment(rowData.eqaSample.endDate).format('DD/MM/YYYY')}</span>
        ) : ""
      },
    ];
    return (
      <Dialog
        scroll={'paper'}
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"lg"}
        fullWidth={true}
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20 styleColor"> {(id ? t("update") : t("Add")) + " " + t("EQAHealthOrgRoundRegister.title")} </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
        </DialogTitle>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
          <DialogContent dividers>
            <Grid className="mb-16" container spacing={2}>
              {/* <Grid item container spacing={2}> */}
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <TextValidator
                  className = "stylePlaceholder"
                  label={<span className="font">{t("EQAHealthOrgRoundRegister.HealthOrgName")}</span>}
                  placeholder={t("EQAHealthOrgRoundRegister.HealthOrgName")}
                  id="healthOrg"
                  size="small"
                  variant = "outlined"
                  className="w-100"
                  value={healthOrg != null ? healthOrg.name : ''}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              {shouldOpenHealthOrgSearchDialog && (
                <EQAHealthOrgSearchDialog
                  open={this.state.shouldOpenHealthOrgSearchDialog}
                  handleSelect={this.handleSelectHealthOrg}
                  selectedItem={healthOrg != null ? healthOrg : {}}
                  handleClose={this.handleHealthOrgSearchDialogClose} t={t} i18n={i18n} />
              )
              }
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <AsynchronousAutocomplete
                  label={<span className="font"><span style={{ color: "red" }}> * </span>
                    {t("EQARound.title")}
                  </span>}
                  size="small"
                  variant = "outlined"
                  searchFunction={searchByPageEQARound}
                  searchObject={searchObject}
                  defaultValue={round}
                  value={round}
                  disabled={isView}
                  displayLable={'code'}
                  valueTextValidator={round}
                  onSelect={this.handleSelectRound}
                />
              </Grid>
              {round != null && round.id != '' && (
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <AsynchronousAutocomplete
                    label={<span className="font">{t("EQAHealthOrgRoundRegister.SetName")}</span>}
                    size="small"
                    variant = "outlined"
                    searchFunction={searchByPageSet}
                    searchObject={searchObjectSet}
                    defaultValue={sampleSet}
                    value={sampleSet}
                    // disabled={isView}
                    displayLable={'name'}
                    valueTextValidator={sampleSet}
                    onSelect={this.handleSelectSampleSet}
                  />
                </Grid>
              )}
              {round != null && round.id != '' && sampleSet != null && (
                <Grid item lg={3} md={3} sm={12} xs={12}>
                  <FormControlLabel
                    label={<span className="font">{t('EQAHealthOrgRoundRegister.sendMore')}</span>}
                    control={<Checkbox checked={sampleRef}
                      onChange={(sampleRef) =>
                        this.handleChange(sampleRef, 'sampleRef')
                      }
                    />}

                  />
                </Grid>
              )}
              {/* </Grid> */}
              
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <FormControl className="w-100" error={hasErrorResult} size="small" variant = "outlined">
                  <InputLabel htmlFor="hasResult">{<span className="font"><span style={{ color: "red" }}> * </span>
                    {t("EQAHealthOrgRoundRegister.HasResult.title")}
                  </span>}</InputLabel>
                  <Select
                    // name="hasResult"
                    value={hasResult}
                    onChange={event => this.handleChange(event, "hasResult")}
                    // input={<Input id="hasResult" />}
                    inputProps ={{
                      id: "hasResult",
                      name: "hasResult"
                    }
                    }
                  >
                    <MenuItem value={false}>{t("EQAHealthOrgRoundRegister.HasResult.No")}</MenuItem>
                    <MenuItem value={true}>{t("EQAHealthOrgRoundRegister.HasResult.Yes")}</MenuItem>
                  </Select>
                  {hasErrorResult && <FormHelperText>{t("general.errorMessages_required")}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <FormControl className="w-100" size="small" variant = "outlined">
                  <InputLabel htmlFor="feeStatus">{<span className="font"><span style={{ color: "red" }}> * </span>
                    {t("EQAHealthOrgRoundRegister.FeeStatus.title")}
                  </span>}</InputLabel>
                  <Select
                    // name="feeStatus"
                    value={feeStatus}
                    onChange={event => this.handleChange(event)}
                    // input={<Input id="feeStatus" />}
                    inputProps={{
                      id:"feeStatus",
                      name: "feeStatus"
                    }}
                  >
                    <MenuItem value={0}>{t("EQAHealthOrgRoundRegister.FeeStatus.No")}</MenuItem>
                    <MenuItem value={1}>{t("EQAHealthOrgRoundRegister.FeeStatus.Yes")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <FormControl className="w-100" size="small" variant = "outlined">
                  <InputLabel htmlFor="status">{<span className="font">{t("EQAHealthOrgRoundRegister.status")}</span>}</InputLabel>
                  <Select
                    // name="status"
                    value={status}
                    defaultValue={{ value: 0 }}
                    onChange={event => this.handleChange(event)}
                    // input={<Input id="status" />}
                    inputProps={{
                      id: "status",
                      name:"status"
                    }}  
                  >
                    <MenuItem value={LocalConstants.EQAHealthOrgRoundRegister_Value.new}>{t("EQAHealthOrgRoundRegister.Status.New")}</MenuItem>
                    <MenuItem value={LocalConstants.EQAHealthOrgRoundRegister_Value.confirmed} >{t("EQAHealthOrgRoundRegister.Status.Confirmed")}</MenuItem>
                    <MenuItem value={LocalConstants.EQAHealthOrgRoundRegister_Value.cancel_Registration} >{t("EQAHealthOrgRoundRegister.Status.Cancel_Registration")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Tabs defaultIndex={0}>
                  <TabList>
                    <Tab><span className="styleColor">{t("EQAHealthOrgRoundRegister.tubeMain")}</span></Tab>
                    {(this.state.eqaSampleTubeReference != null && this.state.eqaSampleTubeReference.length > 0) && <Tab><span className="styleColor">{t("EQAHealthOrgRoundRegister.tubeReference")}</span></Tab>}
                    {/* <Tab>{t("EQAHealthOrgRoundRegister.tubeReference")}</Tab> */}
                  </TabList>
                  <TabPanel>
                    <MaterialTable
                      title=""
                      data={this.state.eqaSampleTubeMain}
                      columns={sampleColumns}
                      parentChildData={(row, rows) => {
                        var list = rows.find(a => a.id === row.parentId);
                        return list;
                      }}
                      options={{
                        selection: false,
                        actionsColumnIndex: -1,
                        paging: false,
                        search: false,
                        rowStyle: rowData => ({
                          backgroundColor: (rowData.tableData.id % 2 === 1) ? '#EEE' : '#FFF',
                        }),
                        headerStyle: {
                          backgroundColor: '#358600',
                          color: '#fff',
                        },
                        padding: 'dense',
                        toolbar: false
                      }}
                      localization={{
                        body: {
                          emptyDataSourceMessage: `${t(
                            "general.emptyDataMessageTable"
                          )}`,
                        },
              }}
                    />
                  </TabPanel>
                  <TabPanel>
                    <MaterialTable
                      title=""
                      data={this.state.eqaSampleTubeReference}
                      columns={sampleColumns}
                      parentChildData={(row, rows) => {
                        var list = rows.find(a => a.id === row.parentId);
                        return list;
                      }}
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
                      localization={{
                        body: {
                          emptyDataSourceMessage: `${t(
                            "general.emptyDataMessageTable"
                          )}`,
                        },
                      }}
                    />
                  </TabPanel>
                </Tabs>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              className="mr-36 align-bottom"
              variant="contained"
              color="secondary"
              onClick={() => handleClose()}>{t('general.cancel')}
            </Button>
            <Button className="mr-16 align-bottom"
              variant="contained"
              color="primary"
              type="submit">
              {t('general.save')}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQAHealthOrgRoundRegisterEditorDialog;
