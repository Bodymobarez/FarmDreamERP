import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollText, Plus, Save, Printer, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JournalEntryLine {
  id: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export default function JournalEntries() {
  const { toast } = useToast();
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryNumber, setEntryNumber] = useState(`JE-${Date.now()}`);
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState<JournalEntryLine[]>([
    { id: '1', accountCode: '', accountName: '', debit: 0, credit: 0, description: '' },
    { id: '2', accountCode: '', accountName: '', debit: 0, credit: 0, description: '' },
  ]);

  const addLine = () => {
    setLines([...lines, {
      id: Date.now().toString(),
      accountCode: '',
      accountName: '',
      debit: 0,
      credit: 0,
      description: ''
    }]);
  };

  const removeLine = (id: string) => {
    if (lines.length > 2) {
      setLines(lines.filter(line => line.id !== id));
    }
  };

  const updateLine = (id: string, field: keyof JournalEntryLine, value: any) => {
    setLines(lines.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
  };

  const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSave = () => {
    if (!isBalanced) {
      toast({
        title: "❌ خطأ",
        description: "القيد غير متوازن! المدين يجب أن يساوي الدائن",
        variant: "destructive",
      });
      return;
    }

    console.log("Journal Entry:", {
      entryNumber,
      entryDate,
      description,
      lines,
      totalDebit,
      totalCredit
    });

    toast({
      title: "✅ تم الحفظ",
      description: `تم حفظ سند القيد رقم ${entryNumber}`,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ScrollText className="h-8 w-8 text-indigo-500" />
            سندات القيد اليومية
          </h1>
          <p className="text-muted-foreground mt-1">
            القيود المحاسبية والحسابات العامة
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle>📝 قيد يومية جديد</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Entry Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">رقم القيد</label>
                <Input 
                  value={entryNumber} 
                  onChange={(e) => setEntryNumber(e.target.value)}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">التاريخ</label>
                <Input 
                  type="date"
                  value={entryDate} 
                  onChange={(e) => setEntryDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">البيان العام</label>
                <Input 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف القيد..."
                />
              </div>
            </div>

            {/* Entry Lines Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-3 text-right text-sm font-medium">كود الحساب</th>
                    <th className="p-3 text-right text-sm font-medium">اسم الحساب</th>
                    <th className="p-3 text-right text-sm font-medium">البيان</th>
                    <th className="p-3 text-right text-sm font-medium w-32">مدين</th>
                    <th className="p-3 text-right text-sm font-medium w-32">دائن</th>
                    <th className="p-3 text-center text-sm font-medium w-20">حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={line.id} className="border-t hover:bg-accent/50">
                      <td className="p-2">
                        <Input
                          value={line.accountCode}
                          onChange={(e) => updateLine(line.id, 'accountCode', e.target.value)}
                          placeholder="1010"
                          className="text-center"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={line.accountName}
                          onChange={(e) => updateLine(line.id, 'accountName', e.target.value)}
                          placeholder="اسم الحساب"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={line.description}
                          onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                          placeholder="البيان..."
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={line.debit || ''}
                          onChange={(e) => updateLine(line.id, 'debit', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="text-left"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={line.credit || ''}
                          onChange={(e) => updateLine(line.id, 'credit', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="text-left"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLine(line.id)}
                          disabled={lines.length <= 2}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted font-bold">
                  <tr>
                    <td colSpan={3} className="p-3 text-left">الإجمالي</td>
                    <td className="p-3 text-left text-lg">
                      {totalDebit.toLocaleString()} ج
                    </td>
                    <td className="p-3 text-left text-lg">
                      {totalCredit.toLocaleString()} ج
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={addLine}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة سطر
              </Button>
            </div>

            {/* Balance Check */}
            <Card className={`${
              isBalanced ? 'bg-green-50 border-green-200' : 
              totalDebit > 0 || totalCredit > 0 ? 'bg-red-50 border-red-200' : 'bg-muted'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium mb-1">
                      {isBalanced ? '✅ القيد متوازن' : 
                       totalDebit > 0 || totalCredit > 0 ? '❌ القيد غير متوازن' : 
                       'ℹ️ أدخل بيانات القيد'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      الفرق: {Math.abs(totalDebit - totalCredit).toLocaleString()} ج
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">مدين</p>
                    <p className="text-2xl font-bold">{totalDebit.toLocaleString()} ج</p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">دائن</p>
                    <p className="text-2xl font-bold">{totalCredit.toLocaleString()} ج</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={!isBalanced} className="flex-1">
                <Save className="w-4 h-4 ml-2" />
                حفظ القيد
              </Button>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="w-4 h-4 ml-2" />
                طباعة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>آخر القيود المسجلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { number: "JE-001", date: "2025-10-11", description: "قيد بيع حيوانات", debit: 25000, credit: 25000 },
              { number: "JE-002", date: "2025-10-10", description: "قيد شراء أعلاف", debit: 15000, credit: 15000 },
              { number: "JE-003", date: "2025-10-09", description: "قيد صرف رواتب", debit: 30000, credit: 30000 },
            ].map((entry) => (
              <div key={entry.number} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded">
                    <ScrollText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium">{entry.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.number} • {entry.date}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">المبلغ</p>
                  <p className="text-lg font-bold">
                    {entry.debit.toLocaleString()} ج
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
