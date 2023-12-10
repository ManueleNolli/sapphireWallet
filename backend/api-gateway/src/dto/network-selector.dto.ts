import { ApiProperty } from '@nestjs/swagger';

export class NetworkSelector {
  @ApiProperty({
    default: 'localhost',
    description: "supported network: 'localhost', 'sepolia'",
  })
  network: string;
}
