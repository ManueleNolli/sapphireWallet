import { ApiProperty } from '@nestjs/swagger';
import {  IsIn, IsNotEmpty } from 'class-validator'
import { NETWORKS } from '../constants/Networks'

export class NetworkSelector {
  @ApiProperty({
    default: 'localhost',
    description: `supported network: ${Object.values(NETWORKS)}`,
  })
  @IsNotEmpty()
  @IsIn(Object.values(NETWORKS))
  network: string;
}
