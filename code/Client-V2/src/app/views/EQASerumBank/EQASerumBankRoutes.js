import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const EQASerumBankTable = EgretLoadable({
  //loader: () => import("./BsTableExample")
  loader: () => import("./EQASerumBankTable")
  //loader: () => import("./AdazzleTable")
  //loader: () => import("./React15TabulatorSample")
});
const ViewComponent = withTranslation()(EQASerumBankTable);

const eQASerumBankRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/eQASerumBank",
    exact: true,
    component: ViewComponent
  }
];

export default eQASerumBankRoutes;
