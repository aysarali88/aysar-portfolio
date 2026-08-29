import { createSocialImage, size } from "./social-image";

export const alt = "Aysar Obeidat FTTH operations and rollout portfolio preview";
export const contentType = "image/png";
export { size };

export default function Image() {
  return createSocialImage({
    title: "AYSAR OBEIDAT",
    subtitle: "FTTH Operations & Rollout\nTelecom Digital Transformation"
  });
}
