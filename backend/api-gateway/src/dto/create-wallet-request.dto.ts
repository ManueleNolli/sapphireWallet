import { ApiProperty } from '@nestjs/swagger';
import { NetworkSelector } from './network-selector.dto';
import { IsAddress } from '../is-address-validation';
import { IsNotEmpty } from 'class-validator';

export class CreateWalletRequest extends NetworkSelector {
  @ApiProperty({ default: '0x1234567890123456789012345678901234567890' })
  @IsAddress({ message: 'eoaAddress must be a valid Ethereum address' })
  @IsNotEmpty()
  eoaAddress: string;

  @ApiProperty({ default: '0x1234567890123456789012345678901234567890' })
  @IsAddress({ message: 'guardianAddress must be a valid Ethereum address' })
  @IsNotEmpty()
  guardianAddress: string;
}
