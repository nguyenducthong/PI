import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Helmet } from "react-helmet";
import EQAResultReportConclusionAllTable from "./EQAResultReportConclusionAllTable";
import EQANotResultReportConclusion from "./EQANotResultReportConclusion"
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { Breadcrumb, ConfirmationDialog } from "egret";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function TabsResultReportConclusionAllForm() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { t, i18n } = useTranslation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="m-sm-30">
        <div className="mb-sm-30">
          <Helmet>
            <title>
              {t("EQAResultReportConclusionAll.title2")} | {t("web_site")}
            </title>
          </Helmet>
          <Breadcrumb
            routeSegments={[{ name: t("EQAResultReportConclusionAll.title2") }]}
          />
        </div>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label={t('EQAResultReportConclusionAll.results')} {...a11yProps(0)} />
            <Tab label={t('EQAResultReportConclusionAll.no_results')} {...a11yProps(1)} />
            {/* <Tab label={t('HealthOrgRegisterForm.tab2')} {...a11yProps(2)} /> */}
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <EQAResultReportConclusionAllTable t={t} i18n={i18n} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EQANotResultReportConclusion t={t} i18n={i18n} />
        </TabPanel>
        {/* <TabPanel value={value} index={2}>
          <EQARoundRegistered t={t} i18n={i18n} />
      </TabPanel> */}
      </div>
    </div>
  );
}
