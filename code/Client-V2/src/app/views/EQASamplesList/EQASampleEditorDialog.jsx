import React, { Component } from "react";
import {
    Dialog,
    Button,
    Grid,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Input,
    InputLabel,
    MenuItem,
    FormControl,TextField,
    Select, FormHelperText, IconButton, Icon
} from "@material-ui/core";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    DateTimePicker
} from "@material-ui/pickers";
import { getAll } from "../Personnel/PresonnelService";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import DateFnsUtils from "@date-io/date-fns";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { checkCode, deleteItem, saveItem, getItemById,updateEQASampleList,addNewEQASampleList } from "./EQASampleListService";
import { searchByPage as searchByPageEQARound } from "../EQARound/EQARoundService";
import Draggable from 'react-draggable';
import EQASerumBottleSelectMultiple from '../Component/EQASerumBottle/EQASerumBottleSelectMultiple';
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TabsSample from "./Tabs";
import { result } from "lodash";

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
function MaterialButton(props) {
    const item = props.item;
    return (
      <div>
        <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
          <Icon fontSize="small" color="error">delete</Icon>
        </IconButton>
      </div>
    );
  }
function OriginnalResult(props) {
    const { t, i18n } = useTranslation();
    const item = props.item;
    let hivStatus = null;
    let str = "";
    if (item) {
        hivStatus = item.hivStatus == 1 ? true : false;
        str = t('eQASerumBottle.hivStatus.' + item.hivStatus);
    }

    if (hivStatus && hivStatus == true) {
        return <small className="border-radius-4 bg-primary text-white px-8 py-2 ">{str}</small>;
    }
    else {
        return <small className="border-radius-4 bg-light-gray px-8 py-2 ">{str}</small>;
    }
}

class EQASampleEditorDialog extends Component {
    constructor(props){
        super(props);
        getAll().then(result =>{
          let listPersonnel = result.data;
          this.setState({listPersonnel: listPersonnel});
        })
      }
    state = {
        name: "",
        code: "",
        eqaSampleBottles: [],
        thrombinAddedDate: new Date(),
        removeFibrinDate: new Date(),
        centrifugeDate: new Date(),
        shouldOpenConfirmationDialog: false,
        shouldOpenPopupSelectEQASerumBottle: false,
        errMessageBottle : "",
        errMessageCode : "",
        round: [],
        result: null,
        isView: false
    };

