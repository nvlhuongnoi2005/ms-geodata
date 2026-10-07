import { useState, type FormEvent, type ReactNode } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import {
  Bell,
  Boxes,
  Database,
  ExternalLink,
  FileStack,
  Gauge,
  Layers3,
  LockKeyhole,
  LogOut,
  Mail,
  MapPinned,
  Menu,
  Paintbrush,
  Send,
  ShieldCheck,
  Sparkles,
  Workflow
} from "lucide-react";
import { useAuth } from "../auth";
import { DashboardPage } from "../pages/DashboardPage";
import { DatasetsPage } from "../pages/DatasetsPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { StyleStudioPage } from "../pages/StyleStudioPage";

const drawerWidth = 278;
type PageKey = "overview" | "datasets" | "pipeline" | "styles" | "releases" | "access";

const navigation: { key: PageKey; label: string; caption: string; icon: ReactNode }[] = [
  { key: "overview", label: "Tổng quan", caption: "Trạng thái nền tảng", icon: <Gauge size={19} /> },
  { key: "datasets", label: "Dữ liệu nguồn", caption: "Raw files & versions", icon: <Database size={19} /> },
  { key: "pipeline", label: "Pipeline", caption: "GDAL processing", icon: <Workflow size={19} /> },
  { key: "styles", label: "Style Studio", caption: "Bản đồ & biểu tượng", icon: <Paintbrush size={19} /> },
  { key: "releases", label: "Map releases", caption: "Publish catalog", icon: <Send size={19} /> },
  { key: "access", label: "Phân quyền", caption: "Người dùng & nhóm", icon: <ShieldCheck size={19} /> }
];

const mapLoginUrl = import.meta.env.VITE_MAP_LOGIN_URL || "http://webgis.localhost/login";
const mapUrl = import.meta.env.VITE_WEBGIS_MAP_URL || "http://webgis.localhost/map";

function BrandMark({ size = 42 }: { size?: number }) {
  return (
    <Box sx={{ width: size, height: size, display: "grid", placeItems: "center", borderRadius: `${Math.round(size * .3)}px`, bgcolor: "primary.main", boxShadow: "0 10px 22px rgb(223 23 67 / 30%)" }}>
      <Layers3 size={Math.round(size * .52)} color="#fff" strokeWidth={2.2} />
    </Box>
  );
}

function LoginMapArtwork() {
  return (
    <Box className="login-map-surface" sx={{ display: { xs: "none", md: "flex" }, minHeight: "100dvh", color: "#f6ffff", position: "relative", overflow: "hidden", p: { md: 5, lg: 7 }, flexDirection: "column", justifyContent: "space-between" }}>
      <Stack direction="row" spacing={1.4} sx={{ alignItems: "center" }}><BrandMark /><Box><Typography sx={{ fontWeight: 800, letterSpacing: "-.025em" }}>Geodata Control</Typography><Typography variant="caption" sx={{ opacity: .68 }}>Tile Server · Operations</Typography></Box></Stack>
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: .92 }}>
        <svg viewBox="0 0 800 650" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <path className="login-route" d="M-60 490 C120 290, 200 540, 350 370 S570 260, 870 160" fill="none" stroke="rgba(86, 235, 202, .55)" strokeWidth="2" />
          <path d="M-60 180 C140 300, 250 100, 460 250 S690 480, 870 350" fill="none" stroke="rgba(255,255,255,.23)" strokeWidth="1.5" />
          <circle cx="350" cy="370" r="10" fill="#f02a54" /><circle className="status-pulse" cx="350" cy="370" r="25" fill="none" stroke="#f02a54" strokeWidth="2" />
          <circle cx="590" cy="282" r="7" fill="#56ebca" /><circle cx="180" cy="310" r="6" fill="#56ebca" />
        </svg>
      </Box>
      <Box sx={{ position: "relative", maxWidth: 500 }}>
        <Chip icon={<Sparkles size={14} />} label="Geospatial operations" size="small" sx={{ color: "#c9fff4", bgcolor: "rgb(96 229 202 / 12%)", border: "1px solid rgb(96 229 202 / 25%)", "& .MuiChip-icon": { color: "#6de8d1" } }} />
        <Typography variant="h3" sx={{ mt: 2.5, maxWidth: 460, lineHeight: 1.05 }}>Một nơi để vận hành toàn bộ dữ liệu bản đồ.</Typography>
        <Typography sx={{ mt: 2, color: "rgb(235 255 251 / 68%)", lineHeight: 1.75, maxWidth: 440 }}>Quản lý raw data, pipeline chuyển đổi, style và quyền publish tile theo cùng một catalog tập trung.</Typography>
      </Box>
      <Stack direction="row" spacing={3} sx={{ position: "relative" }}><Signal label="Offline-ready" /><Signal label="Ceph S3" /><Signal label="Map Auth" /></Stack>
    </Box>
  );
}

