"use client";

import { useMemo, useState } from "react";
import type { Locale, Server } from "@/types/content";
import {
  getServerModeKey,
  ServerModeTabs
} from "@/components/home/ServerModeTabs";
import { ServerStatusGrid } from "@/components/home/ServerStatusGrid";

export function HomeServerBrowser({
  locale,
  servers
}: {
  locale: Locale;
  servers: Server[];
}) {
  const [activeModeKey, setActiveModeKey] = useState("all");
  const visibleServers = useMemo(() => {
    if (activeModeKey === "all") {
      return servers;
    }

    return servers.filter(
      (server) => getServerModeKey(server, locale) === activeModeKey
    );
  }, [activeModeKey, locale, servers]);

  return (
    <>
      <ServerModeTabs
        activeKey={activeModeKey}
        locale={locale}
        onModeChange={setActiveModeKey}
        servers={servers}
      />
      <ServerStatusGrid locale={locale} servers={visibleServers} />
    </>
  );
}
