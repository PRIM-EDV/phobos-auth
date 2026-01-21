import { Controller, Delete, Get, Post, Request, Res, UseGuards } from '@nestjs/common';

import { UserService } from '../core/auth/user.service';
import { RolesGuard } from '../common/guards/roles.guards';
import { Roles } from '../common/decorators/roles.decorator';

import * as argon2 from "argon2";
import { User } from '../core/auth/models/user';
import { OAuth2Service } from '../core/oauth2/oauth2.service';


@Controller('user')
@UseGuards(RolesGuard)
export class UserController {

    constructor(
        private readonly oauth2: OAuth2Service,
        private readonly users: UserService
    ){}

    @Post('/token')
    @Roles(['admin'])
    async findOne(@Request() req, @Res() res) {
        const { name, role } = req.body;
        const duration = 1000 * 60 * 60 * 24 * 30;
        const token = await this.oauth2.generateAccessToken(name, role, duration);

        return res.json({ token: token });
    }

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
    @Roles(['admin'])
    async upsert(@Request() req, @Res() res) {
        const user = req.body as User;
        console.log(user);  
        if (user.password) {
          user.password = await argon2.hash(user.password);
        }

        await this.users.setUser(user);
        return res.status(204).send();
    }

    @Delete()
    @Roles(['admin'])
    async delete(@Request() req, @Res() res) {
        const user = req.body;
        await this.users.deleteUser(user.username);
        return res.status(204).send();
    }
}