import { ApiProperty } from '@nestjs/swagger';
import { NetworkSelector } from './network-selector.dto';

export class AddAuthorised extends NetworkSelector {
  @ApiProperty({ default: '0x1234567890123456789012345678901234567890' })
  address: string;
}
