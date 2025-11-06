import { useEffect, useState } from "react";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  // useEffect(() => {
  //   fetch("http://localhost:8000/api/test")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);
  return <div className="text-1 font-bold">Dashboard mensaje {message}</div>;
}
