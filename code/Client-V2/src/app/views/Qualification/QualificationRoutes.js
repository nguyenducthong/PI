import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const QualificationTable = EgretLoadable({
  //loader: () => import("./BsTableExample")
  loader: () => import("./QualificationTable")
  //loader: () => import("./AdazzleTable")
  //loader: () => import("./React15TabulatorSample")
});
const ViewComponent = withTranslation()(QualificationTable);

const qualificationRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/qualification",
    exact: true,
    component: ViewComponent
  }
];

export default qualificationRoutes;
