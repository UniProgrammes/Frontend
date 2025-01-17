import React, { useState } from "react"

import { Button, Input, notification } from "antd"

import { login } from "~/api/v1/session";
import { getMe } from "~/api/v1/users";
import useMainStore from "~/stores/mainStore";

type LoginModalBodyProps = {
  setModalType: (type: "login" | "register") => void;
  close: () => void;
}

function LoginModalBody({ setModalType, close }: LoginModalBodyProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsLoggedIn, setAccessToken, setUser } = useMainStore();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const data = await login({ username, password });
    if (typeof data === "string") {
      setError(data);
    } else {
      setAccessToken(data.access);
      const user = await getMe();
      if (typeof user === "string") {
        setError(user);
      } else {
        setUser(user);
      }
      setIsLoggedIn(true);
      close();
      notification.success({
        message: "Login successful",
        description: "You have been successfully logged in",
      });
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-center my-2">Login</h1>
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        addonBefore="Username"
      />
      <Input.Password
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        addonBefore="Password"
        onPressEnter={handleLogin}
      />

      <Button type="primary" onClick={handleLogin} loading={loading} disabled={loading}>Login</Button>
      <p className="text-center">
        Don't have an account?
        <Button color="primary" variant="link" onClick={() => setModalType("register")}>
          Register here
        </Button>
      </p>
      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  )
}

export default LoginModalBody;
