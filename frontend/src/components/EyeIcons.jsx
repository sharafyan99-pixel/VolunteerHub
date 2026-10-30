import { Eye, EyeOff } from "lucide-react";

export default function EyeIcons() {
  return (
    <div style={{ display: "flex", gap: "24px" }}>
      {/* Աչքը բաց է */}
      <Eye size={48} color="black" strokeWidth={2.5} />

      {/* Աչքը փակված է */}
      <EyeOff size={48} color="black" strokeWidth={2.5} />
    </div>
  );
}