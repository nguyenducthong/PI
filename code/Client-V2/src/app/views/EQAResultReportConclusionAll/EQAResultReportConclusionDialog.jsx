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
  Checkbox,
  MenuItem,
  Select, FormControlLabel,
} from "@material-ui/core";
import { getAllResultByHealthOrgEQARoundId, getResultReportById } from "../ResultsOfTheUnits/ResultsOfTheUnitsService";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { getItemById, updateResultReportConclusionBySampleTube, updateFinalResultStatus, deleteItem } from "./EQAResultReportConclusionAllServices";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { Breadcrumb, ConfirmationDialog } from "egret";
import Draggable from 'react-draggable';
import moment from "moment";
import EQAResultReportElisaDialog from "../EQAResultReportElisa/EQAResultReportElisaDialog";
import EQAResultReportFastTestEditorDialog from "../EQAResultReportFastTest/EQAResultReportFastTestEditorDialog";
import EQAResultReportSerodiaDialog from "../EQAResultReportSerodia/EQAResultReportSerodiaDialog";
import EQAResultReportEcliaEditorDialog from "../EQAResultReportEclia/EQAResultReportEcliaEditorDialog";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_style.scss';

toast.configure({
  autoClose: 3000,
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
class EQAResultReportConclusionDialog extends Component {


  state = {
    name: "",
    code: "",
    description: "",
    itemList: [],
    item: {},
    listSample: [],
    listResult: [],
    shouldOpenViewDialogElisa: false,
    shouldOpenViewDialogFastTest: false,
    shouldOpenViewDialogSerodia: false,
    shouldOpenViewDialogEclia: false,
    isActive: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDelete: false
  };
  Results = [
    { id: -2, name: "Không thực hiện" },
    { id: -1, name: "Âm tính" },
    { id: 0, name: "Không xác định" },
    { id: 1, name: "Dương tính" },
    { id: 2, name: "PXN gửi mẫu khẳng định" }
  ];
  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    let listData = []
    let p = {}
    if (item && item.details && item.details.length > 0) {
      item.details.sort((a, b) => (a.orderNumber > b.orderNumber) ? 1 : (a.orderNumber === b.orderNumber) ? ((a.sampleTube.code > b.sampleTube.code) ? 1 : -1) : -1);
      item.details.forEach(element => {
        p.tubeID = element.sampleTube.id
        p.tubeCode = element.sampleTube.code
        p.result = element.result
        listData.push(p)
      })
    }
    this.setState({
      listData: listData
    })

    this.setState({
      ...item
    }, function () {
    });
  }
  handleConfirmationResponse = () => {
    let { t } = this.props;

    deleteItem(this.state.id).then((res) => {
      if (res.data == true) {
        toast.success(t("EqaResult.deleteSuccess"));
        this.props.handleOKEditClose();
      } else {
        toast.warning(t('EqaResult.deleteError'));
      }
      this.props.handleOKEditClose();
    }).catch((err) => {
      toast.warning(t('EqaResult.error'));
      this.props.handleOKEditClose();
    });
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenViewDialogElisa: false,
      shouldOpenViewDialogFastTest: false,
      shouldOpenViewDialogSerodia: false,
      shouldOpenViewDialogEclia: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDelete: false
    });
  };

  handleFormSubmit = () => {
    const { t } = this.props;
    const {
      details,
      healthOrgRound,
      isFinalResult,
      listData,
      id
    } = this.state;
    if (details.length === 0) {
      toast.warn(t("EQAResultReportConclusion.no_data"));
    } else {
      // updateResultReportConclusionBySampleTube(
      //   listData,
      //   healthOrgRound.id,
      //   isFinalResult
      // )
      //   .then(res => {
      //     this.props.handleOKEditClose();
      //     toast.success(t("EQAResultReportConclusion.update_result_success"));
      //     // window.location.reload();
      //   })
      //   .catch(err => {
      //     toast.error(t("EQAResultReportConclusion.update_result_error"));
      //   });
      updateFinalResultStatus(id, isFinalResult).then(res => {
        // this.props.handleOKEditClose();
        toast.success(t("EQAResultReportConclusion.update_result_success"));
      })
        .catch(err => {
          toast.error(t("EQAResultReportConclusion.update_result_error"));
        });
    }

  };
  notificationFinalResult = () => {
    // if(this.state.isFinalResult){
    this.setState({ shouldOpenConfirmationDialog: true })
    // } 
  }

  notificationDelete = () => {
    this.setState({ shouldOpenConfirmationDelete: true })
  }
  handleDialogFinalResultClose = () => {
    // this.setState({isFinalResult:false},()=>{
    // })
    this.handleDialogClose()
  }
  handleFinalResult = () => {

    if (this.state.isFinalResult == null || !this.state.isFinalResult) {
      this.setState({ isFinalResult: true, dateSubmitResults: new Date() }, () => {
      })
      this.handleDialogClose()
    }
    if (this.state.isFinalResult) {
      this.setState({ isFinalResult: false, dateSubmitResults: new Date() }, () => {
      })
      this.handleDialogClose()
    }
  }
  render() {
    let { open, handleClose, handleOKEditClose, isView, t, i18n } = this.props;
    let {
      id,
      supplyOfReagent,
      shouldOpenHealthOrgRoundPopup,
      personBuyReagent,
      reagent,
      reagentLot,
      orderTest,
      reagentExpiryDate,
      testDate,
      technician,
      note,
      healthOrgRound,
      isFinalResult,
      incubationPeriod,
      incubationTempWithPlus,
      incubationPeriodWithPlus,
      incubationTempWithSubstrate,
      incubationPeriodWithSubstrate,
      details
    } = this.state;

    let columns = [
      {
        title: t("EQAResultReportEclia.sample_code"), field: "sampleTube.code", align: "left", width: "50"
      },
      {
        title: t("EQAResultReportEclia.result"), field: "result", align: "left", width: "150",
        render: rowData =>
          <FormControl className="w-80">
            <Select
              value={rowData.result}
              disabled={true}
              //onChange={result => this.handleRowDataCellChange(rowData, result)}
              inputProps={{
                name: "result",
                id: "result-simple"
              }}
            >
              <MenuItem value=''><em>None</em> </MenuItem>
              {this.Results.map(item => {
                return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
              })}
            </Select>
          </FormControl>
      }
    ];
    return (
      <Dialog open={open} PaperComponent={PaperComponent} maxWidth={"lg"} scroll={'paper'} >
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            <span className="mb-20 styleColor">{t("EQAResultReportConclusionAll.result_detail")}</span>
            <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {this.state.shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  title={t("confirm")}
                  open={this.state.shouldOpenConfirmationDialog}
                  onConfirmDialogClose={this.handleDialogFinalResultClose}
                  onYesClick={this.handleFinalResult}
                  text={isFinalResult ? t("EqaResult.unFinalResultConfirm") : t("EqaResult.FinalResultConfirm")}
                  Yes={t("general.Yes")}
                  No={t("general.No")}
                />
              )}

              {this.state.shouldOpenConfirmationDelete && (
                <ConfirmationDialog
                  title={t("confirm")}
                  open={this.state.shouldOpenConfirmationDelete}
                  onConfirmDialogClose={this.handleDialogFinalResultClose}
                  onYesClick={this.handleConfirmationResponse}
                  text={t('DeleteConfirm')}
                  Yes={t("general.Yes")}
                  No={t("general.No")}
                />
              )}
              <Grid item md={8} sm={8} xs={8}>
                <TextValidator
                  size="small"
                  disabled={isView}
                  label={<span className="font">{t("EQAResultReportConclusionAll.health_org")}</span>}
                  variant="outlined"
                  id="healthOrgRound"
                  className="w-100"
                  value={(healthOrgRound != null && healthOrgRound.healthOrg) ? healthOrgRound.healthOrg.name : ''}
                />
              </Grid>

              {/* <Grid item md={12} sm={12} xs={12}>
                <TextValidator
                  size="small"
                  disabled={isView}
                  label={t("EQAResultReportConclusionAll.technician")}
                  id="technician"
                  className="w-100"
                  value={technician != null ? technician.displayName : ''}
                />
              </Grid> */}
              {/* <Grid item md={8} sm={6} xs={12}>
                <TextValidator
                  className="w-100"
                  label={t("SampleManagement.serum-bottle.note")}
                  onChange={this.handleChange}
                  type="text"
                  name="note"
                  value={note ? note : ""}
                />
              </Grid> */}

              <Grid item md={4} sm={4} xs={4}>
                <FormControlLabel
                  label={<span className="font" style={{ fontWeight : "bold"}}> {t('EQAResultReportFastTest.isFinalResult')}</span>}
                  control={<Checkbox checked={isFinalResult}
                    onClick={(isFinalResult) =>
                      this.notificationFinalResult(isFinalResult)
                    }
                  />}

                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <MaterialTable
                  title={t('List')}
                  data={details}
                  columns={columns}

                  options={{
                    selection: false,
                    paging: false,
                    search: false,
                    headerStyle: { whiteSpace: 'nowrap' }
                  }}
                  components={{
                    Toolbar: props => (
                      <MTableToolbar {...props} />
                    ),
                  }}
                  onSelectionChange={(rows) => {
                    this.data = rows;
                    // this.setState({selectedItems:rows});
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
            </Grid>
          </DialogContent>
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button variant="contained" className="" color="secondary" onClick={() => handleClose()}> {t('Cancel')}</Button>
            <Button style={{ backgroundColor: "#ffeb3b" }} variant="contained" onClick={() => this.notificationDelete()}> {t('Delete')} </Button>
            <Button variant="contained" color="primary" type="submit" >
              {t('Save')}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQAResultReportConclusionDialog;
