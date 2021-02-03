import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQAHealthOrgRoundRegister = EgretLoadable({
  //loader: () => import("./BsTableExample")
  loader: () => import("./EQAHealthOrgRoundRegister")
  //loader: () => import("./AdazzleTable")
  //loader: () => import("./React15TabulatorSample")
});
const ViewComponent = withTranslation()(EQAHealthOrgRoundRegister);

const EQAHealthOrgRoundRegisterRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"register/eqa_health_org_round_register",
    exact: true,
    component: ViewComponent
  }
];

export default EQAHealthOrgRoundRegisterRoutes;
