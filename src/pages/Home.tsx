import React, { useEffect } from "react";

import { Spin } from "antd";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex items-center justify-center h-screen w-screen text-3xl">
      <Spin />
    </div>
  )
}

export default Home;
