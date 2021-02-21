import React, { Component, useRef } from "react";
import {
  Dialog,
  Button,
  Grid,
  Checkbox,
  IconButton,
  Icon,
  DialogActions,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader,
} from "material-table";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import { divide } from "lodash";
import moment from "moment";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
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
  const { t, i18n } = useTranslation();
}

class EQAResultReportFastTestPrint extends React.Component {
  state = {
    AssetAllocation: [],
    item: {},
    asset: {},
    assetVouchers: [],
    shouldOpenEditorDialog: false,
    shouldOpenViewDialog: false,
    shouldOpenConfirmationDialog: false,
    selectAllItem: false,
    selectedList: [],
    totalElements: 0,
    shouldOpenConfirmationDeleteAllDialog: false,
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
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
    this.setState(
      {
        ...this.props.item,
      },
      function () {
      }
    );

    // this.setState({})
  }

  componentDidMount() {}

  handleFormSubmit = () => {
    let content = document.getElementById("divcontents");
    let pri = document.getElementById("ifmcontentstoprint").contentWindow;
    pri.document.open();

    pri.document.write(content.innerHTML);

    pri.document.close();
    pri.focus();
    pri.print();
  };
  handleExportPdf = () => {
    let content = document.getElementById("divcontents");
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save("download.pdf");
    });
    this.props.handleOKEditClose();
  };

  render() {
    const { t, i18n } = this.props;
    let { open, handleClose, handleOKEditClose, item } = this.props;
    let now = new Date();

    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
        ></DialogTitle>
        <iframe
          id="ifmcontentstoprint"
          style={{ height: "0px", width: "0px", position: "absolute" }}
        ></iframe>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent
            id="divcontents"
            style={{
              width: "210mm",
              minHeight: "auto",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div>
                <p
                  style={{
                    fontSize: "0.975rem",
                    fontWeight: "bold",
                    marginBottom: "0px",
                  }}
                >
                  KẾT QUẢ TEST NHANH
                </p>
              </div>
              <div style={{ textAlign: "left" }}>
                <ol>
                  <li>
                    <p>
                      {t("EQAResultReportElisa.healthOrgName")} :{" "}
                      {this.state.healthOrgRound
                        ? this.state.healthOrgRound.healthOrg.code
                        : ""}
                    </p>
                  </li>
                  <li>
                    <p>
                      {t("EqaResult.reagent")} :{" "}
                      {this.state.reagent ? this.state.reagent.name : ""}{" "}
                      {this.state.noteOtherReagent && (
                        <p>
                          {t("reagent.note")} : {this.state.noteOtherReagent}
                        </p>
                      )}
                    </p>
                  </li>
                  <li>
                    <p>
                      {t("EQAResultReportElisa.reagentLot")} :{" "}
                      {this.state.reagentLot ? this.state.reagentLot : ""}
                    </p>
                  </li>
                  <li>
                    <p>
                      {t("EQAResultReportElisa.reagentExpiryDate")} :{" "}
                      {this.state.reagentExpiryDate
                        ? moment(this.state.reagentExpiryDate).format(
                            "DD/MM/YYYY"
                          )
                        : ""}
                    </p>
                  </li>
                  <li>
                    <p>
                      {t("EQAResultReportElisa.reagentUnBoxDate")} :{" "}
                      {this.state.reagentUnBoxDate ? (
                        <span>
                          {moment(this.state.reagentUnBoxDate).format(
                            "DD/MM/YYYY"
                          )}
                        </span>
                      ) : (
                        ""
                      )}
                    </p>
                  </li>
                  <li>
                    <p>
                      {t("EQAResultReportElisa.testDate")} :{" "}
                      {this.state.testDate
                        ? moment(this.state.testDate).format("DD/MM/YYYY")
                        : ""}
                    </p>
                  </li>
                  <li>
                    <p>
                      {t("EQAResultReportFastTest.technicianName")} :{" "}
                      {this.state.technician
                        ? this.state.technician.displayName
                        : ""}
                    </p>
                  </li>
                  <li>
                    <p>
                      {t("EQAResultReportElisa.note")} :{" "}
                      {this.state.note ? this.state.note : ""}
                    </p>
                  </li>
                  <li>{t("EQAResultReportElisa.list") + ": "}</li>
                </ol>
              </div>
              <div>
                {
                  <table
                    style={{
                      width: "100%",
                      border: "1px solid",
                      borderCollapse: "collapse",
                    }}
                  >
                    <tr>
                      <th style={{ border: "1px solid" }}>
                        {t("EQAResultReportEclia.sample_code")}
                      </th>
                      <th style={{ border: "1px solid" }}>
                        {t("EQAResultReportFastTest.cLine")}
                      </th>
                      <th style={{ border: "1px solid" }}>
                        {t("EQAResultReportFastTest.tLine")}
                      </th>
                      <th style={{ border: "1px solid", width: "30%" }}>
                        {t("EQAResultReportEclia.result")}
                      </th>
                      <th style={{ border: "1px solid", width: "30%" }}>
                        {t("SampleManagement.serum-bottle.note")}
                      </th>
                    </tr>

                    {this.state.details !== null
                      ? this.state.details.map((row, index) => {
                          let result = "", cLine = "", tLine = "" ;
                          if (row.result == 1) {
                            result = t("result.positive");
                          } else if (row.result == -2) {
                            result = t("result.none");
                          } else if (row.result == 0) {
                            result = t("result.indertermine");
                          } else if (row.result == -1) {
                            result = t("result.negative");
                          } else if (row.result == -2) {
                            result = t("result.none");
                          }

                          if(row.cLine == -1){
                            cLine = t("result.negative");
                          }else if(row.cLine == 1){
                            cLine = t("result.positive");
                          }

                          if(row.tLine == -1){
                            tLine = t("result.negative");
                          }else if(row.tLine == 1){
                            tLine = t("result.positive");
                          }

                          return (
                            <tr>
                              <td
                                style={{
                                  border: "1px solid",
                                  textAlign: "center",
                                }}
                              >
                                {row.sampleTube !== null
                                  ? row.sampleTube.code
                                  : ""}
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  textAlign: "center",
                                }}
                              >
                                {cLine !== null ? cLine : ""}
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  textAlign: "center",
                                }}
                              >
                                {tLine !== null ? tLine : ""}
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  textAlign: "center",
                                }}
                              >
                                {result !== null ? result : ""}
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  textAlign: "center",
                                }}
                              >
                                {row.note !== null ? row.note : ""}
                              </td>
                            </tr>
                          );
                        })
                      : ""}
                  </table>
                }
              </div>
            </div>
          </DialogContent>

          <DialogActions>
            <div className="flex flex-space-between flex-middle">
              <Button
                variant="contained"
                color="secondary"
                className="mr-12"
                onClick={() => this.props.handleClose()}
              >
                {t("general.cancel")}
              </Button>
              {this.props.print && (
                <Button variant="contained" color="primary" type="submit">
                  {t("In")}
                </Button>
              )}

              {this.props.pdf && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleExportPdf}
                >
                  {t("Xuất PDF")}
                </Button>
              )}
              {/* <Example></Example> */}
            </div>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQAResultReportFastTestPrint;
