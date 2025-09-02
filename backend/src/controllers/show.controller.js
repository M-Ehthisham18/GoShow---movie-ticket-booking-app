import axios from "axios";
import Movie from "../models/movie.modle.js";
import Show from "../models/show.model.js";

const nowPlayingAPI = `https://api.themoviedb.org/3/movie/now_playing`;

const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(nowPlayingAPI, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    });

    const movies = data.results;
    res.json({ success: true, movies: movies });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// api to add new show to the database
const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);
    if (!movie) {
      // fetch movie from TMDB and save it
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),

        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
      ]);
      const movieApiDate = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id : movieId,
        title: movieApiDate.title,
        overview: movieApiDate.overview,
        posterPath: movieApiDate.poster_path,
        backdropPath: movieApiDate.backdrop_path,
        releaseDate: movieApiDate.release_date,
        originalLanguage: movieApiDate.original_language,
        tagline: movieApiDate.tagline || "",
        geners: movieApiDate.geners || [],
        casts: movieCreditsData.cast || [],
        voteAverage: movieApiDate.vote_average,
        runtime: movieApiDate.runtime,
      
        // genres: movieApiDate.genres.map((genre) => genre.name),
        // casts: movieCreditsData.cast.map((cast) => ({
        //   name: cast.name,
        //   profilePath: cast.profile_path,
        //   character: cast.character,
        // })),
        
      }

      movie = new Movie(movieDetails);
      await movie.save();
    }
    const showsToCreate = [];
    showsInput.forEach(show => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime : new Date(dateTimeString),
          showPrice,
          occupiedSeats : {},
        })
      });     
    });

    if(showsToCreate.length > 0){
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: "Show added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//api to get all the shows from the database
// const getShows = async (req, res) => {
//   try {
//     const shows = await Show.find({showDateTime:{$gte : new Date()}}).populate("movie").sort({showDateTime:1});

//     const uniqueShows = new Set(shows.map(show => show.movie));
//     res.json({success:true, shows: Array.from(uniqueShows)});

//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// }

const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // Use a Map keyed by movie._id to guarantee uniqueness
    const movieMap = new Map();
    shows.forEach(show => {
      if (!movieMap.has(show.movie._id.toString())) {
        movieMap.set(show.movie._id.toString(), show.movie);
      }
    });

    res.json({ success: true, shows: Array.from(movieMap.values()) });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// api to get a single show from the database
const getSingleShow = async (req, res) => {
  try {
    const {movieId} = req.params;
    const shows = await Show.find({movie:movieId, showDateTime:{$gte: new Date()}});
    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if(!dateTime[date]){
        dateTime[date] = [];
      }
      dateTime[date].push({time:show.showDateTime, showId:show._id});
    })
    res.json({success:true,movie,dateTime});
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

export { getNowPlayingMovies ,addShow, getShows, getSingleShow };
