import React, { useEffect, useRef, useState } from "react";
// import { dummyShowsData } from "../../assets/assets";
import Loader from "../../components/Loader";
import Title from "../../components/admin/Title";
import { StarIcon, CheckIcon, Trash2Icon } from "lucide-react";
import kCoverter from "../../lib/kConverter.js";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";

const AddShows = () => {
  const { axios, getToken, user,image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get("/api/show/now-playing", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setNowPlayingMovies(data?.movies || []);
      }
    } catch (error) {
      console.log("Error in fetchNowPlayingMovies", error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  const handleDateTimeAdd = async () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
  };
  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filtereTimes = prev[date].filter((t) => t !== time);
      if (filtereTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filtereTimes,
      };
    });
  };

  useEffect(() => {
    if(user){
      fetchNowPlayingMovies();
    }
  }, [user]);

  //scroll
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // multiplier for scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleSubmit = async () => {
    try {
      setAddingShow(true);
      if(!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice){
        return toast("Missing required fields");
      }

      const showsInput = Object.entries(dateTimeSelection).map(([date,time]) => ({date, time}));
      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice)
      }

      const {data} = await axios.post("/api/show/add", payload,{
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if(data?.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setShowPrice("");
      } else {
        toast.error(data?.message || "Failed to add show");
      }

      setAddingShow(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  }

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add " text2="Shows" />
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
      {/* <div className='flex flex-wrap pb-4 no-scrollbar'> */}
      <div
        ref={scrollRef}
        className="overflow-x-auto pb-4 no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie.id)}
              className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}
            >
              <div>
                <img
                  src={image_base_url+movie.poster_path}
                  className="w-full object-cover brightness-90"
                  alt=""
                />
                <div className="text-sm flex items-center justify-between py-2 pl-1 bg-black/70 w-full absolute bottom-10.5 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-300">
                    {kCoverter(movie.vote_count)} Votes
                  </p>
                </div>
              </div>
              {selectedMovie === movie.id && (
                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                  <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}
              <div>
                <p className="font-medium truncate">{movie.title} </p>
                <p className="text-gray-400 text-sm">{movie.release_date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* show price input  */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
          <p className="text-gray-400">{currency}</p>
          <input
            type="number"
            min={0}
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter Show Price"
            className="outline-none"
          />
        </div>
      </div>

      {/* date & time  */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Select Date and Time
        </label>
        <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="outline-none rounded-md"
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"
          >
            Add Time
          </button>
        </div>
      </div>

      {/* display the selected time  */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2">Selected Date-Time</h2>
          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className="font-medium">{date}</div>
                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {times.map((time) => (
                    <div
                      key={time}
                      className="border border-primary px-2 py-1 flex items-center gap-12 rounded"
                    >
                      <span>{time}</span>
                      <Trash2Icon
                        onClick={() => handleRemoveTime(date, time)}
                        width={15}
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/80 transition-all cursor-pointer"
        disabled={addingShow}
        onClick={handleSubmit}
      >
        Add Show
      </button>
    </>
  ) : (
      <Loader />
  );
};

export default AddShows;
