import { NetworkSelector } from './network-selector.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsAddress } from '../is-address-validation';
import { IsNotEmpty } from 'class-validator';

export class GetWrappedAccountAddress extends NetworkSelector {
  @ApiProperty({
    default: '0x1234567890123456789012345678901234567890',
    description:
      'The address of the account to get the wrapped address for (Base Chain address)',
  })
  @IsAddress({ message: 'address must be a valid Ethereum address' })
  @IsNotEmpty()
  address: string;
}
