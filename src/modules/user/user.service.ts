import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { IPayload } from 'src/shared/interfaces';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async profile({ id, role }: IPayload) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
                role
            },
            select: {
                id: true,
                email: true,
                co2Economy: true,
                rating: true,
                name: true
            }
        })

        return { user }
    }
}
