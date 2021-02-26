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

  class EQAPlanningPrint extends React.Component {
    state = {
        item: {},
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
       
        this.setState(
          {
            ...this.props.item,
          },
          function () {
            
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
                    KẾ HOẠCH NĂM {" "+  this.state.year ? this.state.year: ''}
                    </p>
                  </div>
                  <br/>
                  <br/>
                  <div style={{ textAlign: "center" }}>

                  <table style={{ textAlign: "justify", minWidth: "768px", margin: "0 auto", borderSpacing:"10px 20px" }}>
                        <tr>
                            <td><p style={{ fontWeight: "bold" }}>{t("EQAPlanning.code")} :</p></td>
                            <td>{this.state.code ? this.state.code : ""}</td>
                            
                        </tr>
                        <tr>
                            <td><p style={{ fontWeight: "bold" }}>{t("EQAPlanning.name")} :</p></td>
                            <td>{this.state.name ? this.state.name : ""}</td>
                        </tr>

                        <tr>
                            <td><p style={{ fontWeight: "bold" }}>{t("EQAPlanning.detail.responsible_by")} :</p></td>
                            <td>{this.state.personnel ? this.state.personnel.displayName : ""}</td>
                            <td ><p style={{ fontWeight: "bold" }}>{t("Year")} :</p></td>
                            <td>{this.state.year ? this.state.year : ""}</td>
                        </tr>
                     
                        <tr>
                            <td><p style={{ fontWeight: "bold" }}>{t("EQAPlanning.numberOfRound")} :</p></td>
                            <td>{this.state.numberOfRound ? this.state.numberOfRound : ""}</td>

                            <td ><p style={{ fontWeight: "bold" }}>{t("EQAPlanning.fee")} :</p></td>
                            <td>{this.state.fee ? this.state.fee : ""}</td>
                        </tr>
                     
                        <tr>
                            <td><p style={{ fontWeight: "bold" }}>{t("StartDate")} :</p></td>
                            <td> {this.state.startDate ? moment(this.state.startDate).format('DD/MM/YYYY') : ""}</td>
                            <td ><p style={{ fontWeight: "bold" }}>{t("EndDate")} :</p></td>
                            <td> {this.state.endDate ? moment(this.state.endDate).format('DD/MM/YYYY') : ""}</td>
                        </tr>
                        <tr>
                            <td><p style={{ fontWeight: "bold"}}>{t("EQAPlanning.time")}</p></td>
                        </tr>

                  </table>
                
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

  export default EQAPlanningPrint;
