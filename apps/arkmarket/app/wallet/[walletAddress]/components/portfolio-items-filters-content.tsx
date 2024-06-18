"use client";

import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { validateAndParseAddress } from "starknet";

import type { PropsWithClassName } from "@ark-market/ui/lib/utils";
import { Input } from "@ark-market/ui/components/input";
import {
  cn,
  ellipsableStyles,
  focusableStyles,
  formatUnits,
} from "@ark-market/ui/lib/utils";

import type { WalletCollectionsApiResponse } from "../queries/getWalletData";
import Media from "~/components/media";
import { getWalletCollections } from "../queries/getWalletData";
import {
  walletCollectionFilterKey,
  walletCollectionFilterParser,
} from "../search-params";

interface PortfolioItemsFiltersContentProps {
  walletAddress: string;
  walletCollectionsInitialData: WalletCollectionsApiResponse;
  onFilterChange?: () => void;
}

export default function PortfolioItemsFiltersContent({
  className,
  walletCollectionsInitialData,
  walletAddress,
  onFilterChange,
}: PropsWithClassName<PortfolioItemsFiltersContentProps>) {
  const [collectionFilter, setCollectionFilter] = useQueryState(
    walletCollectionFilterKey,
    walletCollectionFilterParser,
  );

  const {
    data: infiniteData,
    // fetchNextPage,
    // hasNextPage,
    // isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["walletCollections", walletAddress],
    refetchInterval: 10_000,
    getNextPageParam: (lastPage) => lastPage.next_page,
    initialData: {
      pages: [walletCollectionsInitialData],
      pageParams: [],
    },
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      getWalletCollections({
        page: pageParam,
        walletAddress,
      }),
  });

  const walletCollections = useMemo(
    () => infiniteData?.pages.flatMap((page) => page.data),
    [infiniteData],
  );

  return (
    <div className={className}>
      <div className="sticky top-0 mx-[1px] bg-background">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">All Collections </h3>
          {infiniteData.pages[0]?.collection_count !== undefined && (
            <span className="flex h-5 items-center rounded-full bg-secondary px-1.5 text-xs font-medium text-secondary-foreground">
              {infiniteData.pages[0]?.collection_count}
            </span>
          )}
        </div>
        <Input className="mt-5" placeholder="Search collection" />

        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <p>Collection</p>
          <p>Value</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {walletCollections.map((collection) => {
          const isSelected =
            validateAndParseAddress(collection.address) ===
            validateAndParseAddress(collectionFilter ?? 0);
          return (
            <button
              key={collection.address}
              className={cn(
                "flex h-11 justify-between gap-1 rounded-xs px-2 py-1 transition-colors hover:bg-card",
                isSelected && "bg-card",
                focusableStyles,
              )}
              onClick={() => {
                void setCollectionFilter(collection.address);
                onFilterChange?.();
              }}
            >
              <div className="flex h-full items-center gap-2 overflow-hidden">
                <Media
                  src={collection.image ?? undefined}
                  alt={collection.collection_name}
                  className="h-8 w-8 rounded-xs"
                />
                <div className="flex h-full flex-col items-start justify-between overflow-hidden">
                  <p className={cn("w-full text-sm", ellipsableStyles)}>
                    {collection.collection_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Listed: {collection.user_listed_tokens}/
                    {collection.user_token_count}
                  </p>
                </div>
              </div>
              <div className="flex h-full flex-col items-end justify-between">
                <p className="text-sm">
                  {formatUnits(
                    collection.user_token_count * collection.floor,
                    18,
                  )}
                </p>
                <p
                  className={cn(
                    "text-xs text-muted-foreground",
                    ellipsableStyles,
                  )}
                >
                  Floor: {formatUnits(collection.floor, 18)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
