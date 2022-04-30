import { IoCartSharp } from "react-icons/io5";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { MdMarkEmailUnread, MdDashboard } from "react-icons/md";
import { FaPaperPlane, FaUsers } from "react-icons/fa";

const list = [
    {
        text: "dashboard",
        icon: <MdDashboard />,
    },
    {
        text: "orders",
        icon: <IoCartSharp />,
    },
    {
        text: "products",
        icon: <GiCardboardBoxClosed />,
    },
    {
        text: "messages",
        icon: <MdMarkEmailUnread />,
    },
    {
        text: "newsletter",
        icon: <FaPaperPlane />,
    },
    {
        text: "users",
        icon: <FaUsers />,
    },
];

export default list;
