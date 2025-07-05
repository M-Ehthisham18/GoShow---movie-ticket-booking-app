import React from 'react'
import { dummyShowsData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import MovieCard from '../components/MovieCard'
import { FilmIcon } from 'lucide-react'

const Movies = () => {
  return dummyShowsData.length > 0 ?(
    <div className='relative my-30 px-6 md:px-8 lg:px-24 xl:px-40 overflow-hidden min-h-[80vh]'>
      
      <BlurCircle top='150px' left='0px'/>
      <BlurCircle bottom='50px' right='50px'/>

      <h1 className='text-xl font-medium my-4'>Now Showing</h1>
      <div className='grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {dummyShowsData.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
    
  ) : (
    <div className='flex flex-col items-center min-h-[80vh] justify-center gap-4 w-full'>
      <FilmIcon className='w-20 h-20 opacity-50'/>
      
      <p className='text-2xl text-gray-300'>No Movies Avilable</p>
    </div>
  )
}

export default Movies