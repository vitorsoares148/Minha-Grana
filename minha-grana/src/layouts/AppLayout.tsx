import { Outlet } from "react-router-dom";
import NavBar from "../components/app/NavBar";

export default function AppLayout() {
  return (
    <>
      <NavBar />

      <main>
        <Outlet />
      </main>
    </>
  );
}
