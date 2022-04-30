import React from "react";
import { MdEdit } from "react-icons/md";
import { IoMdArrowDropright } from "react-icons/io";
import { Link } from "react-router-dom";

const AddressDetails = ({ user }) => {
    const { city, pincode, address, state } = user.location_info;
    return (
        <div className="main-account-details-container main-address-details-container">
            <div className="top-container">
                <span className="heading">Address details</span>
                <Link className="edit-btn" to="/updateinfo">
                    <MdEdit />
                </Link>
            </div>
            <div>
                <span className="container-heading underline">
                    Loaction Information
                </span>

                <div className="">
                    <div className="address-info-container">
                        <div>
                            <span className="sub-title">state</span>
                            <IoMdArrowDropright className="icon" />
                            <span className="main-info">{state}</span>
                        </div>

                        <div>
                            <span className="sub-title">city</span>
                            <IoMdArrowDropright />
                            <span className="main-info">{city}</span>
                        </div>

                        <div>
                            <span className="sub-title">pinCode</span>
                            <IoMdArrowDropright />
                            <span className="main-info">{pincode}</span>
                        </div>
                    </div>
                </div>

                <span className="container-heading underline">
                    Adress Information
                </span>

                <div className="address-info">
                    <span className="main-info">{address}</span>
                </div>
            </div>
        </div>
    );
};

export default AddressDetails;
