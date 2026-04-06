import L from "leaflet";

// Fix Leaflet default marker icons in Next.js/webpack
// Without this, markers show as broken images because webpack
// rewrites the icon URLs incorrectly
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

export default L;
