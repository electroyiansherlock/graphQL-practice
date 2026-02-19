
import db from "./db.js";

import axios from "axios";

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';


// const typeDefs = `#graphql

// type Review {
//     id: ID!
//     rating: Int!
//     content: String!
//     author: [Author!]
//     game: [Game!]
// }

// type Game {
//     id: ID!
//     title: String!
//     platform: [String!]!
//     review: [Review!]
// }

// type Author {
//     id: ID!
//     name: String!
//     verified: Boolean!
// }

// type Query {
//     reviews : [Review]
//     review(id: ID!) : Review
//     games: [Game]
//     authors: [Author]
//     author(id: ID!): Author
//     game(id: ID!): Game
// }

// type Mutation {
//     deleteGame(id: ID!): [Game!]
//     addGame(game: GameInput!) : Game!
//     addReview(review: ReviewInput!): Review!
//     addAuthor(author: AuthorInput!) : Author!
//     deleteAuthor(id: ID!): [Author!]
//     deleteReview(id: ID!): [Review!]

//     updateReview(id: ID!, updateReviewArg: UpdateReview!): Review!
// }

// input GameInput {
//     title: String!
//     platform: [String!]
// }

// input UpdateReview {
//     rating: Int,
//     content: String
// }

// input ReviewInput {
//     rating: Int!
//     content: String!
// }

// input AuthorInput {
//     name: String!
//     verified: Boolean!
// }

// `;

// Field Resolvers  --> Nested Queries --> They are not root queries hence they should be outisde
// the Query area.

// const resolvers = {
//     Query : {
//         reviews() {
//             return db.reviews;
//         },
//         games() {
//             return db.games;
//         },
//         authors() {
//             return db.authors;
//         },
//         review(parent, args) {
//             return db.reviews.find((r) => r.id === args.id)
//         },
//         author(parent, args, context) {
//             return db.authors.find((a) => a.id === args.id)
//         },
//         game(parent, args) {
//             return db.games.find((g) => g.id === args.id)
//         },
//     },
//     Game : {
//         review(parent) {
//             return db.reviews.filter((r) => r.game_id === parent.id)
//         }
//     },

//     Review : {
//         author(parent) {
//             return db.authors.filter((a) => a.id === parent.author_id)
//         },
//         game(parent) {
//             return db.games.filter((g) => g.id === parent.game_id)
//         }
//     },

//     Mutation : {
//         deleteGame(parent, args) {
//             db.games = db.games.filter((g) => g.id !== args.id)
//             return db.games
//         },

//         addGame(parent, args) {
//             let game = {
//                 title: args.game.title,
//                 platform: args.game.platform,
//                 id: 11
//             }

//             db.games.push(game)

//             return game
//         },

//         addReview(parent, args) {

//             let review1 = {
//                 rating: args.review.rating,
//                 content: args.review.content,
//                 id: 123
//             }

//             db.reviews.push(review1);

//             return review1;
//         },

//         addAuthor(parent, args) {
            
//             let author = {
//                 name : args.author.name,
//                 verified: args.author.verified,
//                 id : 1234
//             }

//             db.authors.push(author);

//             return author;
//         },

//         deleteAuthor(parent, args) {

//             let authorId = args.id;

//             db.authors = db.authors.filter((a) => a.id !== authorId);
            
//             return db.authors;
//         },

//         deleteReview(parent, args) {
//             let reviewId = args.id
//             db.reviews = db.reviews.filter((r) => r.id !== reviewId)
//             return db.reviews;
//         },

//         updateReview(parent, args) {

//             // map function will not return true or false for every value in array instead
//             // map will return the actual transformed value for every element in the list
//             // so treat it like a proper function for denoted as "r" of the list.
            
//             db.reviews = db.reviews.map((r) => {
                
//                 if(r.id === args.id) {
//                     return {
//                         ...r,
//                         ...args.updateReviewArg
//                     }
//                 }

//                 // Means in case of else condition we will return the same review
//                 return r;
//             })

//             return db.reviews.find((r) => r.id === args.id)
//         }
//     }
// }


const typeDefs = `#graphql

type Users {
    id: ID!
    name: String!
    email: String!
    address: Address
    phone: String
    website: String
    company: Company
}

type Company {
    name: String
    catchPhrase: String
    bs: String
}

type Address {
    street : String!
    suite : String
    city : String
    zipcode : String
    geo : Geo
}

type Geo {
    lat : Float
    lng: Float
}

type Posts {
    userId: ID!
    id: ID!
    title: String
    body: String
}

type Todos {
    userId: ID!
    id: ID!
    title: String
    completed: Boolean
}

type Albums {
    userId: ID
    id: ID
    title: String
}

type Query {
    albums: [Albums!]
    todos: [Todos!]
    posts: [Posts!]
    users: [Users!]
    album(id: ID!): Albums!
    user(id: ID!): Users!
}

`;

const resolvers = {
    Query: {
        posts: async(parent, args) => {
            const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
            return res.data;
        },

        albums: async(parent, args) => {
            const res = await axios.get("https://jsonplaceholder.typicode.com/albums");
            return res.data;
        },

        todos: async(parent, args) => {
            const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
            return res.data;
        },

        users: async(parent, args) => {
            const res = await axios.get("https://jsonplaceholder.typicode.com/users");
            return res.data;
        },

        album: async(parent, args) => {
            const res = await axios.get("https://jsonplaceholder.typicode.com/albums");
            return res.data.find((a) => a.id === Number(args.id));
        },

        user: async(parent, args) => {
            const res = await axios.get("https://jsonplaceholder.typicode.com/users");
            return res.data.find((u) => u.id === Number(args.id));
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port : 4000 }, 
});

console.log(`Server starting at port : ${url}`);
