import React, { Component } from "react";
import {
  Dialog,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Icon,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from "@material-ui/core";
import { getAllResultByHealthOrgEQARoundId, getResultReportById } from "./ResultsOfTheUnitsService";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { getItemById } from "./ResultsOfTheUnitsService";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import VisibilityIcon from '@material-ui/icons/Visibility';
import shortid from "shortid";
import moment from "moment";
import Paper from '@material-ui/core/Paper';
import EQAResultReportElisaDialog from "../EQAResultReportElisa/EQAResultReportElisaDialog";
import EQAResultReportFastTestEditorDialog from "../EQAResultReportFastTest/EQAResultReportFastTestEditorDialog";
import EQAResultReportSerodiaDialog from "../EQAResultReportSerodia/EQAResultReportSerodiaDialog";
import EQAResultReportEcliaEditorDialog from "../EQAResultReportEclia/EQAResultReportEcliaEditorDialog";

function MaterialButton(props) {

  const { t, i18n } = useTranslation();
  const item = props.item;
  return (
    <React.Fragment>
      <TableCell className="px-0" align="left">
        {item.title}
      </TableCell>;
    </React.Fragment>
  )
}

class HealthOrgEQARoundViewDetailDialog extends Component {
  constructor(props) {
    super(props)
    this.headerRef = React.createRef()
    this.dateColRef = React.createRef()
    this.timeColRef = React.createRef()
    this.contentRef = React.createRef()
    this.tbodyRef = React.createRef()
  }

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
    isActive: false
  };

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
    this.setState(item);
    // console.log(item);
    getAllResultByHealthOrgEQARoundId(item.id).then((result) => {
      if (result != null && result.data != null) {
        this.setState({
          listResult: result.data
        }, function () {
          let { sampleSet, listSample } = item;
          listSample = [];
          if (sampleSet != null && sampleSet.details != null && sampleSet.details.length > 0) {
            sampleSet.details.sort((a, b) => (a.orderNumber > b.orderNumber) ? 1 : (a.orderNumber === b.orderNumber) ? ((a.sampleTube.code > b.sampleTube.code) ? 1 : -1) : -1);
            sampleSet.details.forEach(sampleSetDetail => {
              let eQASet = {};
              eQASet.id = sampleSetDetail.sample.id;
              eQASet.code = sampleSetDetail.code;
              // sampleSetDetail.sample = sampleSet.details.sample;
              // sampleSetDetail.code = sampleSet.details.code;
              //listSample.push(sampleSetDetail.sample);
              listSample.push(eQASet);
            });
            this.setState({
              listSample: listSample
            });
          }
        });
      }
    });
  }

  getTypeMethodName(text, type) {
    if (type == 1) {
      return text;
    } else if (type == 2) {
      return text;
    } else if (type == 3) {
      return text;
    } else if (type == 4) {
      return text;
    } else if (type == 5) {
      return 'KẾT LUẬN';
    }
  }

  renderColHeadFirst(item) {
    if (item.reagent != null) {
      item.title = this.getTypeMethodName(item.reagent.name, item.typeMethod);
    } else {
      item.title = this.getTypeMethodName("", item.typeMethod);
    }
    //item.title = this.getTypeMethodName(item.reagent.name,item.typeMethod);
    return (
      this.renderHeadCells(item)
    )
  }

  renderRowHead() {
    let { onSelectEvent, handleDelete, handleClick } = this.props;
    let { listResult } = this.state;
    let titleCell = null;
    if (listResult != null && listResult.length > 0) {
      listResult.forEach(item => {
        if (!titleCell) {
          titleCell = <TableCell style={{
            backgroundColor: '#358600',
            color: '#fff', textAlign: "left", textTransform: "uppercase"
          }} key={shortid.generate()} className="px-0" align="left">
            {this.getTypeMethodName(item.typeMethod)}
          </TableCell>
        } else {
          titleCell += <TableCell style={{
            backgroundColor: '#358600',
            color: '#fff', textAlign: "left", textTransform: "uppercase"
          }} key={shortid.generate()} className="px-0" align="left">
            {this.getTypeMethodName(item.typeMethod)}
          </TableCell>
        }
      });
    }

    return (
      <React.Fragment>
        {listResult.map((item, index) => this.renderColHeadFirst(item))}
      </React.Fragment>
    )
  }

  renderHeadCells(item) {
    if (item == null) {
      item = {};
    }
    let titleCell = <TableCell style={{
      backgroundColor: '#358600',
      color: '#fff', textAlign: "left", textTransform: "uppercase"
    }} key={shortid.generate()} className="px-0" align="left">
      {item.title}
    </TableCell>
    return (
      <React.Fragment>
        {titleCell}
      </React.Fragment>
    )
  }
  openDialogDetailCellContent(resultReportDetail) {
    if (resultReportDetail != null && resultReportDetail.resultReport != null && resultReportDetail.resultReport.id != null) {
      getResultReportById(resultReportDetail.resultReport.id).then((result) => {
        let item = result.data;
        item.isView = true;
        this.setState({ item: item }, function () {
          //Elisa(1),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Elisa
          //FastTest(2),//Kết Quả Xét Nghiệm Bằng Kỹ Thuật Xét Nghiệm Nhanh
          //SERODIA(3)//Kết Quả Xét Nghiệm Bằng Kỹ Thuật SERODIA
          //ECLIA(4)//KẾT QUẢ ĐIỆN/HÓA PHÁT QUANG
          if (item.typeMethod == 1) {
            this.setState({ shouldOpenViewDialogElisa: true });
          } else if (item.typeMethod == 2) {
            this.setState({ shouldOpenViewDialogFastTest: true });
          } else if (item.typeMethod == 3) {
            this.setState({ shouldOpenViewDialogSerodia: true });
          } else if (item.typeMethod == 4) {
            this.setState({ shouldOpenViewDialogEclia: true });
          }
        });
      });
    }
  }

  renderCells(item) {
    let { t, i18n } = this.props;
    if (item == null) {
      item = {};
    }
    let contentCell = <TableCell key={shortid.generate()} className="px-0" align="left">
      {
        item.result == 1 ? (
          <small className="border-radius-4 bg-primary text-white px-8 py-2 ">
            <a href="#" onClick={() => this.openDialogDetailCellContent(item)}>
              {t('result.positive')}
            </a>
          </small>
        ) : (
            <small className="border-radius-4 bg-light-gray px-8 py-2 ">
              <a href="#" onClick={() => this.openDialogDetailCellContent(item)}>
                {
                  item.result == -2 ? (
                    t('result.none')
                  ) : (
                      item.result == -1 ? (
                        t('result.negative')
                      ) : (
                          item.result == 0 ? (
                            t('result.indertermine')
                          ) : (item.result == 2 ? (
                            t('EQAResultReportElisa.Result.confirms')
                          ) : (
                              ''
                            ))
                        )
                    )
                }
              </a>
            </small>
          )
      }
    </TableCell>
    return (
      <React.Fragment>
        {contentCell}
      </React.Fragment>
    )
  }

  renderSample(item, index) {
    let sttCell = <TableCell style={{ textAlign: "center", width: "15px"}} className="" align="center">
      {index + 1}
    </TableCell>
    let titleCell = <TableCell style={{ textAlign: "left" }} className="px-0" align="left">
      {item ? item.code : ''}
    </TableCell>

    let { listResult } = this.state;
    let cellContentByMethod = [];
    listResult.forEach(result => {
      let content = null;
      if (result != null && result.details != null && result.details.length > 0 && item) {
        result.details.forEach(resultDetail => {
          if (resultDetail.sampleTube != null && resultDetail.sampleTube.eqaSample != null
            && item.id == resultDetail.sampleTube.eqaSample.id) {
            content = resultDetail;
          }
        });
      }
      cellContentByMethod.push(content);
    });

    return (
      <React.Fragment>
        {sttCell}
        {titleCell}
        {cellContentByMethod.map((cell, index) => this.renderCells(cell))}
      </React.Fragment>
    )
  }

  renderResultDetails(sample, index) {
    return (
      <React.Fragment>
        <TableRow>
          {this.renderSample(sample, index)}
        </TableRow>
      </React.Fragment>
    )
  }

  handleDialogClose = () => {
    this.setState({
      shouldOpenViewDialogElisa: false,
      shouldOpenViewDialogFastTest: false,
      shouldOpenViewDialogSerodia: false,
      shouldOpenViewDialogEclia: false
    });
  };

  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
    const infoStyle = {
      fontSize: '18px',
      fontWeight: 'bold'
    };
    const titleStyle = {
      fontSize: '18px',
    };
    let {
      id,
      healthOrg,
      round,
      sampleSet,
      listSample,
      listResult,
      shouldOpenViewDialogElisa,
      shouldOpenViewDialogFastTest,
      shouldOpenViewDialogSerodia,
      shouldOpenViewDialogEclia,
      item
    } = this.state;
    return (
      <Dialog onClose={handleClose} open={open} maxWidth={'lg'} fullWidth={true} disableBackdropClick={true}>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20 styleColor">
            {t("result.title")}
          </span>
          <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="">
            <div style={{ marginRight: "10%" }} className="mb-20 mr-5">{t("ResultsOfTheUnits.laboratory")}: <span style={{fontWeight: "bold"}}>{healthOrg.name} ({healthOrg.code})</span></div>
            <span style={{ marginRight: "10%" }} className="mb-20 mr-5">{t("ResultsOfTheUnits.eqaPlanning")}: <span style={{fontWeight: "bold"}}>{round.eqaPlanning.name}</span></span>

            <span style={{ marginLeft: "10%" }} className="mb-20 mr-5">{t("ResultsOfTheUnits.round")}: <span style={{fontWeight: "bold"}}>{round.name}</span></span>
            {/*<div style={titleStyle} className="mb-20">{t("ResultsOfTheUnits.set")}: <span style={infoStyle}>{sampleSet.name}</span></div>*/}
            {listResult.length > 0 && listSample && (<Grid className="mb-8 mt-8" container spacing={4}>
              <Grid item sm={12} xs={12}>
                <div>
                  <Paper>
                    <TableContainer style={{ maxHeight: 1000 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell style={{
                              backgroundColor: '#358600',
                              color: '#fff', textAlign: "center", width: "15px"
                            }}>{t('ResultsOfTheUnits.STT')}</TableCell>
                            <TableCell style={{
                              backgroundColor: '#358600',
                              color: '#fff', textAlign: "left", textTransform: "uppercase"
                            }}>{t('ResultsOfTheUnits.set')}</TableCell>
                            {
                              (listResult && this.renderRowHead())
                            }
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            (listSample && listSample.map((sample, index) => this.renderResultDetails(sample, index)))
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </div>
              </Grid>
            </Grid>)}

            {shouldOpenViewDialogElisa && (
              <EQAResultReportElisaDialog t={t} i18n={i18n}
                handleClose={this.handleDialogClose}
                open={shouldOpenViewDialogElisa}
                handleOKEditClose={this.handleOKEditClose}
                item={item}
              />
            )}
            {shouldOpenViewDialogFastTest && (
              <EQAResultReportFastTestEditorDialog t={t} i18n={i18n}
                handleClose={this.handleDialogClose}
                open={shouldOpenViewDialogFastTest}
                handleOKEditClose={this.handleOKEditClose}
                item={item}
              />
            )}
            {shouldOpenViewDialogSerodia && (
              <EQAResultReportSerodiaDialog t={t} i18n={i18n}
                handleClose={this.handleDialogClose}
                open={shouldOpenViewDialogSerodia}
                handleOKEditClose={this.handleOKEditClose}
                item={item}
              />
            )}
            {shouldOpenViewDialogEclia && (
              <EQAResultReportEcliaEditorDialog t={t} i18n={i18n}
                handleClose={this.handleDialogClose}
                open={shouldOpenViewDialogEclia}
                handleOKEditClose={this.handleOKEditClose}
                item={item}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions spacing={4} className="flex flex-end flex-middle">
          <Button variant="contained" color="secondary" onClick={() => this.props.handleClose()}>{t('Cancel')}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default HealthOrgEQARoundViewDetailDialog;
