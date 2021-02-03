import {
  InputAdornment,
  Input,
  Grid,
  MuiThemeProvider,
  TextField,
  Button,
  TableHead,
  TableCell,
  TableRow,
  Checkbox,
  TablePagination,
  Radio,
  Dialog, TableContainer, Table, TableBody, IconButton, Icon
} from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader
} from "material-table";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { getHealthOrgByUserId, getCurrentUser } from "./HealthOrgRegisterFormService";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import shortid from "shortid";


function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
class EQAHealthOrgSearchMultipleDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyWordChange = this.handleKeyWordChange.bind(this);
  }
  state = {
    rowsPerPage: 5,
    page: 0,
    data: [],
    result: [],
    totalElements: 0,
    itemList: [],
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    selectedHealthOrg: [],
    keyword: "",
    user: {}
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

  handleCheckboxChange = rowData => {
    let selectedHealthOrg = this.state.selectedHealthOrg;
    if (selectedHealthOrg.some(selected => selected.id === rowData.id)) {
      selectedHealthOrg = selectedHealthOrg.filter(
        selected => selected.id !== rowData.id
      );
    } else {
      selectedHealthOrg.push(rowData);
    }
    this.setState({
      selectedHealthOrg
    });
  };
  updatePageData = () => {
    getCurrentUser().then(({ data }) => {
      this.setState({ user: data }, function () {
        getHealthOrgByUserId(this.state.user.id).then(({ data }) => {
          this.setState({
            itemList: [...data],
          });
        });
      });
    });

  };
  componentWillUnmount() {

  }
  componentDidMount() {

    this.setState({ selectedHealthOrg: this.props.selectedHealthOrg });
    this.updatePageData();

  }

  handleKeyDownEnterSearch = e => {
    if (e.key === "Enter") {
      this.search();
    }
  };
  search = () => {
    let { userId } = this.state.user.id;
    getHealthOrgByUserId(userId).then(({ data }) => {
      this.setState({
        itemList: [...data.content],
        totalElements: data.totalElements
      });
    });
  };

  handleKeyWordChange(event) {
    this.setState({ keyword: event.target.value });
  }

  render() {
    const {
      t,
      i18n,
      handleClose,
      handleSelect,
      selectedHealthOrg,
      open
    } = this.props;
    let { keyword } = this.state;
    let columns = [
      {
        title: t("Select"),
        field: "custom",
        align: "left",
        width: "150",
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
        render: rowData => (
          <Checkbox
            checked={this.state.selectedHealthOrg.some(
              selected => selected.id === rowData.id
            )}
            onChange={() => this.handleCheckboxChange(rowData)}
          />
        )
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
      }
    ];
    return (
      <Dialog
        onClose={handleClose}
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"md"}
        fullWidth={true}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <h4 className="mb-20">{t("PleaseSelect")}</h4>
        </DialogTitle>

        <DialogContent dividers>
          <Grid className="mb-16" container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              {this.state.itemList && (
                <MaterialTable data={this.state.itemList} columns={columns}
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
              )}
            </Grid>
          </Grid>

          {/* <Grid className="mb-16" container spacing={2}>
            <Grid item md={12} sm={12} xs={12} style={{ marginLeft: "30%" }}>
              <Grid item md={12} sm={12} xs={12}>
                <Input
                  label={t("EnterSearch")}
                  type="text"
                  name="keyword"
                  value={keyword}
                  onChange={this.handleKeyWordChange}
                  onKeyDown={this.handleKeyDownEnterSearch}
                  className="w-100 mb-16 mr-10 ml-10"
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
                            right: "0"
                          }}
                        />
                      </Link>
                    </InputAdornment>
                  }
                />
              </Grid>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <TableContainer>
                <Table className="crud-table" style={{ whiteSpace: "pre", minWidth: "750px" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('Name')}</TableCell>
                      <TableCell>{t('Code')}</TableCell>
                      <TableCell>{t('Action')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.itemList
                      .map((item, index) => (
                        <TableRow key={shortid.generate()}>
                          <TableCell className="px-0">{item.name}</TableCell>
                          <TableCell className="px-0" align="left">
                            {item.code}
                          </TableCell>

                          <TableCell className="px-0 border-none">
                            <IconButton
                              // onClick={() =>
                              //   this.handleEditAdministrativeUnit(adminUnit)
                              // }
                            >
                              <Icon color="primary">edit</Icon>
                            </IconButton>
                            <IconButton onClick={() => this.handleDeleteAdministrativeUnit(adminUnit.id)}>
                              <Icon color="error">delete</Icon>
                            </IconButton> 
                          </TableCell>

                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid> */}
        </DialogContent>

        <DialogActions>
          <Button
            className="mb-16 mr-8 align-bottom"
            variant="contained"
            color="secondary"
            onClick={() => handleClose()}
          >
            {t("general.cancel")}
          </Button>
          <Button
            className="mb-16 mr-16 align-bottom"
            variant="contained"
            color="primary"
            onClick={() => handleSelect(this.state.selectedHealthOrg)}
          >
            {t("general.select")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default EQAHealthOrgSearchMultipleDialog;
