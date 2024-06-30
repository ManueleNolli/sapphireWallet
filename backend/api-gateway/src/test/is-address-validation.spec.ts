import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { IsAddress } from '../is-address-validation';
describe('IsAddress Validator', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [ValidationPipe],
    }).compile();
  });

  it('should pass validation for a valid Ethereum address', async () => {
    // Mock a class instance with the decorated property
    class TestClass {
      @IsAddress()
      address: string;
    }

    const testInstance = new TestClass();
    testInstance.address = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'; // A valid Ethereum address

    const validationPipe = app.get(ValidationPipe);
    await validationPipe.transform(testInstance, {
      metatype: TestClass,
      type: 'body',
    });

    expect(testInstance.address).toBe(
      '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    );
  });

  it('should fail validation for an invalid Ethereum address', async () => {
    // Mock a class instance with the decorated property
    class TestClass {
      @IsAddress() address: string;
    }

    const testInstance = new TestClass();
    testInstance.address = 'invalid_ethereum_address';

    const validationPipe = app.get(ValidationPipe);

    // Validation errors will throw exceptions, so we wrap this in a try-catch block
    try {
      await validationPipe.transform(testInstance, {
        metatype: TestClass,
        type: 'body',
      });
    } catch (error) {
      expect(error.getResponse()).toEqual({
        statusCode: 400,
        message: ['Invalid Ethereum address'],
        error: 'Bad Request',
      });
    }
  });
});
