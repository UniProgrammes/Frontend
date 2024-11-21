import React, { useState } from "react"

import { Button, Input, message } from "antd";

import { register } from "~/api/v1/session";


type RegisterModalBodyProps = {
  setModalType: (type: "login" | "register") => void;
}

const initialUserState = {
  username: "",
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  enrollmentNumber: "",
  password: "",
  confirmPassword: "",
}

function RegisterModalBody({ setModalType }: RegisterModalBodyProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<{
    username: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    enrollmentNumber: string;
    password: string;
    confirmPassword: string;
  }>(initialUserState);

  const isValid = () => {
    const mustBeFilled = ["username", "firstName", "lastName", "email", "enrollmentNumber", "password", "confirmPassword"];
    for (const field of mustBeFilled) {
      if (!user[field as keyof typeof user]) {
        setError(`${field} is required`);
        return false;
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  }

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    if (!isValid()) {
      setLoading(false);
      return;
    }
    const response = await register(user);
    if (typeof response === "string") {
      setError(response);
    } else {
      message.success("Account created successfully");
      setModalType("login");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-center my-2">Register</h1>
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          addonBefore="Username"
        />
        <Input
          placeholder="First Name"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          addonBefore="First Name"
        />
        <Input
          placeholder="Middle Name"
          value={user.middleName}
          onChange={(e) => setUser({ ...user, middleName: e.target.value })}
          addonBefore="Middle Name"
        />
        <Input
          placeholder="Last Name"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          addonBefore="Last Name"
        />
        <Input
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          addonBefore="Email"
        />
        <Input
          placeholder="Enrollment Number"
          value={user.enrollmentNumber}
          onChange={(e) => setUser({ ...user, enrollmentNumber: e.target.value })}
          addonBefore="Enrollment Number"
        />
        <Input.Password
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          addonBefore="Password"
        />
        <Input.Password
          placeholder="Confirm Password"
          value={user.confirmPassword}
          onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
          addonBefore="Confirm Password"
        />
      </div>
      <Button type="primary" onClick={handleRegister} loading={loading} disabled={loading}>Register</Button>
      <p className="text-center">
        Already have an account?
        <Button color="primary" variant="link" disabled={loading} onClick={() => setModalType("login")}>
          Login here
        </Button>
      </p>
      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  )
}

export default RegisterModalBody;
