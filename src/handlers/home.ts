import { CACHE_CONTROL } from "../constants";
import { generateHomePage } from "../templates/home";

/**
 * 处理主页请求
 */
export async function handleHome(): Promise<Response> {
  return new Response(generateHomePage(), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": CACHE_CONTROL.NO_CACHE,
    },
  });
}
