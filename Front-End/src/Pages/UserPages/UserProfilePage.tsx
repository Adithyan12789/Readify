import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "../../Slices/AuthSlice";
import {
  useGetUserProfileQuery,
  useUpdateUserMutation,
} from "../../Slices/UserApiSlice";
import { UserInfo } from "../../Types/UserTypes";
import Loader from "../../Components/UserComponents/Loader";
import { useNavigate } from "react-router-dom";

const BOOK_IMAGE_DIR_PATH = "https://api.readify.space/bookImages/";
const DEFAULT_PROFILE_IMAGE = "/profileImage_1729749713837.jpg";

const ProfileScreen: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [, setConfirmPassword] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector(
    (state: { auth: { userInfo: UserInfo } }) => state.auth
  );
  const userId = userInfo?.id;

  const {
    data: userProfile,
    isLoading: profileLoading,
    refetch,
  } = useGetUserProfileQuery(userId);

  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    document.title = "Modern Profile - Your Details";
    if (userProfile) {
      setName(userProfile.name);
      setPhone(userProfile.phone || "");
      setProfileImage(userProfile.profileImageName);
    }
  }, [userProfile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image")) {
        toast.error("Please select an image file.");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone number are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      if (newPassword) formData.append("password", newPassword);
      formData.append("currentPassword", currentPassword);
      if (profileImage) formData.append("profileImage", profileImage);

      const responseFromApiCall = await updateProfile(formData).unwrap();

      await refetch();

      dispatch(setCredentials(responseFromApiCall));

      toast.success("Profile Updated Successfully");

      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (profileLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-black">
      <div className="container py-8 mx-auto">
        <div className="max-w-xl p-6 mx-auto bg-white shadow-xl rounded-2xl">
          <div className="text-center">
            <img
              src={
                userProfile.profileImageName
                  ? `${BOOK_IMAGE_DIR_PATH}${userProfile.profileImageName}`
                  : DEFAULT_PROFILE_IMAGE
              }
              alt="Profile"
              className="w-32 h-32 mx-auto border-4 border-indigo-500 rounded-full shadow-lg"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">
              {userProfile?.name}
            </h2>
            <p className="text-gray-600">{userProfile?.email}</p>
            <p className="text-gray-600">{userProfile?.phone || "N/A"}</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2 mt-4 text-white rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
          <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <button
              title="edit profile modal"
              onClick={() => setShowModal(false)}
              className="absolute text-gray-400 top-4 right-4 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="mb-6 text-2xl font-semibold text-center text-gray-800">
              Edit Profile
            </h3>
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="flex justify-center">
                <label htmlFor="profileImageInput">
                  <img
                    src={
                      profileImagePreview ||
                      `${BOOK_IMAGE_DIR_PATH}${userProfile.profileImageName}`
                    }
                    alt="Profile Preview"
                    className="w-20 h-20 border-2 border-blue-600 rounded-full cursor-pointer"
                  />
                  <input
                    type="file"
                    id="profileImageInput"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={phone}
                    placeholder="Enter your phone number"
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Current password"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="New password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {isLoading ? <Loader /> : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
