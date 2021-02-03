import { FormControl, Input, Radio, InputAdornment, MenuItem, Select, Grid, InputLabel, MuiThemeProvider, IconButton, Icon, TextField, Button, TableHead, TableCell, TableRow, Checkbox, TablePagination } from "@material-ui/core";
import moment from "moment";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { getListTestResult, getReportHealthOrgNameByReagent, searchByPage as reagentSearchByPage, exportToExcel, getEQASample, searchPlanning, getEQARoundsByPlanning, saveReferenceResult } from "./ReferenceResultReagentService";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import { getCurrentUser, getListHealthOrgByUser } from "../User/UserService"
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_style.scss';

toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});
function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return <div>
    <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
      <Icon fontSize="small" color="primary">edit</Icon>
    </IconButton>
    <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
      <Icon fontSize="small" color="error">delete</Icon>
    </IconButton>
  </div>;
}
class ReportHealthOrgNameByReagent extends React.Component {
  state = {
    rowsPerPage: 25,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    listEQARound: [],
    keyword: '',
    round: null,
    shouldOpenConfirmationEditDialog: false,
    shouldOpenDialog: false,
    sample: null,
    reagent: null,
    testMethod: null
  }
  constructor(props) {
    super(props);
    this.handleTextSearchChange = this.handleTextSearchChange.bind(this);
  }

  handleTextSearchChange = event => {
    this.setState({ keyword: event.target.value }, function () {
    })
  };
  handleKeyDownEnterSearch = (e) => {
    if (e.key === 'Enter') {
      this.search()
    }
  }
  search() {
    const { t } = this.props;
    let { sample, sampleId, reagent, reagentId, testMethod, roundId } = this.state;
    let searchObject = {}
    if (roundId == null || roundId == "") {
      toast.warn(t("EQASampleSet.please_select_eqa_round"))
      return
    } else {
      searchObject.roundId = roundId;
    }
    if (sample == null || sampleId == null || sampleId == "") {
      searchObject.sampleId = "00000000-0000-0000-0000-000000000000"
    } else {
      searchObject.sampleId = sampleId;
    }
    if (testMethod == null || testMethod == 0) {
      searchObject.testMethod = 0;
    } else {
      searchObject.testMethod = testMethod;
    }
    if (reagent == null || reagentId == null || reagentId == "") {
      searchObject.reagentId = "00000000-0000-0000-0000-000000000000";
    } else {
      searchObject.reagentId = reagentId;
    }

    getListTestResult(searchObject).then(({ data }) => {
      this.setState({ itemList: [...data], totalElements: data.length })
      // console.log(data)
    }
    );
  }
  saveAllReferenceResult = () => {
    const { t } = this.props;
    let { sample, sampleId, reagent, reagentId, testMethod, roundId } = this.state;
    let searchObject = {}
    if (roundId == null || roundId == "") {
      toast.warn(t("EQASampleSet.please_select_eqa_round"))
      return
    } else {
      searchObject.roundId = roundId;
    }
    if (sample == null || sampleId == null || sampleId == "") {
      searchObject.sampleId = "00000000-0000-0000-0000-000000000000"
    } else {
      searchObject.sampleId = sampleId;
    }
    if (testMethod == null || testMethod == 0) {
      searchObject.testMethod = 0;
    } else {
      searchObject.testMethod = testMethod;
    }
    if (reagent == null || reagentId == null || reagentId == "") {
      searchObject.reagentId = "00000000-0000-0000-0000-000000000000";
    } else {
      searchObject.reagentId = reagentId;
    }

    saveReferenceResult(searchObject).then(({ data }) => {
      // this.setState({ itemList: [...data] })
      // console.log(data)
      toast.info(t("EQAResultReportConclusion.update_result_success"));
    }
    );
  }
  componentDidMount() {
    let searchObject = { pageIndex: 1, pageSize: 1000000 }
    searchPlanning(searchObject).then(({ data }) => {
      this.setState({ listPlanning: [...data.content] });
    });
    // this.updatePageData();
  }

