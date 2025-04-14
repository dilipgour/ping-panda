"use client";

import { Event, EventCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { CategoryEmptyState } from "./category-empty-state";
import { client } from "@/lib/client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Card } from "@/app/components/card";
import { ArrowUpDown, BarChart, Key } from "lucide-react";
import { isAfter, isToday, startOfMonth, startOfWeek } from "date-fns";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { Heading } from "@/app/components/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

interface CategoryPageContentProps {
  hasEvents: boolean;
  category: EventCategory;
}

export const CategoryPageContent = ({
  category,
  hasEvents,
}: CategoryPageContentProps) => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: limit,
  });
  const [activeTab, setActiveTab] = useState<"today" | "week" | "month">(
    "today"
  );
  const { data: pollingData } = useQuery({
    queryKey: ["category", category.name, "hasEvents"],
    queryFn: async () => {
      const res = await client.category.pollingCategory.$get({
        name: category.name,
      });
      return await res.json();
    },
    initialData: { hasEvents },
  });

  if (!pollingData.hasEvents) {
    return <CategoryEmptyState categoryName={category.name} />;
  }

  const { data, isFetching } = useQuery({
    queryKey: [
      "events",
      category.name,
      pagination.pageIndex,
      pagination.pageSize,
      activeTab,
    ],
    queryFn: async () => {
      const res = await client.category.getEventsByCategoryName.$get({
        categoryName: category.name,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        timeRange: activeTab,
      });
      return await res.json();
    },
    refetchOnWindowFocus: false,
    enabled: pollingData.hasEvents,
  });

  const numaricFieldSums = useMemo(() => {
    if (!data?.events || data?.events.length === 0) {
      return {};
    }

    const sums: Record<
      string,
      {
        total: number;
        today: number;
        thisMonth: number;
        thisWeek: number;
      }
    > = {};

    const now = new Date();

    const weekStart = startOfWeek(now, { weekStartsOn: 0 });
    const monthStart = startOfMonth(now);

    data.events.forEach((event) => {
      const eventDate = event.createdAt;

      Object.entries(event.fields as object).forEach(([key, value]) => {
        if (typeof value === "number") {
          if (!sums[key]) {
            sums[key] = { total: 0, thisMonth: 0, thisWeek: 0, today: 0 };
          }
          sums[key].today += value;

          if (
            isAfter(eventDate, weekStart) ||
            eventDate.getTime() === weekStart.getTime()
          ) {
            sums[key].thisWeek += value;
          }
          if (
            isAfter(eventDate, monthStart) ||
            eventDate.getTime() === monthStart.getTime()
          ) {
            sums[key].thisMonth += value;
          }
          if (isToday(eventDate)) {
            sums[key].today += value;
          }
        }
      });
    });
    return sums;
  }, [data?.events]);

  const NumericFielsSumCard = () => {
    if (Object.keys(numaricFieldSums).length === 0) {
      return null;
    }
    return Object.entries(numaricFieldSums).map(([key, value]) => {
      const relaventSum =
        activeTab === "today"
          ? value.today
          : activeTab === "week"
          ? value.thisWeek
          : value.thisMonth;
      return (
        <Card key={key} className="border-2 border-brand-700">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">{relaventSum.toFixed(2)}</p>
            <p className=" text-xs/5 text-muted-foreground">
              {activeTab == "today"
                ? "Today"
                : activeTab == "week"
                ? "This week"
                : "This month"}
            </p>
          </div>
        </Card>
      );
    });
  };

  const columns: ColumnDef<Event>[] = useMemo(
    () => [
      {
        accessorKey: "categoty",
        header: "Category",
        cell: () => <span>{category.name || "Uncategorized"}</span>,
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Date <ArrowUpDown className="size-4 ml-1" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return new Date(row.getValue("createdAt")).toLocaleString();
        },
      },

      ...(data?.events[0]
        ? Object.keys(data.events[0].fields as object).map((field) => ({
            accessorFn: (row: Event) =>
              (row.fields as Record<string, any>)[field],
            header: field,
            cell: ({ row }: { row: Row<Event> }) =>
              (row.original.fields as Record<string, any>)[field] || "-",
          }))
        : []),
      {
        accessorKey: "deliveryStatus",
        header: "Dlivery Status",
        cell: ({ row }) => (
          <span
            className={cn("px-2 py-1 text-xs rounded-full font-semibold", {
              "bg-green-100 text-green-800":
                row.getValue("deliveryStatus") === "SUCCESS",
              "bg-yellow-100 text-yellow-800":
                row.getValue("deliveryStatus") === "PENDING",
              "bg-red-100 text-red-800":
                row.getValue("deliveryStatus") === "FAILED",
            })}
          >
            {row.getValue("deliveryStatus") === "SUCCESS"
              ? "DELIVERED"
              : row.getValue("deliveryStatus")}
          </span>
        ),
      },
    ],
    [category.name, data?.events]
  );
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: data?.events || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((data?.eventsCount || 0) / pagination.pageSize),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", (pagination.pageIndex + 1).toString());
    searchParams.set("limit", pagination.pageSize.toString());
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }, [pagination, router]);

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as "today" | "week" | "month");
        }}
      >
        <TabsList className="mb-2">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This week</TabsTrigger>
          <TabsTrigger value="month">This month</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            <Card className="border-2 border-brand-700">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm/6 font-medium">Total Events</p>
                <BarChart className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data?.eventsCount || 0}</p>
                <p className=" text-xs/5 text-muted-foreground">
                  {activeTab == "today"
                    ? "Today"
                    : activeTab == "week"
                    ? "This week"
                    : "This month"}
                </p>
              </div>
            </Card>

            <NumericFielsSumCard />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex w-full flex-col gap-4">
            <Heading className="text-3xl">Event overview</Heading>
          </div>
        </div>

        <Card contentClassName="px-6 py-4">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroups) => (
                <TableRow key={headerGroups.id}>
                  {headerGroups.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isFetching ? (
                [...Array(3)].map((_, idx) => (
                  <TableRow key={idx}>
                    {columns.map((_, cellidx) => (
                      <TableCell key={cellidx}>
                        <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="h-24 text-center"
                    colSpan={columns.length}
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
      <div className="flex items-center justify-end py-4 space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isFetching}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isFetching}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
