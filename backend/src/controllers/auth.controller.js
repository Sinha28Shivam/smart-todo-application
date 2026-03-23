import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';


// this part for User Registration 
export async function registerUser(request, reply){
    const { name, email, password } = request.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name, 
        email,
        password: hashedPassword
    });

    reply.code(201).send({ message: 'User registered successfully' });
}

// This part for User Login
export async function loginUser(request, reply){
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if(!user){
        return reply.code(401).send({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return reply.code(401).send({ message: 'Invalid email or password' });
    }

    const token = request.server.jwt.sign(
        {
        id: user._id,
        email: user.email
        },

        {
            expiresIn: '2h'
        }
    );

    reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2 * 60 * 60 // 2 hours in seconds
    }).send({
        message: 'Login successful',
        name: user.name,
        email: user.email,
    });

    
}

export async function googleCallback(req, reply){
 console.log("SUCCESS! User made it to the callback:", req.user);
    const user = req.user;
 
    const token = req.server.jwt.sign({
        id: user._id,
        email: user.email
    }, {
        expiresIn: '2h'
    });

    reply.setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 2 * 60 * 60 // 2 hours in seconds
    });

    const safeName = encodeURIComponent(user.name || "Google User");
    const safeEmail = encodeURIComponent(user.email);

    // redirect to frontend. Removed ?token=$token from the URL for security reasons. Frontend can read the token from the cookie.
    reply.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/oauth-success?name=${safeName}&email=${safeEmail}`);

}

export async function logoutUser(req, reply){
    reply.clearCookie('token', { path: '/' }).send({ message: 'Logged out successfully' });
}