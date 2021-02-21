import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import {
  ValidatorForm,
  TextValidator,
  TextField
} from "react-material-ui-form-validator";
import { getItemById } from "./HealthOrgRegisterFormService";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader
} from "material-table";
import EQARoundSearchDialog from "./EQARoundSearchDialog";
import EQAHealthOrgSearchDialog from "./EQAHealthOrgSearchDialog";
import EQASampleSetSearchDialog from "./EQASampleSetSearchDialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Helmet } from "react-helmet";

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
class EQAHealthOrgRoundRegisterEditorDialog extends Component {
  state = {
    status: 1,
    shouldOpenSearchDialog: false,
    shouldOpenConfirmationDialog: false
  };

  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      let status = 0;
      if (event.target.checked) {
        status = 1;
      }
      this.setState({ status: status });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = () => {};

  handleRoundSearchDialogClose = () => {
    this.setState({
      shouldOpenRoundSearchDialog: false
    });
  };
  handleSelectRound = item => {
    //alert('Test');
    this.setState({ round: item });
    this.handleRoundSearchDialogClose();
  };
  componentWillMount() {
    let { open, handleClose, item } = this.props;
    this.setState({
      ...this.props.item
    });
  }
  handleHealthOrgSearchDialogClose = () => {
    this.setState({
      shouldOpenHealthOrgSearchDialog: false
    });
  };
  handleSelectHealthOrg = item => {
    //alert('Test');
    this.setState({ healthOrg: item });
    this.handleHealthOrgSearchDialogClose();
  };

  //Set mau
  handleSampleSetSearchDialogClose = () => {
    this.setState({
      shouldOpenSampleSetSearchDialog: false
    });
  };
  handleSelectSampleSet = item => {
    //alert('Test');
    this.setState({ sampleSet: item });
    this.handleSampleSetSearchDialogClose();
  };
  handleDateChange = (date, name) => {
    this.setState({
      [name]: date
    });
  };

  render() {
    let {
      shouldOpenHealthOrgSearchDialog,
      shouldOpenRoundSearchDialog,
      shouldOpenSampleSetSearchDialog,
      healthOrg,
      round,
      sampleSet,
      status,
      feeStatus,
      hasResult
    } = this.state;
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
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
    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={"md"} fullWidth={true}>
        <Helmet>
          <title>
            {t("EQAHealthOrgRoundRegister.titlePage")} | {t("web_site")}
          </title>
        </Helmet>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("SaveUpdate")}
        </DialogTitle>
        <DialogContent>
          <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
            <Grid className="mb-16" container spacing={2}>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  label={t("EQAHealthOrgRoundRegister.HealthOrgName")}
                  placeholder={t("EQAHealthOrgRoundRegister.HealthOrgName")}
                  id="healthOrg"
                  className="w-80 mb-16 mr-16"
                  value={healthOrg != null ? healthOrg.name : ""}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />

