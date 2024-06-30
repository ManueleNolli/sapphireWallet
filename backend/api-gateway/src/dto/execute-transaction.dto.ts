import { NetworkSelector } from './network-selector.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';
import { IsAddress } from '../is-address-validation';
import { NETWORKS } from '../constants/Networks';

export class ExecuteTransaction extends NetworkSelector {
  @ApiProperty({ default: '0x1234567890123456789012345678901234567890' })
  @IsAddress({ message: 'walletAddress must be a valid Ethereum address' })
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({
    default: '0x18c48c3726d',
  })
  @IsNotEmpty()
  nonce: string;

  @ApiProperty({ default: '01234567890' })
  @IsNotEmpty()
  signedTransaction: string;

  @ApiProperty({
    default: '01234567890',
    description: 'Non signed transaction',
  })
  @IsNotEmpty()
  transactionData: string;

  @ApiProperty({
    default: 'localhost',
    description: `supported network: ${Object.values(NETWORKS)}`,
  })
  @IsIn([...Object.values(NETWORKS), null])
  bridgeNetwork: string;
}
