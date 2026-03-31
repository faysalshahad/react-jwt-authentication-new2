import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import OrderPage from "./pages/OrderPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerPage from "./pages/CustomerPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="items" element={<Items />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Login/Register usually don't have the main header/footer */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Outlet,
// } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import Items from "./pages/Items";
// import OrderPage from "./pages/OrderPage";
// import CustomerPage from "./pages/CustomerPage";

// // 1. Create a Layout component for protected/internal pages
// const MainLayout = () => (
//   <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//     <Header />
//     <main style={{ flex: 1, padding: "20px" }}>
//       {/* Outlet renders the child routes defined in the Route nesting below */}
//       <Outlet />
//     </main>
//     <Footer />
//   </div>
// );

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Layout />}>
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="items" element={<Items />} />
//           <Route path="orders" element={<OrderPage />} />
//           <Route path="customers" element={<CustomerPage />} />
//           <Route path="register" element={<Register />} />
//         </Route>

//         {/* Login/Register usually don't have the main header/footer */}
//         <Route path="/login" element={<Login />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
