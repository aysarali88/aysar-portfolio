import { createSocialImage, size } from "../../social-image";

export const alt = "FTTH Site Survey and Infrastructure Mapping demo preview";
export const contentType = "image/png";
export { size };

export default function Image() {
  return createSocialImage({
    eyebrow: "INTERACTIVE FTTH DEMO",
    title: "FTTH Site Survey & Infrastructure Mapping",
    subtitle: "Field Data • Infrastructure • Validation"
  });
}
