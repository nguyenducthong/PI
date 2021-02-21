import React, { Component } from "react";
import {
  Grid,
  IconButton,
  Icon,
  TablePagination,
  Button,
  TextField,
  InputAdornment, Input,
} from "@material-ui/core";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { getAllEQAHealthOrgTypes, deleteItem, searchByPage, getItemById } from "./HealthOrgLevelService";
import HealthOrgLevelEditorDialog from "./HealthOrgLevelEditorDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import shortid from "shortid";
import { saveAs } from 'file-saver';
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
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

class HealthOrgLevelTable extends Component {
  state = {
    keyword: '',
    rowsPerPage: 10,
    page: 0,
    eQAHealthOrgType: [],
    item: {},
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    selectAllItem: false,
    selectedList: [],
    totalElements: 0,
    shouldOpenConfirmationDeleteAllDialog: false
  };
  numSelected = 0;
  rowCount = 0;

  handleTextChange = event => {
    this.setState({ keyword: event.target.value }, function () {
    })
  };

  handleKeyDownEnterSearch = e => {
    if (e.key === 'Enter') {
      this.search();
    }
  };

  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    })
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  search() {
    this.setState({ page: 0 }, function () {
      var searchObject = {};
      searchObject.text = this.state.keyword;
      searchObject.pageIndex = this.state.page + 1;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
        this.setState({ itemList: [...data.content], totalElements: data.totalElements })
      });
    });
  }

  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    }
    );
  };

  handleDownload = () => {
    var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "hello world.txt");
  }
  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false
    });
    this.setPage(0);
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false
    });
    this.updatePageData();
  };

  handleDeleteEQAHealthOrgType = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleEditEQAHealthOrgType = item => {
    getItemById(item.id).then((result) => {
      this.setState({
        item: result.data,
        shouldOpenEditorDialog: true
      });
    });
  };

  handleConfirmationResponse = () => {
    let {t} = this.props;
    deleteItem(this.state.id).then(() => {
      this.updatePageData();
      this.handleDialogClose();
      toast.success(t("deleteSuccess"));
    }).catch(()=>{
      toast.warning(t('error'));
      this.handleDialogClose();
    });
  };

  componentDidMount() {
    this.updatePageData();
  }

  handleEditItem = item => {
    this.setState({
      item: item,
      shouldOpenEditorDialog: true
    });
  };

  handleClick = (event, item) => {
    let { eQAHealthOrgType } = this.state;
    if (item.checked == null) {
      item.checked = true;
    } else {
      item.checked = !item.checked;
    }
    var selectAllItem = true;
    for (var i = 0; i < eQAHealthOrgType.length; i++) {
      if (eQAHealthOrgType[i].checked == null || eQAHealthOrgType[i].checked == false) {
        selectAllItem = false;
      }
      if (eQAHealthOrgType[i].id == item.id) {
        eQAHealthOrgType[i] = item;
      }
    }
    this.setState({ selectAllItem: selectAllItem, eQAHealthOrgType: eQAHealthOrgType });

  };
  handleSelectAllClick = (event) => {
    let { eQAHealthOrgType } = this.state;
    for (var i = 0; i < eQAHealthOrgType.length; i++) {
      eQAHealthOrgType[i].checked = !this.state.selectAllItem;
    }
    this.setState({ selectAllItem: !this.state.selectAllItem, eQAHealthOrgType: eQAHealthOrgType });
  };

  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  async handleDeleteList(list) {
    let { t } = this.props;
    let demSuccess = 0, demError = 0;
    for (var i = 0; i < list.length; i++) {
      await deleteItem(list[i].id).then((res) => {
        demSuccess++;
        // toast.success(t("deleteSuccess") + " " + list[i].code);
        this.updatePageData();
        this.handleDialogClose();
    }).catch((err) => {
      demError++;
      // toast.warning(t('error'));
      this.handleDialogClose();
    });
    }
    if(demSuccess != 0){
      toast.success(t("deleteSuccess") + " " + demSuccess);
    }
    if(demError != 0){
      toast.warning(t('error') + " " + demError);
    }
  }

  handleDeleteAll = (event) => {
    let {t} = this.props;
    if(this.data != null){
      this.handleDeleteList(this.data).then(() => {
        this.updatePageData();
        this.handleDialogClose();
      }
      );
    }else{
      toast.warning(t('general.select_data'));
      this.handleDialogClose();
    } 
  };

  render() {
    const { t, i18n } = this.props;
    let {
      keyword,
      rowsPerPage,
      page,
      totalElements,
      itemList,
      item,
      shouldOpenConfirmationDialog,
      shouldOpenEditorDialog,
      shouldOpenConfirmationDeleteAllDialog
    } = this.state;

    let columns = [
      {
        title: t("Action"),
        field: "custom",
        align: "left",
        width: "250",
        cellStyle: { whiteSpace: 'nowrap' },
        render: rowData => <MaterialButton item={rowData}
          onSelect={(rowData, method) => {
            if (method === 0) {
              getItemById(rowData.id).then(({ data }) => {
                if (data.parent === null) {
                  data.parent = {};
                }
                this.setState({
                  item: data,
                  shouldOpenEditorDialog: true
                });
              })
            } else if (method === 1) {
              this.handleDelete(rowData.id);
            } else {
              alert('Call Selected Here:' + rowData.id);
            }
          }}
        />
      },
      { title: t("HealthOrgLevel.code"), field: "code", align: "left", width: "150" },
      { title: t("HealthOrgLevel.name"), field: "name", width: "150" },
      { title: t("HealthOrgLevel.description"), field: "description", align: "left", width: "150" },
     
    ];

    return (
      <div className="m-sm-30">
        <Helmet>
          <title>{t("HealthOrgLevel.title")} | {t("web_site")}</title>
        </Helmet>
        <div className="mb-sm-30">
          <Breadcrumb routeSegments={[{ name: t("category"), path: "/directory/apartment" },{ name: t('HealthOrgLevel.title') }]} />
        </div>

        <Grid container spacing={3}>
          <Grid item lg={7} md={7} sm={12} xs={12}>
            <Button
              className="mb-16 mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={() => {
                this.handleEditItem({ startDate: new Date(), endDate: new Date() });
              }
              }
            >
              {t('Add')}
            </Button>
            <Button className="mb-16 mr-36 align-bottom" variant="contained" color="primary"
              onClick={() => this.setState({ shouldOpenConfirmationDeleteAllDialog: true })}>
              {t('Delete')}
            </Button>

            {shouldOpenConfirmationDeleteAllDialog && (
              <ConfirmationDialog
                open={shouldOpenConfirmationDeleteAllDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleDeleteAll}
                title={t("confirm")}
                text={t('DeleteAllConfirm')}
                Yes={t('general.Yes')}
                No={t('general.No')}
              />
            )}
          </Grid>
          <Grid item lg={5} md={5} sm={12} xs={12}>
            <Input
              label={t('EnterSearch')}
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleTextChange}
              onKeyDown={this.handleKeyDownEnterSearch}
              className="w-100 mb-16 mr-10 stylePlaceholder"
              id="search_box"
              placeholder={t('general.enterSearch')}
              startAdornment={
                <InputAdornment >
                  <Link to="#"> <SearchIcon
                    onClick={() => this.search()}
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0"
                    }} /></Link>
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>


        <Grid item xs={12}>
          <div>
            {shouldOpenEditorDialog && (
              <HealthOrgLevelEditorDialog t={t} i18n={i18n}
                handleClose={this.handleDialogClose}
                open={shouldOpenEditorDialog}
                handleOKEditClose={this.handleOKEditClose}
                item={item}
              />
            )}

            {shouldOpenConfirmationDialog && (
              <ConfirmationDialog
                title={t("confirm")}
                open={shouldOpenConfirmationDialog}
                onConfirmDialogClose={this.handleDialogClose}
                onYesClick={this.handleConfirmationResponse}
                text={t('DeleteConfirm')}
                Yes={t('general.Yes')}
                No={t('general.No')}
              />
            )}
          </div>
          <MaterialTable
            title={t('List')}
            data={itemList}
            columns={columns}
            //parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
            parentChildData={(row, rows) => {
              var list = rows.find(a => a.id === row.parentId);
              return list;
            }}
            options={{
                selection: true,
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
              // this.setState({selectedItems:rows});
            }}
            actions={[
              {
                tooltip: 'Remove All Selected Users',
                icon: 'delete',
                onClick: (evt, data) => {
                  this.handleDeleteAll(data);
                  alert('You want to delete ' + data.length + ' rows');
                }
              },
            ]}
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
            rowsPerPageOptions={[1, 2, 3, 5, 10, 25, 50, 100]}
            component="div"
            labelRowsPerPage={t('general.rows_per_page')}
            labelDisplayedRows={ ({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
            count={totalElements}
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
        </Grid>
      </div>
    );
  }
}

export default HealthOrgLevelTable;
