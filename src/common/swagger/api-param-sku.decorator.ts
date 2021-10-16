import { ApiParam } from '@nestjs/swagger';

export const ApiParamSKU = () => {
  return ApiParam({
    name: 'sku',
    example: '5021;6',
    description: 'SKU of the item',
  });
};
