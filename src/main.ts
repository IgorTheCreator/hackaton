import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'
import * as fastifyHelmet from '@fastify/helmet'
import * as fastifyCookie from '@fastify/cookie'
import { AppModule } from './app.module'
import { ConfigService } from './core/config/config.service'

async function build() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    cors: {
      origin: '*'
    }
  })
  await app.register(fastifyHelmet)
  await app.register(fastifyCookie)
  const config = new DocumentBuilder()
    .setTitle('UpMe')
    .setDescription('Platform for supporting creative peoples')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentFactory)
  patchNestJsSwagger()
  app.enableShutdownHooks()

  return app
}

async function bootstrap() {
  const app = await build()
  const config = app.get(ConfigService)
  await app.listen(config.APP_PORT, config.APP_HOST)
}
bootstrap()
