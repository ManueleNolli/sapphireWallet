import { ApiProperty } from '@nestjs/swagger';
import { NetworkSelector } from './network-selector.dto';
import { IsAddress } from '../is-address-validation';
import { IsIn, IsNotEmpty } from 'class-validator';
import { NETWORKS } from '../constants/Networks';

export class GetNFTBalance extends NetworkSelector {
  @ApiProperty({ default: '0x1234567890123456789012345678901234567890' })
  @IsAddress({ message: 'walletAddress must be a valid Ethereum address' })
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({ default: ['mumbai'] })
  @IsIn(Object.values(NETWORKS), { each: true })
  destinationChains: string[];
}
