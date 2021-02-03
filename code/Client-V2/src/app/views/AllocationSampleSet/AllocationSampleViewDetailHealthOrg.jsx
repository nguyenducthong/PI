import { InputAdornment, Input, Grid, MuiThemeProvider, TextField, Button, TableHead, TableCell, TableRow, Checkbox, TablePagination, Radio, Dialog } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { searchByPage, deleteItem, saveItem } from "../EQAHealthOrg/EQAHealthOrgService";
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
class AllocationSampleViewDetailHealthOrg extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyWordChange = this.handleKeyWordChange.bind(this);
  }
  state = {
    rowsPerPage: 5,
    page: 0,
    data: [],
    totalElements: 0,
    item:[],
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
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function(){ 
      this.updatePageData();
    }) 
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };
  updatePageData = () => {
    var searchObject = {};
    let { keyword } = this.state;
    if (keyword != null) {
      searchObject.text = keyword.trim();
    }
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    // searchByPage(searchObject).then(({ data }) => {
    //   this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    // }
    // );
  };
  componentDidMount() {
    this.updatePageData(this.state.page, this.state.rowsPerPage);
  }

  handleClick = (event, item) => {
    if (item.id != null) {
      this.setState({ selectedValue: item.id, selectedItem: item });
    } else {
      this.setState({ selectedValue: item.id, selectedItem: null });
    }

  }
  componentWillMount() {
    let {item } = this.props;
    this.setState({ item });
  }
  handleKeyDownEnterSearch = (e) => {
    if (e.key === 'Enter') {
      this.search()
    }
  }
  search = () => {
    var searchObject = {};
    let { keyword } = this.state;
    if (keyword != null) {
      searchObject.text = keyword.trim();
    }
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    // searchByPage(searchObject).then(({ data }) => {
    //   this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    // });
  }

  handleKeyWordChange(event) {
    this.setState({ keyword: event.target.value });
  }

  render() {
    const { t, i18n, handleClose, handleSelect, selectedItem, open } = this.props;
    let { keyword } = this.state;
    let columns = [
      { title: t("EQAHealthOrg.Code"), field: "healthOrg.code", align: "left", width: "150",
      headerStyle: {
        minWidth:"175x",
        paddingLeft: "10px",
        paddingRight: "0px",
      },
      cellStyle: {
        minWidth:"175px",
        paddingLeft: "10px",
        paddingRight: "0px",
        textAlign: "left",
      }, },
      { title: t("EQAHealthOrg.Name"), field: "healthOrg.name", width: "150" },
      { title: t("EQAHealthOrg.Address"), field: "healthOrg.address", align: "left", width: "150" },
    ];
    return (
      <Dialog onClose={handleClose} open={open} PaperComponent={PaperComponent} maxWidth={"md"} >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <h4 className="mb-20">{t("EQAHealthOrg.listtitle")}</h4>
        </DialogTitle>
        <DialogContent dividers>
          <Grid className="mb-16" container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              <MaterialTable data={this.state.item} columns={columns}
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
                headerStyle: {
                  backgroundColor: '#358600',
                  color:'#fff',
                },
                padding: 'dense',
                toolbar: false
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
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            className="mb-16 mr-36 align-bottom"
            variant="contained"
            color="secondary"
            onClick={() => handleClose()}>{t('general.close')}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
export default AllocationSampleViewDetailHealthOrg;