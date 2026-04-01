import React, { useState } from "react";
import { 
  ClipboardList, 
  Loader2, 
  AlertTriangle, 
  Search,
  Calendar,
  User,
  Activity as ActivityIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useGetActivitiesQuery } from "@/store/api/activityApi";
import { Badge } from "@/components/ui/badge";

export default function ActivitiesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  
  const { data, isLoading, error, isFetching } = useGetActivitiesQuery({ page, limit });

  const activities = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 15, totalPages: 1 };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <h3 className="text-lg font-semibold text-slate-800">Loading system logs...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-destructive">Failed to load activities</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {error?.data?.message || "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">System Audit Logs</h1>
        <p className="text-slate-500 font-medium italic">
          Track all security-relevant actions and system state changes.
        </p>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardHeader className="flex flex-row items-center justify-between py-4 bg-slate-50/50">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <ActivityIcon className="h-4 w-4 text-primary" />
              Activity Stream
            </CardTitle>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded border">
            {meta.total} Total Events
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px] pl-6 font-bold uppercase text-[10px] tracking-wider">Timestamp</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-wider">Action Description</TableHead>
                <TableHead className="w-[120px] text-right pr-6 font-bold uppercase text-[10px] tracking-wider">Event ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-slate-400 italic">
                    No activities recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                activities.map((log) => (
                  <TableRow key={log.id} className="group transition-colors hover:bg-slate-50/50">
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 tabular-nums">
                            {new Date(log.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                         <div className="h-2 w-2 rounded-full bg-primary/40 group-hover:scale-125 transition-transform" />
                         <p className="text-sm text-slate-800 font-medium leading-relaxed max-w-2xl">
                           {log.text}
                         </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6 whitespace-nowrap">
                       <Badge variant="outline" className="font-mono text-[9px] bg-slate-50 text-slate-500 border-slate-200">
                         {log.id.slice(-8).toUpperCase()}
                       </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {meta.totalPages > 1 && (
            <div className="py-4 border-t px-6 bg-slate-50/20">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page - 1);
                      }}
                      className={page === 1 ? "pointer-events-none opacity-40 text-slate-400" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {[...Array(meta.totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i + 1);
                        }}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page + 1);
                      }}
                      className={page === meta.totalPages ? "pointer-events-none opacity-40 text-slate-400" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
