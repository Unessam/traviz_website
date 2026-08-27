import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Clock, Database, LockKeyhole, Play, RefreshCw, Shield } from "lucide-react";
import type { RetentionAuditEvent, RetentionRun } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RetentionPreview = {
  referenceTime: string;
  contacts: { total: number; eligible: number; legalHold: number; notDue: number; missingTimestamp: number };
  users: { total: number; eligible: number; legalHold: number; notDue: number; missingTimestamp: number; alreadyAnonymized: number };
};

type HoldTarget = "user" | "contact";
type HoldAction = "add" | "release";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) throw Object.assign(new Error("Request failed"), { status: response.status });
  return response.json();
}

async function mutationJson<T>(method: string, url: string, data: unknown): Promise<T> {
  const response = await apiRequest(method, url, data);
  return response.json();
}

function dateTimeLocalNow() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function isoFromLocal(value: string) {
  return value ? new Date(value).toISOString() : undefined;
}

function formatDate(value: string | Date | null | undefined) {
  return value ? new Date(value).toLocaleString() : "—";
}

function statusBadge(status: string) {
  if (status === "completed") return <Badge className="bg-emerald-600">Completed</Badge>;
  if (status === "failed") return <Badge variant="destructive">Failed</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}

export default function RetentionConsole() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [referenceTime, setReferenceTime] = useState(dateTimeLocalNow);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [accessUserId, setAccessUserId] = useState("");
  const [accessRemovedAt, setAccessRemovedAt] = useState(dateTimeLocalNow);
  const [holdTarget, setHoldTarget] = useState<HoldTarget>("user");
  const [holdAction, setHoldAction] = useState<HoldAction>("add");
  const [holdTargetId, setHoldTargetId] = useState("");
  const [holdReason, setHoldReason] = useState("");

  const runsQuery = useQuery<RetentionRun[], Error & { status?: number }>({
    queryKey: ["/api/admin/retention/runs?limit=20"],
    queryFn: () => fetchJson("/api/admin/retention/runs?limit=20"),
    staleTime: 0,
  });
  const isAuthorised = runsQuery.isSuccess;
  const previewQuery = useQuery<RetentionPreview>({
    queryKey: ["/api/admin/retention/preview", referenceTime],
    queryFn: () => fetchJson(`/api/admin/retention/preview?referenceTime=${encodeURIComponent(isoFromLocal(referenceTime) ?? "")}`),
    enabled: isAuthorised && Boolean(referenceTime),
    staleTime: 0,
  });
  const auditsQuery = useQuery<RetentionAuditEvent[]>({
    queryKey: ["/api/admin/retention/audit-events?limit=30"],
    queryFn: () => fetchJson("/api/admin/retention/audit-events?limit=30"),
    enabled: isAuthorised,
    staleTime: 0,
  });

  const selectedRun = useMemo(
    () => runsQuery.data?.find((run) => run.id === selectedRunId),
    [runsQuery.data, selectedRunId],
  );

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/retention/runs?limit=20"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/retention/preview"] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/retention/audit-events?limit=30"] });
  };

  const runMutation = useMutation({
    mutationFn: (dryRun: boolean) => mutationJson<RetentionRun>("POST", "/api/admin/retention/runs", {
      dryRun,
      referenceTime: dryRun ? isoFromLocal(referenceTime) : selectedRun?.referenceTime,
      ...(dryRun ? {} : { previewRunId: selectedRunId, confirmation }),
    }),
    onSuccess: (run) => {
      toast({ title: run.dryRun ? "Dry run created" : "Live retention run submitted", description: `Run ${run.id}` });
      if (run.dryRun) setSelectedRunId(run.id);
      setConfirmation("");
      refresh();
    },
    onError: (error: Error) => toast({ title: "Retention run rejected", description: error.message, variant: "destructive" }),
  });

  const accessMutation = useMutation({
    mutationFn: () => mutationJson("PATCH", `/api/admin/users/${encodeURIComponent(accessUserId)}/access-removal`, {
      removedAt: isoFromLocal(accessRemovedAt),
    }),
    onSuccess: () => {
      toast({ title: "Access removal recorded" });
      setAccessUserId("");
      refresh();
    },
    onError: (error: Error) => toast({ title: "Access removal failed", description: error.message, variant: "destructive" }),
  });

  const holdMutation = useMutation({
    mutationFn: () => {
      const segment = holdTarget === "user" ? "users" : "contact-submissions";
      return mutationJson("PATCH", `/api/admin/${segment}/${encodeURIComponent(holdTargetId)}/legal-hold`, {
        legalHold: holdAction === "add",
        reason: holdReason.trim(),
      });
    },
    onSuccess: () => {
      toast({ title: holdAction === "add" ? "Legal hold added" : "Legal hold released" });
      setHoldTargetId("");
      setHoldReason("");
      refresh();
    },
    onError: (error: Error) => toast({ title: "Legal hold change failed", description: error.message, variant: "destructive" }),
  });

  if (runsQuery.isLoading || runsQuery.error?.status === 403) return null;
  if (!isAuthorised) return null;

  const eligibleDryRuns = (runsQuery.data ?? []).filter((run) => run.dryRun && run.status === "completed");
  const liveReady = Boolean(selectedRun && confirmation === "APPLY_RETENTION" && !runMutation.isPending);

  return (
    <section className="space-y-6" data-testid="retention-console">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-charcoal">
            <Shield className="h-6 w-6 text-logo-purple" /> Retention Operations
          </h2>
          <p className="text-sm text-muted-blue">Authorised staff only. Live actions are irreversible and require a reviewed dry run.</p>
        </div>
        <Button variant="outline" onClick={refresh} data-testid="button-refresh-retention">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Preview and run</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="retention-reference-time">Reference time</label>
              <Input id="retention-reference-time" type="datetime-local" value={referenceTime} max={dateTimeLocalNow()} onChange={(e) => setReferenceTime(e.target.value)} />
            </div>
            <Button className="self-end" onClick={() => runMutation.mutate(true)} disabled={!referenceTime || runMutation.isPending} data-testid="button-create-dry-run">
              <Play className="mr-2 h-4 w-4" /> Create dry run
            </Button>
          </div>

          {previewQuery.data && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-testid="retention-preview">
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Eligible contacts</p><p className="text-2xl font-bold">{previewQuery.data.contacts.eligible}</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Eligible users</p><p className="text-2xl font-bold">{previewQuery.data.users.eligible}</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Blocked by holds</p><p className="text-2xl font-bold">{previewQuery.data.contacts.legalHold + previewQuery.data.users.legalHold}</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Missing timestamps</p><p className="text-2xl font-bold">{previewQuery.data.contacts.missingTimestamp + previewQuery.data.users.missingTimestamp}</p></div>
            </div>
          )}

          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <div className="mb-3 flex items-start gap-2 text-amber-900">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm">Select the exact completed preview you reviewed. Any candidate change after review causes the server to reject the live run.</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
              <Select value={selectedRunId} onValueChange={setSelectedRunId}>
                <SelectTrigger data-testid="select-reviewed-dry-run"><SelectValue placeholder="Select reviewed dry run" /></SelectTrigger>
                <SelectContent>
                  {eligibleDryRuns.map((run) => (
                    <SelectItem key={run.id} value={run.id}>
                      {formatDate(run.referenceTime)} · {run.contactEligible + run.usersEligible} eligible
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={confirmation} onChange={(e) => setConfirmation(e.target.value)} placeholder="Type APPLY_RETENTION" aria-label="Live run confirmation" data-testid="input-live-confirmation" />
              <Button variant="destructive" onClick={() => runMutation.mutate(false)} disabled={!liveReady} data-testid="button-submit-live-run">
                Apply retention
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Record access removal</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input value={accessUserId} onChange={(e) => setAccessUserId(e.target.value)} placeholder="User ID" aria-label="User ID for access removal" data-testid="input-access-user-id" />
            <Input type="datetime-local" value={accessRemovedAt} max={dateTimeLocalNow()} onChange={(e) => setAccessRemovedAt(e.target.value)} aria-label="Access removed at" />
            <Button onClick={() => accessMutation.mutate()} disabled={!accessUserId.trim() || !accessRemovedAt || accessMutation.isPending} data-testid="button-record-access-removal">Record removal</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole className="h-5 w-5" /> Manage legal hold</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Select value={holdTarget} onValueChange={(value: HoldTarget) => setHoldTarget(value)}>
                <SelectTrigger aria-label="Legal hold target type"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="user">User</SelectItem><SelectItem value="contact">Contact submission</SelectItem></SelectContent>
              </Select>
              <Select value={holdAction} onValueChange={(value: HoldAction) => setHoldAction(value)}>
                <SelectTrigger aria-label="Legal hold action"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="add">Add hold</SelectItem><SelectItem value="release">Release hold</SelectItem></SelectContent>
              </Select>
            </div>
            <Input value={holdTargetId} onChange={(e) => setHoldTargetId(e.target.value)} placeholder={holdTarget === "user" ? "User ID" : "Contact submission ID"} aria-label="Legal hold target ID" data-testid="input-hold-target-id" />
            <Textarea value={holdReason} onChange={(e) => setHoldReason(e.target.value)} placeholder="Required reason" maxLength={2000} aria-label="Legal hold reason" data-testid="input-hold-reason" />
            <Button onClick={() => holdMutation.mutate()} disabled={!holdTargetId.trim() || !holdReason.trim() || holdMutation.isPending} data-testid="button-change-legal-hold">
              {holdAction === "add" ? "Add legal hold" : "Release legal hold"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent runs</CardTitle></CardHeader>
          <CardContent className="max-h-[28rem] space-y-3 overflow-y-auto">
            {(runsQuery.data ?? []).map((run) => (
              <button key={run.id} type="button" onClick={() => run.dryRun && run.status === "completed" && setSelectedRunId(run.id)} className="w-full rounded-lg border p-3 text-left hover:bg-muted/50" data-testid={`retention-run-${run.id}`}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  {run.dryRun ? <Badge variant="outline">Dry run</Badge> : <Badge variant="destructive">Live</Badge>}
                  {statusBadge(run.status)}
                  <span className="ml-auto text-xs text-muted-foreground">{formatDate(run.createdAt)}</span>
                </div>
                <p className="break-all font-mono text-xs">{run.id}</p>
                <p className="mt-2 text-sm">{run.contactEligible} contacts · {run.usersEligible} users eligible · {run.blockedByLegalHold} held · {run.skipped} skipped</p>
              </button>
            ))}
            {!runsQuery.data?.length && <p className="py-6 text-center text-sm text-muted-foreground">No retention runs recorded.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Non-sensitive audit events</CardTitle></CardHeader>
          <CardContent className="max-h-[28rem] space-y-3 overflow-y-auto">
            {(auditsQuery.data ?? []).map((event) => (
              <div key={event.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-logo-purple" />
                  <span className="font-medium">{event.eventType.replaceAll("_", " ")}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{formatDate(event.createdAt)}</span>
                </div>
                <p className="mt-1 break-all text-xs text-muted-foreground">Target: {event.targetType}{event.targetId ? ` · ${event.targetId}` : ""}</p>
              </div>
            ))}
            {!auditsQuery.data?.length && <p className="py-6 text-center text-sm text-muted-foreground">No audit events recorded.</p>}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}