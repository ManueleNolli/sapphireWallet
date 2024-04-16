import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { ethers } from 'ethers';

@ValidatorConstraint({ name: 'isAddress', async: false })
export class IsAddressConstraint implements ValidatorConstraintInterface {
  validate(address: any) {
    return ethers.isAddress(address);
  }

  defaultMessage() {
    return 'Invalid Ethereum address';
  }
}

export function IsAddress(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAddressConstraint,
    });
  };
}
