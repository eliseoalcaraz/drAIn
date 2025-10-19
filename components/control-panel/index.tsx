"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/components/context/AuthProvider";
import type { ControlPanelProps } from "./types";
import { DETAIL_TITLES } from "./constants";
import { useControlPanelState } from "./hooks/use-control-panel-state";
import { Sidebar } from "./components/sidebar";
import { TopBar } from "./components/top-bar";
import { ContentRenderer } from "./components/content-renderer";
import { usePipes, useInlets, useOutlets, useDrain } from "@/hooks";
import client from "@/app/api/client";
import type { DateFilterValue } from "../date-sort";

export function ControlPanel({
  reports,
  activeTab,
  dataset,
  selectedInlet,
  selectedOutlet,
  selectedDrain,
  selectedPipe,
  onTabChange,
  onDatasetChange,
  onSelectInlet,
  onSelectOutlet,
  onSelectDrain,
  onSelectPipe,
  onBack,
  overlaysVisible,
  onToggle,
  overlays,
  onToggleOverlay,
  isSimulationMode = false,
  selectedPointForSimulation = null,
  onRefreshReports,
  isRefreshingReports = false,
  selectedYear,
  onYearChange,
  onGenerateTable,
  isLoadingTable,
  onCloseTable,
  hasTable = false,
  onGenerateTable3,
  isLoadingTable3 = false,
  onCloseTable3,
  hasTable3 = false,
  selectedComponentIds = [],
  onComponentIdsChange = () => {},
  selectedPipeIds = [],
  onPipeIdsChange = () => {},
  componentParams = new Map(),
  onComponentParamsChange = () => {},
  pipeParams = new Map(),
  onPipeParamsChange = () => {},
  showNodePanel = false,
  onToggleNodePanel = () => {},
  showLinkPanel = false,
  onToggleLinkPanel = () => {},
}: ControlPanelProps & { reports: any[] }) {
  const router = useRouter();
  const supabase = client;
  const authContext = useContext(AuthContext);
  const session = authContext?.session;
  const [profile, setProfile] = useState<any>(null);
  const [publicAvatarUrl, setPublicAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      const cacheKey = `profile-${session.user.id}`;
      const cachedProfile = localStorage.getItem(cacheKey);

      if (cachedProfile) {
        const { profile: cachedData, publicAvatarUrl: cachedAvatarUrl } =
          JSON.parse(cachedProfile);
        setProfile(cachedData);
        setPublicAvatarUrl(cachedAvatarUrl);
      } else {
        const fetchProfile = async () => {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error && error.code !== "PGRST116") {
            console.error("Error fetching profile:", error);
          } else if (data) {
            const avatarUrl = data.avatar_url;
            setProfile(data);
            setPublicAvatarUrl(avatarUrl);
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ profile: data, publicAvatarUrl: avatarUrl })
            );
          }
        };
        fetchProfile();
      }
    }
  }, [session, supabase]);
  const {
    sortField,
    sortDirection,
    searchTerm,
    profileView,
    setProfileView,
    activeReportTab,
    setActiveReportTab,
    handleSort,
    handleSearch,
  } = useControlPanelState();

  // Drag control state
  const [isDragEnabled, setIsDragEnabled] = useState(false);

  const handleToggleDrag = (enabled: boolean) => {
    setIsDragEnabled(enabled);
  };

  // Date filter state
  const [dateFilter, setDateFilter] = useState<DateFilterValue>("all");

  const handleSignOut = async () => {
    // Clear any cached profile data
    const session = await supabase.auth.getSession();
    if (session?.data?.session) {
      const cacheKey = `profile-${session.data.session.user.id}`;
      localStorage.removeItem(cacheKey);
    }
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Data hooks
  const { inlets, loading: loadingInlets } = useInlets();
  const { outlets, loading: loadingOutlets } = useOutlets();
  const { pipes, loading: loadingPipes } = usePipes();
  const { drains, loading: loadingDrains } = useDrain();

  const selectedItem =
    selectedInlet || selectedPipe || selectedOutlet || selectedDrain;
  const selectedItemTitle = selectedItem ? DETAIL_TITLES[dataset] : "";

  const handleNavigateToTable = (
    dataset: "inlets" | "outlets" | "storm_drains" | "man_pipes"
  ) => {
    onDatasetChange(dataset);
    onTabChange("stats");
  };

  const handleNavigateToReportForm = () => {
    onTabChange("report");
  };

  return (
    <div className="absolute m-5 flex flex-row h-[600px] w-sm bg-white rounded-2xl overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        profile={profile}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          activeTab={activeTab}
          dataset={dataset}
          onDatasetChange={onDatasetChange}
          onSearch={handleSearch}
          onBack={onBack}
          hasSelectedItem={!!selectedItem}
          selectedItemTitle={selectedItemTitle}
          overlaysVisible={overlaysVisible}
          onToggleOverlays={onToggle}
          isDragEnabled={isDragEnabled}
          onToggleDrag={handleToggleDrag}
          onSignOut={handleSignOut}
          activeReportTab={activeReportTab}
          onReportTabChange={setActiveReportTab}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />

        {/* Main Content */}
        <div
          className={`control-panel-scroll relative flex-1 overflow-auto ${
            activeTab === "stats" ? "overflow-y-scroll" : ""
          }`}
        >
          <ContentRenderer
            activeTab={activeTab}
            dataset={dataset}
            searchTerm={searchTerm}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            inlets={inlets}
            pipes={pipes}
            outlets={outlets}
            drains={drains}
            loadingInlets={loadingInlets}
            loadingPipes={loadingPipes}
            loadingOutlets={loadingOutlets}
            loadingDrains={loadingDrains}
            selectedInlet={selectedInlet}
            selectedPipe={selectedPipe}
            selectedOutlet={selectedOutlet}
            selectedDrain={selectedDrain}
            onSelectInlet={onSelectInlet}
            onSelectPipe={onSelectPipe}
            onSelectOutlet={onSelectOutlet}
            onSelectDrain={onSelectDrain}
            overlays={overlays}
            onToggleOverlay={onToggleOverlay}
            onNavigateToTable={handleNavigateToTable}
            onNavigateToReportForm={handleNavigateToReportForm}
            isDragEnabled={isDragEnabled}
            onToggleDrag={handleToggleDrag}
            isSimulationMode={isSimulationMode}
            selectedPointForSimulation={selectedPointForSimulation}
            reports={reports}
            profileView={profileView}
            onProfileViewChange={setProfileView}
            activeReportTab={activeReportTab}
            dateFilter={dateFilter}
            onRefreshReports={onRefreshReports}
            isRefreshingReports={isRefreshingReports}
            profile={profile}
            publicAvatarUrl={publicAvatarUrl}
            setProfile={setProfile}
            selectedYear={selectedYear}
            onYearChange={onYearChange}
            onGenerateTable={onGenerateTable}
            isLoadingTable={isLoadingTable}
            onCloseTable={onCloseTable}
            hasTable={hasTable}
            onGenerateTable3={onGenerateTable3}
            isLoadingTable3={isLoadingTable3}
            onCloseTable3={onCloseTable3}
            hasTable3={hasTable3}
            setPublicAvatarUrl={setPublicAvatarUrl}
            selectedComponentIds={selectedComponentIds}
            onComponentIdsChange={onComponentIdsChange}
            selectedPipeIds={selectedPipeIds}
            onPipeIdsChange={onPipeIdsChange}
            componentParams={componentParams}
            onComponentParamsChange={onComponentParamsChange}
            pipeParams={pipeParams}
            onPipeParamsChange={onPipeParamsChange}
            showNodePanel={showNodePanel}
            onToggleNodePanel={onToggleNodePanel}
            showLinkPanel={showLinkPanel}
            onToggleLinkPanel={onToggleLinkPanel}
          />
        </div>
      </div>
    </div>
  );
}
