import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const HealthOrgLevelTable = EgretLoadable({
  loader: () => import("./HealthOrgLevelTable")
});
const ViewComponent = withTranslation()(HealthOrgLevelTable);

const healthOrgLevelRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/health_org_level",
    exact: true,
    component: ViewComponent
  }
];

export default healthOrgLevelRoutes;
