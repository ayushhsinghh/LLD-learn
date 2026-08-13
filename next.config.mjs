import createMDX from "@next/mdx";

const withMDX = createMDX({});
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // The custom domain serves this site at its root. Set NEXT_PUBLIC_BASE_PATH
  // only for a deployment that intentionally uses a repository subpath.
  ...(basePath ? { basePath } : {}),
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default withMDX(nextConfig);
