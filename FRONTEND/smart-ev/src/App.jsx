import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/ADMIN/AdminDashboard";
import UserDashboard from "./components/USER/UserDashboard";
import AdminCities from "./components/ADMIN/AdminCities";
import AdminLocationsPage from "./components/ADMIN/AdminLocationsPage";
import AdminStations from "./components/ADMIN/AdminStations";
import AdminSlots from "./components/ADMIN/AdminSlots";
import AdminManageUsers from "./components/ADMIN/AdminManageUsers";
import UserStations from "./components/USER/UserStations";
import UserBookSlot from "./components/USER/UserBookSlot";
import UserBookings from "./components/USER/UserBookings";
import UserProfile from "./components/USER/UserProfile";
import AdminAnalytics from "./components/ADMIN/AdminAnalytics";
import AdminReviews from "./components/ADMIN/AdminReviews";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/cities" element={<AdminCities/>}/>
        <Route path="/admin/locations" element={<AdminLocationsPage/>}/>
        <Route path="/admin/stations" element={<AdminStations/>}/>
        <Route path="/admin/slots" element={<AdminSlots/>}/>
        <Route path="/admin/users" element={<AdminManageUsers/>}/>
        <Route path="/admin/analytics" element={<AdminAnalytics/>}/>
        <Route path="/admin/reviews" element={<AdminReviews/>}/>

        <Route path="/user/dashboard" element={<UserDashboard/>}/>
        <Route path="/user/stations" element={<UserStations/>}/>
        <Route path="/user/book-slot" element={<UserBookSlot/>}/>
        <Route path="/user/bookings" element={<UserBookings/>}/>
        <Route path="/user/profile" element={<UserProfile/>}/>
      </Routes>
    </Router>
  );
};

export default App;
