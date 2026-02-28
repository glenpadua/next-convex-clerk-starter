import { AuthConfig } from "convex/server"

// Optional auth config: keep providers empty by default so Convex can run
// without any auth environment variables.
export default {
  providers: [],
} satisfies AuthConfig
