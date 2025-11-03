import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export default function AppLayout() {
  return (
    <div className="grid layout min-h-dvh">
      <Sidebar />
      <Header />
      <main className="[grid-area:main]">
        <Outlet />
      </main>
    </div>
  );
}
