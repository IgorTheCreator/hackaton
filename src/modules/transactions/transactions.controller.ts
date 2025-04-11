import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { User } from 'src/shared/decorators'
import { IPayload } from 'src/shared/interfaces'
import { IdDto, ListDto } from 'src/shared/dtos'
import { CreateTransactionDto } from './transactions.dto'
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger'

@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Get('')
  @ApiQuery({
    required: true,
    type: ListDto,
  })
  list (@User() user: IPayload, @Query() query: ListDto) {
    return this.transactionsService.list(user.id, query)
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  get (@User() user: IPayload, @Param() param: IdDto) {
    return this.transactionsService.get(user.id, param)
  }

  @Post()
  create (@User() user: IPayload, @Body() body: CreateTransactionDto) {
    return this.transactionsService.createTransaction(user.id, body)
  }
}
