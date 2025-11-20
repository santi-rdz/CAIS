import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export default function AppLayout() {
  return (
    <div className="layout grid h-dvh">
      <Sidebar />
      <Header />

      <main className="overflow-scroll bg-gray-50 py-10 [grid-area:main]">
        <div className="my-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
