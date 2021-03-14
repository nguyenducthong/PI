import React, { Component, useRef } from "react";
import {
    Dialog,
    Button,
    Grid,
    Checkbox,
    IconButton,
    Icon,
    DialogActions,
    Table, TableRow, TableCell
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import MaterialTable, {
    MTableToolbar,
    Chip,
    MTableBody,
    MTableHeader,
} from "material-table";
import { Helmet } from 'react-helmet';
import { Breadcrumb, ConfirmationDialog } from "egret";
import DialogContent from "@material-ui/core/DialogContent";
import { useTableRowanslation, withTableRowanslation, TableRowans } from "react-i18next";
import Draggable from "react-draggable";
import Paper from "@material-ui/core/Paper";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_style.scss';
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});
const containerStyle = {
    width: 'auto',
    height: '400px'
};

const center = {
    lat: 10.786238,
    lng: 106.6886709
};
class Contact extends React.Component {
    state={
        name: '',
        phone: "",
        email:'',
        message:""
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };
    handleFormSubmit = () =>{
        
    }

    clean = () =>{
        this.setState({name: "", email:"", phone: "", message:"" })
    }

    render() {
        const { t, i18n } = this.props;
        let {
            name,
            phone,
            email,
            message
        } = this.state;
        let TitlePage = t('general.contact');
        return (
            <div className="m-sm-30">
                <div className="mb-sm-30">
                    <Helmet>
                        <title>{TitlePage} | {t("web_site")}</title>
                    </Helmet>
                    <Breadcrumb routeSegments={[{ name: TitlePage }]} />
                </div>

                <Grid container spacing={3} justify="space-between">
                    <Grid item md={12} sm={12} xs={12}>
                        {/* <LoadScript
                            id="script-loader"
                            googleMapsApiKey="AIzaSyBH6QWuk83tEkcgP462pteg8JqW3KqJDL0"

                        >
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={20}
                            >
                            </GoogleMap>
                        </LoadScript> */}
                        {/* <div style={{height: "400px", width: "auto"}}> */}
                            <iframe 
                                style={{width: "100%", height: "400px"}}
                                title="myMap"
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d489.9158909525001!2d106.688671!3d10.786238!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf3c4d6c268064af5!2sVi%E1%BB%87n%20Pasteur%20TP.HCM!5e0!3m2!1svi!2sus!4v1612326756896!5m2!1svi!2sus" >
                            </iframe>
                        
                        {/* </div> */}
                    </Grid>
                    <Grid item md={7} sm={7} xs={12}>
                        <h2 className="mt-8 mb-16" style={{ textAlign: "center" }}>Thông tin liên hệ</h2>
                        <Table>
                            <TableRow>
                                <TableCell style={{ width: "100px" }}>Địa chỉ</TableCell>
                                <TableCell>167 Pasteur
                                Phường 8
                                Quận 3
                                Thành phố Hồ Chí Minh, Việt Nam
                            </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ width: "100px" }}>Email</TableCell>
                                <TableCell>nhantin@pasteurhcm.gov.vn
                            </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ width: "100px" }}>Điện thoại</TableCell>
                                <TableCell>(84) 34.888.6670
                            </TableCell>
                            </TableRow>
                        </Table>
                    </Grid>
                    <Grid item md={5} sm={5} xs={12} spacing={3}>
                        <h2 className="mt-8 mb-16" style={{ textAlign: "center" }}>Liên hệ</h2>
                        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} style={{
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column"
                        }}>
                            <DialogContent >
                            <Grid item container md={12} sm={12} xs={12} spacing={3}>
                            <Grid item xs={12}>
                                    <TextValidator
                                        className="w-100"
                                        label={
                                            <span className="font">
                                                {t("Name")}
                                            </span>
                                        }
                                        onChange={this.handleChange}
                                        name="name"
                                        variant="outlined"
                                        size="small"
                                        value={name}
                                        validators={["required"]}
                                        errorMessages={[t("general.errorMessages_required")]}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextValidator
                                        className="w-100"
                                        label={
                                            <span className="font">
                                                {t("Email")}
                                            </span>
                                        }
                                        onChange={this.handleChange}
                                        name="email"
                                        variant="outlined"
                                        size="small"
                                        value={email}
                                        validators={["required", "isEmail"]}
                                        errorMessages={[t("general.errorMessages_required"), t("general.errorMessages_email_valid")]}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextValidator
                                        className="w-100"
                                        label={
                                            <span className="font">
                                                {t("Phone")}
                                            </span>
                                        }
                                        onChange={this.handleChange}
                                        name="phone"
                                        variant="outlined"
                                        size="small"
                                        value={phone}
                                        validators={["required"]}
                                        errorMessages={[t("general.errorMessages_required")]}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextValidator
                                        className="w-100"
                                        label={
                                            <span className="font">
                                                {t("Message")}
                                            </span>
                                        }
                                        onChange={this.handleChange}
                                        rowsMax={4}
                                        name="message"
                                        variant="outlined"
                                        size="small"
                                        value={message}
                                        validators={["required"]}
                                        errorMessages={[t("general.errorMessages_required")]}
                                    />
                                </Grid>
                            </Grid>
                            </DialogContent>
                            <DialogActions spacing={4} className="flex flex-end flex-middle mr-12">
                    
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit">
                                    {t('send')}
                                </Button>
                            </DialogActions>
                        </ValidatorForm>

                    </Grid>


                </Grid>
            </div>

        )
    }
}

export default Contact;