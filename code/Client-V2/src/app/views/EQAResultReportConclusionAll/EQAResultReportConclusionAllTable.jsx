import {
  FormControl,
  Input,
  InputAdornment,
  Grid,
  MuiThemeProvider,
  IconButton,
  Icon,
  TextField,
  Button,
  TableHead,
  TableCell,
  TableRow,
  Checkbox,
  TablePagination
} from "@material-ui/core";
import moment from "moment";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader
} from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import {
  saveItem,
  getItemById,
  searchByPage,
  searchByPageAll,
} from "./EQAResultReportConclusionAllServices";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EQAResultReportConclusionAllDialog from "./EQAResultReportConclusionDialog";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import { Helmet } from "react-helmet";
import { saveAs } from 'file-saver';
import { toast } from "react-toastify";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit:3
  //etc you get the idea
});
function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return (
    <div>
      <IconButton onClick={() => props.onSelect(item, 0)}>
      <Icon fontSize="small" color="primary">edit</Icon>
      </IconButton>
    </div>
  );
}
class eqaResultReportConclusionAll extends React.Component {
  state = {
    rowsPerPage: 5,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    listEQARound: [],
    keyword: "",
    round: null, 
    startDate: null,
    endDate: null
  };
  constructor(props) {
    super(props);
    this.handleTextSearchChange = this.handleTextSearchChange.bind(this);
  }

  handleTextSearchChange = event => {
    this.setState({ keyword: event.target.value }, function() {});
  };
  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.search();
    }
  };
  search() {
    var searchObject = {};
    searchObject.typeMethod = 5;
    searchObject.text = this.state.keyword.trim();
    searchObject.round = this.state.round ? this.state.round : null;
    searchObject.startDate = this.state.startDate;
    searchObject.endDate = this.state.endDate;
    searchObject.pageIndex = 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPageAll(searchObject).then(
      ({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements
        });
      }
    );
  }

  componentDidMount() {
    let searchObject = { pageIndex: 0, pageSize: 1000000 };
    searchByPageEQARound(searchObject).then(({ data }) => {
      if (data != null && data.content.length > 0) {
        this.setState({ listEQARound: [...data.content] }, () => {});
      }
    });
    this.updatePageData();
  }

  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.round = this.state.round ? this.state.round : null;
    searchObject.typeMethod = 5;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPageAll(searchObject, this.state.page, this.state.rowsPerPage).then(
      ({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements
        });
      }
    );
  };
  handleFilterEQARound = (event, round, reason, details) => {
    if (round != null) {
      this.setState({ round: round }, () => {
        let searchObject = {};
        searchObject.round = this.state.round;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        // searchByPage(searchObject).then(({ data }) => {
        //   this.setState({
        //     itemList: [...data.content],
        //     totalElements: data.totalElements,
        //     round: round
        //   });
        // });
        this.search();
      });
      if (reason == "clear") {
        this.setState({ round: null });
      }
    } else {
      this.setState({ round: null }, () => {
        let searchObject = {};
        searchObject.round = null;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        // searchByPage(searchObject).then(({ data }) => {
        //   this.setState({
        //     itemList: [...data.content],
        //     totalElements: data.totalElements,
        //     round: round
        //   });
        // });
        this.search();
      });
    }
  };

  setPage = page => {
    this.setState({ page }, function() {
      this.updatePageData();
    });
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function() {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false
    });
    this.setPage(0);
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false
    });
    this.setPage(0);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false
    });
    this.setPage(0);
  };

  handleConfirmationResponse = () => {};

  handleEditItem = item => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true
    });
  };
  
  render() {
    const { t, i18n } = this.props;
    let { keyword, listEQARound, round } = this.state;

    let columns = [
      {
        title: t("Action"),
        field: "custom",
        align: "left",
        width: "250",
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
        render: rowData => (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 0) {
                getItemById(rowData.id).then(({ data }) => {
                  this.setState({
                    item: data,
                    shouldOpenEditorDialog: true
                  });
                });
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        )
      },
      {
        title: t("EQAResultReportConclusionAll.eqa_round"),
        field: "healthOrgRound.round.code",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("EQAResultReportConclusionAll.health_org"),
        field: "healthOrgRound.healthOrg.name",
        width: "150",
        headerStyle: {
          minWidth: "350px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "350px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("Code"),
        field: "healthOrgRound.healthOrg.code",
        width: "100",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
    ];
    return (
      <div className="">
        <Grid container spacing={3}>
          <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Autocomplete
              size="small"
              id="combo-box"
              options={listEQARound}
              className="flex-end"
              getOptionLabel={option => option.code}
              onChange={this.handleFilterEQARound}
              value={round}
              renderInput={params => (
                <TextField
                  {...params}
                  label={t("general.fillterByRoundEQA")}
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item lg={5} md={5} sm={12} xs={12}>
            <FormControl fullWidth>
              <Input
                className="mt-8 search_box w-100 stylePlaceholder"
                type="text"
                name="keyword"
                value={keyword}
                onChange={this.handleTextSearchChange}
                onKeyDown={this.handleKeyDownEnterSearch}
                placeholder={t("general.enterSearch")}
                id="search_box"
                startAdornment={
                  <InputAdornment>
                    <Link to="#">
                      {" "}
                      <SearchIcon
                        onClick={() => this.search(keyword)}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0"
                        }}
                      />
                    </Link>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <MaterialTable
              title={t("List")}
              data={this.state.itemList}
              columns={columns}
              //parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
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
                Toolbar: props => <MTableToolbar {...props} />
              }}
              onSelectionChange={rows => {
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
            {this.state.shouldOpenEditorDialog && (
              <EQAResultReportConclusionAllDialog
                t={t}
                i18n={i18n}
                handleClose={this.handleDialogClose}
                open={this.state.shouldOpenEditorDialog}
                handleOKEditClose={this.handleOKEditClose}
                item={this.state.item}
              />
            )}
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
    );
  }
}
export default eqaResultReportConclusionAll;
