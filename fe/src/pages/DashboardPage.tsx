import type { ReactNode } from "react";
import { Box, Button, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { ArrowRight, CheckCircle2, Database, HardDrive, Plus, ShieldCheck, UploadCloud, Workflow } from "lucide-react";

type PageKey = "overview" | "datasets" | "pipeline" | "styles" | "releases" | "access";

export function DashboardPage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return <Stack spacing={3.25}>
    <Paper sx={{ overflow: "hidden", position: "relative", p: { xs: 2.5, sm: 4 }, bgcolor: "#11262c", color: "#f1fbfa", backgroundImage: "radial-gradient(circle at 82% 35%, rgb(55 156 137 / 42%), transparent 30%), radial-gradient(circle at 32% 130%, rgb(223 23 67 / 30%), transparent 42%)" }}>
      <Box sx={{ position: "absolute", inset: 0, opacity: .16, backgroundImage: "linear-gradient(rgb(255 255 255 / .8) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .8) 1px, transparent 1px)", backgroundSize: "34px 34px", maskImage: "linear-gradient(90deg, black, transparent 76%)" }} />
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ position: "relative", justifyContent: "space-between", alignItems: { md: "flex-end" } }}>
        <Box><Chip icon={<CheckCircle2 size={14} />} label="Nền tảng đang sẵn sàng" size="small" sx={{ bgcolor: "rgb(98 230 203 / 16%)", color: "#bffff0", border: "1px solid rgb(98 230 203 / 24%)", "& .MuiChip-icon": { color: "#72e9d5" } }} /><Typography variant="h3" sx={{ mt: 2.2, maxWidth: 660 }}>Không gian vận hành dữ liệu địa không gian.</Typography><Typography sx={{ mt: 1.4, maxWidth: 590, color: "rgb(235 252 249 / 70%)", lineHeight: 1.7 }}>Quản lý toàn bộ vòng đời dữ liệu: tiếp nhận, xử lý GDAL, thiết kế style và phát hành tileset có kiểm soát.</Typography></Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}><Button variant="outlined" onClick={() => onNavigate("pipeline")} sx={{ color: "#eafff9", borderColor: "rgb(234 255 249 / 28%)", "&:hover": { borderColor: "rgb(234 255 249 / 55%)", bgcolor: "rgb(255 255 255 / 7%)" } }}>Xem pipeline</Button><Button variant="contained" startIcon={<UploadCloud size={18} />} onClick={() => onNavigate("datasets")}>Thêm dataset</Button></Stack>
      </Stack>
    </Paper>

    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 2 }}>
      <Metric icon={<Database size={20} />} label="Dataset quản lý" value="0" detail="Sẵn sàng tiếp nhận nguồn dữ liệu đầu tiên" />
      <Metric icon={<Workflow size={20} />} label="Job đang xử lý" value="0" detail="Queue không có job đang chờ" tone="teal" />
      <Metric icon={<HardDrive size={20} />} label="Raw storage" value="Ceph S3" detail="Bucket bootstrap đang chờ cấu hình" tone="amber" />
      <Metric icon={<ShieldCheck size={20} />} label="Map releases" value="0" detail="Chưa có tileset được publish" tone="slate" />
    </Box>

    <Box sx={{ display: "grid", gridTemplateColumns: { lg: "1.45fr .9fr" }, gap: 2 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2.25, sm: 3 }, borderColor: "#e2e9e7" }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}><Box><Typography variant="h6">Thiết lập nền tảng</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .45 }}>Hoàn tất các bước bên dưới trước khi bắt đầu nhận dữ liệu lớn.</Typography></Box><Chip label="Bước 1 / 3" size="small" color="primary" /></Stack>
        <Stack spacing={2} sx={{ mt: 3 }}><SetupRow number="01" title="Kết nối Ceph RGW" description="Khai báo endpoint, bucket và policy lifecycle." state="Đang chờ" /><SetupRow number="02" title="Tạo dataset đầu tiên" description="Upload raw file bằng presigned multipart URL." state="Tiếp theo" muted /><SetupRow number="03" title="Publish map release" description="Gắn tileset, style và chính sách truy cập." state="Tiếp theo" muted /></Stack>
        <Button sx={{ mt: 2.4 }} endIcon={<ArrowRight size={16} />} onClick={() => onNavigate("datasets")}>Mở khu vực dữ liệu</Button>
      </Paper>
      <Paper variant="outlined" sx={{ p: { xs: 2.25, sm: 3 }, borderColor: "#e2e9e7" }}><Typography variant="h6">Tình trạng hệ thống</Typography><Stack spacing={2.1} sx={{ mt: 2.6 }}><HealthRow label="Xác thực Map" value="Kết nối" color="#16806e" /><HealthRow label="Storage backend" value="Chưa bootstrap" color="#a96108" /><HealthRow label="Tile gateway" value="Chưa cấu hình" color="#87959a" /></Stack><Box sx={{ mt: 3, px: 1.5, py: 1.3, borderRadius: 2.5, bgcolor: "#f6f9f8" }}><Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.55, display: "block" }}>Dữ liệu raw, derived và style được tách bucket để bảo toàn nguồn và dễ kiểm toán.</Typography></Box></Paper>
    </Box>
  </Stack>;
}

