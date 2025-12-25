import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { LoginDto, RegisterDto } from '../dtos/auth.dto.js';

export async function login(req: Request, res: Response) {
    const credentials: LoginDto = req.body;

    try {
        console.log('Login attempt:', credentials.email);
        const { token, user } = await authService.loginUser(credentials);
        res.json({ data: { token, user }, msg: "success" });
    } catch (error: any) {
        res.status(401).json({ error: error.message, msg: "error" });
    }
}

export async function register(req: Request, res: Response) {
    const userData: RegisterDto = req.body;

    try {
        const { user } = await authService.registerUser(userData);
        res.status(200).json({ data: { user }, msg: "success" });
    } catch (error: any) {
        res.status(400).json({ error: error.message, msg: "error" });
    }
}

export async function get(req: Request, res: Response) {
    const id = req.params.id;
    try {
        const { user } = await authService.get(id);
        res.status(200).json({ data: { user }, msg: "success" });
    } catch (error: any) {
        res.status(400).json({ error: error.message, msg: "error" });
    }
}
