import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SellNest — E-commerce for Independent Makers",
    short_name: "SellNest",
    description:
      "Your business. Your own little corner of the internet. Beautiful storefronts for home bakers, Instagram sellers and creators.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBFBFA",
    theme_color: "#7E22CE",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

