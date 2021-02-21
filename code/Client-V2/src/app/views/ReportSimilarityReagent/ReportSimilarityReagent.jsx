import { FormControl, Input,Radio, InputAdornment, Grid, MuiThemeProvider, IconButton, Icon, TextField, Button, TableHead, TableCell, TableRow, Checkbox, TablePagination } from "@material-ui/core";
import moment from "moment";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { searchPlanning,getByReportSimilarityReagent,exportToExcel,searchByPage,getEQASampleTubeByHealthOrgEQARoundId,getEQARoundsByPlanning,getEQASample } from "./ReportSimilarityReagentService";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import {getCurrentUser,getListHealthOrgByUser} from "../User/UserService"
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit:3
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
class ReportSimilarityReagent extends React.Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    listEQARound: [],
    keyword: '',
    listSample:[],
    round: null,
    shouldOpenConfirmationEditDialog:false,
    shouldOpenDialog:false
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
    var searchObject = {};
    searchObject.typeMethod = 1;
    searchObject.text = this.state.keyword.trim();
    searchObject.round = this.state.round ? this.state.round : null;
    searchObject.pageIndex = 1;
    searchObject.pageSize = this.state.rowsPerPage;
    getByReportSimilarityReagent(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    }
    );
  }

  componentDidMount() {
    let searchObject = { pageIndex: 1, pageSize: 1000000 }
    searchPlanning(searchObject).then(({data})=>{
          this.setState({listPlanning: [...data.content]}); 
  });
    // this.updatePageData();
  }

  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.round = this.state.round ? this.state.round : null;
    searchObject.typeMethod = 1;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    getByReportSimilarityReagent(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    }
    );
  };
  handleFilterEQARound = (event, round, reason, details) => {
    if (round != null) {
      getEQASample(round.id).then((data)=>{
        let p ={}
        let listSample =[]
        let list = [...data.data]
        list.forEach(element => {
          p = {...element.eqaSample}
          listSample.push(p)
        });
        this.setState({ sample: null,listSample:list},()=>{
        })
      })
      this.setState({ HealthOrgEQARound:round,round: round }, () => {
        
      });
      if (reason == 'clear') {
        this.setState({ round: null })
      }
    } else{
      this.setState({
        HealthOrgEQARound: null,
        sample: null,
        listSample: [],
      })
    }
  }
  handleFilterEQASample =(event,item)=>{
    this.setState({sample:item ? item :null,sampleId :item? item.id :null},()=>{
      if(this.state.sampleId != null){
        getByReportSimilarityReagent(this.state.sampleId).then(({ data }) => {
          this.setState({
            itemList: [...data],
          })
        },()=>{
        })
      }
    })
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

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationEditDialog:false,
      shouldOpenDialog:false
    });
    this.setPage(0);
  };

  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenConfirmationEditDialog:false,
      shouldOpenDialog:false
    });
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenConfirmationEditDialog:false,
      shouldOpenDialog:false
    });
    this.setPage(0);
  };

  exportToExcel = () => {
    const { t } = this.props;
    let searchObject = {}
    if(this.state.sampleId == null || this.state.sampleId == ""){
      toast.warn(t("EQASampleSet.please_select_eqa_sample"))
      return
    }
      exportToExcel(this.state.round ? this.state.round.id :"").then((res) => {
        let blob = new Blob([res.data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        saveAs(blob, 'EQAResultReport.xlsx')
      })
      .catch((err) => {
        // console.log(err)
      })
  }
  
  handleFilterEQAPlanning = (event,item)=>{
    // console.log(item);
    if(item != null && item.id != null){
    this.setState({planning:item?item:null,planningId :item ? item.id :null},()=>{
      if(this.state.planningId !=null){
      getEQARoundsByPlanning(this.state.planningId).then(({data})=>{
        if (data != null && data.length > 0) {
          this.setState({ HealthOrgEQARound: null, sample: null, listEQARound: [...data]});
        }
      })}
    })}else{
      this.setState({
        HealthOrgEQARound: null,
        sample: null,
        listEQARound: [],
        listSample: []
      })
    }
  }
  render() {
    const { t, i18n } = this.props;
    let { listPlanning,
      planning, 
      listEQARound, 
      round,
      HealthOrgEQARound,
      sample,
      listSample } = this.state;

    let columns = [
      {
        title: t("ResultsOfTheUnits.STT"), width: "50", align: "left",
        render: rowData => ( (rowData.tableData.id + 1))
    },
      { title: t("EqaResult.reagent"), field: "reagentName", align: "left", width: "150",
      headerStyle: {
        minWidth:"250px",
        paddingLeft: "10px",
        paddingRight: "0px",
      },
      cellStyle: {
        minWidth:"250px",
        paddingLeft: "10px",
        paddingRight: "0px",
        textAlign: "left",
      },  },
      { title: t("ReportSimilarityReagent.title"), field: "percentSimilarity", width: "150",
      headerStyle: {
        minWidth:"150px",
        paddingLeft: "10px",
        paddingRight: "0px",
      },
      cellStyle: {
        minWidth:"150px",
        paddingLeft: "10px",
        paddingRight: "0px",
        textAlign: "left",
      },  },
      { title: t("ReportSimilarityReagent.countHealthOrg"), field: "countHealthOrg", width: "150",
      headerStyle: {
        minWidth:"150px",
        paddingLeft: "10px",
        paddingRight: "0px",
      },
      cellStyle: {
        minWidth:"150px",
        paddingLeft: "10px",
        paddingRight: "0px",
        textAlign: "left",
      },  },
      { title: t("ReportSimilarityReagent.similarityRate"), field: "similarityRate", width: "150",
      headerStyle: {
        minWidth:"150px",
        paddingLeft: "10px",
        paddingRight: "0px",
      },
      cellStyle: {
        minWidth:"150px",
        paddingLeft: "10px",
        paddingRight: "0px",
        textAlign: "left",
      },  },
      
    ];
    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
        <Helmet>
          <title>{t("ReportSimilarityReagent.title")} | {t("web_site")}</title>
        </Helmet>
          <Breadcrumb routeSegments={[{ name: t("ReportResult.title"), path: "/directory/apartment" },{ name: t("ReportSimilarityReagent.title") }]} />
        </div>
        <Grid container spacing={3}>
          <Grid item ld={3} md={3} sm={6} xs={12}>
            <Button
                className="mb-16 align-bottom"
                variant="contained"
                color="primary"
                onClick={this.exportToExcel}
                >
                {t('general.exportToExcel')}
                </Button>
          </Grid>
          <Grid item lg={3} md={3} sm={6} xs={12}>
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
          <Grid item lg={3} md={3} sm={6} xs={12}>
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
          <Grid item lg={3} md={3} sm={6} xs={12}>
            <Autocomplete
              size="small"
              id="combo-box"
              options={listSample}
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
              title={t('ReportSimilarityReagent.list')}
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
                  color:'#fff',
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
              rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
              component="div"
              labelRowsPerPage={t('general.rows_per_page')}
              labelDisplayedRows={ ({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
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
export default ReportSimilarityReagent;