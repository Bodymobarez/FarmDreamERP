import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Scale } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Weights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">تسجيل الأوزان</h1>
          <p className="text-muted-foreground">إضافة قياسات الأوزان واستيراد البيانات</p>
        </div>
        <Button size="lg" variant="outline" data-testid="button-import-weights">
          <Upload className="w-5 h-5 ml-2" />
          استيراد من Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Scale className="w-6 h-6 text-primary" />
            تسجيل وزن يدوي
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="animal-select">اختر الحيوان</Label>
              <Select>
                <SelectTrigger id="animal-select" data-testid="select-animal">
                  <SelectValue placeholder="ابحث برقم الأذن..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="98">رقم 98 - عنبر 5</SelectItem>
                  <SelectItem value="75">رقم 75 - عنبر 3</SelectItem>
                  <SelectItem value="52">رقم 52 - عنبر 1</SelectItem>
                  <SelectItem value="89">رقم 89 - عنبر 5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weight">الوزن (كجم)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="مثال: 42.5"
                step="0.1"
                data-testid="input-weight"
              />
            </div>

            <div>
              <Label htmlFor="date">التاريخ</Label>
              <Input
                id="date"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                data-testid="input-date"
              />
            </div>

            <div>
              <Label htmlFor="notes">ملاحظات (اختياري)</Label>
              <Input
                id="notes"
                placeholder="أضف أي ملاحظات..."
                data-testid="input-notes"
              />
            </div>

            <Button className="w-full" size="lg" data-testid="button-save-weight">
              <Plus className="w-5 h-5 ml-2" />
              حفظ القياس
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">آخر القياسات المسجلة</h2>
          <div className="space-y-3">
            {[
              { earTag: "98", weight: 42.5, date: "18/6/2025", pen: "عنبر 5" },
              { earTag: "75", weight: 38.2, date: "18/6/2025", pen: "عنبر 3" },
              { earTag: "89", weight: 40.3, date: "17/6/2025", pen: "عنبر 5" },
              { earTag: "64", weight: 37.8, date: "17/6/2025", pen: "عنبر 3" },
            ].map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-card rounded-lg border border-card-border"
              >
                <div>
                  <p className="font-bold">رقم {record.earTag}</p>
                  <p className="text-sm text-muted-foreground">{record.pen} • {record.date}</p>
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-primary">{record.weight}</p>
                  <p className="text-xs text-muted-foreground">كجم</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
