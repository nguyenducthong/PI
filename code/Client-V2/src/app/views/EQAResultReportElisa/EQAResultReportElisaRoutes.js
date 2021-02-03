import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQAResultReportElisa = EgretLoadable({
  loader: () => import("./EQAResultReportElisa")
});
const ViewComponent = withTranslation()(EQAResultReportElisa);

const EQAResultReportElisaRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"result-report/elisa",
    exact: true,
    component: ViewComponent
  }
];

export default EQAResultReportElisaRoutes;
