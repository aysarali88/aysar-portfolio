import { createSocialImage, size } from "../../social-image";

export const alt = "FTTH Warehouse and Material Control demo preview";
export const contentType = "image/png";
export { size };

export default function Image() {
  return createSocialImage({
    eyebrow: "INTERACTIVE FTTH DEMO",
    title: "FTTH Warehouse & Material Control",
    subtitle: "Inventory • Material Requests • Traceability"
  });
}
