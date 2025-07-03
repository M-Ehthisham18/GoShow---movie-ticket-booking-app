import { Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Movies from "./pages/Movies"
import MovieDetails from "./pages/MovieDetails"
import MyBookings from "./pages/MyBookings"
import Favorite from "./pages/Favorite"
import SeatLayout from "./pages/SeatLayout"
import { Toaster } from "react-hot-toast"


function App() {
  const isAdminroute = useLocation().pathname.startsWith('/admin');

  return (
    <>
      <Toaster />
      {!isAdminroute && <Navbar/>}
      <Routes>
        <Route path="/" element={ <Home/>}/>
        <Route path="/movies" element={ <Movies/>}/>
        <Route path="/movies/:id" element={ <MovieDetails/>}/>
        <Route path="/movies/:id/:date" element={ <SeatLayout/>}/>
        <Route path="/my-bookings" element={ <MyBookings/>}/>
        <Route path="/favorite" element={ <Favorite/>}/>
      </Routes>
      {!isAdminroute && <Footer/>}
    </>
  )
}

export default App
