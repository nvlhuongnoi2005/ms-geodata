import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import { Braces, Save } from "lucide-react";
import { Map, NavigationControl, type StyleSpecification } from "maplibre-gl";

const initialStyle = JSON.stringify({ version: 8, name: "Draft basemap", sources: {}, layers: [{ id: "background", type: "background", paint: { "background-color": "#dcefeb" } }] }, null, 2);

export function StyleStudioPage() {
  const [source, setSource] = useState(initialStyle);
  const [error, setError] = useState<string | null>(null);
  const mapNode = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapNode.current || map.current) return;
    map.current = new Map({ container: mapNode.current, style: JSON.parse(initialStyle) as StyleSpecification, center: [105.85, 21.03], zoom: 5 });
    map.current.addControl(new NavigationControl(), "top-right");
    return () => { map.current?.remove(); map.current = null; };
  }, []);

  const applyStyle = () => {
    try {
      const parsed = JSON.parse(source) as StyleSpecification;
      if (parsed.version !== 8 || !Array.isArray(parsed.layers)) throw new Error("Style phải tuân theo MapLibre Style Specification v8.");
      map.current?.setStyle(parsed, { diff: false });
      setError(null);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "JSON không hợp lệ."); }
  };

  return <Stack spacing={3}><Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}><Box><Typography variant="h4">Style Studio</Typography><Typography color="text.secondary" sx={{ mt: .5 }}>Chỉnh style JSON và render preview MapLibre trước khi tạo style version.</Typography></Box><Stack direction="row" spacing={1}><Chip icon={<Braces size={15} />} label="Draft chưa lưu" variant="outlined"/><Button variant="contained" startIcon={<Save size={17} />} disabled>Lưu style version</Button></Stack></Stack><Box sx={{ display: "grid", gridTemplateColumns: { lg: "minmax(340px, .9fr) minmax(420px, 1.1fr)" }, gap: 2, minHeight: { lg: 590 } }}><Paper variant="outlined" sx={{ p: 2, display: "flex", flexDirection: "column", minHeight: 430 }}><Stack direction="row" sx={{ mb: 1.5, justifyContent: "space-between", alignItems: "center" }}><Typography sx={{ fontWeight: 800 }}>style.json</Typography><Button size="small" onClick={applyStyle}>Áp dụng preview</Button></Stack><TextField multiline fullWidth value={source} onChange={(event) => setSource(event.target.value)} spellCheck={false} sx={{ flex: 1, "& textarea": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, lineHeight: 1.55 } }} slotProps={{ htmlInput: { "aria-label": "Style JSON editor" } }} />{error && <Alert severity="error" sx={{ mt: 1.5 }}>{error}</Alert>}</Paper><Paper variant="outlined" sx={{ overflow: "hidden", minHeight: 430, position: "relative" }}><Box ref={mapNode} sx={{ position: "absolute", inset: 0 }} /><Box sx={{ position: "absolute", left: 14, top: 14, bgcolor: "rgba(255,255,255,.92)", borderRadius: 2, p: 1.25 }}><Typography variant="caption" sx={{ fontWeight: 800 }}>MapLibre preview</Typography><Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Tileset source sẽ được kết nối khi Geodata API sẵn sàng.</Typography></Box></Paper></Box></Stack>;
}

