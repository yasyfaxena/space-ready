import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations, workspaceTypes } from "@/data/workspace-data";
import { cn } from "@/lib/utils";

export function SearchModule({
  className,
  defaults,
}: {
  className?: string;
  defaults?: { location?: string; date?: string; time?: string; type?: string };
}) {
  const navigate = useNavigate();
  const [location, setLocation] = useState(defaults?.location ?? "all");
  const [date, setDate] = useState(defaults?.date ?? "2026-08-25");
  const [time, setTime] = useState(defaults?.time ?? "09:00");
  const [type, setType] = useState(defaults?.type ?? "all");

  return (
    <form
      className={cn(
        "grid gap-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-lift)] md:grid-cols-[1.3fr_1fr_0.8fr_1.1fr_auto] md:items-end",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/workspaces", search: { location, date, time, type } });
      }}
    >
      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">Location</Label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((l) => (
              <SelectItem key={l.slug} value={l.slug}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground" htmlFor="search-date">
          Date
        </Label>
        <Input id="search-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground" htmlFor="search-time">
          Time
        </Label>
        <Input id="search-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>

      <div className="grid gap-1.5">
        <Label className="text-xs text-muted-foreground">Workspace type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {workspaceTypes.map((t) => (
              <SelectItem key={t.type} value={t.type}>
                {t.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" size="lg" className="h-10 gap-2">
        <Search className="size-4" /> Search
      </Button>
    </form>
  );
}
