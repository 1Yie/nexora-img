import { Env } from "../types";
import { BASE_URL } from "../constants";
import { isRefererAllowed } from "../utils/domain";
import { handleHome } from "../handlers/home";
import { handleApiImages } from "../handlers/api";
import { handleImageRequest } from "../handlers/image";
import { generateErrorPage } from "../templates/error";
import { CACHE_CONTROL } from "../constants";

/**
 * 路由处理主函数
 */
export async function handleRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const referer = request.headers.get("referer");

  // 检查域名（生产环境才检查，本地开发跳过）
  const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (!isLocalhost && url.host !== BASE_URL) {
    return new Response(generateErrorPage(404, "Not Found"), {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": CACHE_CONTROL.NO_CACHE,
      },
    });
  }

  // 处理 API 请求 - 分页获取图片列表
  if (url.pathname === "/api/images") {
    return handleApiImages(request, env);
  }

  // 处理根路径，显示主页
  if (url.pathname === "/" || url.pathname === "") {
    return handleHome();
  }

  // 检查 referer 是否允许
  if (!isRefererAllowed(referer)) {
    console.log(`Unauthorized referer: ${referer}`);
    return new Response(generateErrorPage(403, "Forbidden"), {
      status: 403,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": CACHE_CONTROL.NO_CACHE,
      },
    });
  }

  // 处理图片文件请求
  const filePath = url.pathname.replace(/^\//, "");
  return handleImageRequest(request, env, filePath);
}