function Signal({ label }: { label: string }) {
  return <Stack direction="row" spacing={.8} sx={{ alignItems: "center" }}><Box className="status-pulse" sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#64e9d0" }} /><Typography variant="caption" sx={{ color: "rgb(235 255 251 / 72%)" }}>{label}</Typography></Stack>;
}

function SessionGate({ children }: { children: ReactNode }) {
  const { isLoading, login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (!result.ok) setError(result.message);
  };

  if (isLoading) return <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", bgcolor: "#102128" }}><CircularProgress sx={{ color: "#fff" }} /></Box>;
  if (!user) {
    return <Box sx={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: { md: "minmax(420px, 1.08fr) minmax(500px, .92fr)" } }}><LoginMapArtwork />
      <Box sx={{ display: "grid", placeItems: "center", p: { xs: 2.5, sm: 5, md: 6 }, bgcolor: "#fbfcfc" }}>
        <Paper component="form" onSubmit={(event) => void signIn(event)} elevation={0} sx={{ width: "100%", maxWidth: 405, p: { xs: 0, sm: 1 }, bgcolor: "transparent" }}>
          <Stack spacing={3}>
            <Box sx={{ display: { md: "none" } }}><Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}><BrandMark size={38} /><Typography sx={{ fontWeight: 800 }}>Geodata Control</Typography></Stack></Box>
            <Box><Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: ".12em" }}>ADMIN ACCESS</Typography><Typography variant="h4" sx={{ mt: .25 }}>Chào mừng trở lại</Typography><Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.65 }}>Đăng nhập bằng tài khoản quản trị WebGIS để tiếp tục.</Typography></Box>
            <Stack spacing={1.75}>
              <TextField autoComplete="email" label="Email WebGIS" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus slotProps={{ input: { startAdornment: <InputAdornment position="start"><Mail size={18} /></InputAdornment> } }} />
              <TextField autoComplete="current-password" label="Mật khẩu" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockKeyhole size={18} /></InputAdornment> } }} />
              {error && <Box sx={{ px: 1.5, py: 1.2, borderRadius: 2, bgcolor: "#fff0f3", color: "error.main", fontSize: 14 }}>{error}</Box>}
            </Stack>
            <Button variant="contained" type="submit" size="large" disabled={isSubmitting}>{isSubmitting ? "Đang xác thực…" : "Đăng nhập vào Geodata"}</Button>
            <Divider><Typography variant="caption" color="text.secondary">hoặc</Typography></Divider>
            <Button component="a" href={mapLoginUrl} variant="text" startIcon={<MapPinned size={17} />}>Mở trang đăng nhập WebGIS</Button>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", lineHeight: 1.6 }}>Chỉ tài khoản có role <b>admin</b> trong WebGIS mới có quyền truy cập.</Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>;
  }
  if (user.role !== "admin") return <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 3 }}><Paper sx={{ maxWidth: 460, p: 4, textAlign: "center" }}><ShieldCheck size={34} color="#df1743" /><Typography variant="h5" sx={{ mt: 2 }}>Không có quyền truy cập</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Geodata Control chỉ dành cho tài khoản WebGIS có role admin.</Typography></Paper></Box>;
  return <>{children}</>;
}

