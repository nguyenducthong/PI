import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQAHealthOrgTypeTable = EgretLoadable({
  //loader: () => import("./BsTableExample")
  loader: () => import("./EQAHealthOrgTypeTable")
  //loader: () => import("./AdazzleTable")
  //loader: () => import("./React15TabulatorSample")
});
const ViewComponent = withTranslation()(EQAHealthOrgTypeTable);

const eQAHealthOrgTypeRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/eqa_health_org_type",
    exact: true,
    component: ViewComponent
  }
];

export default eQAHealthOrgTypeRoutes;
