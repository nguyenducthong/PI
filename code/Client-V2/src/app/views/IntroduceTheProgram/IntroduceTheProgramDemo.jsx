import React, { Component } from "react";
import {
  FormControl,
  Input,
  Radio,
  InputAdornment,
  Grid,
  TextField,
  IconButton,
  Icon,
  Button,
} from "@material-ui/core";
import moment from "moment";
import {
  getItemActive,
  searchByPageMessage,
} from "./IntroduceTheProgramService";
import { getItemActiveMessage as getContentMessage } from "./IntroduceTheProgramService";
import IntroduceTheProgramFileDownload from "./IntroduceTheProgramFileDownload";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

//Đây là bảng thông báo
class IntroduceTheProgramDemo extends Component {
  state = {
    item: {},
    data: [],
    contentMessage: "",
    shouldOpenFileDownLoad: false,
    shouldOpenShowMessage: false,
    pageIndex: 1,
    pageSize: 10,
    checkBtn: true,
    dataTest: []
  };
  componentDidMount() {
    getItemActive().then(({ data }) => {
      this.setState({ content: data.content, item: data });
      document.getElementById("content").innerHTML =
        "<div>" + data.content ? data.content : "" + "</div>";
    });

    // getContentMessage().then(({ data}) => {
    //   document.getElementById("messageContent").innerHTML =
    //     "<div>" + data.content ? data.content : "" + "</div>";
    // })
    this.updatePageData();
    
  }
  updatePageData = () => {
    let searchObject = {
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize,
    };

    searchByPageMessage({
      pageIndex: this.state.pageIndex + 1,
      pageSize: this.state.pageSize ,
    }).then(({ data }) => {
      this.setState({ dataTest: data.content }, () => {});
    });
    
    searchByPageMessage(searchObject).then(({ data }) => {
      this.setState({ data: data.content }, () => {});
    });
  };
  handleOpenFileDownload = (event, item) => {
    this.setState({
      item: item,
      shouldOpenFileDownLoad: true,
    });
  };
  handleCloseFileDownload = () => {
    this.setState({
      shouldOpenFileDownLoad: false,
      shouldOpenShowMessage: false,
    });
  };
  shouldOpenShowMessage = (content) => {
    this.setState({
      contentMessage: content,
      shouldOpenShowMessage: true,
    });
  };
  handelNextPage = () => {
    this.setState(
      {
        pageIndex: this.state.pageIndex + 1,
      },
      () => {
        this.componentDidMount();
      }
    );
  };
  handelPrePage = () => {
    this.setState(
      {
        pageIndex: this.state.pageIndex - 1,
      },
      () => {
        this.componentDidMount();
      }
    );
  };
  render() {
    let { data } = this.state;
    let {dataTest} = this.state;
    let checkNext = dataTest.length;
    let { t } = this.props;
    return (
      <div>
        <Grid container spacing={5}>
          <Grid item lg={7} md={7} sm={12} xs={12} id="content"></Grid>
          <Grid item lg={5} md={5} sm={12} xs={12}>
            <h2 className="ql-align-center">
              <strong style={{ color: "rgb(0, 102, 204)", textTransform: "uppercase" }}>
                {t("newMessage")}
              </strong>
            </h2>
            {Array.isArray(data) && data.length > 0 && (
              <Grid>
                <ul style={{ paddingLeft: 0 }}>
                  {this.state.data.map((row, index) => {
                    return (
                      <li
                        style={{
                          listStyle: "none",
                          padding: "0px 16px",
                          borderBottom: "1px dotted #ccc",
                          cursor: "pointer",
                          height: 60,
                        }}
                        className="list-item w-100"
                        onClick={(event) =>
                          this.handleOpenFileDownload(event, row)
                        }
                      >
                        <div style={{ display: "flex", height: "100%", paddingTop: 10}} class="w-100">
                          <div
                            style={{
                              width: "10%",
                              paddingTop: 10,
                            }}
                          >
                            <h6>
                              <span
                                style={{
                                  fontSize: 16,
                                  fontWeight: "400",
                                  color: "rgb(0, 102, 204)",
                                  height: 60,
                                }}
                              >
                                <ArrowForwardIcon size="small" color="primary"/>
                              </span>
                            </h6>
                          </div>
                          <div style={{ width: "90%" }}>
                            <h3 style={{ width: "100%" }}>
                              <a
                                style={{
                                  width: "100%",
                                  color: "rgb(0, 102, 204)",
                                  fontWeight: "400",
                                  lineHeight: "1",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "block",
                                  fontSize: 16,
                                  height: 20,
                                  paddingTop: 5
                                }}
                              >
                                {row.name}
                              </a>
                            </h3>
                            <h6>
                              <span style={{ color: "#a4b0be", fontWeight: 300 }}>
                                Thông báo -{" "}
                                {moment(row.createDateTime).format(
                                  "DD/MM/YYYY"
                                )}
                              </span>
                            </h6>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex flex-end flex-middle mt-30">
                  {this.state.pageIndex > 1 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handelPrePage}
                      className="mr-16"
                    >
                      {t("back")}
                    </Button>
                  )}
                  {checkNext > 0 && (<Button
                    variant="contained"
                    color="primary"
                    onClick={this.handelNextPage}
                  >
                    {t("next")}
                  </Button>)}
                </div>
              </Grid>
            )}
            <Grid id="messageContent"></Grid>
          </Grid>
        </Grid>
        {/* <div className="flex flex-end flex-middle">
          <Button variant="contained" color="primary" onClick={this.handleOpenFileDownload}>
            {t("Intro.download")}
          </Button>
        </div> */}
        {this.state.shouldOpenFileDownLoad && (
          <IntroduceTheProgramFileDownload
            open={this.state.shouldOpenFileDownLoad}
            item={this.state.item}
            t={t}
            handleClose={this.handleCloseFileDownload}
          />
        )}
        {/* <ShowMessageContentDialog
          open={this.state.shouldOpenShowMessage}
          item={this.state.item}
          t={t}
          handleClose={this.handleCloseFileDownload}
        /> */}
      </div>
    );
  }
}

export default IntroduceTheProgramDemo;
