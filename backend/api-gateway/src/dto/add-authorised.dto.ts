import { ApiProperty } from '@nestjs/swagger';
import { NetworkSelector } from './network-selector.dto';
import { IsAddress } from '../is-address-validation'
import { IsNotEmpty } from 'class-validator'

export class AddAuthorised extends NetworkSelector {
  @ApiProperty({ default: '0x1234567890123456789012345678901234567890' })
  @IsAddress({message: 'address must be a valid Ethereum address'})
  @IsNotEmpty()
  address: string;
}
