import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loader from '../../components/Loader';
import Title from '../../components/admin/Title';
import { dateFormate } from '../../lib/dateFormate';

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [shows , setShows] = useState([]);
  const [ loading, setLoading] = useState(true);
  
  const getAllShows = async () => {
    try {
      setShows([{
        movie : dummyShowsData[0],
        showDateTime : "2025-07-06T02:30:00.000Z",
        showPrice : 59,
        occupiedSeats : {
          A1: "uesr_1",
          B1: "uesr_2",
          C1: "uesr_3"
        }
      }]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    getAllShows();
  },[])
  return !loading ? (
    <>
    <Title text1="List " text2="Shows" />
    <div className='max-w-4xl mt-6 overflow-x-auto'>
      <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
        <thead>
          <tr className='bg-primary/30 text-left text-white'>
            <th className='p-2 font-medium pl-5'>Movie Name</th>
            <th className='p-2 font-medium '>Show Time</th>
            <th className='p-2 font-medium '>Total Bookings</th>
            <th className='p-2 font-medium '>Earnings</th>
          </tr>
        </thead>
        <tbody className='text-sm font-light'>
          {shows.map((show,index) => (
            <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
              <td className='p-2 min-w-45 pl-5'>{show.movie.title} </td>
              <td className='p-2 '>{dateFormate(show.showDateTime)} </td>
              <td className='p-2 px-4'>{Object.keys(show.occupiedSeats).length} </td>
              <td className='p-2 px-4'>{currency} {Object.keys(show.occupiedSeats).length * show.showPrice} </td>
            </tr>
          ))}

        </tbody>
      </table>

    </div>
    
    </>
  ) : (
    <div className="w-full h-[100vh] flex items-center justify-center">
      <Loader />
    </div>
  )
}

export default ListShows