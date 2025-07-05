import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { dummyShowsData } from "../assets/assets.js";

const FeaturedSecton = () => {
  const navigate = useNavigate();
  return (
    // sectin 1
    <div className="px-6 md:px-10 lg:px-24 xl:px-44 overflow-hidden ">
      <div className=" relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle right="-80px" />
        <p className="text-gray-300 font-medium text-lg ">Now Showing</p>
        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer "
        >
          View All
          <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>
      {/* sectin 2 */}

      <section>
        <div className="grid gap-6 mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3   2xl:grid-cols-5 ">
          {dummyShowsData?.map((show) => (
            <MovieCard key={show._id} movie={show} />
          ))}
        </div>
        <BlurCircle left="80px"/>
      </section>
      {/* sectin 3 */}
      <div className="flex justify-center mt-20 ">
        <button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer "
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default FeaturedSecton;
