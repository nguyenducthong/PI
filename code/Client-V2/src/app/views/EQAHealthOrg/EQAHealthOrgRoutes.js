import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQAHealthOrgTable = EgretLoadable({
  loader: () => import("./EQAHealthOrgTable")
});
const ViewComponent = withTranslation()(EQAHealthOrgTable);

const eQAHealthOrgRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/eqa_health_org",
    exact: true,
    component: ViewComponent
  }
];

export default eQAHealthOrgRoutes;
