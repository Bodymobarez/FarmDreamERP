import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface FilterBarProps {
  searchPlaceholder?: string;
  showPenFilter?: boolean;
  showBatchFilter?: boolean;
  showStatusFilter?: boolean;
  onSearchChange?: (value: string) => void;
  onPenChange?: (value: string) => void;
  onBatchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
}

export function FilterBar({
  searchPlaceholder = "بحث...",
  showPenFilter = false,
  showBatchFilter = false,
  showStatusFilter = false,
  onSearchChange,
  onPenChange,
  onBatchChange,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={searchPlaceholder}
            className="pr-10"
            onChange={(e) => onSearchChange?.(e.target.value)}
            data-testid="input-search"
          />
        </div>
      </div>

      {showPenFilter && (
        <Select onValueChange={onPenChange}>
          <SelectTrigger className="w-[180px]" data-testid="select-pen">
            <SelectValue placeholder="جميع العنابر" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع العنابر</SelectItem>
            <SelectItem value="pen1">عنبر 1</SelectItem>
            <SelectItem value="pen3">عنبر 3</SelectItem>
            <SelectItem value="pen5">عنبر 5</SelectItem>
          </SelectContent>
        </Select>
      )}

      {showBatchFilter && (
        <Select onValueChange={onBatchChange}>
          <SelectTrigger className="w-[180px]" data-testid="select-batch">
            <SelectValue placeholder="جميع الدفعات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الدفعات</SelectItem>
            <SelectItem value="batch1">الدفعة الأولى</SelectItem>
            <SelectItem value="batch2">الدفعة الثانية</SelectItem>
            <SelectItem value="batch3">الدفعة الثالثة</SelectItem>
          </SelectContent>
        </Select>
      )}

      {showStatusFilter && (
        <Select onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]" data-testid="select-status">
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="sold">مُباع</SelectItem>
            <SelectItem value="dead">نافق</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Button variant="outline" data-testid="button-filter">
        <Filter className="w-4 h-4 ml-2" />
        فلترة متقدمة
      </Button>
    </div>
  );
}
