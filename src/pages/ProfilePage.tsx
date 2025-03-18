import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FaUser,
  FaLock,
  FaBell,
  FaSignOutAlt,
  FaEdit,
  FaCamera,
} from "react-icons/fa";
import { useAuthStore } from "../store/store";
import { Modal } from "../components/common/Modal";
import { ConfirmationModal } from "../components/common/ConfirmationModal";
import Button from "../components/common/Button";
import FormField from "../components/common/FormElements/FormField";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Form schema for profile update
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  jobTitle: z.string().optional(),
  bio: z.string().max(300, "Bio cannot exceed 300 characters").optional(),
});

// Form schema for password change
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: user?.email || "john.doe@example.com",
    jobTitle: "Software Developer",
    bio: "Task management enthusiast and productivity expert. I enjoy organizing workflows and creating efficient systems.",
    joinDate: "January 15, 2025",
    tasksCompleted: 47,
    tasksCreated: 73,
  });

  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      jobTitle: userData.jobTitle,
      bio: userData.bio,
    },
  });

  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Handle profile update
  const handleUpdateProfile = (data: ProfileFormData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setUserData({
        ...userData,
        name: data.name,
        email: data.email,
        jobTitle: data.jobTitle || "",
        bio: data.bio || "",
      });

      setIsLoading(false);
      setIsEditModalOpen(false);
      toast.success("Profile updated successfully");
    }, 800);
  };

  // Handle password change
  const handleChangePassword = (data: PasswordFormData) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsPasswordModalOpen(false);
      resetPasswordForm();
      toast.success("Password changed successfully");
    }, 800);
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      logout();
      toast.info("Account deleted successfully");
      navigate("/login");
    }, 1000);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <FaUser className="text-indigo-600 text-2xl" />
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          </div>
        </div>

        {/* Profile Overview Card */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 flex flex-col md:flex-row gap-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-bold uppercase">
                  {userData.name.charAt(0)}
                </div>
                <button
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
                  title="Change profile picture"
                >
                  <FaCamera size={14} />
                </button>
              </div>
              <div className="mt-4 text-center">
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                  Active
                </span>
                <p className="text-sm text-gray-500 mt-2">
                  Member since {userData.joinDate}
                </p>
              </div>
            </div>

            {/* User Information */}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {userData.name}
                </h2>
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  className="!py-1.5 !px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1"
                >
                  <FaEdit size={14} /> Edit Profile
                </Button>
              </div>

              <p className="text-gray-600 text-sm mt-1">{userData.jobTitle}</p>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Email:</p>
                <p className="font-medium">{userData.email}</p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Bio:</p>
                <p className="text-gray-700">
                  {userData.bio || "No bio provided."}
                </p>
              </div>

              <div className="mt-5 flex gap-4">
                <div className="bg-gray-50 rounded-md p-3 text-center flex-1">
                  <p className="text-2xl font-bold text-indigo-600">
                    {userData.tasksCreated}
                  </p>
                  <p className="text-xs text-gray-500">Tasks Created</p>
                </div>
                <div className="bg-gray-50 rounded-md p-3 text-center flex-1">
                  <p className="text-2xl font-bold text-green-600">
                    {userData.tasksCompleted}
                  </p>
                  <p className="text-xs text-gray-500">Tasks Completed</p>
                </div>
                <div className="bg-gray-50 rounded-md p-3 text-center flex-1">
                  <p className="text-2xl font-bold text-amber-600">
                    {Math.round(
                      (userData.tasksCompleted / userData.tasksCreated) * 100
                    )}
                    %
                  </p>
                  <p className="text-xs text-gray-500">Completion Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Security Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaLock className="text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Security</h2>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 flex justify-between items-center"
              >
                <span className="text-gray-700">Change Password</span>
                <span className="text-xs text-gray-500">
                  Last changed 45 days ago
                </span>
              </button>

              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 flex justify-between items-center">
                <span className="text-gray-700">Two-Factor Authentication</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                  Disabled
                </span>
              </button>

              <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 flex justify-between items-center">
                <span className="text-gray-700">Session Management</span>
                <span className="text-xs text-gray-500">1 active device</span>
              </button>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaBell className="text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Preferences</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md">
                <span className="text-gray-700">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md">
                <span className="text-gray-700">Task Reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md">
                <span className="text-gray-700">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Account Management
          </h2>
          <div className="space-y-3">
            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700"
            >
              <FaSignOutAlt /> Sign Out
            </Button>
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700"
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form
          onSubmit={handleProfileSubmit(handleUpdateProfile)}
          className="space-y-4"
        >
          <FormField
            label="Name"
            id="name"
            type="text"
            name="name"
            register={profileRegister}
            error={profileErrors.name?.message}
          />

          <FormField
            label="Email"
            id="email"
            type="email"
            name="email"
            register={profileRegister}
            error={profileErrors.email?.message}
          />

          <FormField
            label="Job Title"
            id="jobTitle"
            type="text"
            name="jobTitle"
            register={profileRegister}
            error={profileErrors.jobTitle?.message}
          />

          <div className="space-y-1">
            <label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              {...profileRegister("bio")}
              className="w-full px-3 py-2 border rounded-lg text-sm shadow-sm"
              rows={4}
            ></textarea>
            {profileErrors.bio?.message && (
              <p className="text-red-500 text-xs mt-1">
                {profileErrors.bio?.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      >
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <form
          onSubmit={handlePasswordSubmit(handleChangePassword)}
          className="space-y-4"
        >
          <FormField
            label="Current Password"
            id="currentPassword"
            type="password"
            name="currentPassword"
            register={passwordRegister}
            error={passwordErrors.currentPassword?.message}
          />

          <FormField
            label="New Password"
            id="newPassword"
            type="password"
            name="newPassword"
            register={passwordRegister}
            error={passwordErrors.newPassword?.message}
          />

          <FormField
            label="Confirm New Password"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            register={passwordRegister}
            error={passwordErrors.confirmPassword?.message}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        confirmText="Delete Account"
        cancelText="Cancel"
        isLoading={isLoading}
      >
        <div className="space-y-4">
          <p className="text-red-600 font-medium">
            Warning: This action cannot be undone.
          </p>
          <p className="text-gray-700">
            Deleting your account will permanently remove all your data,
            including:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>All your tasks and task history</li>
            <li>Comments you've made</li>
            <li>Custom labels and categories</li>
            <li>Account preferences and settings</li>
          </ul>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mt-4">
            <p className="text-amber-700 text-sm">
              To confirm, please type "DELETE" in the field below:
            </p>
            <input
              type="text"
              className="w-full px-3 py-2 mt-2 border rounded-lg text-sm shadow-sm"
              placeholder="Type DELETE to confirm"
            />
          </div>
        </div>
      </ConfirmationModal>
    </>
  );
}
