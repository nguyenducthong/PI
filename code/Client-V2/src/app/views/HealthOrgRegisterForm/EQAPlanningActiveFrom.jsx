import {
  InputAdornment,
  Input,
  Grid,
  IconButton,
  TextField,
  Button,
  TablePagination
} from "@material-ui/core";
import React, { Component } from "react";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader
} from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import {
  healthOrgRegisterRound,
  handleCancelRegistration,
  searchEQAPlanningByPage as searchByPage
} from "./HealthOrgRegisterFormService";
import moment from "moment";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import EQAHealthOrgPlanningRegisterDialog from "./EQAHealthOrgPlanningRegisterDialog";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return (
    <div>
      <IconButton
        onClick={() => props.onSelect(item, 0)}
        title="Đăng ký tham gia"
      >
        <span class="material-icons" style={{ color: "#7467ef" }}>
          add_circle
          </span>
      </IconButton>
    </div>
  );
}
class EQAPlanningActiveFrom extends React.Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    shouldOpenHealthOrgRegisterDialog: false,
    isRunning: true,
    text: "",
    listEQARound: [],
    round: null,
    planning: null,
  };
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(event) {
    this.setState({ text: event.target.value });
  }

  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  search() {
    var searchObject = {};
    searchObject.text = this.state.text;
    if (this.state.planning != null) {
      searchObject.planningId = this.state.planning.id;
    }
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.isRunning = this.state.isRunning;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(
      ({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements
        });
      }
    );
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  componentDidMount() {
    // let searchObject = { pageIndex: 0, pageSize: 1000000 };
    // searchByPageEQARound(searchObject).then(({ data }) => {
    //   if (data != null && data.content.length > 0) {
    //     this.setState({ listEQARound: [...data.content] }, () => {});
    //   }
    // });
    this.updatePageData();
  }
  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.text;
    if (this.state.planning != null) {
      searchObject.planningId = this.state.planning.id;
    }
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.isRunning = this.state.isRunning;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(
      ({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements
        });
      }
    );
  };
  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };
  healthOrgRegisterRound = rowData => {
    this.setState(
      { shouldOpenHealthOrgRegisterDialog: true, planning: rowData },
      function () { }
    );
  };
  handleHealthOrgRegisterDialogClose = () => {
    this.setState({
      shouldOpenHealthOrgRegisterDialog: false
    });
  };
  // handleFilterEQARound = (event, round, reason, details) => {
  //   if (round != null && round.id != null) {
  //     let searchObject = {};
  //     searchObject.roundId = round.id;
  //     searchObject.isRunning = this.state.isRunning;
  //     searchObject.pageIndex = this.state.page;
  //     searchObject.pageSize = this.state.rowsPerPage;
  //     searchByPage(searchObject).then(({ data }) => {
  //       this.setState({
  //         itemList: [...data.content],
  //         totalElements: data.totalElements,
  //         round: round
  //       });
  //     });
  //     if (reason == "clear") {
  //       this.setState({ round: null });
  //     }
  //   } else {
  //     this.setState({ round: null }, () => {
  //       let searchObject = {};
  //       searchObject.isRunning = this.state.isRunning;
  //       searchObject.pageIndex = this.state.page;
  //       searchObject.pageSize = this.state.rowsPerPage;
  //       searchByPage(searchObject).then(({ data }) => {
  //         this.setState({
  //           itemList: [...data.content],
  //           totalElements: data.totalElements,
  //           round: round
  //         });
  //       });
  //     });
  //   }
  // };
  render() {
    const { t, i18n } = this.props;
    const { text, shouldOpenHealthOrgRegisterDialog } = this.state;
    let { listEQARound, planning } = this.state;
    let columns = [
      {
        title: t("Action"),
        field: "custom",
        align: "left",
        width: "100",
        headerStyle: {
          minWidth: "80px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: {
          minWidth: "80px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => (
          <Button
            // className="mb-16 mr-16 align-bottom"
            variant="contained"
            color="primary"
            title={t("AllocationSampleSet.ViewDetailOrg")}
            onClick={() => {
              this.healthOrgRegisterRound(rowData);
            }}
          >
            {t("general.register")}
          </Button>
        )
      },

      // {
      //   title: t("stt"),
      //   width: "150",
      //   align: "left",
      //   headerStyle: {
      //     minWidth: "75px",
      //     paddingLeft: "0px",
      //     paddingRight: "0px",
      //   },
      //   cellStyle: {
      //     minWidth: "75px",
      //     paddingLeft: "0px",
      //     paddingRight: "0px",
      //     textAlign: "left",
      //   },
      //   render: rowData => rowData.tableData.id + 1
      // },
      {
        title: t("Year"), field: "name", width: "150",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => rowData.year ? (
        <span>
          {rowData.year}  -  {parseFloat(rowData.year) + 1 }
        </span>) : ""
      },
      {
        title: t("EQARound.registrationStartDate"),
        field: "",
        align: "left",
        width: "150",
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
          rowData.startDate ? (
            <span>
              {moment(rowData.startDate).format("DD/MM/YYYY HH:mm")}
            </span>
          ) : (
              ""
            )
      },
      {
        title: t("EQARound.registrationExpiryDate"),
        field: "",
        align: "left",
        width: "150",
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
          rowData.endDate ? (
            <span>
              {moment(rowData.endDate).format(
                "DD/MM/YYYY HH:mm"
              )}
            </span>
          ) : (
              ""
            )
      },

    ];
    return (
      <Grid container spacing={2} className={"flex-end"}>
        <Helmet>
          <title>
            {t("EQAHealthOrgRoundRegister.titlePage")} | {t("web_site")}
          </title>
        </Helmet>
        <Grid item xs={12}>
          <div>
            {this.state.shouldOpenHealthOrgRegisterDialog && (
              <EQAHealthOrgPlanningRegisterDialog
                t={t}
                i18n={i18n}
                handleClose={this.handleHealthOrgRegisterDialogClose}
                open={this.state.shouldOpenHealthOrgRegisterDialog}
                item={this.state.planning}
              />
            )}
            {this.state.shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                title={t("confirm")}
                open={this.state.shouldOpenConfirmationDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleConfirmationResponse}
                text={t("DeleteConfirm")}
              />
            )}
          </div>
          <MaterialTable
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
          <TablePagination
            align="left"
            className="px-16"
            rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
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
    );
  }
}
export default EQAPlanningActiveFrom;
