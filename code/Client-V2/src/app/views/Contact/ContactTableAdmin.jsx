import { InputAdornment, Input, Grid, IconButton, Icon, TextField, Button, TableHead, TableCell, TableRow, Checkbox, TablePagination } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import MaterialTable, { MTableToolbar, Chip, MTableBody, MTableHeader } from 'material-table';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { getByPage, deleteItem, saveItem,sendEmail, getItemById, searchByPage } from "./ContactService";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3
});

function MaterialButton(props) {
  const { t, i18n } = useTranslation();
  const item = props.item;
  return <div>
    <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
      <Icon fontSize="small" color="primary">save</Icon>
    </IconButton>
    <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
      <Icon fontSize="small" color="error">send</Icon>
    </IconButton>
    
  </div>;
}

class ContactTableAdmin extends React.Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    data: [],
    totalElements: 0,
    itemList: [],
    keyword: ''
  }
  constructor(props) {
    super(props);
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
  }
  handleKeywordChange(event) {
    this.setState({ keyword: event.target.value });
  }

  search() {
    var searchObject = {};
    searchObject.text = this.state.keyword.trim();
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    }
    );
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  componentDidMount() {
    this.updatePageData();
  }
  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword.trim();
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;
    searchByPage(searchObject).then(({ data }) => {
      this.setState({ itemList: [...data.content], totalElements: data.totalElements })
    }
    );
  };

  handleKeyDownEnterSearch = e => {
    if (e.key === 'Enter') {
      this.updatePageData();
    }
  };
  setPage = page => {
    this.setState({ page }, function () {
      this.updatePageData();
    })
  };

  setRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    })
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  handleDelete = id => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true
    });
  };

  handleRowDataCellChange = (rowData, event) => {
    let { itemList } = this.state;
    let {t} = this.props;
    if(itemList != null && itemList.length > 0){
      itemList.forEach(element =>{
        if(element.tableData != null && rowData != null && rowData.tableData != null &&  element.tableData.id == rowData.tableData.id){
          if(event.target.name == "reply"){
            element.reply = event.target.value;
          }
        }
      }); //ket thuc forEach
      this.setState({itemList: itemList});
    }
  }

  handleConfirmationResponse = () => {
    let { t } = this.props;
    deleteItem(this.state.id).then((res) => {
      if (res.data == true) {
        toast.info(t("EQARound.notify.deleteSuccess"));
        this.updatePageData();
      } else {
        toast.warning(t('EQARound.notify.deleteError'));
      }
      this.handleDialogClose();
    }).catch((err) => {
      toast.warning(t('EQARound.notify.error'));
      this.handleDialogClose();
    })
  };

  async handleDeleteList(list) {
    let { t } = this.props;
    for (var i = 0; i < list.length; i++) {
      await deleteItem(list[i].id).then((res) => {
        if (res.data == true) {
          toast.success(t("EQARound.notify.deleteSuccess") + " " + list[i].code);
          this.updatePageData();
        } else {
          toast.warning(t('EQARound.notify.deleteError') + " " + list[i].code);
        }
        this.handleDialogClose();
      }).catch((err) => {
        toast.warning(t('EQARound.notify.error'));
        this.handleDialogClose();
      });
    }
  }
  handleDeleteAll = (event) => {
    let { t } = this.props;
    if (this.data != null) {
      this.handleDeleteList(this.data);
    } else {
      toast.warning(t('general.select_data'));
      this.handleDialogClose();
    }
  };

  render() {
    const { t, i18n } = this.props;
    let {
      keyword,
      name,
      phone,
      email,
      message
    } = this.state;
    let TitlePage = t('Contact.title_table');
    let columns = [
      {
        title: t("Action"),
        field: "custom",
        align: "left",
        width: "250",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        cellStyle: { whiteSpace: 'nowrap' },
        render: rowData => <MaterialButton item={rowData}
          onSelect={(rowData, method) => {
              if (method === 0) {
                if(rowData.reply != null){
                  saveItem(rowData).then(()=>{
                      toast.info(t("Contact.save_successfully"))
                  }).catch(()=>{
                    toast.warning(t("Contact.save_error"))
                  })
              }else{
                toast.warning(t("Contact.no_reply"));
              }
            } else if(method === 1){
              if(rowData.reply != null){
                sendEmail(rowData).then((data)=>{
                    if(!data.sendEmailFailed){
                      toast.info(t("Contact.send_email_successfully"))
                    }else{
                      toast.warning(t("Contact.email_sending_failed"))
                    }
                }).catch(()=>{
                  toast.warning(t("Contact.save_error"))
                })
              }else{
                toast.warning(t("Contact.no_reply"));
              }
            } else {
              alert('Call Selected Here:' + rowData.id);
            }
          }}
        />
      },
      {
        title: t("Name"),
        field: "name",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("Email"),
        field: "email",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("Phone"),
        field: "phone",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("Message"),
        field: "message",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("reply"),
        field: "reply",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "200px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => 
        <TextField
          className="w-100"
          multiline
          rowsMax={10}
          value={rowData.reply ? rowData.reply : ''}
          onChange={(reply) => this.handleRowDataCellChange(rowData, reply)}
          type="text"     
          name="reply"
     
      />
      }
    ];

  return (
    <div className = "m-sm-30">
       <div className="mb-sm-30">
        <Helmet>
          <title>{TitlePage} | {t("web_site")}</title>
        </Helmet>
          <Breadcrumb routeSegments={[{ name: t("category"), path: "/directory/apartment" }, { name: TitlePage}]} />
        </div>
        <Grid container spacing={3} justify ="space-between">
        <Grid item md={7} sm={7} xs={12}></Grid>
        <Grid item md={5} sm={5} xs={12}>
        <Input
              label={t('EnterSearch')}
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleKeywordChange}
              onKeyDown={this.handleKeyDownEnterSearch}
              className="w-100 mb-16 mr-10 stylePlaceholder"
              id="search_box"
              placeholder={t('general.enterSearch')}
              startAdornment={
                <InputAdornment >
                  <Link to="#"> <SearchIcon
                    onClick={() => this.search()}
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0"
                    }} /></Link>
                </InputAdornment>
              }
            />
        </Grid>
        </Grid>
        <Grid item xs={12}>
        <MaterialTable
            title={t('EQARound.ListRound')}
            data={this.state.itemList}
            columns={columns}
            parentChildData={(row, rows) => {
              var list = rows.find(a => a.id === row.parentId);
              return list;
            }}
            options={{
                selection: true,
                actionsColumnIndex: -1,
                paging: false,
                search: false,
                rowStyle: (rowData, index) => ({
                  backgroundColor: (index % 2 === 1) ? '#EEE' : '#FFF',
                }), 
                maxBodyHeight: '450px',
                minBodyHeight: '370px',
                headerStyle: {
                  backgroundColor: '#358600',
                  color:'#fff',
                },
                padding: 'dense',
                toolbar: false
              }}
            components={{
              Toolbar: props => (
                <MTableToolbar {...props} />
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
          <TablePagination
            align="left"
            className="px-16"
            rowsPerPageOptions={[1, 2, 3, 5, 10, 25]}
            component="div"
            labelRowsPerPage={t('general.rows_per_page')}
            labelDisplayedRows={ ({ from, to, count }) => `${from}-${to} ${t('general.of')} ${count !== -1 ? count : `more than ${to}`}`}
            count={this.state.totalElements}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            backIconButtonProps={{
              "aria-label": "Previous Page"
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page"
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.setRowsPerPage}
          />
        </Grid>
    </div>
  )  
  }
}
export default ContactTableAdmin