import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    required: true
  },
  posterPath: {
    type: String,
    required: true
  },
  backdropPath: {
    type: String,
    required: true
  },
  releaseDate: {
    type: String,
    required: true
  },
  originalLanguage: {
    type: String,
    
  },
  tagline: {
    type: String,
    
  },
  genres : {
    type:Array,
    required: true
  },
  casts : {
    type : Array,
    required : true
  },
  voteAverage: {
    type: Number,
    required : true
  },
  runtime:{
    type : Number,
    required : true
  }

},{
  timestamps: true,
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;