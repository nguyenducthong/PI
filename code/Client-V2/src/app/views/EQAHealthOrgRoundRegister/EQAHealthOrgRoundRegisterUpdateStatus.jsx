import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  Input, Icon, IconButton
} from "@material-ui/core";
import {
    updateSubscriptionStatus
  } from "./EQAHealthOrgRoundRegisterService";
import {TabList,Tabs, Tab,TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { toast } from 'react-toastify';
import LocalConstants from "./Constants";
import DialogActions from '@material-ui/core/DialogActions';
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { ValidatorForm, TextValidator, TextField } from "react-material-ui-form-validator";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import 'react-toastify/dist/ReactToastify.css';
import '../../../styles/views/_style.scss';
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit:3
});

function PaperComponent(props) {
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
  }

class EQAHealthOrgRoundRegisterUpdateStatus  extends Component{
    state = {
        status: 0,
        feeStatus: 0

      };
      handleChange = (event, source) => {
        event.persist();
        this.setState({
          [event.target.name]: event.target.value
        });
       if(source === "hasResult"){
        this.setState({hasErrorResult: false});
       }
   
      };

      handleFormSubmit = () => {
        let { t } = this.props;
        let { status, feeStatus, healthOrg }=  this.state;
        healthOrg.forEach(element => {
            element.status = status;
            element.feeStatus = feeStatus;
        });

        updateSubscriptionStatus(healthOrg).then(() =>{
            toast.success(t("mess_update"));
            // this.props.handleOKEditClose();
        })
      };

    componentDidMount(){
        //let healthOrg = {};
        
    }
    componentWillMount() {
        let { handleClose, item } = this.props;
        this.setState({
          healthOrg : item
        });

      }

    render() {
        let {
            status,
            feeStatus,
        } =  this.state;
        let { open, handleClose, handleOKEditClose, t, i18n, item } = this.props;

        return (
            <Dialog 
                scroll={'paper'} 
                open={open} 
                PaperComponent={PaperComponent} 
                maxWidth={"sm"}
                fullWidth={true}
                >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            <span className="mb-20 styleColor"> {t("update")+ " " + t("Status")} </span>
            <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
              title={t("close")}>
              close
            </Icon>
            </IconButton>
            </DialogTitle>
            <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}
            style={{
                overflowY: "auto",
                display: "flex",
                flexDirection: "column"
            }}>
            <DialogContent dividers>
                <Grid className="mb-16" container spacing={2}>
                <Grid item sm={12} xs={12}>
                    <FormControl className="w-100" size="small" variant = "outlined">
                    <InputLabel htmlFor="feeStatus"><span className="font">{t("EQAHealthOrgRoundRegister.FeeStatus.title")}</span></InputLabel>
                    <Select
                        // name="feeStatus"
                        value={feeStatus}
                        onChange={event => this.handleChange(event)}
                        // input={<Input id="feeStatus" />}
                        inputProps={{
                          id: "feeStatus",
                          name: "feeStatus"
                        }}
                    >
                        <MenuItem value={0}>{t("EQAHealthOrgRoundRegister.FeeStatus.No")}</MenuItem>
                        <MenuItem value={1}>{t("EQAHealthOrgRoundRegister.FeeStatus.Yes")}</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                <Grid item sm={12} xs={12}>
                    <FormControl className="w-100" size="small" variant = "outlined">
                    <InputLabel htmlFor="status"><span className="font">{t("EQAHealthOrgRoundRegister.status")}</span></InputLabel>
                    <Select
                        // name="status"
                        value={status}
                        defaultValue={{ value: 0 }}
                        onChange={event => this.handleChange(event)}
                        // input={<Input id="status" />}
                        inputProps={{
                          id: "status",
                          name: "status"
                        }}
                    >
                        <MenuItem value= {LocalConstants.EQAHealthOrgRoundRegister_Value.new}>{t("EQAHealthOrgRoundRegister.Status.New")}</MenuItem>
                        <MenuItem value= {LocalConstants.EQAHealthOrgRoundRegister_Value.confirmed} >{t("EQAHealthOrgRoundRegister.Status.Confirmed")}</MenuItem>
                        <MenuItem value= {LocalConstants.EQAHealthOrgRoundRegister_Value.cancel_Registration} >{t("EQAHealthOrgRoundRegister.Status.Cancel_Registration")}</MenuItem>
                    </Select>
                    </FormControl>
                </Grid>
                
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                className="mr-36 align-bottom"
                variant="contained"
                color="secondary"
                onClick={() => handleClose()}>{t('general.cancel')}
                </Button>
                <Button className="mr-16 align-bottom"
                variant="contained"
                color="primary"
                type="submit">
                {t('general.save')}
                </Button>
            </DialogActions>
            </ValidatorForm>
      </Dialog>
        )
    }
}

export default EQAHealthOrgRoundRegisterUpdateStatus;