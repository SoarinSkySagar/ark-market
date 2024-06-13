import type { PropsWithClassName } from "@ark-market/ui/lib/utils";
import { Button } from "@ark-market/ui/components/button";
import FiltersIcon from "@ark-market/ui/components/icons/filters-icon";
import { Input } from "@ark-market/ui/components/input";
import { cn } from "@ark-market/ui/lib/utils";

import type { WalletCollectionsApiResponse } from "../queries/getWalletData";
import type { ViewType } from "~/components/view-type-toggle-group";
import ViewTypeToggleButton from "~/components/view-type-toggle-button";
import ViewTypeToggleGroup from "~/components/view-type-toggle-group";
import PortfolioItemsFiltersModal from "./portfolio-items-filters-modal";
import PortfolioItemsSortingSelect from "./portfolio-items-sorting-select";

interface PortfolioItemsToolsBarProps {
  toggleFiltersOpen: () => void;
  viewType: ViewType;
  setViewType: (viewType: ViewType) => void;
  walletCollectionsInitialData: WalletCollectionsApiResponse;
}
export default function PortfolioItemsToolsBar({
  className,
  toggleFiltersOpen,
  viewType,
  setViewType,
  walletCollectionsInitialData,
}: PropsWithClassName<PortfolioItemsToolsBarProps>) {
  return (
    <div className={cn("bg-background", className)}>
      <div className="flex items-center gap-2 md:gap-6">
        <PortfolioItemsFiltersModal
          walletCollectionsInitialData={walletCollectionsInitialData}
        >
          <Button variant="secondary" size="icon" className="sm:hidden">
            <FiltersIcon />
          </Button>
        </PortfolioItemsFiltersModal>
        <Button
          onClick={toggleFiltersOpen}
          variant="secondary"
          size="lg"
          className="hidden sm:flex"
        >
          <FiltersIcon />
          <span>Filters</span>
        </Button>

        <Input className="flex-1" placeholder="Search item" />

        {/* <PortfolioItemsSortingSelect
          className="hidden lg:block"
          sortBy={sortBy}
          setSortBy={setSortBy}
          setSortDirection={setSortDirection}
          sortDirection={sortDirection}
        /> */}

        <ViewTypeToggleGroup
          className="hidden md:flex"
          setViewType={setViewType}
          viewType={viewType}
        />
        <ViewTypeToggleButton
          className="md:hidden"
          setViewType={setViewType}
          viewType={viewType}
        />
      </div>
    </div>
  );
}
