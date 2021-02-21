import React, { Component } from 'react';
import {
    IconButton,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Icon,
    TablePagination,
    Button,
    Card,
    Grid
} from "@material-ui/core";
import axios from "axios";
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { Breadcrumb, ConfirmationDialog } from "egret";
import UploadImage from "./UploadImage";
import ConstantList from "../../appConfig";
import {getCurrentUser} from "../page-layouts/UserProfileService";
import authService from "../../services/jwtAuthService";
import TabsHealthOrgRegisterForm from "./Tab";

const API_PATH = ConstantList.API_ENPOINT + "/api/fileUpload/";
class IntroduceTheProgram extends Component {
    state = {
        checkAdmin: false,
        open: true, 
        shouldOpenImageDialog: false, 
        shouldOpenPasswordDialog: false,
        checkHealthOrg: false
      };
    handleDialogClose = () => {
        this.setState({
          shouldOpenImageDialog: false
        })
      }
    handleOpenUploadDialog = () => {
        this.setState({
          shouldOpenImageDialog: true
        });
    }
    handleUpdate = (blobValue) => {
        let { t } = this.props;
        const url = ConstantList.API_ENPOINT + "/api/users/updateavatar";
        let formData = new FormData();
        formData.set('uploadfile', blobValue)
        //formData.append('uploadfile',file);//Lưu ý tên 'uploadfile' phải trùng với tham số bên Server side
        const config = {
          headers: {
            'Content-Type': 'image/jpg'
          }
        }
        return axios.post(url, formData, config).then(response => {
          toast.success(t("update_success_message"));
          let user = response.data;
          this.setState({ user: user });
          authService.setLoginUser(user);
          this.handleDialogClose();
        }).catch(() => {
          toast.warning(t("error_update_image"));
        });
    }
    componentWillMount = () => {
        
        getCurrentUser().then(({data}) => {
            data.roles.forEach((role) => {
                if (role.name === "ROLE_ADMIN" || role.name === "ROLE_SUPER_ADMIN") {
                    this.setState({checkAdmin: true});
                }
            })
        })
    }
    render() {
        const { t, i18n } = this.props;
        let {homepage} = this.props;
        return (
            <div className={homepage == undefined ? "m-sm-30" : ""}>
                {homepage == undefined && (<Helmet>
                    <title>
                        {t("Intro.title")} | {t("web_site")}
                    </title>
                </Helmet>)}
                {homepage == undefined && (<div className="mb-sm-30">
                    <Breadcrumb
                        routeSegments={[{ name: t("Dashboard.dashboard"), path: "/dashboard/intro" }, { name: t("Intro.title") }]}
                    />
                </div>)}
                <Grid>
                    <TabsHealthOrgRegisterForm t={t}/>
                </Grid>
            </div>
        );
    }
}

export default IntroduceTheProgram;