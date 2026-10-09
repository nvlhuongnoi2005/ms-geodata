import { Button, Tooltip } from "@mui/material";
import { Languages } from "lucide-react";
import { useI18n } from "../i18n";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  const nextLanguage = language === "vi" ? "en" : "vi";

  return (
    <Tooltip title={t("language.switch")}>
      <Button
        aria-label={t("language.switch")}
        onClick={() => setLanguage(nextLanguage)}
        size="small"
        startIcon={<Languages size={16} />}
        sx={{ minWidth: 0, px: 1.1, borderColor: "divider", color: "text.primary" }}
        variant="outlined"
      >
        {language === "vi" ? "VN" : "EN"}
      </Button>
    </Tooltip>
  );
}
