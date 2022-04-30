import { FaUserCircle } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { IoBagHandle } from "react-icons/io5";

const nav_links = [
    {
        text: "my details",
        icon: <FaUserCircle />,
        active_text: "details",
    },
    {
        text: "my address book",
        icon: <MdLocationPin />,
        active_text: "addressBook",
    },
    {
        text: "my orders",
        icon: <IoBagHandle />,
        active_text: "orders",
    },
];

export default nav_links;
