import { createSocialImage, size } from "../../social-image";

export const alt = "FTTH Rollout Management demo preview";
export const contentType = "image/png";
export { size };

export default function Image() {
  return createSocialImage({
    eyebrow: "INTERACTIVE FTTH DEMO",
    title: "FTTH Rollout Management",
    subtitle: "Field Progress • Operations • Visibility"
  });
}
