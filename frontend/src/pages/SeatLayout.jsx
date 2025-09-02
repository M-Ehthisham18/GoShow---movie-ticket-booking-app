import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets} from "../assets/assets";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import Loader from "../components/Loader";
import isoTimeFormate from "../lib/isoTimeFormate.js";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext.jsx";

const SeatLayout = () => {
  const {axios, user, getToken} = useAppContext();

  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H", "I"],
    ["J", "K", "L"],
  ];
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  // const navigate = useNavigate();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if(data?.success) {
        setShow(data)
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("please select time first");
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length > 4) {
      return toast("you can only selcet 5 seats");
    }
    if(occupiedSeats.includes(seatId)){
      return toast.error("this seat is already booked")
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const getOccupiedSeats = async () => {
    try {
      const {data} = await axios.get(`/api/booking/seats/${selectedTime.showId}`);
      
      if(data?.success){
        setOccupiedSeats(data.occupiedSeats)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const bookTickets = async () => {
  try {
    if (!user) return toast.error("Please login to proceed");
    if (!selectedTime || !selectedSeats.length) return toast.error("Please select a time and seats");

    const showId = selectedTime.showId;
    if (!showId) return toast.error("Invalid show selected");

    const token = await getToken(); // Clerk auth token
    const { data } = await axios.post(
      "/api/booking/create",
      { showId, selectedSeats },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data?.success) {
      console.log(data);
      
      window.location.href = data?.url;
    } else {
      toast.error(data.message || "Booking failed");
    }
  } catch (error) {
    console.log("Booking error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};


  useEffect(() => {
    if(selectedTime) getOccupiedSeats();
  }, [selectedTime])

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8  rounded border border-primary/60 cursor-pointer ${
                selectedSeats.includes(seatId) && "bg-primary text-white"
                } ${occupiedSeats.includes(seatId) && 'opacity-50'}`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );
  useEffect(() => {
    if(user) getShow();
  }, [user]);

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50 ">
      {/* available times  */}
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30 ">
        <p className="text-2xl mb-2 font-semibold text-center">
          
          {date &&
            ` ${new Date(date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })} `}
        </p>
      <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.dateTime[date].map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                selectedTime?.time === item.time
                  ? "bg-primary text-white"
                  : "hover:bg-primary-dull"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormate(item.time)}</p>
            </div>
          ))}
        </div>
      </div>
      {/* seat layout  */}
      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className="text-2xl font-semibold mb-4">selet Your Seat</h1>
        <img src={assets.screenImage} alt="" />
        <p className="text-gray-400 text-sm mb-6">screen side</p>

        <div className="flex flex-col items-center mt-10 text-xs text-gray-300 ">
          <div className="grid md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))} 
          </div>
        </div>

        <button onClick={bookTickets} className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95">
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="h-3 w-4"/>
        </button>
      </div>
    </div>
  ) : (
      <Loader />
  );
};

export default SeatLayout;
