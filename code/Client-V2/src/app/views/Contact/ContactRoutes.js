import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Contact = EgretLoadable({
  loader: () => import("./Contact")
});

const ContactTableAdmin = EgretLoadable({
  loader: () => import("./ContactTableAdmin")
});
const ViewComponent = withTranslation()(Contact);
const ViewContactTableAdmin = withTranslation()(ContactTableAdmin);

const ContactRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"dashboard/contact",
    exact: true,
    component: ViewComponent // component giống với trong jsx    
  },
  {
    path:  ConstantList.ROOT_PATH+"dashboard/contact_table_admin",
    exact: true,
    component: ViewContactTableAdmin // component giống với trong jsx    
  }
];

export default ContactRoutes;