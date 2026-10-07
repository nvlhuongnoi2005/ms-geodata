import type { ReactNode } from "react";
import { Box, Button, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { ArrowRight, Database, HardDrive, UploadCloud, Workflow } from "lucide-react";

type PageKey = "overview" | "datasets" | "pipeline" | "styles" | "releases" | "access";

export function DashboardPage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}>
        <Box><Typography variant="h4">Tổng quan geodata</Typography><Typography color="text.secondary" sx={{ mt: 0.5 }}>Theo dõi kho dữ liệu, pipeline GDAL và map đang được publish.</Typography></Box>
        <Button variant="contained" startIcon={<UploadCloud size={18} />} onClick={() => onNavigate("datasets")}>Tạo dataset</Button>
      </Stack>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 2 }}>
        <Metric icon={<Database size={20} />} label="Dataset quản lý" value="0" detail="Chưa kết nối Geodata API" />
        <Metric icon={<Workflow size={20} />} label="Job đang xử lý" value="0" detail="Queue chưa có job" />
        <Metric icon={<HardDrive size={20} />} label="Ceph S3" value="Sẵn sàng" detail="Đợi bucket bootstrap" tone="success" />
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { md: "1.35fr .85fr" }, gap: 2 }}>
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}><Box><Typography variant="h6">Khởi tạo storage</Typography><Typography variant="body2" color="text.secondary">Tạo bucket raw, derived và styles trên Ceph RGW trước khi nhận dữ liệu.</Typography></Box><Chip label="Bước 1" color="primary" size="small" /></Stack>
          <Box sx={{ mt: 2.5 }}><LinearProgress variant="determinate" value={35} sx={{ height: 8, borderRadius: 4 }} /><Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block" }}>Manifest bootstrap đã được chuẩn bị trong `deployment/storage`.</Typography></Box>
          <Button sx={{ mt: 2 }} endIcon={<ArrowRight size={16} />} onClick={() => onNavigate("datasets")}>Xem khu vực dataset</Button>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2.5 }}><Typography variant="h6">Nguyên tắc publish</Typography><Stack spacing={1.25} sx={{ mt: 1.5 }}>{["Raw data luôn immutable", "Tileset chỉ publish khi validation đạt", "Map restricted kiểm quyền tại gateway"].map((text) => <Typography key={text} variant="body2" color="text.secondary">• {text}</Typography>)}</Stack></Paper>
      </Box>
    </Stack>
  );
}

function Metric({ icon, label, value, detail, tone = "primary" }: { icon: ReactNode; label: string; value: string; detail: string; tone?: "primary" | "success" }) {
  return <Paper variant="outlined" sx={{ p: 2.25 }}><Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}><Box sx={{ p: 1, borderRadius: 2, bgcolor: `${tone}.light`, color: `${tone}.dark` }}>{icon}</Box><Box><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="h6">{value}</Typography></Box></Stack><Typography variant="caption" color="text.secondary" sx={{ mt: 1.25, display: "block" }}>{detail}</Typography></Paper>;
}

