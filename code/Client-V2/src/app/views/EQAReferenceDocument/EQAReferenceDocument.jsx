import {
  InputAdornment,
  Input,
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
  TablePagination,
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader,
} from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import {
  getByPage,
  deleteItem,
  saveItem,
  getItemById,
  searchByPage,
  getCurrentUser,
} from "./EQAReferenceDocumentService";
import { Breadcrumb, ConfirmationDialog } from "egret";
import EQAReferenceDocumentDialog from "./EQAReferenceDocumentDialog";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3,
});
function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return (
    <div>
      {props.isRoleAdmin && (
        <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
          <Icon fontSize="small" color="primary">
            edit
          </Icon>
        </IconButton>
      )}
      {props.isRoleAdmin && (
        <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
          <Icon fontSize="small" color="error">
            delete
          </Icon>
        </IconButton>
      )}
      {!props.isRoleAdmin && (
        <IconButton size="small" onClick={() => props.onSelect(item, 2)}>
          <Icon color="primary"><VisibilityIcon /></Icon>
        </IconButton>
      )}
    </div>
  );
}
class EQAReferenceDocument extends React.Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    data: [],
    totalElements: 0,
    keyword: "",
    isRoleAdmin: false,
    isView: false,
  };

  constructor(props) {
    super(props);
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
  }
  handleKeywordChange(event) {
    this.setState({ keyword: event.target.value });
  }
  search() {
    var searchObject = {};
    searchObject.text = this.state.keyword.trim();
    searchObject.pageIndex = this.state.page;
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

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  componentDidMount() {
    let { isRoleAdmin } = this.state;
    getCurrentUser().then(({ data }) => {
      data.roles.forEach((res) => {
        if (res.name == "ROLE_ADMIN" && res.authority == "ROLE_ADMIN") {
          isRoleAdmin = true;
        }
      });
      this.setState({ isRoleAdmin: isRoleAdmin });
    });

    this.updatePageData();
  }
  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword.trim();
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

  handleKeyDownEnterSearch = (e) => {
    if (e.key === "Enter") {
      this.updatePageData();
    }
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
      shouldOpenPrintDialog: false,
    });
    this.setPage(0);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
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
    deleteItem(this.state.id)
      .then(() => {
        this.updatePageData();
        this.handleDialogClose();
        toast.success(t("EQAHealthOrgTypeTable.notify.deleteSuccess"));
      })
      .catch(() => {
        toast.warning(t("EQAHealthOrgTypeTable.notify.error"));
        this.handleDialogClose();
      });
  };

  handleEditItem = (item) => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true,
    });
  };
  render() {
    const { t, i18n } = this.props;
    let TitlePage = t("referenceDocument.title");
    let {
      keyword,
      rowsPerPage,
      page,
      shouldOpenEditorDialog,
      item,
      pageSize,
      pageIndex,
      totalElements,
      isRoleAdmin,
    } = this.state;

    let columns = [
      {
        title: t("Action"),
        field: "custom",
        align: "left",
        width: "250",
        cellStyle: { whiteSpace: "nowrap" },
        render: (rowData) => (
          <MaterialButton
            item={rowData}
            isRoleAdmin={isRoleAdmin}
            onSelect={(rowData, method) => {
              if (method === 0) {
                getItemById(rowData.id).then(({ data }) => {
                  if (data.parent === null) {
                    data.parent = {};
                  }
                  this.setState({
                    item: data,
                    shouldOpenEditorDialog: true,
                  });
                });
              } else if (method === 1) {
                this.handleDelete(rowData.id);
              } else if (method === 2) {
                getItemById(rowData.id).then(({ data }) => {
                  if (data.parent === null) {
                    data.parent = {};
                  }
                  this.setState({
                    item: data,
                    shouldOpenEditorDialog: true,
                    isView: true,
                  });
                });
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        ),
      },
      // { title: t("Tên file"), field: "file.name", width: "150" },
      {
        title: t("referenceDocument.description"),
        field: "description",
        align: "left",
        width: "150",
      },
      {
        title: t("referenceDocument.number_of_documents"),
        field: "custom",
        align: "left",
        width: "250",
        render: (rowData) =>
          rowData.documents ? (
            <span>{rowData.documents.length}</span>
          ) : (
            <span>0</span>
          ),
      },
    ];

    return (
      <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>
              {TitlePage} | {t("web_site")}
            </title>
          </Helmet>
          <Breadcrumb routeSegments={[{ name: TitlePage }]} />
        </div>
        <Grid container spacing={3} justify="space-between">
          <Grid item md={5} sm={5} xs={12}>
            {isRoleAdmin && (
              <Button
                className="mb-16 mr-16"
                variant="contained"
                color="primary"
                onClick={() => {
                  this.handleEditItem({
                    startDate: new Date(),
                    endDate: new Date(),
                  });
                }}
              >
                {t("button.add")}
              </Button>
            )}
            {/* <Button className="mb-16 mr-36" variant="contained" color="primary"
                            onClick={() => this.setState({ shouldOpenConfirmationDeleteAllDialog: true })}>
                            {t('button.delete')}
                        </Button> */}

            {this.state.shouldOpenConfirmationDeleteAllDialog && (
              <ConfirmationDialog
                open={this.state.shouldOpenConfirmationDeleteAllDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleDeleteAll}
                title={t("confirm")}
                text={t("DeleteAllConfirm")}
                Yes={t("general.Yes")}
                No={t("general.No")}
              />
            )}
            {this.state.shouldOpenEditorDialog && (
              <EQAReferenceDocumentDialog
                t={t}
                i18n={i18n}
                handleClose={this.handleDialogClose}
                open={shouldOpenEditorDialog}
                isRoleAdmin={isRoleAdmin}
                handleOKEditClose={this.handleOKEditClose}
                item={item}
                isView={this.state.isView}
              />
            )}
          </Grid>
          <Grid item md={5} sm={5} xs={12}>
            <Input
              label={t("EnterSearch")}
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleKeywordChange}
              onKeyDown={this.handleKeyDownEnterSearch}
              className="w-100 mb-16 mr-10 stylePlaceholder"
              id="search_box"
              placeholder={t("general.enterSearch")}
              startAdornment={
                <InputAdornment>
                  <Link to="#">
                    {" "}
                    <SearchIcon
                      onClick={() => this.search()}
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
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div>
            {this.state.shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                open={this.state.shouldOpenConfirmationDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleConfirmationResponse}
                title={t("confirm")}
                text={t("DeleteConfirm")}
                Yes={t("general.Yes")}
                No={t("general.No")}
              />
            )}
          </div>
          <MaterialTable
            title={t("EQARound.ListRound")}
            data={this.state.itemList}
            columns={columns}
            parentChildData={(row, rows) => {
              var list = rows.find((a) => a.id === row.parentId);
              return list;
            }}
            options={{
              selection: true,
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
            localization={{
              body: {
                emptyDataSourceMessage: `${t("general.emptyDataMessageTable")}`,
              },
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
      </div>
    );
  }
}
export default EQAReferenceDocument;
