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

    const token = request.server.jwt.sign({
        id: user._id,
        email: user.email

    });

    reply.send({ name: user.name, email: user.email, token});
}