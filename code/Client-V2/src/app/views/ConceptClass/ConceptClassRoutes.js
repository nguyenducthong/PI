import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const ConceptClassTable = EgretLoadable({
  //loader: () => import("./BsTableExample")
  loader: () => import("./ConceptClassTable")
  //loader: () => import("./AdazzleTable")
  //loader: () => import("./React15TabulatorSample")
});
const ViewComponent = withTranslation()(ConceptClassTable);

const conceptClassRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/conceptClass",
    exact: true,
    component: ViewComponent
  }
];

export default conceptClassRoutes;
