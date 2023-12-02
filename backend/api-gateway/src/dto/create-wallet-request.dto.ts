import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletRequest {
  @ApiProperty({ default: '0x1234567890123456789012345678901234567890' })
  eoaAddress: string;

  @ApiProperty({
    default: 'localhost',
    description: "supported network: 'localhost', 'sepolia'",
  })
  network: string;
}
