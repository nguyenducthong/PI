import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQAResultReportSerodia = EgretLoadable({
  //loader: () => import("./BsTableExample")
  loader: () => import("./EQAResultReportSerodia")
  //loader: () => import("./AdazzleTable")
  //loader: () => import("./React15TabulatorSample")
});
const ViewComponent = withTranslation()(EQAResultReportSerodia);

const EQAResultReportSerodiaRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"result-report/serodia",
    exact: true,
    component: ViewComponent
  }
];

export default EQAResultReportSerodiaRoutes;
