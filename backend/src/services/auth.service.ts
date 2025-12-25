import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { GetUserDto, LoginDto, RegisterDto } from "../dtos/auth.dto.js";
import * as userRepository from "../repositories/user.repository.js";

export async function loginUser(credentials: LoginDto) {
    const { email, password } = credentials;

    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ id: user.id, name: user.name }, env.jwtSecret, {
        expiresIn: "7d",
        issuer: "product-manager"
    });

    return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export async function registerUser(userData: RegisterDto) {
    const { name, email, password } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create(name, email, hashedPassword);

    return { user };
}

export async function get(id: string) {
    const user = await userRepository.findById(id);

    return { user };
}