export function AdminShell() {
  const [activePage, setActivePage] = useState<PageKey>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, user } = useAuth();

  const drawer = <Box className="app-drawer" sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff", color: "#15252b" }}>
    <Box sx={{ px: 2.25, pt: 2.5, pb: 2.25 }}><Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}><BrandMark size={38} /><Box><Typography sx={{ fontWeight: 800, letterSpacing: "-.02em" }}>Geodata Control</Typography><Typography variant="caption" sx={{ color: "rgb(225 244 241 / 58%)" }}>Tile platform · offline</Typography></Box></Stack></Box>
    <Divider sx={{ borderColor: "rgb(255 255 255 / 8%)" }} />
    <Typography variant="overline" sx={{ px: 2.4, pt: 2.5, pb: .8, color: "rgb(225 244 241 / 42%)", fontWeight: 800, letterSpacing: ".12em", fontSize: 10 }}>WORKSPACE</Typography>
    <List sx={{ px: 1.15, py: 0 }}>{navigation.map((item) => <ListItemButton key={item.key} selected={activePage === item.key} onClick={() => { setActivePage(item.key); setMobileOpen(false); }} sx={{ mb: .45, borderRadius: 2.5, py: 1.05, color: activePage === item.key ? "#fff" : "rgb(230 244 242 / 70%)", "&.Mui-selected": { bgcolor: "rgb(255 255 255 / 11%)" }, "&.Mui-selected:hover, &:hover": { bgcolor: "rgb(255 255 255 / 9%)" } }}><ListItemIcon sx={{ minWidth: 39, color: activePage === item.key ? "#ff728f" : "rgb(230 244 242 / 56%)" }}>{item.icon}</ListItemIcon><ListItemText primary={<Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>{item.label}</Typography>} secondary={<Typography variant="caption" sx={{ color: "rgb(230 244 242 / 44%)", fontSize: 11 }}>{item.caption}</Typography>} /></ListItemButton>)}</List>
    <Box sx={{ mt: "auto", m: 1.25, p: 1.5, borderRadius: 3, bgcolor: "rgb(94 222 194 / 9%)", border: "1px solid rgb(94 222 194 / 12%)" }}><Stack direction="row" spacing={.8} sx={{ alignItems: "center" }}><Box className="status-pulse" sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#65e8d1" }} /><Typography variant="caption" sx={{ color: "#bff9ed", fontWeight: 800 }}>Hạ tầng sẵn sàng</Typography></Stack><Typography variant="caption" sx={{ mt: .7, display: "block", color: "rgb(225 244 241 / 57%)", lineHeight: 1.5 }}>S3 Ceph · pipeline nội bộ · Map Auth</Typography></Box>
    <Box sx={{ px: 1.25, pb: 1.25 }}><Button fullWidth variant="outlined" color="inherit" startIcon={<LogOut size={17} />} onClick={() => void logout()}>Đăng xuất</Button></Box>
  </Box>;

  return <SessionGate><Box sx={{ display: "flex", minHeight: "100dvh", bgcolor: "background.default" }}>
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}><Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: drawerWidth, bgcolor: "#102128" } }}>{drawer}</Drawer><Drawer variant="permanent" open sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", border: 0, bgcolor: "#102128" } }}>{drawer}</Drawer></Box>
    <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}><AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e4eaea", bgcolor: "rgb(251 252 252 / 88%)", backdropFilter: "blur(16px)" }}><Toolbar sx={{ minHeight: "70px !important", justifyContent: "space-between", px: { xs: 2, sm: 3.5 } }}><Stack direction="row" spacing={1.3} sx={{ alignItems: "center" }}><IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: "none" } }}><Menu /></IconButton><Box><Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.1 }}>GEODATA WORKSPACE</Typography><Typography sx={{ fontWeight: 750, fontSize: 15 }}>{navigation.find((item) => item.key === activePage)?.label}</Typography></Box></Stack><Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}><Tooltip title="Thông báo"><IconButton size="small" sx={{ border: "1px solid #e3e8e7" }}><Bell size={18} /></IconButton></Tooltip><Button component="a" href={mapUrl} target="_blank" rel="noreferrer" variant="outlined" size="small" startIcon={<ExternalLink size={15} />} sx={{ display: { xs: "none", sm: "inline-flex" } }}>Mở WebGIS</Button><Stack direction="row" spacing={1} sx={{ alignItems: "center", pl: .4 }}><Avatar sx={{ width: 34, height: 34, bgcolor: "primary.light", color: "primary.dark", fontSize: 14, fontWeight: 800 }}>{user?.name.slice(0, 1).toUpperCase()}</Avatar><Box sx={{ display: { xs: "none", sm: "block" } }}><Typography variant="body2" sx={{ fontWeight: 750, lineHeight: 1.15 }}>{user?.name}</Typography><Typography variant="caption" color="text.secondary">WebGIS admin</Typography></Box></Stack></Stack></Toolbar></AppBar>
      <Box sx={{ p: { xs: 2, sm: 3.5 }, maxWidth: 1540, mx: "auto" }}>{activePage === "overview" && <DashboardPage onNavigate={setActivePage} />}{activePage === "datasets" && <DatasetsPage />}{activePage === "pipeline" && <PlaceholderPage icon={<Workflow size={25} />} title="Pipeline GDAL" description="Job queue, tiến độ, retry và log xử lý sẽ kết nối vào Geodata API ở bước backend." />}{activePage === "styles" && <StyleStudioPage />}{activePage === "releases" && <PlaceholderPage icon={<Send size={25} />} title="Map releases" description="Tạo map, chọn basemap/overlay, gán style version và publish qua catalog tương thích WebGIS." />}{activePage === "access" && <PlaceholderPage icon={<FileStack size={25} />} title="Phân quyền" description="Gán publication cho user, group hoặc organization lấy từ db-auth." />}</Box>
    </Box>
  </Box></SessionGate>;
}
