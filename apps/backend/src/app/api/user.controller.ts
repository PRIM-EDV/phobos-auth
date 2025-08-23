import { Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';

import { UserService } from '../core/auth/user.service';
import { RolesGuard } from '../common/guards/roles.guards';

@Controller('/user')
@UseGuards(RolesGuard)
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

    @Post()
    async upsert(@Request() req, @Res() res) {
        const user = req.body;

        console.log(user);
    }
}