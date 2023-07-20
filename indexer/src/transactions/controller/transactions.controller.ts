import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { TransactionQueryRequestDto } from '../dto/request/transaction-query.request.dto';
import { BalanceResponseDto } from '../dto/response/balance.response.dto';
import { TransactionResponseDto } from '../dto/response/transaction.response.dto';
import { TransactionPaginationResponseDto } from '../dto/response/trasaction-pagination.response.dto';
import { TransactionsService } from '../service/transaction.service';

@ApiSecurity('X-API-KEY')
@ApiTags('Transactions')
@UseGuards(ThrottlerGuard, AuthGuard('api-key'))
@Controller('transactions')
export class TransactionsController {
  @Inject() transactionsService: TransactionsService;

  @ApiOperation({ summary: 'Get transaction where the addresse is a receiver' })
  @ApiOkResponse({ type: [TransactionResponseDto] })
  @Get('receiver/:address')
  async getReceiverTransactions(
    @Param('address') address: string,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionsService.getReceiverTransactions(address);
  }

  @ApiOperation({ summary: 'Get transaction where the addresse is a sender' })
  @ApiOkResponse({ type: [TransactionResponseDto] })
  @Get('sender/:address')
  async getSenderTransactions(
    @Param('address') address: string,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionsService.getSenderTransactions(address);
  }

  @ApiOperation({ summary: 'Get balance of this wallet address (from db)' })
  @ApiOkResponse({ type: Number })
  @Get('balance/:address')
  async getDaiBalance(
    @Param('address') address: string,
  ): Promise<BalanceResponseDto> {
    return this.transactionsService.getDaiBalance(address);
  }

  @ApiOperation({
    summary:
      'Get data from pagination query, default page 1 result per page 100',
  })
  @ApiOkResponse({ type: TransactionPaginationResponseDto })
  @HttpCode(200)
  @Post()
  async transaction(
    @Body() query: TransactionQueryRequestDto,
  ): Promise<TransactionPaginationResponseDto> {
    return this.transactionsService.getTransactions(
      query.page,
      query.result_per_page,
    );
  }
}
