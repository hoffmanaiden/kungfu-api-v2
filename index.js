const { ApolloServer, gql } = require('apollo-server');

// left off

// ----------------------------- Schema
const typeDefs = gql`
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
    releaseDate: String
    rating: Float
    status: Status
    actors: [Actor]
  }
  type Query {
    movies: [Movie],
    movie(id: ID): Movie
  }
`;


// ----------------------------------- fake DataBase
const movies = [
  {
    id: "1",
    title: "5 Deadly Venoms",
    releaseDate: "1983",
    rating: 5.5
  },
  {
    id: "2",
    title: "36th Camber of Shaolin",
    releaseDate: "1978",
    rating: 9.5,
    actors: [
      { id: "01", name: "Gordon Liu" },
      { id: "02", name: "Dat Gui" },
      { id: "03", name: "Yo Gurl" },
    ],
  },
  {
    id: "3",
    title: "Kung Pow: Enter the Fist",
    releaseDate: "2002",
    rating: 9.9,
    actors: [
      { id: "04", name: "Steve Oedekerk" },
      { id: "05", name: "Lung Fei" }
    ]
  }
]

// ---------------------------- Resolvers - query responders?
const resolvers = {
  Query: {
    // (obj, args, context, info)
    movies: () => {
      return movies;
    },
    movie: (obj, { id }, context, info) => {
      console.log("id is", id);
      const foundMovie = movies.find((movie) => movie.id === id)
      return foundMovie
    }
  }
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