import { IoBarChartSharp } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { FaCalendarAlt } from "react-icons/fa";
import { FaBell } from "react-icons/fa";

const links = [
  {
    id: 1,
    text: "Vital params",
    path: "/",
    icon: <IoBarChartSharp />,
  },
  {
    id: 2,
    text: "all patients",
    path: "all-patient",
    icon: <MdQueryStats />,
  },
  {
    id: 3,
    text: "add patient",
    path: "add-patient",
    icon: <FaWpforms />,
  },
  {
    id: 4,
    text: "profile",
    path: "profile",
    icon: <ImProfile />,
  },
  {
    id: 5,
    text: "Stats",
    path: "statistique",
    icon: <IoBarChartSharp />,
  },
  {
    id: 6,
    text: "Calendrier",
    path: "Calendrier",
    icon: <FaCalendarAlt />,
  },
  {
    id: 7,
    text: "Notifications",
    path: "Notifications",
    icon: <FaBell />,
  },
];
export default links;
