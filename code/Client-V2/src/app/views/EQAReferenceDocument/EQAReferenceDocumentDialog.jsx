import {
  Grid,
  DialogActions,
  MuiThemeProvider,
  TextField,
  Button,
  Tooltip,
  Icon,
  Checkbox,
  TablePagination,
  IconButton,
  Dialog,
  FormControl,
  FormControlLabel,
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
import { withStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FileSaver from "file-saver";
import ConstantList from "../../appConfig";
import axios from "axios";
import Select from "@material-ui/core/Select";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import NotificationPopup from "../Component/NotificationPopup/NotificationPopup";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { width } from "dom-helpers";
import ReferenceDocumentFilePopup from "./ReferenceDocumentFilePopup";
import { saveItem, getCurrentUser } from "./EQAReferenceDocumentService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
  //etc you get the idea
});
const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    position: "absolute",
    top: "-15px",
    left: "-30px",
    width: "80px",
  },
}))(Tooltip);
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

class EQAReferenceDocumentDialog extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    rowsPerPage: 5,
    page: 0,
    totalElements: 0,
    shouldOpenEditorDialog: false,
    shouldOpenConfirmationDialog: false,
    selectedItem: {},
    keyword: "",
    shouldOpenSelectSourcePopup: false,
    documents: [],
    shouldOpenSelectOwnerPopup: false,
    isRoleAdmin: false,
  };
  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };
  setRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, page: 0 });
    this.updatePageData();
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  componentDidMount() {}

  handleChange = (event, source) => {
    event.persist();
    let { item } = this.state;
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value,
    });
  };

  handleClick = (event, item) => {
    //alert(item);
    if (item.id != null) {
      this.setState({ selectedValue: item.id, selectedItem: item });
    } else {
      this.setState({ selectedValue: item.id, selectedItem: null });
    }
  };
  handleChangeValue = (event, source) => {
    const name = event.target.name;
    const value = event.target.value;
    let { item } = this.state;
    item[name] = value;
    this.setState({ item: item }, () => {
      this.state.item[name] = value;
    });
  };
  componentWillMount() {
    let { item } = this.props;
    //   console.log(item);
    let { displayName, lastName } = this.state;
    this.setState({ ...this.props.item }, () => {
      // this.state.item = item
    });
  }
  handleDialogClose = () => {
    this.setState({
      shouldOpenSelectSourcePopup: false,
      shouldOpenSelectOwnerPopup: false,
    });
  };
  handleAddRealStateFileItem = () => {
    this.setState({ shouldOpenPopupFile: true });
  };
  handleFilePopupClose = () => {
    this.setState({ shouldOpenPopupFile: false });
  };
  handleSelectFile = (items) => {
    // console.log(items)
    let { documents } = this.state;
    let isCheck = false;
    let listItem = documents;
    if (listItem != null && listItem.length > 0) {
      items.forEach((e) => {
        listItem.push(e);
      });
    } else {
      listItem = items;
    }
    // if (listItem == null) {
    //     // listItem = []
    //     listItem = items
    //     debugger
    // } else {
    // }
    documents = listItem;
    this.setState({ documents }, () => {
      this.handleFilePopupClose();
    });
  };

  handleFormSubmit = () => {
    let { id } = this.state;
    let { t } = this.props;
    if (id) {
      saveItem({ ...this.state })
        .then(() => {
          toast.success(t("mess_edit"));
        })
        .catch(() => {
          toast.error(t("mess_edit_error"));
        });
    } else {
      saveItem({ ...this.state })
        .then(() => {
          toast.success(t("mess_add"));
        })
        .catch(() => {
          toast.error(t("mess_add_error"));
        });
    }
  };
  handleRowDataCellDownloadFile = (rowData) => {
    let file = rowData.file;
    let contentType = rowData.file.contentType;
    let fileName = rowData.file.name;
    const url =
      ConstantList.API_ENPOINT +
      "/api/fileDownload/document/" +
      rowData.file.id;
    axios.get(url, { responseType: "arraybuffer" }).then((successResponse) => {
      let document = successResponse.data;
      let file = new Blob([document], { type: contentType });
      return FileSaver.saveAs(file, fileName);
    });
  };

  handleRowDataCellDeleteFile = (rowData) => {
    let { documents } = this.state;

    // let documents = this.state.documents;
    for (let index = 0; index < documents.length; index++) {
      const item = documents[index];
      if (rowData && item && rowData.id === item.id) {
        documents.splice(index, 1);
        documents = documents;
        this.setState({ documents: documents });
        break;
      }
    }
  };
  handleRowDataCellChange = (rowData, event) => {
    let { t } = this.props;
    let item = this.props.item;
    if (item.documents != null && item.documents.length > 0) {
      item.documents.forEach((element) => {
        if (
          element.tableData != null &&
          rowData != null &&
          rowData.tableData != null &&
          element.tableData.id == rowData.tableData.id
        ) {
          if (event.target.name === "description") {
            element.description = event.target.value;
          }
        }
      });
      this.setState({ item: item }, () => {});
    }
  };

  render() {
    const {
      t,
      i18n,
      handleClose,
      handleSelect,
      selectedItem,
      open,
      isRoleAdmin,
      isView,
      item,
    } = this.props;
    let searchOwnerType = { pageIndex: 1, pageSize: 1000000 };
    let { id, description, documents } = this.state;
    const selectForValue = { select: 1, add: 2 };
    let columnsAssetFile = [
      {
        title: t("general.stt"),
        field: "code",
        width: "50px",
        align: "center",
        headerStyle: {
          paddingLeft: "10px",
          paddingRight: "10px",
        },
        render: (rowData) => rowData.tableData.id + 1,
      },
      {
        title: t("file.name"),
        field: "file.name",
        align: "left",
        width: "250px",
      },
      {
        title: t("file.description"),
        field: "description",
        align: "left",
        width: "250px",
        render: (rowData) => (
          <TextValidator
            className="w-100"
            onChange={(event) => this.handleRowDataCellChange(rowData, event)}
            multiLine
            rowsMax={3}
            disabled={!isRoleAdmin}
            type="text"
            name="description"
            value={rowData.description}
            size="small"
          />
        ),
      },
      {
        title: t("general.action"),
        field: "valueText",
        width: "150px",
        render: (rowData) => (
          <div className="none_wrap">
            <LightTooltip
              title={t("general.download")}
              placement="top"
              enterDelay={300}
              leaveDelay={200}
            >
              <IconButton
                size="small"
                onClick={() => this.handleRowDataCellDownloadFile(rowData)}
              >
                <Icon fontSize="small" color="primary">
                  download
                </Icon>
              </IconButton>
            </LightTooltip>
            {isRoleAdmin && (
              <LightTooltip
                title={t("general.deleteIcon")}
                placement="top"
                enterDelay={300}
                leaveDelay={200}
              >
                <IconButton
                  size="small"
                  onClick={() => this.handleRowDataCellDeleteFile(rowData)}
                >
                  <Icon fontSize="small" color="error">
                    delete
                  </Icon>
                </IconButton>
              </LightTooltip>
            )}
          </div>
        ),
      },
    ];
    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"md"}
        fullWidth={true}
      >
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            <span className="mb-20 styleColor">
              {" "}
              {id ? t("update") : t("Add")}{" "}
            </span>
            <IconButton
              style={{ position: "absolute", right: "10px", top: "10px" }}
              onClick={() => handleClose()}
            >
              <Icon color="error" title={t("close")}>
                close
              </Icon>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid className="mt-8" container spacing={2}>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("referenceDocument.description")}
                    </span>
                  }
                  onChange={this.handleChange}
                  disabled={isView}
                  type="text"
                  name="description"
                  size="small"
                  variant="outlined"
                  value={description}
                  validators={["required"]}
                  errorMessages={[t("general.errorMessages_required")]}
                />
              </Grid>
              {isRoleAdmin && (
                <Grid item md={12} sm={12} xs={12}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={this.handleAddRealStateFileItem}
                  >
                    {t("file.addFile")}
                  </Button>
                  {this.state.shouldOpenPopupFile && (
                    <ReferenceDocumentFilePopup
                      open={this.state.shouldOpenPopupFile}
                      handleClose={this.handleFilePopupClose}
                      handleSelect={this.handleSelectFile}
                      t={t}
                      i18n={i18n}
                    />
                  )}
                </Grid>
              )}
              <Grid item md={12} sm={12} xs={12} className="mt-16">
                <MaterialTable
                  data={documents ? documents : []}
                  columns={columnsAssetFile}
                  options={{
                    toolbar: false,
                    selection: false,
                    actionsColumnIndex: -1,
                    paging: false,
                    search: false,
                    padding: "dense",
                    rowStyle: (rowData) => ({
                      backgroundColor:
                        rowData.tableData.id % 2 === 1 ? "#EEE" : "#FFF",
                    }),
                    headerStyle: {
                      backgroundColor: "#358600",
                      color: "#fff",
                    },
                    maxBodyHeight: "290px",
                    minBodyHeight: "290px",
                  }}
                  components={{
                    Toolbar: (props) => (
                      <div style={{ width: "100%" }}>
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
          <DialogActions spacing={4} className="flex flex-end flex-middle">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.props.handleClose()}
            >
              {t("Cancel")}
            </Button>
            {!isView && (
              <Button variant="contained" color="primary" type="submit">
                {t("Save")}
              </Button>
            )}
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}
export default EQAReferenceDocumentDialog;