  updatePageData = () => {
    const { t } = this.props;
    let { sample, sampleId, reagent, reagentId, testMethod, roundId } = this.state;
    let searchObject = {}
    if (roundId == null || roundId == "") {
      toast.warn(t("EQASampleSet.please_select_eqa_round"))
      return
    } else {
      searchObject.roundId = roundId;
    }
    if (sample == null || sampleId == null || sampleId == "") {
      searchObject.sampleId = "00000000-0000-0000-0000-000000000000"
    } else {
      searchObject.sampleId = sampleId;
    }
    if (testMethod == null || testMethod == 0) {
      searchObject.testMethod = 0;
    } else {
      searchObject.testMethod = testMethod;
    }
    if (reagent == null || reagentId == null || reagentId == "") {
      searchObject.reagentId = "00000000-0000-0000-0000-000000000000";
    } else {
      searchObject.reagentId = reagentId;
    }

    getListTestResult(searchObject).then(({ data }) => {
      this.setState({ itemList: [...data]})
    }
    );
  };
  handleFilterEQARound = (event, round, reason, details) => {
    if (round != null) {
      // console.log(round)
      getEQASample(round.id).then((data) => {
        let p = {}
        let listSample = []
        let list = [...data.data]
        list.forEach(element => {
          p = { ...element.eqaSample }
          listSample.push(p)
        });
        this.setState({ sample: null, listSample: list }, () => {
        })
      })
      this.setState({ HealthOrgEQARound: round, round: round, roundId: round.id }, () => {
        this.updatePageData();
      });
      if (reason == 'clear') {
        this.setState({ round: null, itemList: [] })
      }
    } else {
      this.setState({
        HealthOrgEQARound: null,
        sample: null,
        listSample: [],
        itemList: []
      })
    }
  }

  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    })
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    })
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  exportToExcel = () => {
    const { t } = this.props;
    let { sample, sampleId, reagent, reagentId, testMethod, roundId, itemList } = this.state;
    let searchObject = {}
    if (this.state.roundId == null || this.state.roundId == "") {
      toast.warn(t("EQASampleSet.please_select_eqa_round"))
      return
    } else {
      searchObject.roundId = roundId;
    }
    if (sample == null || sampleId == null || sampleId == "") {
      searchObject.sampleId = "00000000-0000-0000-0000-000000000000"
    } else {
      searchObject.sampleId = sampleId;
    }
    if (testMethod == null || testMethod == 0) {
      searchObject.testMethod = 0;
    } else {
      searchObject.testMethod = testMethod;
    }
    if (reagent == null || reagentId == null || reagentId == "") {
      searchObject.reagentId = "00000000-0000-0000-0000-000000000000";
    } else {
      searchObject.reagentId = reagentId;
    }
    if (itemList != null && itemList.length > 0) {
      exportToExcel(searchObject).then((res) => {
        let blob = new Blob([res.data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        saveAs(blob, 'EQAResultReport.xlsx')
      })
        .catch((err) => {
          // console.log(err)
        })
    } else {
      toast.warning(t("no_data"));
    }

  }

  handleFilterEQAPlanning = (event, item) => {
    // console.log(item);
    if (item != null && item.id != null) {
      this.setState({ planning: item ? item : null, planningId: item ? item.id : null }, () => {
        if (this.state.planningId != null) {
          getEQARoundsByPlanning(this.state.planningId).then(({ data }) => {
            // console.log(data)
            if (data != null && data.length > 0) {
              this.setState({ HealthOrgEQARound: null, sample: null, itemList: [], listEQARound: [...data] });
            }
          })
        }
      })
    } else {
      this.setState({
        HealthOrgEQARound: null,
        sample: null,
        listEQARound: [],
        listSample: [],
        itemList: []
      })
    }
  }
  handleFilterEQASample = (event, item) => {
    this.setState({ sample: item ? item : null, sampleId: item ? item.id : null }, () => {
      if (this.state.sampleId != null) {
        this.updatePageData();
      }
    })
  }
  handleTestMethodChange = (event, item) => {
    this.setState({ testMethod: event.target.value, reagent: null }, () => {
      this.updatePageData();
      let searchObject = { pageIndex: 0, pageSize: 1000000, testType: this.state.testMethod };

      reagentSearchByPage(searchObject).then(({ data }) => {
        this.setState({ listReagent: [...data.content] })
      }
      );
    })
  }
  selectReagent = (event, item) => {
    this.setState({ reagent: item ? item : null, reagentId: item ? item.id : "" }, () => {
      if (this.state.reagentId != null) {
        this.updatePageData();
      }
    })
  }
  result = () => {
    const { t } = this.props;
    let { sample, sampleId, reagent, reagentId, testMethod, roundId } = this.state;
    let searchObject = {}
    if (roundId == null || roundId == "") {
      toast.warn(t("EQASampleSet.please_select_eqa_round"))
      return
    } else {
      searchObject.roundId = roundId;
    }
    if (sample == null || sampleId == null || sampleId == "") {
      searchObject.sampleId = "00000000-0000-0000-0000-000000000000"
    } else {
      searchObject.sampleId = sampleId;
    }
    if (testMethod == null || testMethod == 0) {
      searchObject.testMethod = 0;
    } else {
      searchObject.testMethod = testMethod;
    }
    if (reagent == null || reagentId == null || reagentId == "") {
      searchObject.reagentId = "00000000-0000-0000-0000-000000000000";
    } else {
      searchObject.reagentId = reagentId;
    }

    getListTestResult(searchObject).then(({ data }) => {
      this.setState({ itemList: [...data] })
    }
    );
  }
  render() {
    const { t, i18n } = this.props;
    let { keyword, listEQARound, reagent, listReagent, round, sample, listSample, listPlanning, planning, HealthOrgEQARound } = this.state;
    let searchObject = { pageIndex: 0, pageSize: 1000000, testType: this.state.testMethod };
    let columns = [
      {
        title: t("ResultsOfTheUnits.STT"), width: "50", align: "left",
        headerStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "50px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => ((rowData.tableData.id + 1))
      },
      {
        title: t("ReferenceResultReagent.reagentName"), field: "reagentName", align: "left", width: "150",
        headerStyle: {
          minWidth: "250px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "250px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("ReferenceResultReagent.sampleCode"), field: "sampleCode", align: "left", width: "150",
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
        title: t("ReferenceResultReagent.totalNumberOfTest"), field: "totalNumberOfTest", width: "150",
        headerStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "center",
        },
      },
      {
        title: t("ReferenceResultReagent.negativeRatio"), field: "negativeRatio", width: "150",
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
        render: rowData => <span>{rowData.negativeRatio.toFixed(2)}  % </span>
      },
      {
        title: t("ReferenceResultReagent.indertermineRatio"), field: "indertermineRatio", width: "150",
        headerStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData =>
          <span>{rowData.indertermineRatio.toFixed(2)}  % </span>
      },
      {
        title: t("ReferenceResultReagent.positiveRatio"), field: "positiveRatio", width: "150",
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
        render: rowData =>
          <span>{rowData.positiveRatio.toFixed(2)}  % </span>
      },
      {
        title: t("ReferenceResultReagent.referenceResult"), field: "referenceResult", width: "150",
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
        render: rowData => rowData.referenceResult == -3 ?
          (<small className="border-radius-4 bg-light-gray px-8 py-2 ">
            {t("SampleManagement.sample-list.Result.noEvaluate")}
          </small>)
          : rowData.referenceResult == -2 ?
            (<small className="border-radius-4 bg-light-gray px-8 py-2 ">
              {t("SampleManagement.sample-list.Result.none")}
            </small>)
            : rowData.referenceResult == -1 ?
              (<small className="border-radius-4  px-8 py-2 " style={{ backgroundColor: "#3366FF" }}>
                {t("SampleManagement.sample-list.Result.negative")}
              </small>)
              : rowData.referenceResult == 0 ?
                (<small className="border-radius-4 bg-light-gray px-8 py-2 ">
                  {t("SampleManagement.sample-list.Result.indertermine")}
                </small>)
                : rowData.referenceResult == 1 ?
                  (<small className="border-radius-4  text-white px-8 py-2 " style={{ backgroundColor: "#f44336" }}>
                    {t("SampleManagement.sample-list.Result.positive")}
                  </small>)
                  : rowData.referenceResult == null ?
                    (<small className="border-radius-4  px-8 py-2 " style={{ backgroundColor: "#FFFF00" }}>
                      {t("SampleManagement.sample-list.Result.get_PI_result")}
                    </small>)
                    : (<small></small>)
      },

    ];
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>{t("ReferenceResultReagent.title")} | {t("web_site")}</title>
          </Helmet>
          <Breadcrumb routeSegments={[{ name: t("ReportResult.title"), path: "/directory/apartment" }, { name: t("ReferenceResultReagent.title") }]} />
        </div>
        <Grid container spacing={2}>
          <Grid item md={4} sm={12} xs={12}>
            
              <Button
                className="align-bottom mb-8 mr-8"
                variant="contained"
                color="primary"
                onClick={this.exportToExcel}
              >
                {t('general.exportToExcel')}
              </Button>
       
           
              <Button
                className="align-bottom mb-8 mr-8"
                variant="contained"
                color="primary"
                onClick={this.saveAllReferenceResult}
              >
                {t('EQAResultReportConclusion.update_result')}
              </Button>
        

          </Grid>
          {/* <Grid item md={3} sm={6} xs={12}>
           
          </Grid> */}
          <Grid item container md={8} sm={12} xs={12} spacing={1}>
            <Grid item md={4} sm={12} xs={12}>
              <Autocomplete
                size="small"
                id="combo-box"
                options={listPlanning}
                className="flex-end"
                getOptionLabel={(option) => option.code}
                onChange={this.handleFilterEQAPlanning}
                value={planning}
                renderInput={(params) => <TextField {...params}
                  label={t('ResultsOfTheUnits.eqaPlanning')}
                  variant="outlined"
                />}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <Autocomplete
                size="small"
                id="combo-box"
                options={listEQARound}
                className="flex-end"
                getOptionLabel={(option) => option.code}
                onChange={this.handleFilterEQARound}
                value={HealthOrgEQARound ? HealthOrgEQARound : ""}
                renderInput={(params) => <TextField {...params}
                  label={t('general.fillterByRoundEQA')}
                  variant="outlined"
                />}
              />
            </Grid>

            <Grid item md={4} sm={12} xs={12}>
              <Autocomplete
                size="small"
                id="combo-box"
                options={listSample ? listSample : []}
                className="flex-end"
                getOptionLabel={(option) => option.code}
                onChange={this.handleFilterEQASample}
                value={sample ? sample : ""}
                renderInput={(params) => <TextField {...params}
                  label={t('general.fillterBySampleEQA')}
                  variant="outlined"
                />}
              />
            </Grid>
          </Grid>
          
          {/* <Grid item md={6} sm={10} xs={12}>

          </Grid> */}
          <Grid item md={4} sm={0} xs={0}>
          </Grid>
          <Grid item container md={8} sm={12} xs={12} spacing={1}>
          <Grid item md={4} sm={12} xs={12}>
            <FormControl className="w-100" size="small" variant="outlined">
              <InputLabel htmlFor="testType">{t("ReferenceResultReagent.testMethods")}</InputLabel>
              <Select
                label={t("ReferenceResultReagent.testMethods")}
                value={this.state.testMethod}
                onChange={(result) => this.handleTestMethodChange(result)}
                inputProps={{
                  name: "result",
                  id: "result-simple"
                }}
              >
                <MenuItem value={0}> None </MenuItem>
                <MenuItem value={1}>{"Elisa"}</MenuItem>
                <MenuItem value={2}>{"FastTest"}</MenuItem>
                <MenuItem value={3}>{"Serodia"}</MenuItem>
                <MenuItem value={4}>{"Eclia"}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={4} sm={12} xs={12}>
            <Autocomplete
              size="small"
              id="combo-box"
              options={listReagent ? listReagent : []}
              className="flex-end"
              getOptionLabel={(option) => option.name}
              onChange={this.selectReagent}
              value={reagent ? reagent : ""}
              renderInput={(params) => <TextField {...params}
                label={t("EqaResult.reagent")}
                variant="outlined"
              />}
            />
          </Grid>
          </Grid>
         
          {/* <Grid item md={3} sm={6} xs={12}>
                    <Button
                        className="mb-16 align-bottom"
                        variant="contained"
                        color="primary"
                        onClick={this.result}
                        >
                        {t('general.result')}
                        </Button>
          </Grid> */}
          <Grid item xs={12}>
            <div>


              {this.state.shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  title={t("confirm")}
                  open={this.state.shouldOpenConfirmationDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationResponse}
                  text={t('DeleteConfirm')}
                  Yes={t('general.Yes')}
                  No={t('general.No')}
                />
              )}
              {this.state.shouldOpenConfirmationEditDialog && (
                <ConfirmationDialog
                  title={t("confirm")}
                  open={this.state.shouldOpenConfirmationEditDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationEdit}
                  text={t('EQAResultReportFastTest.editConfirm')}
                  Yes={t('general.Yes')}
                  No={t('general.No')}
                />
              )}
            </div>
            <MaterialTable
              title={t('ReportHealthOrgNameByReagent.list')}
              data={this.state.itemList}
              columns={columns}
              //   parentChildData={(row, rows) => {
              //     var list = rows.find(a => a.id === row.parentId);
              //     return list;
              //   }}
              options={{
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                rowStyle: (rowData, index) => ({
                  backgroundColor: (index % 2 === 1) ? '#EEE' : '#FFF',
                }),
                maxBodyHeight: '450px',
                minBodyHeight: '370px',
                headerStyle: {
                  backgroundColor: '#358600',
                  color: '#fff',
                },
                padding: 'dense',
                toolbar: false
              }}
              components={{
                Toolbar: props => (
                  <MTableToolbar {...props} />
                ),
              }}
              onSelectionChange={(rows) => {
                this.data = rows;
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: `${t(
                    "general.emptyDataMessageTable"
                  )}`,
                },
              }}
            />
            <TablePagination
              align="left"
              className="px-16"
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              labelRowsPerPage={t('general.rows_per_page')}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
              count={this.state.totalElements}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              backIconButtonProps={{
                "aria-label": "Previous Page"
              }}
              nextIconButtonProps={{
                "aria-label": "Next Page"
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.setRowsPerPage}
            />
          </Grid>
        </Grid>
      </div>

    )
  }
}
export default ReportHealthOrgNameByReagent;