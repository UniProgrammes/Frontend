import React, { useState } from "react";

import { Button, Input, message } from "antd";

import { updateMe, UpdateUserPayload } from "~/api/v1/users";
import useMainStore from "~/stores/mainStore";

function Profile() {
  const { user: storeUser, setUser: setStoreUser } = useMainStore();
  const [user, setUser] = useState<UpdateUserPayload & { confirmPassword?: string } | null>(storeUser);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (key: string, value: string) => {
    if (!user) return;
    setUser({ ...user, [key]: value });
  };

  const isValid = () => {
    if (!user) return false;
    const mustBeFilled = ["username", "firstName", "lastName", "email", "enrollmentNumber"];
    for (const field of mustBeFilled) {
      if (!user[field as keyof typeof user]) {
        setError(`${field} is required`);
        return false;
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email || "")) {
      setError("Please enter a valid email address");
      return false;
    }

    if (user.password && user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  }


  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    if (!isValid()) {
      setLoading(false);
      return;
    }
    const response = await updateMe(user);
    if (typeof response === "string") {
      setError(response);
    } else {
      setStoreUser(response);
      message.success("Profile updated successfully");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-200 rounded-3xl p-8 m-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Change your profile settings</h2>
      <div className="w-full max-w-lg grid grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold" htmlFor="username">
            Username
          </label>
          <Input
            id="username"
            placeholder="New username"
            className="h-10"
            value={storeUser?.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            placeholder="janesmith@example.com"
            className="h-10"
            value={user?.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold" htmlFor="firstName">
            First Name
          </label>
          <Input
            id="firstName"
            placeholder="First Name"
            className="h-10"
            value={user?.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold" htmlFor="middleName">
            Middle Name
          </label>
          <Input
            id="middleName"
            placeholder="Middle Name"
            className="h-10"
            value={user?.middleName}
            onChange={(e) => handleChange("middleName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold" htmlFor="lastName">
            Last Name
          </label>
          <Input
            id="lastName"
            placeholder="Last Name"
            className="h-10"
            value={user?.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold" htmlFor="enrollmentNumber">
            Enrollment Number
          </label>
          <Input
            id="enrollmentNumber"
            placeholder="Enrollment Number"
            className="h-10"
            value={user?.enrollmentNumber}
            onChange={(e) => handleChange("enrollmentNumber", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold" htmlFor="password">
            New Password
          </label>
          <Input.Password
            id="new-password"
            placeholder="New Password"
            className="h-10"
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold" htmlFor="repeat-password">
            Repeat Password
          </label>
          <Input.Password id="repeat-password" placeholder="Repeat Password" className="h-10" onChange={(e) => handleChange("confirmPassword", e.target.value)} />
        </div>
        <div className="flex justify-center mt-4 col-span-2">
          <Button
            type="primary"
            className="bg-purple-600 hover:bg-purple-700 h-10 w-3/4"
            onClick={handleUpdate}
            loading={loading}
            disabled={loading}
          >
            Apply changes
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default Profile;
