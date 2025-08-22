import { Controller, Get, Post, Request, Res } from '@nestjs/common';

import { UserService } from '../core/auth/user.service';

@Controller('/user')
export class UserController {

    constructor(private readonly users: UserService) {}

    @Get()
    async findAll(@Request() req, @Res() res) {
        const users = await this.users.getAllUsers()
        return res.json(users.map(user => {
            return {
                username: user.username,
                role: user.role
            };
        }))
    }
}