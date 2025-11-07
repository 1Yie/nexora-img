import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Hello World worker', () => {
	it('responds with home page HTML (unit style)', async () => {
		const request = new IncomingRequest('http://img.ichiyo.in');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		const responseText = await response.text();
		expect(responseText).toContain('Nexora - Image Vault');
		expect(responseText).toContain('<html');
	});

	it('responds with home page HTML (integration style)', async () => {
		const response = await SELF.fetch('https://img.ichiyo.in');
		const responseText = await response.text();
		expect(responseText).toContain('Nexora - Image Vault');
		expect(responseText).toContain('<html');
	});
});
