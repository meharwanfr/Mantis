import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { registerRoutes } from './routes/index.ts'

export const app = new Elysia()
	.use(cors({
		origin: 'http://localhost:3000'
	}))
	.use(registerRoutes)
	.listen(8000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)