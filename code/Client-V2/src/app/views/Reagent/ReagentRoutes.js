import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const ReagentTable = EgretLoadable({
  //loader: () => import("./BsTableExample")
  loader: () => import("./ReagentTable")
  //loader: () => import("./AdazzleTable")
  //loader: () => import("./React15TabulatorSample")
});
const ViewComponent = withTranslation()(ReagentTable);

const reagentRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/reagent",
    exact: true,
    component: ViewComponent
  }
];

export default reagentRoutes;
