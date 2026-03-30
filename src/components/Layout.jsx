import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="app-wrapper">
      <Header />
      <main className="content-area">
        <Outlet /> {/* This is where Dashboard, Items, etc., will load */}
      </main>
      <Footer />
    </div>
  );
}
