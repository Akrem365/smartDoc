import React, { useState } from "react";
import Wrapper from "../assets/wrappers/Navbar";
import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useAppcontext } from "../context/appContext";
import Logo from "./Logo";
import { IoIosNotificationsOutline } from "react-icons/io";

function Navbar() {
  const [showLogout, setShowLogout] = useState(false);
  const { ToggleSideBar, user, LogoutUser } = useAppcontext();
  const isAdmin = user.role !== "user";

  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={ToggleSideBar}>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h3 className="logo-text">Dashboard</h3>
        </div>
        <div className="btn-container">
          <div className="alignment">
            <button
              type="button"
              className="btn"
              onClick={() => setShowLogout(!showLogout)}
            >
              <FaUserCircle />
              <span>{user.name}</span>
              <FaCaretDown />
            </button>
          </div>
          {/* {!isAdmin && (
            <span className="notification">
              <IoIosNotificationsOutline />
            </span>
          )} */}
          <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
            <button type="button" onClick={LogoutUser} className="dropdown-btn">
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Navbar;
