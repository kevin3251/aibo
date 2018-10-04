const logger = require('../lib/logger')
const fastify = require('fastify')()

fastify.register(require('fastify-formbody'))

fastify.post('/*', async (request, reply) => {
 logger.info(request.headers)
 logger.info(request.body) 
 return { success: true }
})

const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().post}`)
  } catch (err){
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
