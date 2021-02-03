import React, { Component } from "react";
import moment from "moment";
import {
  IconButton, Table, TableHead, TableBody, TableRow, TableCell, Icon, TablePagination, TableContainer, Button, Card, Checkbox, TableSortLabel, InputAdornment, Input, Grid
} from "@material-ui/core";
import MaterialTable, {
  MTableToolbar, Chip, MTableBody, MTableHeader
} from "material-table";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import shortid from "shortid";
import { saveAs } from "file-saver";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { searchByPage } from "./EQAActivityLogService";
import SearchIcon from "@material-ui/icons/Search";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});
function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return (
    <div>
      <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
        <Icon fontSize="small" color="primary">edit</Icon>
      </IconButton>
      <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
        <Icon fontSize="small" color="error">delete</Icon>
      </IconButton>
      <IconButton size="small" onClick={() => props.onSelect(item, 2)}>
        <Icon fontSize="small" color="primary">visibility</Icon>
      </IconButton>
    </div>
  );
}
class EQAActivityLog extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,

    item: {},
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenViewDialog: false,
    shouldOpenConfirmationDialog: false,
    selectAllItem: false,
    selectedList: [],
    totalElements: 0,
    shouldOpenConfirmationDeleteAllDialog: false,
    serumBottleList: [],
    keyword: ""
  };
  numSelected = 0;
  rowCount = 0;
  constructor(props) {
    super(props);
    //this.state = {keyword: ''};
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.search(this.state.value);
    }
  };

  search() {
    var searchObject = {};
    searchObject.text = this.state.keyword.trim();
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(({ data }) => {
      this.setState({
        itemList: [...data.content],
        totalElements: data.totalElements
      });
    });
  }
  handleTextChange(event) {
    this.setState({ keyword: event.target.value });
  }
  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };
  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.search();
    }
  };
  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  updatePageData = () => {
    var searchObject = {};
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.keyword = this.state.keyword.trim();
    searchByPage(searchObject).then(({ data }) => {
      this.setState({
        itemList: [...data.content],
        totalElements: data.totalElements
      });
    });
  };




  componentDidMount() {
    this.updatePageData();
  }

  render() {
    const { t } = this.props;
    let { keyword } = this.state;

    let {
      rowsPerPage,
      page,
      eQASerumBankList,
      shouldOpenConfirmationDialog,
      shouldOpenEditorDialog,
      shouldOpenViewDialog,
      shouldOpenConfirmationDeleteAllDialog
    } = this.state;

    let columns = [
      {
        title: t("log.userName"),
        field: "userName",
        align: "left",
        width: "200",
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
      //   {
      //     title: t("log.moduleLog"),
      //     field: "moduleLog",
      //     width: "150"
      //   },
      {
        title: t("log.logDate"),
        field: "logDate",
        width: "150",
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
          rowData.logDate ? (
            <span>{moment(rowData.logDate).format("dd/MM/yyyy")}</span>
          ) : (
              ""
            )
      },
      {
        title: t("log.contentLog"),
        field: "contentLog",
        width: "200",
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
        title: t("log.logType"),
        field: "logType",
        align: "left",
        width: "150",
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
        cellStyle: { whiteSpace: "nowrap" },
        render: rowData => {
          if (rowData.logType === 1) {
            return (
              <span >
                {t("log.resultReport")}
              </span>)
          } else if (rowData.logType === 2) {
            return (
              <span >
                {t("log.log_Sample")}
              </span>)
          } else if (rowData.logType === 3) {
            return (
              <span >
                {t("log.log_SerumBottle")}
              </span>)
          }else{
            return (<span>{t("log.log_User")}</span>)
          }
        }
        // rowData.logType == 1 ? (
        //   <small >
        //     {t("log.resultReport")}
        //   </small>
        // ) : (
        //   <small >
        //     {t("log.log_Sample")}
        //   </small>
        // )
      },
    ];
    return (
      <div className="m-sm-30">
        <Helmet>
          <title>
            {t("log.title")} | {t("web_site")}
          </title>
        </Helmet>
        <div className="mb-sm-30">
          <Breadcrumb
            routeSegments={[{ name: t("category"), path: "/directory/apartment" }, { name: t("log.title") }]}
          />
        </div>
        <Grid container spacing={3}>
          <Grid item md={7} sm={10} xs={12}>
            {/* <Button
              className="mb-16 mr-16"
              variant="contained"
              color="primary"
              onClick={() =>
                this.setState({
                  shouldOpenEditorDialog: true,
                  item: {},
                  serumBottleList: []
                })
              }
            >
              {t("button.add")}
            </Button>
            <Button
              className="mb-16 mr-16"
              variant="contained"
              color="primary"
              onClick={() =>
                this.setState({ shouldOpenConfirmationDeleteAllDialog: true })
              }
            >
              {t("Delete")}
            </Button> */}
          </Grid>
          <Grid item md={5} sm={10} xs={12}>
            <Input
              label={t("EnterSearch")}
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleTextChange}
              onKeyDown={this.handleKeyDownEnterSearch}
              className="w-100 mb-16 mr-10 ml-10 stylePlaceholder"
              id="search_box"
              placeholder={t("general.enterSearch")}
              startAdornment={
                <InputAdornment>
                  <Link to="#">
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
          </Grid>
        </Grid>

        <MaterialTable
          title={t("List")}
          data={this.state.itemList}
          columns={columns}
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
            maxBodyHeight: '450px',
            minBodyHeight: '370px',
            headerStyle: {
              backgroundColor: '#358600',
              color: '#fff',
            },
            padding: 'dense',
            toolbar: false
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
        // actions={[
        //   {
        //     tooltip: "Remove All Selected Users",
        //     icon: "delete",
        //     onClick: (evt, data) => {
        //       this.handleDeleteAll(data);
        //     }
        //   }
        // ]}
        />
        <TablePagination
          className="px-16"
          rowsPerPageOptions={[1, 2, 5, 10, 25]}
          component="div"
          labelRowsPerPage={t('general.rows_per_page')}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
          count={this.state.totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.setRowsPerPage}
        />

        {shouldOpenConfirmationDialog && (
          <ConfirmationDialog
            open={shouldOpenConfirmationDialog}
            onConfirmDialogClose={this.handleDialogClose}
            onYesClick={this.handleConfirmationResponse}
            title={t("confirm")}
            text={t("DeleteConfirm")}
            Yes={t("general.Yes")}
            No={t("general.No")}
          />
        )}

        {shouldOpenConfirmationDeleteAllDialog && (
          <ConfirmationDialog
            open={shouldOpenConfirmationDeleteAllDialog}
            onConfirmDialogClose={this.handleDialogClose}
            onYesClick={this.handleDeleteAll}
            title={t("confirm")}
            text={t("DeleteAllConfirm")}
            Yes={t("general.Yes")}
            No={t("general.No")}
          />
        )}

      </div>
    );
  }
}

export default EQAActivityLog;
