/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com.au",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "daily",
  priority: 0.7,
  exclude: [
    "/dashboard/*",
    "/connect/*",
    "/my-requests",
    "/login",
    "/register",
    "/api/*",
    "/service-request",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/connect/", "/my-requests", "/api/"],
      },
    ],
  },
};
