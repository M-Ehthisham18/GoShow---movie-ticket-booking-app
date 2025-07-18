import { ArrowRight, CalendarIcon, ClockIcon } from "lucide-react";
import { assets } from "../assets/assets";
import backgroundImage from "../assets/backgroundImage.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div
      className="relative flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Gradient Overlay at Bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent z-0" />

      <img
        src={assets.marvelLogo}
        alt="Marvel Logo"
        className="max-h-11 lg:h-11 mt-20 z-10"
      />

      <h1 className="text-5xl md:text-7xl md:leading-18 font-semibold max-w-110 z-10">
        Guardians <br /> of the Galaxy
      </h1>

      <div className="flex items-center gap-4 text-gray-300 z-10">
        <span>Action | Adventure | Sci-Fi</span>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-4.5 h-4.5" /> 2018
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4.5 h-4.5" /> 2h 8m
        </div>
      </div>

      <p className="max-w-md text-gray-300 z-10">
        In a post-apocalyptic world where cities ride on wheels and consume each
        other to survive, two people meet in London and try to stop a
        conspiracy.
      </p>

      <button
        onClick={() => navigate("/movies")}
        className="group flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer z-10"
      >
        Explore Movies
        <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition" />
      </button>
    </div>
  );
};

export default HeroSection;
