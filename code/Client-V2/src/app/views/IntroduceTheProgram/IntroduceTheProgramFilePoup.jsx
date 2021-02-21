import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogActions,
  Card,
  Divider,
  Icon,
  IconButton,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
// import { getAllAssetTypes, addNewOrUpdateAssetType, searchByPage, checkCode } from './AssetTypeService';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import { EgretProgressBar } from "egret";
// import NotificationPopup from '../Component/NotificationPopup/NotificationPopup'
import axios from "axios";
import ConstantList from "../../appConfig";
import FileSaver from "file-saver";
import GetAppSharpIcon from "@material-ui/icons/GetAppSharp";
import CancelIcon from "@material-ui/icons/Cancel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/views/_style.scss";
toast.configure();

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
class IntroduceTheProgramFilePoup extends Component {
  state = {
    name: "",
    code: "",
    content: "",
    description: "",
    shouldOpenImportExcelDialog: false,
    shouldOpenNotificationPopup: false,
    dragClass: "",
    attachments: [],
    files: [],
    statusList: [],
    queProgress: 0,
    progress: 0,
    uploaded: false,
  };

  handleChange = (event, source) => {
    event.persist();
    let { files } = this.state;
    let list = [];
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    files.forEach((el) => {
      // el["name"] = event.target.value
      el.name = event.target.value;
      list.push(el);
    });
    this.setState({
      [event.target.name]: event.target.value,
      files: list,
    });
  };

  componentWillMount() {
    let { open, handleClose } = this.props;
  }
  componentDidMount() {}
  handleDialogClose = () => {
    this.setState({
      shouldOpenNotificationPopup: false,
      shouldOpenImportExcelDialog: false,
    });
  };

  handleOKEditClose = () => {
    this.setState({
      shouldOpenNotificationPopup: false,
      shouldOpenImportExcelDialog: false,
    });
    this.updatePageData();
  };

  handleFileUploadOnSelect = (event) => {
    let files = event.target.files;
    this.fileUpload(files[0]).then((res) => {
      toast.info("Tải tập tin thành công");
      // alert("File uploaded successfully.")
    });
  };
  handleFileSelect = (event) => {
    let files = event.target.files;
    let list = [...this.state.files];

    for (const iterator of files) {
      list.push({
        file: iterator,
        uploading: false,
        error: false,
        progress: 0,
      });
    }

    this.setState({
      files: [...list],
    });
  };

  handleSingleRemove = (index) => {
    let files = [...this.state.files];
    let attachments = [...this.state.attachments];
    files.splice(index, 1);
    attachments.splice(index, 1);
    this.setState(
      {
        files: [...files],
        attachments: [...attachments],
      },
      () => {}
    );
  };

  fileUpload(file) {
    const url =
      ConstantList.API_ENPOINT +
      "/api/file/eQAResultReport/eQAResultReportDocument/uploadattachment";
    let formData = new FormData();
    formData.append("uploadfile", file); //Lưu ý tên 'uploadfile' phải trùng với tham số bên Server side
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return axios.post(url, formData, config).then((successResponse) => {
      let attachment = successResponse.data;
      let { attachments } = this.state;
      if (attachment) {
        attachments.push(attachment);
      }
      this.setState({ attachments });
    });
  }

  uploadSingleFile = (index) => {
    let allFiles = [...this.state.files];
    let file = this.state.files[index];
    this.setState({ progress: 50 });
    this.fileUpload(file.file).then((res) => {
      // alert("File uploaded successfully.")
      this.setState({ uploaded: true });
      toast.info("Tải tập tin thành công");
    });

    allFiles[index] = { ...file, uploading: true, error: false };

    this.setState({
      files: [...allFiles],
    });
  };

