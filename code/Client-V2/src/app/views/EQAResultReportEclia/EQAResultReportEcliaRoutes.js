import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQAResultReportEclia = EgretLoadable({
  loader: () => import("./EQAResultReportEclia")
});
const ViewComponent = withTranslation()(EQAResultReportEclia);

const EQAResultReportEcliaRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"result-report/eclia",
    exact: true,
    component: ViewComponent
  }
];

export default EQAResultReportEcliaRoutes;
