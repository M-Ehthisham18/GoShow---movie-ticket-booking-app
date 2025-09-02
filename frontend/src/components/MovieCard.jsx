import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeForamte.js";
import { useAppContext } from "../context/AppContext.jsx";

const MovieCard = ({ movie = "" }) => {
  const { image_base_url } = useAppContext();

  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between p-3 bg-gray-300/20 rounded-2xl hover:translate-y-1 transition duration--300 min-w-60 ">
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
        src={image_base_url + movie.backdropPath}
        alt=""
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer "
      />
      <p
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
        className="font-semibold mt-2 truncate cursor-pointer "
      >
        {movie.title}
      </p>
      <p>
        {new Date(movie.releaseDate).getFullYear()} -{" "}
        {movie.genres?.length
          ? movie.genres
              .slice(0, 2)
              .map((genre) => genre.name)
              .join(" | ")
          : "All Geners"}{" "}
        - {timeFormat(movie.runtime)}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3 ">
        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer "
        >
          Buy Ticket
        </button>
        <p className="flex items-center gap-1 text-md text-gray-500">
          <StarIcon className="w-4.5 h-4.5 text-primary fill-primary" />
          {movie.voteAverage?.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