  handleViewDocument = (index) => {
    // debugger
    let file = this.state.files[index];
    let contentType = file.file.contentType;
    let fileName = file.file.name;
    const url =
      ConstantList.API_ENPOINT + "/api/fileDownload/document/" + file.file.id;
    axios.get(url, { responseType: "arraybuffer" }).then((successResponse) => {
      let document = successResponse.data;
      let file = null;
      file = new Blob([document], { type: contentType });
      if (file.type == "application/pdf") {
        let fileURL = URL.createObjectURL(file, fileName);
        return window.open(fileURL);
      } else {
        toast.warning("Định dạng tệp tin không thể xem. Hãy tải xuống");
      }
    });
  };
  handleDownloadDocument = (index) => {
    let file = this.state.files[index];
    let contentType = file.file.contentType;
    let fileName = file.file.name;
    const url =
      ConstantList.API_ENPOINT + "/api/fileDownload/document/" + file.file.id;
    axios.get(url, { responseType: "arraybuffer" }).then((successResponse) => {
      let document = successResponse.data;
      let file = new Blob([document], { type: contentType });
      return FileSaver.saveAs(file, fileName);
    });
  };
  render() {
    let {
      open,
      handleClose,
      handleSelect,
      handleOKEditClose,
      t,
      i18n,
    } = this.props;
    let { dragClass, files, queProgress } = this.state;
    let isEmpty = files.length === 0;

    let {
      name,
      code,
      description,
      attachments,
      shouldOpenImportExcelDialog,
      shouldOpenNotificationPopup,
    } = this.state;

    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth={"md"}
        fullWidth
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="mb-20 styleColor">{t("general.saveUpdate")}</span>
        </DialogTitle>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent>
            <Grid className="mb-10" container spacing={1}>
              {/* <Grid item md={12} sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("file.name")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required"]}
                  errorMessages={["This field is required"]}
                  variant="outlined"
                  size="small"
                />
              </Grid> */}
            </Grid>
            <div className="mt-15">
              <div className="flex flex-wrap mb-24 mt-15">
                <label htmlFor="upload-single-file">
                  <Button
                    size="small"
                    className="capitalize"
                    component="span"
                    variant="contained"
                    color="primary"
                  >
                    <div className="flex flex-middle">
                      <span>{t("general.select_file")}</span>
                    </div>
                  </Button>
                </label>
                <input
                  className="display-none"
                  onChange={this.handleFileSelect}
                  id="upload-single-file"
                  type="file"
                />
                <div className="px-16"></div>
              </div>
              <Card className="mb-24" elevation={2}>
                <div className="p-16">
                  <Grid
                    container
                    spacing={2}
                    justify="center"
                    alignItems="center"
                    direction="row"
                  >
                    <Grid item lg={4} md={4}>
                      {t("general.file_name")}
                    </Grid>
                    <Grid item lg={4} md={4}>
                      {t("general.size")}
                    </Grid>
                    <Grid item lg={4} md={4}>
                      {t("general.action")}
                    </Grid>
                  </Grid>
                </div>
                <Divider></Divider>

                {isEmpty && (
                  <p className="px-16 center">{t("general.empty_file")}</p>
                )}

                {files.map((item, index) => {
                  let {
                    file,
                    uploading,
                    error,
                    progress,
                    isEditDocument,
                    contentSize,
                  } = item;
                  return (
                    <div className="px-16 py-16" key={file.name}>
                      <Grid
                        container
                        spacing={2}
                        justify="center"
                        alignItems="center"
                        direction="row"
                      >
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          {file.name}
                        </Grid>
                        {isEditDocument === true ? (
                          <Grid item lg={1} md={1} sm={12} xs={12}>
                            {(file.contentSize / 1024 / 1024).toFixed(1)} MB
                          </Grid>
                        ) : (
                          <Grid item lg={1} md={1} sm={12} xs={12}>
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </Grid>
                        )}
                        {isEditDocument === true ? (
                          <Grid item lg={2} md={2} sm={12} xs={12}>
                            <EgretProgressBar
                              value={100}
                              checked={this.state.uploaded}
                            ></EgretProgressBar>
                          </Grid>
                        ) : (
                          <Grid item lg={2} md={2} sm={12} xs={12}>
                            <EgretProgressBar
                              value={progress}
                              checked={this.state.uploaded}
                            ></EgretProgressBar>
                          </Grid>
                        )}
                        <Grid item lg={1} md={1} sm={12} xs={12}>
                          {error && <Icon color="error">error</Icon>}
                          {/* {uploading && <Icon className="text-green">done</Icon>} */}
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12}>
                          <div className="flex">
                            {!isEditDocument && (
                              <IconButton
                                title={t("general.upload")}
                                onClick={() => this.uploadSingleFile(index)}
                              >
                                <Icon color="primary">cloud_upload</Icon>
                              </IconButton>
                            )}
                            {isEditDocument && (
                              <IconButton
                                title={t("general.viewDocument")}
                                onClick={() => this.handleViewDocument(index)}
                              >
                                <Icon color="primary">visibility</Icon>
                              </IconButton>
                            )}

                            {isEditDocument && (
                              <IconButton
                                title={t("general.downloadDocument")}
                                onClick={() =>
                                  this.handleDownloadDocument(index)
                                }
                              >
                                <Icon color="default">
                                  <GetAppSharpIcon />
                                </Icon>
                              </IconButton>
                            )}
                            <IconButton
                              title={t("general.removeDocument")}
                              onClick={() => this.handleSingleRemove(index)}
                            >
                              <Icon color="error">delete</Icon>
                            </IconButton>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  );
                })}
              </Card>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="flex flex-space-between flex-middle">
              <Button
                variant="contained"
                className="mr-36"
                color="secondary"
                onClick={() => this.props.handleClose()}
              >
                {t("general.cancel")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSelect(this.state.attachments)}
                // type="submit"
              >
                {t("general.save")}
              </Button>
            </div>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default IntroduceTheProgramFilePoup;
