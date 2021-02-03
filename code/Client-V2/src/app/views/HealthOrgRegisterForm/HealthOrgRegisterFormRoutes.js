import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Tabs = EgretLoadable({
  //loader: () => import("./BsTableExample")
  loader: () => import("./Tabs")
  //loader: () => import("./AdazzleTable")
  //loader: () => import("./React15TabulatorSample")
});
const ViewComponent = withTranslation()(Tabs);

const HealthOrgRegisterFormRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"register/health_org_register_form",
    exact: true,
    component: ViewComponent
  }
];

export default HealthOrgRegisterFormRoutes;
