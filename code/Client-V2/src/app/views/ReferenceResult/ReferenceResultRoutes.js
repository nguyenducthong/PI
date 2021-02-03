import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { withTranslation } from "react-i18next";
const ReferenceResultReagent = EgretLoadable({
  loader: () => import("./ReferenceResultReagent")
});
const ViewComponent = withTranslation()(ReferenceResultReagent);

const ReferenceResultRoutes = [
  {
    path: ConstantList.ROOT_PATH + "report_result/reference_result",
    exact: true,
    component: ViewComponent
  }
];

export default ReferenceResultRoutes;