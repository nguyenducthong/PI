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
// import FormControl from "@material-ui/core/FormControl";
import ConstantList from "../../appConfig";
import axios from "axios";
import Select from "@material-ui/core/Select";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import NotificationPopup from "../Component/NotificationPopup/NotificationPopup";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { width } from "dom-helpers";
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import IntroduceTheProgramFilePoup from "./IntroduceTheProgramFilePoup";
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
//File dính kèm của thông báo
class IntroduceTheProgramDialogAttachment extends React.Component {
  constructor(props) {
    super(props);
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
    keyword: "",
    shouldOpenNotificationPopup: false,
    shouldOpenSelectBuildingPopup: false,
    shouldOpenSelectSourcePopup: false,
    roles: [],
    listRole: [],
    selectFor: 2,
    displayName: "",
    lastName: "",
    firstName: "",
    fullAddress: "",
    codeOwner: "",
    owner: null,
    documents: [],
    shouldOpenSelectOwnerPopup: false,
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
      // this.state.item['displayName']= fillName;
    });
  };
  componentWillMount() {
    let { item } = this.props;

    let { displayName, lastName } = this.state;
    this.setState({ item: item }, () => {
      this.state.item = item;
    });
  }
  handleDialogClose = () => {
    this.setState({
      shouldOpenNotificationPopup: false,
      shouldOpenSelectBuildingPopup: false,
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
    let { item } = this.state;
    let isCheck = false;
    let listItem = item["documents"];
    if (listItem == null) {
      listItem = [];
      listItem = items;
    } else {
      if (listItem != null && listItem.length > 0) {
        items.forEach((e) => {
          listItem.push(e);
        });
      }
    }

    item["documents"] = listItem;
    this.setState({ item: item }, () => {
      this.handleFilePopupClose();
    });
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
    let { item } = this.state;

    let documents = item.documents;
    for (let index = 0; index < documents.length; index++) {
      const item = documents[index];
      if (rowData && item && rowData.id === item.id) {
        documents.splice(index, 1);
        item["documents"] = documents;
        this.setState({ item: item });
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
      this.setState({ item: item }, () => {
      });
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
      item,
    } = this.props;
    let searchOwnerType = { pageIndex: 1, pageSize: 1000000 };
    let {} = this.state;
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
            {!this.props.isRoleAdmin && (
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
      <React.Fragment style={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid item md={12} sm={12} xs={12}>
            {!this.props.isRoleAdmin && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={this.handleAddRealStateFileItem}
              >
                {t("file.addFile")}
              </Button>
            )}
            {this.state.shouldOpenPopupFile && (
              <IntroduceTheProgramFilePoup
                open={this.state.shouldOpenPopupFile}
                handleClose={this.handleFilePopupClose}
                handleSelect={this.handleSelectFile}
                t={t}
                i18n={i18n}
              />
            )}
          </Grid>
          <Grid item md={12} sm={12} xs={12} className="mt-16">
            <MaterialTable
              data={this.state.item.documents ? this.state.item.documents : []}
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
      </React.Fragment>
    );
  }
}
export default IntroduceTheProgramDialogAttachment;
