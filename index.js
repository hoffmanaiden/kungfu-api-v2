const { ApolloServer, gql } = require('apollo-server');
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

// left off

// ----------------------------- Schema
const typeDefs = gql`
  scalar Date

  enum Status {
    WATCHED
    INTERESTED
    NOT_INTERESTED
    UNKNOWN
  }
  type Actor {
    id: ID
    name: String
  }
  type Movie {
    id: ID
    title: String
    releaseDate: Date
    rating: Float
    status: Status
    actors: [Actor]
  }
  type Query {
    movies: [Movie],
    movie(id: ID): Movie,
  }
`;


// ----------------------------------- fake DataBase
const actors = [
  { id: "01", name: "Gordon Liu" },
  { id: "02", name: "Dat Gui" },
  { id: "03", name: "Yo Gurl" },
  { id: "04", name: "Steve Oedekerk" },
  { id: "05", name: "Lung Fei" },
  { id: "06", name: "Jimmy Wang" },
  { id: "07", name: "Lisa Chiao Chiao" },
  { id: "08", name: "Angela Pan" },
  { id: "09", name: "John Smith" },
  { id: "10", name: "Jane Johnson" },
  {id: "11", name: "Chiang Sheng"},
  {id: "12", name: "Sun Chien"},
  {id: "13", name: "Philip Kwok"},
  {id: "14", name: "Aiden Hoffman"},
]

const movies = [
  {
    id: "1",
    title: "5 Deadly Venoms",
    releaseDate: new Date("10-12-1983"),
    rating: 5.5,
    actors: [
      {id: "11"},
      {id: "12"},
      {id: "13"},
    ],
  },
  {
    id: "2",
    title: "36th Camber of Shaolin",
    releaseDate: new Date("10-10-1978"),
    rating: 9.5,
    actors: [
      { id: "01"},
      { id: "02"},
      { id: "03"},
    ],
  },
  {
    id: "3",
    title: "Kung Pow: Enter the Fist",
    releaseDate: new Date("6-1-2002"),
    rating: 9.9,
    actors: [
      { id: "04"},
      { id: "05"}
    ]
  },
  {
    id: "4",
    title: "One-Armed Swordsman",
    releaseDate: new Date("6-1-1967"),
    rating: 7.4,
    actors: [
      { id: "06"},
      { id: "07"},
      { id: "08"},
    ]
  },
  {
    id: "5",
    title: "Best Movie Ever!",
    releaseDate: new Date("6-1-2005"),
    rating: 7.4,
    actors: [
      { id: "09"},
      { id: "10"},
      { id: "14"},
    ]
  }
]

// ---------------------------- Resolvers - query responders?
const resolvers = {
  Query: {
    // Query movies, return the array of movies
    // but specify what fields to return within movies[]
    movies: () => {
      return movies;
    },
    // Query movie, return a movie object
    // but specify what fields to return within that movie
    movie: (obj, args, context, info) => {
      const foundMovie = movies.find((movie) => movie.id === args.id)
      return foundMovie
    },
  },
  Movie: {
    actors: (obj, args, context, info) => {

      // from obj
      // for each movie, create an array of actor ids
      const actorIds = obj.actors.map(actor => actor.id)
      console.log('actorIds ', actorIds)

      // from DB
      // for each movie, based on ids array above, filter DB actors array
      const filteredActors = actors.filter(actor => actorIds.includes(actor.id))
      console.log('filteredActors ', filteredActors)

      // for each movie return the filtered array of actors
      return filteredActors
    }
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "defining a date object",
    parseValue(value){
      // incoming value from the client
      return new Date(value)
    },
    serialize(value){
      // outgoing value to the client
      return value.getTime(); 
    },
    parseLiteral(ast){
      if(ast.kind === Kind.INT){
        return new Date(ast.value)
      }
      return null
    }
  })
}

// ------------------------------------------------------------------ APOLLO SERVER
const server = new ApolloServer({ 
  typeDefs, 
  resolvers, 
  introspection: true, // for dev only
  playground: true // for dev only
});

server.listen({
  port: process.env.PORT || 4000
}).then(({ url }) => {
  console.log(`Server running on ${url}`)
});