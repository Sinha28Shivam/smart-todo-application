import passport from "@fastify/passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export default async function(fastify){
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL
            },

            async function(accessToken, refreshToken, profile, done){

                try{

                    const users = fastify.mongo.db.collection("users");

                    let user = await users.findOne({
                        email: profile.emails[0].value
                    });

                    if (!user){

                        const newUser = {
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            picture: profile.photos[0].value,
                            provider: "google" ,
                            createdAT: new Date()
                        };
                        const result = await users.insertOne(newUser);
                        user = {
                            _id: result.insertedId,
                            ...newUser
                        };
                    }
                    return done(null, user);
                }
                catch(error){
                    return done(error, null);
                }
            }
        )
    );
    passport.registerUserSerializer(async(user)=> user._id);
    passport.registerUserDeserializer(async(id)=>{
        return await fastify.mongo.db.collection("users").findOne({
            _id: id
        });
    });
    fastify.register(passport.initialize());
    fastify.register(passport.secureSession());
}