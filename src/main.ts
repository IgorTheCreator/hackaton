import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'
import * as fastifyMultipart from '@fastify/multipart'
import * as fastifyCookie from '@fastify/cookie'
import { AppModule } from './app.module'

async function build() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    cors: {
      origin: '*',
    },
  })
  await app.register(fastifyCookie)
  await app.register(fastifyMultipart)
  const config = new DocumentBuilder().addBearerAuth().build()
  patchNestJsSwagger()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs/json',
  })

  app.enableShutdownHooks()

  return app
}

async function bootstrap() {
  const app = await build()
  await app.listen(3000, '0.0.0.0')
}
bootstrap()
