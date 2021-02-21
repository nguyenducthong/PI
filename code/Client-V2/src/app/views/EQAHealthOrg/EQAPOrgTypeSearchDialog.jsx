import { InputAdornment, Input, Grid, MuiThemeProvider, TextField, Button, TableHead, TableCell, TableRow, Checkbox, TablePagination, Radio, Dialog } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { searchByPage, deleteItem, saveItem } from "../EQAHealthOrgType/EQAHealthOrgTypeService";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
class EQAPOrgTypeSearchDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyWordChange = this.handleKeyWordChange.bind(this);
  }
  state = {
    rowsPerPage: 5,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    selectedItem: {},
    keyword: ''
  };

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

  componentDidMount() {
    this.updatePageData(this.state.page, this.state.rowsPerPage);
  }

  handleClick = (event, item) => {
    //alert(item);
    if (item.id != null) {
      this.setState({ selectedValue: item.id, selectedItem: item });
    } else {
      this.setState({ selectedValue: item.id, selectedItem: null });
    }

  }
  componentWillMount() {
    let { open, handleClose, selectedItem } = this.props;
    //this.setState(item);
    this.setState({ selectedValue: selectedItem.id });
  }

  handleKeyWordChange(event) {
    this.setState({ keyword: event.target.value });
  }
  handleKeyDownEnterSearch = (e) => {
    if (e.key === 'Enter') {
      this.search()
    }
  }
  render() {
    const { t, i18n, handleClose, handleSelect, selectedItem, open } = this.props;
    let { 
      keyword,
      itemList,
      totalElements,
      rowsPerPage,
      page
    } = this.state;
    let columns = [
      { title: t("Name"), field: "name", width: "150" },
      { title: t("Code"), field: "code", align: "left", width: "150" },

      {
        title: t("Action"),
        field: "custom",
        align: "left",
        width: "250",
        render: rowData => <Radio name="radSelected" value={rowData.id} checked={this.state.selectedValue === rowData.id} onClick={(event) => this.handleClick(event, rowData)}
        />
      },
    ];
    return (
      <Dialog onClose={handleClose} open={open} PaperComponent={PaperComponent}>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <span className="mb-20">{t("EQAHealthOrg.HealthOrgType")}</span>
        </DialogTitle>
        <DialogContent dividers>
        <Grid className="mb-16" container spacing={2}>
            <Grid item md={12} sm={12} xs={12} style={{ marginLeft: '30%' }}>
              <Grid item md={12} sm={12} xs={12}>
                <Input
                  label={t('EnterSearch')}
                  type="text"
                  name="keyword"
                  value={keyword}
                  onChange={this.handleKeyWordChange}
                  onKeyDown={this.handleKeyDownEnterSearch}
                  className="w-100 mb-16 mr-10 ml-10 stylePlaceholder"
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
            <Grid item md={12} sm={12} xs={12}>
              <MaterialTable title={t("EQAHealthOrg.EQAPlanningList")} data={this.state.itemList} columns={columns}
                parentChildData={(row, rows) => {
                  var list = rows.find(a => a.id === row.parentId);
                  return list;
                }}
                options={{
                  toolbar: false,
                  selection: false,
                  actionsColumnIndex: -1,
                  paging: false,
                  search: false
                }}
                components={{
                  Toolbar: props => (
                    <div style={{ witdth: "100%" }}>
                      <MTableToolbar {...props} />
                    </div>
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
        </DialogContent>
        <DialogActions>
          <Button
            className="mb-16 mr-36 align-bottom"
            variant="contained"
            color="secondary"
            onClick={() => handleClose()}>{t('general.cancel')}
          </Button>
          <Button className="mb-16 mr-16 align-bottom"
            variant="contained"
            color="primary"
            onClick={() => handleSelect(this.state.selectedItem)}>
            {t('general.select')}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
export default EQAPOrgTypeSearchDialog;