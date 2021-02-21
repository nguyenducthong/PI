import React, { Component } from "react";
import {
  Grid,
  IconButton,
  Icon,
  TablePagination,
  Button,
  FormControl,
  Input,
  InputAdornment
} from "@material-ui/core";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { getAllEQAHealthOrgTypes, deleteItem, searchByPage, getItemById } from "./EQAHealthOrgTypeService";
import EQAHealthOrgTypeEditorDialog from "./EQAHealthOrgTypeEditorDialog";
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

class EQAHealthOrgTypeTable extends Component {
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
      if(this.state.keyword != ""){
        searchObject.text = this.state.keyword.trim();
      }
      searchObject.pageIndex = this.state.page + 1;
      searchObject.pageSize = this.state.rowsPerPage;
      searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
        this.setState({ itemList: [...data.content], totalElements: data.totalElements })
      });
    });
  }

  updatePageData = () => {
    var searchObject = {};
    if(this.state.keyword != ""){
      searchObject.text = this.state.keyword.trim();
    }
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    }
    );
  };
 
  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false
    });
    this.updatePageData();
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
      toast.success(t("EQAHealthOrgTypeTable.notify.deleteSuccess"));
    }).catch(()=>{
      toast.warning(t('EQAHealthOrgTypeTable.notify.error'));
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
    let {t} = this.props;
    for (var i = 0; i < list.length; i++) {
      await deleteItem(list[i].id).then((res) => {
          toast.success(t("EQAHealthOrgTypeTable.notify.deleteSuccess") + " " + list[i].code);
          this.updatePageData();
          this.handleDialogClose();
      }).catch((err) => {
        toast.warning(t('EQAHealthOrgTypeTable.notify.error'));
        this.handleDialogClose();
      });
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
        }, 
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
      { title: t("Code"), field: "code", align: "left", width: "150",
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
        }, 
      },
      { title: t("Name"), field: "name", width: "150", 
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
        }, 
      },
      { title: t("Description"), field: "description", align: "left", width: "150",
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
        }, 
      },
      
    ];

    return (
      <div className="m-sm-30">

        <div className="mb-sm-30">
        <Helmet>
          <title>{t("EQAHealthOrgTypeTable.title")} | {t("web_site")}</title>
        </Helmet>
          <Breadcrumb routeSegments={[{ name: t("category"), path: "/directory/apartment" },{ name: t('EQAHealthOrgTypeTable.title') }]} />
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
            <FormControl fullWidth>
              <Input
                label={t('EnterSearch')}
                className="mb-16 mr-10 stylePlaceholder"
                type="text"
                name="keyword"
                value={keyword}
                onKeyDown={this.handleKeyDownEnterSearch}
                onChange={this.handleTextChange}
                placeholder={t('general.enterSearch')}
                startAdornment={
                  <InputAdornment >
                    <Link to="#"> <SearchIcon
                      onClick={() => this.search(keyword)}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0"
                      }} /></Link>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div>
            {shouldOpenEditorDialog && (
              <EQAHealthOrgTypeEditorDialog t={t} i18n={i18n}
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
            //     tooltip: 'Remove All Selected Users',
            //     icon: 'delete',
            //     onClick: (evt, data) => {
            //       this.handleDeleteAll(data);
            //       alert('You want to delete ' + data.length + ' rows');
            //     }
            //   },
            // ]}
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

export default EQAHealthOrgTypeTable;
