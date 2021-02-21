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

class EQARoundPrint extends React.Component {
  state = {
    item: {},
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;

    this.setState(
      {
        ...this.props.item,
      },
      function () {
        // console.log(this.state);
      }
    );
  }

  handleFormSubmit = () => {
    let content = document.getElementById("divcontents");
    let pri = document.getElementById("ifmcontentstoprint").contentWindow;
    pri.document.open();

    pri.document.write(content.innerHTML);

    pri.document.close();
    pri.focus();
    pri.print();
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
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        </DialogTitle>
        <iframe
          id="ifmcontentstoprint"
          style={{ height: "0px", width: "0px", position: "absolute" }}
        ></iframe>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent id="divcontents" style={{}}>
            <div style={{ textAlign: "center" }}>
              <div>
                <p
                  style={{
                    fontSize: "0.975rem",
                    fontWeight: "bold",
                    marginBottom: "0px",
                  }}
                >
                  KẾ HOẠCH CỤ THỂ
                    </p>
              </div>
              <br />
              <br />
              <div style={{ textAlign: "center" }}>
                <table style={{ textAlign: "justify", minWidth: "768px", margin: "0 auto", borderSpacing: "10px 20px" }}>
                  <tr>
                    <td><p style={{ fontWeight: "bold" }}>{t("EQAPlanning.code")} :</p></td>
                    <td>{this.state.eqaPlanning ? this.state.eqaPlanning.code : ""}</td>
                  </tr>
                  <tr>
                    <td><p style={{ fontWeight: "bold" }}>{t("EQAPlanning.name")} :</p></td>
                    <td>{this.state.eqaPlanning ? this.state.eqaPlanning.name : ""}</td>
                  </tr>

                  <tr>
                    <td><p style={{ fontWeight: "bold" }}>{t("EQARound.Name")} :</p></td>
                    <td>{this.state.name ? this.state.name : ""}</td>
                    <td ><p style={{ fontWeight: "bold" }}>{t("EQARound.Code")} :</p></td>
                    <td>{this.state.code ? this.state.code : ""}</td>
                  </tr>
                  <tr>
                    <td><p style={{ fontWeight: "bold" }}>{t("EQARound.startDate")} :</p></td>
                    <td> {this.state.startDate ? moment(this.state.startDate).format('DD/MM/YYYY') : ""}</td>
                    <td ><p style={{ fontWeight: "bold" }}>{t("EQARound.endDate")} :</p></td>
                    <td> {this.state.endDate ? moment(this.state.endDate).format('DD/MM/YYYY') : ""}</td>
                  </tr>

                  <tr>
                    <td><p style={{ fontWeight: "bold" }}>{t("EQARound.registrationStartDate")} :</p></td>
                    <td> {this.state.registrationStartDate ? moment(this.state.registrationStartDate).format('DD/MM/YYYY') : ""}</td>
                    <td ><p style={{ fontWeight: "bold" }}>{t("EQARound.registrationExpiryDate")} :</p></td>
                    <td> {this.state.registrationExpiryDate ? moment(this.state.registrationExpiryDate).format('DD/MM/YYYY') : ""}</td>
                  </tr>
                  <tr>
                    <td><p style={{ fontWeight: "bold" }}>{t("EQARound.sample_submission_deadline")} :</p></td>
                    <td>{this.state.sampleSubmissionDeadline ? moment(this.state.sampleSubmissionDeadline).format('DD/MM/YYYY') : ""}</td>
                  </tr>
                </table>
              </div>
              {/* Chi tiêt */}
              <div>
                <p
                  style={{
                    fontSize: "0.975rem",
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  {t("EQAPlanning.detail_planning")}
                </p>
              </div>
             
              <div style={{ textAlign: "center" }}>
                {/* <table style={{ textAlign: "justify", minWidth: "768px", margin: "0 auto", borderSpacing: "10px 20px" }}>
                  <tr>
                    <td><p style={{ fontWeight: "bold" }}>{t("EQARound.healthOrgNumber")} :</p></td>
                    <td>{this.state.healthOrgNumber ? this.state.healthOrgNumber : ""}</td>
                    <td><p style={{ fontWeight: "bold" }}>{t("EQARound.sampleNumber")} :</p></td>
                    <td>{this.state.sampleNumber ? this.state.sampleNumber : ""}</td>
                  </tr>
                  <tr>
                    <td><p style={{ fontWeight: "bold" }}>{t("EQARound.sampleSetNumber")} :</p></td>
                    <td>{this.state.sampleSetNumber ? this.state.sampleSetNumber : ""}</td>
                    <td><p style={{ fontWeight: "bold" }}>{t("EQARound.executionTime")} :</p></td>
                    <td>{this.state.executionTime ?  moment(this.state.executionTime).format('DD/MM/YYYY'): ""}</td>
                  </tr>
                </table> */}
                {
                  <table
                    style={{
                      width: "100%",
                      border: "1px solid",
                      borderCollapse: "collapse",
                    }}
                  >
                    <tr>
                      <th style={{ border: "1px solid" }}>{t("EQARound.healthOrgNumber")}</th>
                      <th style={{ border: "1px solid" }}>{t("EQARound.sampleNumber")}</th>
                      <th style={{ border: "1px solid" }}>{t('EQARound.sampleSetNumber')}</th>
                      <th style={{ border: "1px solid" }}>{t("EQARound.executionTime")}</th>
                    </tr>
                    <td 
                      style={{
                          border: "1px solid",
                          textAlign: "center",
                        }}>
                        {this.state.healthOrgNumber ? this.state.healthOrgNumber : ""}
                    </td>
                    <td 
                      style={{
                          border: "1px solid",
                          textAlign: "center",
                        }}>
                        {this.state.sampleNumber ? this.state.sampleNumber : ""}
                    </td>
                    <td 
                      style={{
                          border: "1px solid",
                          textAlign: "center",
                        }}>
                        {this.state.sampleSetNumber ? this.state.sampleSetNumber : ""}
                    </td>
                    <td 
                      style={{
                          border: "1px solid",
                          textAlign: "center",
                        }}>
                        {this.state.executionTime ?  moment(this.state.executionTime).format('DD/MM/YYYY'): ""}
                    </td>
                    <tr>
                      
                    </tr>
                  </table>
                }
              </div>

              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: "0.975rem",
                    fontWeight: "bold",
                    marginBottom: "20px",
                  }}
                >
                  {t("EQAPlanning.details")}
                </p>


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
                      <th style={{ border: "1px solid" }}>{t("activity")}</th>
                      <th style={{ border: "1px solid" }}>{t("EQARound.detail.startDate")}</th>
                      <th style={{ border: "1px solid" }}>{t("EQARound.detail.endDate")}</th>
                      <th style={{ border: "1px solid" }}>{t('EQARound.detail.responsible_by')}</th>
                      <th style={{ border: "1px solid" }}>{t("EQARound.detail.note")}</th>
                    </tr>

                    {this.state.detailRound !== null
                      ? this.state.detailRound.map((row, index) => {
                        let type = ""
                        if(row.type == 0){
                          type = t("EQAPlanning.sending_invitation_letter")
                        }else if(row.type == 1){
                          type = t("EQARound.collecting_registration_files")
                        }else if(row.type == 2){
                          type = t("EQARound.prepare_supplies")
                        }else if(row.type == 3){
                          type = t("EQARound.sample_characterization")
                        }else if(row.type == 4){
                          type = t("EQARound.checkingStockSample")
                        }else if(row.type == 5){
                          type = t("EQARound.collectingSample")
                        }else if(row.type == 6){
                          type = t("EQARound.identifyingSample")
                        }else if(row.type == 7){
                          type = t("EQARound.sampleDilutionAndHomogenous")
                        }else if(row.type == 8){
                          type = t("EQARound.asessingSample")
                        }else if(row.type == 9){
                          type = t("EQARound.printingDocument")
                        }else if(row.type == 10){
                          type = t("EQARound.samplePakage1")
                        }else if(row.type == 11){
                          type = t("EQARound.samplePakage2")
                        }else if(row.type == 12){
                          type = t("EQARound.packingSamples")
                        }else if(row.type == 13){
                          type = t("EQARound.sendingThePanel")
                        }else if(row.type == 14){
                          type = t("EQARound.collectionReportForm")
                        }else if(row.type == 15){
                          type = t("EQARound.feedbackToParticipant")
                        }
                        else if(row.type == 16){
                          type = t("EQARound.preliminaryReport")
                        }else if(row.type == 17){
                          type = t("EQARound.dataDoubleEntries")
                        }else if(row.type == 18){
                          type = t("EQARound.dataCheckingAndClearing")
                        }else if(row.type == 19){
                          type = t("EQARound.dataAnalysis")
                        }else if(row.type == 20){
                          type = t("EQARound.finalReport")
                        }
                          return (
                            <tr>
                            <td
                                style={{
                                  border: "1px solid",
                                  textAlign: "left",
                                  width: "250px"
                                }}
                              >
                                {type !== null ?  type : ""}
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  textAlign: "center",
                                }}
                              >
                                {row.startDate !== null ?  moment(row.startDate).format('DD/MM/YYYY'): ""}
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  textAlign: "center",
                                }}
                              >
                                {row.endDate !== null ?  moment(row.endDate).format('DD/MM/YYYY') : ""}
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  textAlign: "left",
                                }}
                              >
                                {row.personnel !== null ? row.personnel.displayName : ""}
                              </td>
                              <td
                                style={{
                                  border: "1px solid",
                                  textAlign: "left",
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
              <Button variant="contained" color="primary" type="submit">
                {t("In")}
              </Button>
            </div>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default EQARoundPrint;
