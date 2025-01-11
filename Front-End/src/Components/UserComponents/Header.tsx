import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetUserProfileQuery } from "../../Slices/UserApiSlice";
import { logout } from "../../Slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { RootState, AppDispatch } from "../../Store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faSignOutAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const PROFILE_IMAGE_DIR_PATH = "https://readify.space/UserProfileImages/";
const DEFAULT_PROFILE_IMAGE = "/profileImage_1729749713837.jpg";

const Header: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { data: profileData } = useGetUserProfileQuery(userInfo?.id);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const profileHandler = () => navigate("/profile");
  const logoutHandler = async () => {
    try {
      await dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <header className="bg-gray-800">
      <nav className="flex items-center justify-between px-5">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="/360_F_964220239_nc3cQWdaQzfDHE297RW5lqo8pO83zxn9-removebg-preview.png"
            alt="Readify Logo"
            className="w-24 pt-3"
          />
          <h1 className="text-[1.8rem] font-semibold text-white">Readify</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <a href="/" className="text-white hover:text-gray-300">
            Home
          </a>
          <a href="/allBooks" className="text-white hover:text-gray-300">
            Books
          </a>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-6">
          {userInfo ? (
            <div className="relative">
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={toggleDropdown}
              >
                <img
                  src={
                    profileData?.profileImageName
                      ? `${PROFILE_IMAGE_DIR_PATH}${profileData.profileImageName}`
                      : DEFAULT_PROFILE_IMAGE
                  }
                  alt="User Avatar"
                  className="object-cover w-10 h-10 rounded-full"
                />
                <span className="text-white">{userInfo.name}</span>
                <FontAwesomeIcon icon={faCaretDown} className="text-white" />
              </div>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-lg">
                  <button
                    onClick={profileHandler}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a href="/login" className="text-white hover:text-gray-300">
                Sign In
              </a>
              <a href="/signup" className="text-white hover:text-gray-300">
                Sign Up
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