    handleChange = (event, source) => {
        event.persist();
        if (source === "active") {
            this.setState({hasErrorResult: false});
        }
        if (source === "hasErrorSample") {
            this.setState({hasErrorSample: false});
        }
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleDelete = rowData => {
        let eqaSampleBottles = this.state.eqaSampleBottles;
        for (let index = 0; index < eqaSampleBottles.length; index++) {
            const item = eqaSampleBottles[index]
            if (
              rowData &&
              item &&
              rowData.id === item.id
            ) {
                eqaSampleBottles.splice(index, 1)
              this.setState({ eqaSampleBottles })
              break
            }
          }
     
      };
    handleSelectEQARound = (item) => {
        this.setState({ round: item });
        let numberSampleList = [];
        if(item != null && item.numberSampleList != null){
            for(let i = 0 ; i < item.numberSampleList; i++){
                numberSampleList.push({id: i+1,
                name: i+1});
            }
            this.setState({numberSampleList:numberSampleList});
        }else{
            this.setState({numberSampleList: null});
        }
        
      }
    handleFormSubmit = () => {
        const { t, i18n } = this.props;
        let { id,item,  listPersonnel} = this.state;
        this.setState({hasErrorResult: false,hasErrorSample: false, hasErrorPerson: false});
        // console.log(this.state.item.result);
        if( (typeof this.state.item.result == "undefined") || this.state.item.result === null){
            item["hasErrorResult"] = true;
            this.setState({item: item});
            return;
        } else 
        if(typeof this.state.item.inactiveVirus == "undefined" || this.state.item.inactiveVirus === null){
            item["hasErrorVirus"] = true;
            this.setState({item: item});
            return;
        }else if (typeof this.state.item.personnel == "undefined" || this.state.item.personnel === null){
            item["hasErrorPerson"] = true;
            this.setState({item: item});
            return;
        }else {
            if(item != null && item.eqaSampleBottles != null && item.eqaSampleBottles.length >0) {
                let objPerson = listPersonnel.find(element => element.id == item.personnel);
                item.personnel = objPerson;
                if(typeof item.isManualSetCode != "undefined" && item.isManualSetCode){
                    checkCode(id, item.code).then(res =>{
                        if (res.data) {
                            toast.warning(t("mess_code"));
                          } else{
                            if (id) {
                                // this.setState({isView: true});
                                saveItem({
                                    ...this.state.item
                                }).then((response) => {
                                    if(response.data != null && response.status == 200){
                                        item.personnel = response.data.personnel.id
                                        this.setState({...item})
                                        toast.success(t('mess_edit'));
                                    }
                                    // this.props.handleOKEditClose();
                                }).catch(err =>{
                                   if(err.data == null) {
                                    toast.warning(t("mess_edit_error"));
                                   }
                                })
                            }
                            
                            else {
                            // this.setState({isView: true});
                            saveItem({
                                ...this.state.item
                            }).then((response) => {
                                if(response.data != null && response.status == 200){
                                    item.id = response.data.id
                                    item.personnel = response.data.personnel.id
                                    this.setState({...item})
                                    toast.success(t('mess_add'));
                                }
                                // this.props.handleOKEditClose();
                            }).catch(err =>{
                                if(err.data == null) {
                                 toast.warning(t("mess_add_error"));
                                }
                            });
                            }
                          }
                    })
                }else{
                    if (id) {
                        // this.setState({isView: true});
                        saveItem({
                            ...this.state.item
                        }).then((response) => {
                            if(response.data != null && response.status == 200){
                                item.personnel = response.data.personnel.id
                                this.setState({...item})
                                toast.success(t('mess_edit'));
                            }
                            // this.props.handleOKEditClose();
                        }).catch(err =>{
                           if(err.data == null) {
                            toast.warning(t("mess_edit_error"));
                           }
                        })
                    }
                    else {
                    // this.setState({isView: true});
                    saveItem({
                        ...this.state.item
                    }).then((response) => {
                        // this.props.handleOKEditClose();
                        if(response.data != null && response.status == 200){
                            item.id = response.data.id
                            item.personnel = response.data.personnel.id
                            this.setState({...item})
                            toast.success(t('mess_add'));
                        }
                    }).catch(err =>{
                        if(err.data == null) {
                         toast.warning(t("mess_add_error"));
                        }
                    });
                    }
                }
            } else{
                toast.warning(t("SampleManagement.eqaSampleBottlesisNull"));
            }
        }
       
    };

    componentDidMount() {
    }

    componentWillMount() {
        let { open, handleClose, item } = this.props;
        this.setState({
            item:item
        }); 
        let numberSampleList = [];
        if (item && item.eqaSampleBottles && item.eqaSampleBottles.length > 0) {
            item.eqaSampleBottles.sort((a, b) => (a.eQASerumBottle.code > b.eQASerumBottle.code) ? 1 : -1);
        }
        if(item.round != null && item.round.numberSampleList != null){
            for(let i = 0 ; i < item.round.numberSampleList; i++){
                numberSampleList.push({id: i+1,
                name: i+1});
            }
            this.setState({numberSampleList:numberSampleList});
        }else{
            this.setState({numberSampleList: null});
        }
        this.setState({
            ...item
        });     
    }

    handleThrombinAddedDateChange = (date) => {
        this.setState({
            thrombinAddedDate: date
        });
    };
    handleRemoveFibrinDateChange = (date) => {
        this.setState({
            removeFibrinDate: date
        });
    };
    handleCentrifugeDateChange = (date) => {
        this.setState({
            centrifugeDate: date
        });
    };
    selectBottle = (bottles) => {
        this.setState({ eqaSampleBottles: bottles }, function () {
        });
    }

    handleClosePopupSelectEQASerumBottle = () => {
        this.setState({ shouldOpenPopupSelectEQASerumBottle: false }, function () {
        });
    }

    handleSelectEQASerumBottle = (item) => {
        // item.sort((a, b) => (a.eQASerumBottle.code > b.eQASerumBottle.code) ? 1 : -1);
        // this.setState({ eqaSampleBottles: item }, function () {
        //     this.handleClosePopupSelectEQASerumBottle();
        // });
        
        let data = item.map(row => ({ ...row }));
        this.setState({ eqaSampleBottles: data });
        this.handleClosePopupSelectEQASerumBottle();
    }

    render() {
        let {i18n,t,handleClose,open }= this.props
        let {
            id,
            name,
            code,
            result,
            round,
            eqaSampleBottles,
            additiveThrombin,
            thrombinAddedDate,
            inactiveVirus,
            volumeAfterRemoveFibrin,
            removeFibrinDate,
            volumeAfterCentrifuge,
            centrifugeDate,
            volumeOfProclinAdded,
            note,orderNumberSample,
            numberSampleList,
            numberSample,
            hasErrorSample,
            hasErrorResult,
            isView,
            shouldOpenPopupSelectEQASerumBottle
        } = this.state;

        

        return (
            <Dialog open={open} PaperComponent={PaperComponent} maxWidth={'lg'} fullWidth={true}>
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                <span className="mb-20 styleColor"> {(id ? t("update") : t("Add")) + " " + t("SampleManagement.sample-list.title")} </span>
                <IconButton style={{ position: "absolute", right: "10px", top: "10px" }} onClick={() => handleClose()}><Icon color="error"
                    title={t("close")}>
                    close
                    </Icon>
                    </IconButton>
                </DialogTitle>
                <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} style={{
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <DialogContent dividers>
                        <Grid item  xs={12}>
                            <TabsSample 
                                t={t} i18n={i18n} 
                                item={this.state.item} 
                            />
                        </Grid>
                    </DialogContent>
                        
                    <DialogActions spacing={4} className="flex flex-end flex-middle">
                        <Button 
                            variant="contained" 
                            className="mr-16" 
                            color="secondary" 
                            type="button" onClick={() => handleClose()}> {t('Cancel')}</Button>
                        <Button 
                            disabled = {isView}
                            variant="contained" 
                            color="primary" 
                            className=" mr-16 align-bottom" 
                            type="submit">
                            {t('Save')}
                        </Button>
                    </DialogActions>
                </ValidatorForm>
            </Dialog>
        );
    }
}

export default EQASampleEditorDialog;
