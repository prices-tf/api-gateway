import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsGreater(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isGreater',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const compare = args.object[args.constraints[0]];
          if (compare === undefined) {
            return true;
          }

          return value > compare;
        },
        defaultMessage(args: ValidationArguments) {
          return `"${args.property}" must be greater than "${args.constraints[0]}"`;
        },
      },
    });
  };
}
