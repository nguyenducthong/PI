import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const AllocationSampleSet = EgretLoadable({
  loader: () => import("./AllocationSampleSet")
});
const ViewComponent = withTranslation()(AllocationSampleSet);

const allocationSampleSetRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"sample/allocation_sampleSet",
    exact: true,
    component: ViewComponent
  }
];

export default allocationSampleSetRoutes;