                <Button
                  className="mb-16 align-bottom"
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.setState({
                      shouldOpenHealthOrgSearchDialog: true,
                      item: {}
                    })
                  }
                >
                  {t("Select")}
                </Button>
              </Grid>
              {shouldOpenHealthOrgSearchDialog && (
                <EQAHealthOrgSearchDialog
                  open={this.state.shouldOpenHealthOrgSearchDialog}
                  handleSelect={this.handleSelectHealthOrg}
                  selectedItem={healthOrg != null ? healthOrg : {}}
                  handleClose={this.handleHealthOrgSearchDialogClose}
                  t={t}
                  i18n={i18n}
                />
              )}
              <Grid item sm={12} xs={12}>
                <TextValidator
                  label={t("EQAHealthOrgRoundRegister.RoundName")}
                  placeholder={t("EQAHealthOrgRoundRegister.RoundName")}
                  id="round"
                  className="w-80 mb-16 mr-16"
                  value={round != null ? round.name : ""}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
                <Button
                  className="mb-16 align-bottom"
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.setState({
                      shouldOpenRoundSearchDialog: true,
                      item: {}
                    })
                  }
                >
                  {t("Select")}
                </Button>
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

              {round != null && round.id != "" && (
                <Grid item sm={12} xs={12}>
                  <TextValidator
                    label={t("EQAHealthOrgRoundRegister.SetName")}
                    placeholder={t("EQAHealthOrgRoundRegister.SetName")}
                    id="RoundName"
                    className="w-80 mb-16 mr-16"
                    value={sampleSet != null ? sampleSet.name : ""}
                    validators={["required"]}
                    errorMessages={[t("general.errorMessages_required")]}
                  />
                  <Button
                    className="mb-16 align-bottom"
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      this.setState({
                        shouldOpenSampleSetSearchDialog: true,
                        item: {}
                      })
                    }
                  >
                    {t("Select")}
                  </Button>
                </Grid>
              )}
              {shouldOpenSampleSetSearchDialog && (
                <EQASampleSetSearchDialog
                  open={this.state.shouldOpenSampleSetSearchDialog}
                  handleSelect={this.handleSelectSampleSet}
                  selectedItem={sampleSet != null ? sampleSet : {}}
                  handleClose={this.handleSampleSetSearchDialogClose}
                  t={t}
                  i18n={i18n}
                  eqaRoundId={round != null ? round.id : ""}
                />
              )}
              <Grid item sm={6} xs={12}>
                <FormControl className="w-100">
                  <InputLabel htmlFor="hasResult">
                    {t("EQAHealthOrgRoundRegister.HasResult.title")}
                  </InputLabel>
                  <Select
                    name="hasResult"
                    value={hasResult}
                    onChange={event => this.handleChange(event)}
                    input={<Input id="hasResult" />}
                  >
                    <MenuItem value={false}>
                      {t("EQAHealthOrgRoundRegister.HasResult.No")}
                    </MenuItem>
                    <MenuItem value={true}>
                      {t("EQAHealthOrgRoundRegister.HasResult.Yes")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl className="w-100">
                  <InputLabel htmlFor="feeStatus">
                    {t("EQAHealthOrgRoundRegister.FeeStatus.title")}
                  </InputLabel>
                  <Select
                    name="feeStatus"
                    value={feeStatus}
                    onChange={event => this.handleChange(event)}
                    input={<Input id="feeStatus" />}
                  >
                    <MenuItem value={0}>
                      {t("EQAHealthOrgRoundRegister.FeeStatus.No")}
                    </MenuItem>
                    <MenuItem value={1}>
                      {t("EQAHealthOrgRoundRegister.FeeStatus.Yes")}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid>
                <FormControlLabel
                  className="my-20"
                  control={
                    <Switch
                      checked={status}
                      onChange={event => this.handleChange(event, "switch")}
                    />
                  }
                  label={t("EQAHealthOrgRoundRegister.Status.title")}
                />
              </Grid>
              <Grid item xs={12}>
                {this.state.sampleSet != null &&
                  this.state.sampleSet.details != null && (
                    <MaterialTable
                      title={t("SampleManagement.sample-list.title")}
                      data={this.state.sampleSet.details}
                      columns={sampleColumns}
                      parentChildData={(row, rows) => {
                        var list = rows.find(a => a.id === row.parentId);
                        return list;
                      }}
                      options={{
                        selection: false,
                        actionsColumnIndex: -1,
                        paging: false,
                        search: false
                      }}
                      localization={{
                      body: {
                        emptyDataSourceMessage: `${t(
                          "general.emptyDataMessageTable"
                        )}`,
                      },
                    }}
                    />
                  )}
              </Grid>
            </Grid>
            <div className="flex flex-space-between flex-middle">
              <Button variant="contained" color="primary" type="submit">
                {t("Save")}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleClose()}
              >
                {" "}
                {t("Cancel")}
              </Button>
            </div>
          </ValidatorForm>
        </DialogContent>
      </Dialog>
    );
  }
}

export default EQAHealthOrgRoundRegisterEditorDialog;
