import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/shortener/_shortener.tsx"),
  route("/:shortCode", "routes/redirect/_redirect.tsx"),
] satisfies RouteConfig;
