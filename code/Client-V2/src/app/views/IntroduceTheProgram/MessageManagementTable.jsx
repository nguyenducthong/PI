import React, { Component } from "react";
import {
  FormControl,
  Input,
  Radio,
  InputAdornment,
  Grid,
  IconButton,
  Icon,
  Button,
  TablePagination,
} from "@material-ui/core";
import moment from "moment";
import MaterialTable, {
  MTableToolbar,
} from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getCurrentUser, getListHealthOrgByUser } from "../User/UserService";
import MessageManagementDialog from "./MassageManagementDialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {searchByPage, deleteItem, getItemById} from "./IntroduceTheProgramService";

function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return (
    <div>
      <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
        <Icon fontSize="small" color="primary">
          edit
        </Icon>
      </IconButton>
      {props.isRoleAdmin && (
        <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
          <Icon fontSize="small" color="error">
            delete
          </Icon>
        </IconButton>
      )}
    </div>
  );
}
class MessageManagementTable extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    data: [],
    totalElements: 0,
    listEQARound: [],
    itemList: [],
    shouldOpenEditorDialog: false,
    isRoleAdmin: false,
    shouldOpenViewDialog: false,
    shouldOpenConfirmationDialog: false,
    shouldOpenConfirmationDeleteAllDialog: false,
    shouldOpenConfirmationEditDialog: false,
    keyword: "",
    round: null,
    startDate: null,
    endDate: null,
    isSearch: false,
    shouldOpenPIEditorDialog: false,
    shouldOpenPrintDialog: false,
  };
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  handleTextChange(event) {
    this.setState({ keyword: event.target.value });
  }
  handleKeyDownEnterSearch = (e) => {
    if (e.key === "Enter") {
      this.search();
    }
  };
  search() {
    var searchObject = {};
    searchObject.text = this.state.keyword.trim();
    searchObject.pageIndex = 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(
      ({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements,
        });
      }
    );
  }
  componentWillMount() {
    getCurrentUser().then((res) => {
      let checkRoleAdmin = false;
      res.data.roles.forEach((el) => {
        if (el.name == "ROLE_ADMIN" || el.authority == "ROLE_ADMIN") {
          checkRoleAdmin = true;
        }
      });
      if (checkRoleAdmin) {
        this.setState({ isRoleAdmin: true, isView: true });
      }
      // if (!checkRoleAdmin) {
      //   this.setState({ isRoleAdmin: false, isView: false })
      // }
    });
  }

  componentDidMount() {
    this.updatePageData();
  }
  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(
      ({ data }) => {
        this.setState({
          itemList: [...data.content],
          totalElements: data.totalElements,
        });
      }
    );
  };
  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };

  setRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationEditDialog: false,
      shouldOpenViewDialog: false,
      shouldOpenPrintDialog: false,
    });
    this.setPage(0);
  };

  handleDelete = (id) => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true,
    });
  };
  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenConfirmationEditDialog: false,
      shouldOpenPIEditorDialog: false,
      shouldOpenViewDialog: false,
      shouldOpenPrintDialog: false,
    });
    this.setPage(0);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
      shouldOpenConfirmationEditDialog: false,
      shouldOpenPIEditorDialog: false,
      shouldOpenViewDialog: false,
      shouldOpenPrintDialog: false,
    });
    this.setPage(0);
  };

  handleDelete = (id) => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true,
    });
  };

  handleConfirmationResponse = () => {
    let { t } = this.props;
    deleteItem(this.state.id).then((res) => {
      if (res.data == true) {
        toast.success(t("deleteSuccess"));
        this.updatePageData();
      } else {
        toast.warning(t('error'));
      }
      this.handleDialogClose();
    }).catch((err) => {
      toast.warning(t('EqaResult.error'));
      this.handleDialogClose();
    });
  };
  handleConfirmationEdit = () => {
    this.setState({
      shouldOpenEditorDialog: true,
    });
  };
  handleEditItem = (item) => {
    let { t } = this.props;
    
    this.setState({
      item: item,
      shouldOpenEditorDialog: true,
    });
  };

  render() {
    let { t, i18n } = this.props;
    let { keyword } = this.state;
    let columns = [
      {
        title: t("Action"),
        field: "custom",
        align: "center",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "0px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "0px",
          paddingRight: "0px",
          textAlign: "center",
        },
        // cellStyle: { whiteSpace: 'nowrap' },
        render: (rowData) => (
          <MaterialButton
            item={rowData}
            isRoleAdmin={this.state.isRoleAdmin}
            onSelect={(rowData, method) => {
              if (method === 0) {
                getItemById(rowData.id).then(({data}) => {
                    this.setState({
                        item: data,
                        shouldOpenEditorDialog: true
                    })
                })
              } else if (method === 1) {
                this.handleDelete(rowData.id);
              }
            }}
          />
        ),
      },
      {
        title: t("Code"),
        field: "code",
        width: "150",
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
        title: t("Name"),
        field: "name",
        width: "150",
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
        title: t("Status"),
        field: "active",
        width: "150",
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
        render: rowData => (
          rowData.active === true ? <p>{t("showing")}</p> : <p>{t("notShow")}</p>
        )
      },
    ];
    return (
      <div>
        <Grid container spacing={3}>
          <Grid item md={8} sm={6} xs={12}>
            <Button
              className="mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={() => {
                this.handleEditItem({
                  startDate: new Date(),
                  endDate: new Date(),
                });
              }}
            >
              {t("Add")}
            </Button>
          </Grid>
          <Grid item md={4} sm={6} xs={12}>
            <FormControl fullWidth>
              <Input
                className="search_box w-100 stylePlaceholder"
                type="text"
                name="keyword"
                value={keyword}
                onChange={this.handleTextChange}
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
                          right: "0",
                        }}
                      />
                    </Link>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <div>
              {this.state.shouldOpenEditorDialog && (
                <MessageManagementDialog
                  t={t}
                  i18n={i18n}
                  handleClose={this.handleDialogClose}
                  open={this.state.shouldOpenEditorDialog}
                  handleOKEditClose={this.handleOKEditClose}
                  item={this.state.item}
                  isRoleAdmin={this.state.isRoleAdmin}
                  isView={this.state.isView}
                  //   listHealthOrgRound={this.state.listHealthOrgRound}
                />
              )}

              {this.state.shouldOpenConfirmationDialog && (
                <ConfirmationDialog
                  title={t("confirm")}
                  open={this.state.shouldOpenConfirmationDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationResponse}
                  text={t("DeleteConfirm")}
                  Yes={t("Yes")}
                  No={t("No")}
                />
              )}
              {this.state.shouldOpenConfirmationEditDialog && (
                <ConfirmationDialog
                  title={t("confirm")}
                  open={this.state.shouldOpenConfirmationEditDialog}
                  onConfirmDialogClose={this.handleDialogClose}
                  onYesClick={this.handleConfirmationEdit}
                  text={t("EQAResultReportFastTest.editConfirm")}
                  Yes={t("general.Yes")}
                  No={t("general.No")}
                />
              )}
            </div>
            <MaterialTable
              title={t("EQAResultReportElisa.list")}
              data={this.state.itemList}
              columns={columns}
              options={{
                selection: false,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                rowStyle: (rowData, index) => ({
                  backgroundColor: index % 2 === 1 ? "#EEE" : "#FFF",
                }),
                maxBodyHeight: "450px",
                minBodyHeight: "370px",
                headerStyle: {
                  backgroundColor: "#358600",
                  color: "#fff",
                },
                padding: "dense",
                toolbar: false,
              }}
              components={{
                Toolbar: (props) => <MTableToolbar {...props} />,
              }}
              onSelectionChange={(rows) => {
                this.data = rows;
              }}
            />
            <TablePagination
              align="left"
              className="px-16"
              rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
              component="div"
              labelRowsPerPage={t("general.rows_per_page")}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${t("general.of")} ${
                  count !== -1 ? count : `more than ${to}`
                }`
              }
              count={this.state.totalElements}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              backIconButtonProps={{
                "aria-label": "Previous Page",
              }}
              nextIconButtonProps={{
                "aria-label": "Next Page",
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

export default MessageManagementTable;
