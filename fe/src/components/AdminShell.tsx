import { useState, type FormEvent, type ReactNode } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import {
  Boxes,
  Database,
  ExternalLink,
  FileStack,
  Gauge,
  Menu,
  Paintbrush,
  Send,
  ShieldCheck,
  Workflow
} from "lucide-react";
import { useAuth } from "../auth";
import { DashboardPage } from "../pages/DashboardPage";
import { DatasetsPage } from "../pages/DatasetsPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { StyleStudioPage } from "../pages/StyleStudioPage";

const drawerWidth = 264;
type PageKey = "overview" | "datasets" | "pipeline" | "styles" | "releases" | "access";

const navigation: { key: PageKey; label: string; icon: ReactNode }[] = [
  { key: "overview", label: "Tổng quan", icon: <Gauge size={19} /> },
  { key: "datasets", label: "Dataset & raw files", icon: <Database size={19} /> },
  { key: "pipeline", label: "Pipeline GDAL", icon: <Workflow size={19} /> },
  { key: "styles", label: "Style Studio", icon: <Paintbrush size={19} /> },
  { key: "releases", label: "Map releases", icon: <Send size={19} /> },
  { key: "access", label: "Quyền truy cập", icon: <ShieldCheck size={19} /> }
];

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
  if (isLoading) {
    return <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  }
  if (!user) {
    return (
      <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 3 }}>
        <Stack component="form" onSubmit={(event) => void signIn(event)} spacing={2} sx={{ width: "100%", maxWidth: 460 }}>
          <Typography variant="h4">Geodata Control</Typography>
          <TextField autoComplete="email" label="WebGIS email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus />
          <TextField autoComplete="current-password" label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button variant="contained" type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in…" : "Sign in with WebGIS"}</Button>
          <Typography color="text.secondary">Đăng nhập bằng tài khoản WebGIS admin để quản lý dữ liệu geodata.</Typography>
          <Button variant="contained" component="a" href={import.meta.env.VITE_MAP_LOGIN_URL || "http://localhost:8080/login"}>Mở trang đăng nhập WebGIS</Button>
        </Stack>
      </Box>
    );
  }
  if (user.role !== "admin") {
    return (
      <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 3 }}>
        <Stack spacing={1} sx={{ maxWidth: 460 }}><Typography variant="h5">Không có quyền truy cập</Typography><Typography color="text.secondary">Chỉ tài khoản có role admin trong WebGIS được dùng Geodata Control.</Typography></Stack>
      </Box>
    );
  }
  return <>{children}</>;
}

export function AdminShell() {
  const [activePage, setActivePage] = useState<PageKey>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2.5, pt: 2.75, pb: 2 }}>
        <Stack direction="row" spacing={1.2} sx={{ alignItems: "center" }}>
          <Box sx={{ width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: 2, bgcolor: "primary.main", color: "primary.contrastText" }}><Boxes size={22} /></Box>
          <Box><Typography sx={{ fontWeight: 800 }}>Geodata Control</Typography><Typography variant="caption" color="text.secondary">Tile platform · offline</Typography></Box>
        </Stack>
      </Box>
      <Divider />
      <List sx={{ px: 1.25, py: 1.5 }}>
        {navigation.map((item) => (
          <ListItemButton key={item.key} selected={activePage === item.key} onClick={() => { setActivePage(item.key); setMobileOpen(false); }} sx={{ mb: 0.5, borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon><ListItemText primary={<Typography sx={{ fontWeight: activePage === item.key ? 750 : 500, fontSize: 14 }}>{item.label}</Typography>} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ mt: "auto", mx: 1.25, mb: 1.5, p: 1.25, borderRadius: 2, bgcolor: "primary.light" }}>
        <Typography variant="caption" color="primary.dark" sx={{ fontWeight: 800 }}>S3 · Ceph RGW</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>Buckets tách raw, derived và styles.</Typography>
      </Box>
    </Box>
  );

  return (
    <SessionGate>
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}>{drawer}</Drawer>
          <Drawer variant="permanent" open sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", borderRightColor: "divider" } }}>{drawer}</Drawer>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
          <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "rgba(255,255,255,.88)", backdropFilter: "blur(12px)" }}>
            <Toolbar sx={{ minHeight: "64px !important", justifyContent: "space-between" }}>
              <IconButton onClick={() => setMobileOpen(true)} sx={{ display: { md: "none" } }}><Menu /></IconButton>
              <Box sx={{ display: { xs: "none", md: "block" } }}><Typography variant="body2" color="text.secondary">Tile server / quản trị dữ liệu tập trung</Typography></Box>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                <Button component="a" href={import.meta.env.VITE_WEBGIS_MAP_URL || "http://webgis.localhost/map"} target="_blank" rel="noreferrer" variant="outlined" size="small" startIcon={<ExternalLink size={15} />}>Mở WebGIS</Button>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><Avatar sx={{ width: 34, height: 34, bgcolor: "primary.light", color: "primary.dark", fontSize: 14 }}>{user?.name.slice(0, 1).toUpperCase()}</Avatar><Box sx={{ display: { xs: "none", sm: "block" } }}><Typography variant="body2" sx={{ fontWeight: 700 }}>{user?.name}</Typography><Typography variant="caption" color="text.secondary">WebGIS admin</Typography></Box></Stack>
              </Stack>
            </Toolbar>
          </AppBar>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {activePage === "overview" && <DashboardPage onNavigate={setActivePage} />}
            {activePage === "datasets" && <DatasetsPage />}
            {activePage === "pipeline" && <PlaceholderPage icon={<Workflow size={25} />} title="Pipeline GDAL" description="Job queue, progress, retry và log xử lý sẽ kết nối vào Geodata API ở bước backend." />}
            {activePage === "styles" && <StyleStudioPage />}
            {activePage === "releases" && <PlaceholderPage icon={<Send size={25} />} title="Map releases" description="Tạo map, chọn basemap/overlay, gán style version và publish qua catalog tương thích WebGIS." />}
            {activePage === "access" && <PlaceholderPage icon={<FileStack size={25} />} title="Quyền truy cập" description="Gán publication cho user, group hoặc organization lấy từ db-auth." />}
          </Box>
        </Box>
      </Box>
    </SessionGate>
  );
}

