import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
// const EQAResultReportConclusionAll = EgretLoadable({
//   loader: () => import("./EQAResultReportConclusionAllTable")
// });
const Tabs = EgretLoadable({
  loader: () => import("./Tabs")
});
// const ViewComponent = withTranslation()(EQAResultReportConclusionAll);
const ViewComponent = withTranslation()(Tabs);
const EQAResultReportConclusionAllRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"result-report/conclusionAll",
    exact: true,
    component: ViewComponent
  }
];

export default EQAResultReportConclusionAllRoutes;