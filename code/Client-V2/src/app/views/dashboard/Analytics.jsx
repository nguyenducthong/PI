import React, { Component, Fragment } from "react";
import {
  Grid,
  Card,
  Icon,
  IconButton,
  Button,
  Checkbox,
  Fab,
  Avatar,
  Hidden,
  TextField
} from "@material-ui/core";
import { Breadcrumb, SimpleCard, EgretProgressBar } from "egret";
import DashboardWelcomeCard from "../cards/DashboardWelcomeCard";
import DashboardWelcomeHealthOrgCard from "../cards/DashboardWelcomeHealthOrgCard";
import AreaChart from "../charts/echarts/AreaChart";
import { format } from "date-fns";
import ModifiedAreaChart from "./ModifiedAreaChart";
import { withStyles } from "@material-ui/styles";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import ConstantList from "../../appConfig";
import JwtAuthService from "../../services/jwtAuthService";
import { Helmet } from "react-helmet";
import ReactEcharts from "echarts-for-react";
// import HomePage from "../HomePage/HomePage";
// import Tab from "../IntroduceTheProgram/Tab";

import {
  getCurrentUser,
  getEQARound,
  countSampleTubeByEQARound
} from "./DashboardService";
import Autocomplete from "@material-ui/lab/Autocomplete";
//let isAdmin=false;
class Dashboard1 extends Component {
  state = {
    user: {},
    isAdmin: false,
    isHealthOrg: false,
    isUser: false,
    numberOfEQARound: 0,
    eqaRoundList: [],
    pieChartData: []
  };
  constructor(props) {
    super(props);
  }
  checkIsAdmin = ()=>{
    this.setState({isAdmin:false})
    if(this.state.user!=null && this.state.user.roles!=null && this.state.user.roles.length>0){
      this.state.user.roles.forEach(element => {
        if(element.name=='ROLE_ADMIN'){
          this.setState({isAdmin:true})
          return true;
        }
      });
    }
  }
 
  async componentWillMount() {
    let  user=JwtAuthService.getLoginUser();
    if (user != null && user.roles != null && user.roles.length > 0) {
 
      this.setState({
        isHealthOrg: false,
        isAdmin: false,
        isUser: false
      });      
      user.roles.forEach(role => {      
        if (role.name == "ROLE_ADMIN") {
          this.setState({ isAdmin: true });
        } else if (role.name == "ROLE_HEALTH_ORG") {
          this.setState({ isHealthOrg: true });
        } else if (role.name == "ROLE_USER") {
          this.setState({ isUser: true });
        } 
      });
    }
    var pieChartData = null;
    this.setState({
      pieChartData
    });
  }

  render() {
    
    let { theme, t, i18n } = this.props;
    //this.checkIsAdmin();
    let isAdmin = this.state.isAdmin;
    const {
      pieChartData
    } = this.state;
    
    return (
      <div className="analytics m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>
              {t("Dashboard.dashboard")} | {t("web_site")}
            </title>
          </Helmet>

          <div className="mb-sm-30">
            <Breadcrumb routeSegments={[{ name: t("Dashboard.dashboard") }]} />
          </div>
        </div>
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} sm={12} xs={12}>   
          <DashboardWelcomeHealthOrgCard t={t}/>
          {/* {isAdmin && (
            <Tab t={t}/>
          )}
          {!isAdmin && (
            <HomePage t={t} />
          )} */}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles({}, { withTheme: true })(Dashboard1);
