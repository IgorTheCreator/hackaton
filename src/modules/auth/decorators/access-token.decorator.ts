import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const AccessToken = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.headers['authorization'].split(' ')[1]
})
