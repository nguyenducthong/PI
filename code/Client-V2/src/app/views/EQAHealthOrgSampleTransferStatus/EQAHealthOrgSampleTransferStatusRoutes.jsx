import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from "react-i18next";
const EQAHealthOrgSampleTransferStatusTable = EgretLoadable({
  loader: () => import("./EQAHealthOrgSampleTransferStatusTable")
});
const ViewComponent = withTranslation()(EQAHealthOrgSampleTransferStatusTable);

const EQAHealthOrgSampleTransferStatusRoutes = [
  {
    path: ConstantList.ROOT_PATH + "sample_transfer_status",
    exact: true,
    component: ViewComponent
  }
];

export default EQAHealthOrgSampleTransferStatusRoutes;
