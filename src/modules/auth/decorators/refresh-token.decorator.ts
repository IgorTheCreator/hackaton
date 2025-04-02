import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { REFRESH_TOKEN_COOKIE_NAME } from '../auth.controller'

export const RefreshToken = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request?.cookies[REFRESH_TOKEN_COOKIE_NAME]
})