function Metric({ icon, label, value, detail, tone = "red" }: { icon: ReactNode; label: string; value: string; detail: string; tone?: "red" | "teal" | "amber" | "slate" }) {
  const colors = { red: ["#fff0f3", "#b50e35"], teal: ["#e6f7f3", "#08776b"], amber: ["#fff5e8", "#9a5905"], slate: ["#eef3f4", "#53666c"] }[tone];
  return <Paper variant="outlined" sx={{ p: 2.25, borderColor: "#e2e9e7", transition: "transform .18s ease, box-shadow .18s ease", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 28px rgb(20 42 40 / 7%)" } }}><Stack direction="row" spacing={1.35} sx={{ alignItems: "center" }}><Box sx={{ p: 1.05, borderRadius: 2.25, bgcolor: colors[0], color: colors[1], display: "grid" }}>{icon}</Box><Box><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="h5" sx={{ lineHeight: 1.1, mt: .15 }}>{value}</Typography></Box></Stack><Typography variant="caption" color="text.secondary" sx={{ mt: 1.45, display: "block", lineHeight: 1.45 }}>{detail}</Typography></Paper>;
}

function SetupRow({ number, title, description, state, muted = false }: { number: string; title: string; description: string; state: string; muted?: boolean }) {
  return <Stack direction="row" spacing={1.5} sx={{ opacity: muted ? .6 : 1 }}><Box sx={{ width: 30, height: 30, flexShrink: 0, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: muted ? "#f0f3f3" : "primary.main", color: muted ? "text.secondary" : "#fff", fontSize: 11, fontWeight: 800 }}>{number}</Box><Box sx={{ minWidth: 0, flex: 1 }}><Stack direction="row" sx={{ justifyContent: "space-between", gap: 1 }}><Typography variant="body2" sx={{ fontWeight: 750 }}>{title}</Typography><Typography variant="caption" color={muted ? "text.secondary" : "primary.main"} sx={{ whiteSpace: "nowrap", fontWeight: 700 }}>{state}</Typography></Stack><Typography variant="caption" color="text.secondary" sx={{ mt: .25, display: "block" }}>{description}</Typography>{!muted && <LinearProgress value={35} variant="determinate" sx={{ mt: 1, height: 5, borderRadius: 5, bgcolor: "#f5e6ea" }} />}</Box></Stack>;
}

function HealthRow({ label, value, color }: { label: string; value: string; color: string }) {
  return <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}><Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: color }} /><Typography variant="body2">{label}</Typography></Stack><Typography variant="caption" sx={{ color, fontWeight: 800 }}>{value}</Typography></Stack>;
}
