import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from "react-i18next";
const EQARoundConclusionsTable = EgretLoadable({
  loader: () => import("./EQARoundConclusionsTable")
});
const ViewComponent = withTranslation()(EQARoundConclusionsTable);

const EQARoundConclusionsRoutes = [
  {
    path: ConstantList.ROOT_PATH + "round-conclusions",
    exact: true,
    component: ViewComponent
  }
];

export default EQARoundConclusionsRoutes;
