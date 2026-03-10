import passport from "@fastify/passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

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

                    let user = await User.findOne({
                        email: profile.emails[0].value
                    });

                    if(!user){
                        user = await User.create({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            provider: "google",
                        });
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
        return await User.findById(id);
        });
}