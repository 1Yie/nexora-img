/**
 * Nexora Image Hosting Service
 * A Cloudflare Workers-based image hosting service with R2 storage
 */

import { Env } from "./types";
import { handleRequest } from "./router";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handleRequest(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
