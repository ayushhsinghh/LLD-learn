import createMDX from "@next/mdx";

const withMDX = createMDX({});
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // GitHub Pages serves this repository at /LLD-learn/, while local development
  // continues to run from the domain root.
  ...(isGitHubPagesBuild ? { basePath: "/LLD-learn" } : {}),
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
};

export default withMDX(nextConfig);
