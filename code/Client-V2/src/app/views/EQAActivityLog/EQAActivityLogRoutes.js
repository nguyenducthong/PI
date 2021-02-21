import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQAActivityLog = EgretLoadable({
  loader: () => import("./EQAActivityLog")
});
const ViewComponent = withTranslation()(EQAActivityLog);

const EQAActivityLogRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"user_manager/activity_log",
    exact: true,
    component: ViewComponent
  }
];

export default EQAActivityLogRoutes;