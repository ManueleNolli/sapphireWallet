import { NetworkSelector } from './network-selector.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteTransaction extends NetworkSelector {
  @ApiProperty({ default: '0x1234567890123456789012345678901234567890' })
  walletAddress: string;

  @ApiProperty({
    default: '0x18c48c3726d',
  })
  nonce: string;

  @ApiProperty({ default: '01234567890' })
  signedTransaction: string;

  @ApiProperty({
    default: '01234567890',
    description: 'Non signed transaction',
  })
  transactionData: string;
}
