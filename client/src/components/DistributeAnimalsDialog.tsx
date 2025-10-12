import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2, Trash2, Plus, AlertCircle, CheckCircle2, Package, Scale, DollarSign, Hash, Target, Layers, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface Reception {
  id: string;
  receptionNumber: string;
  animalType: string;
  animalBreed?: string;
  totalAnimals: string;
  totalWeight: string;
  totalPrice: string;
  supplier?: string;
}

interface Props {
  reception: Reception;
}

const animalDistributionSchema = z.object({
  earTag: z.string().min(1, "رقم الأذن مطلوب"),
  sex: z.enum(["ذكر", "أنثى"]),
  birthDate: z.string().optional(),
  weight: z.string().min(1, "الوزن مطلوب"),
  healthStatus: z.enum(["ممتاز", "جيد", "متوسط", "يحتاج فحص"]).default("جيد"),
  penNumber: z.string().min(1, "رقم العنبر مطلوب"),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
});

type AnimalDistribution = z.infer<typeof animalDistributionSchema>;

export function DistributeAnimalsDialog({ reception }: Props) {
  const [open, setOpen] = useState(false);
  const [animals, setAnimals] = useState<AnimalDistribution[]>([]);
  const [autoIncrement, setAutoIncrement] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pens and batches
  const { data: pens = [] } = useQuery({
    queryKey: ["/api/pens"],
    queryFn: async () => {
      const response = await fetch("/api/pens");
      if (!response.ok) throw new Error("فشل في جلب العنابر");
      return response.json();
    },
  });

  const { data: batches = [] } = useQuery({
    queryKey: ["/api/batches"],
    queryFn: async () => {
      const response = await fetch("/api/batches");
      if (!response.ok) throw new Error("فشل في جلب الدفعات");
      return response.json();
    },
  });

  const form = useForm<AnimalDistribution>({
    resolver: zodResolver(animalDistributionSchema),
    defaultValues: {
      earTag: "",
      sex: "ذكر",
      birthDate: "",
      weight: "",
      healthStatus: "جيد",
      penNumber: "",
      batchNumber: "",
      notes: "",
    },
  });

  // Auto-generate ear tag
  useEffect(() => {
    if (autoIncrement && animals.length > 0) {
      const lastEarTag = animals[animals.length - 1].earTag;
      const match = lastEarTag.match(/(\d+)$/);
      if (match) {
        const nextNumber = parseInt(match[1]) + 1;
        const prefix = lastEarTag.substring(0, lastEarTag.length - match[1].length);
        form.setValue("earTag", prefix + nextNumber.toString().padStart(match[1].length, '0'));
      }
    }
  }, [animals.length, autoIncrement]);

  const addAnimal = (data: AnimalDistribution) => {
    setAnimals([...animals, data]);
    form.reset();
    toast({
      title: "تمت الإضافة",
      description: `تمت إضافة الحيوان رقم ${data.earTag}`,
    });
  };

  const removeAnimal = (index: number) => {
    setAnimals(animals.filter((_, i) => i !== index));
  };

  const totalDistributedWeight = animals.reduce(
    (sum, animal) => sum + parseFloat(animal.weight || "0"),
    0
  );

  const remainingAnimals = parseInt(reception.totalAnimals) - animals.length;
  const remainingWeight = parseFloat(reception.totalWeight) - totalDistributedWeight;
  const distributionProgress = (animals.length / parseInt(reception.totalAnimals)) * 100;

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/receptions/${reception.id}/distribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animals: animals.map((animal) => ({
            ...animal,
            animalType: reception.animalType,
            receptionId: reception.id,
            // حساب التكلفة بناءً على الوزن
            calculatedCost: (
              (parseFloat(animal.weight) / parseFloat(reception.totalWeight)) *
              parseFloat(reception.totalPrice)
            ).toFixed(2),
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في توزيع الحيوانات");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/receptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "تم بنجاح",
        description: "تم توزيع الحيوانات وإضافتها بنجاح",
      });
      setAnimals([]);
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitDistribution = () => {
    if (animals.length === 0) {
      toast({
        title: "تنبيه",
        description: "يجب إضافة حيوان واحد على الأقل",
        variant: "destructive",
      });
      return;
    }

    if (animals.length > parseInt(reception.totalAnimals)) {
      toast({
        title: "تنبيه",
        description: "عدد الحيوانات المضافة أكبر من العدد الإجمالي",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <ArrowRight className="w-4 h-4 ml-2" />
          توزيع الحيوانات
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            توزيع حيوانات - {reception.receptionNumber}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-base">
            {reception.animalType}
            {reception.animalBreed && <Badge variant="outline">{reception.animalBreed}</Badge>}
            {reception.supplier && (
              <span className="text-xs text-muted-foreground">
                • المورد: {reception.supplier}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" />
              تقدم التوزيع
            </h3>
            <Badge variant={remainingAnimals === 0 ? "default" : "secondary"}>
              {animals.length} / {reception.totalAnimals} حيوان
            </Badge>
          </div>
          <Progress value={distributionProgress} className="h-2" />
          
          {remainingAnimals > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                متبقي: <strong>{remainingAnimals}</strong> حيوان • 
                <strong className="mr-1">{remainingWeight.toFixed(2)}</strong> كجم
              </AlertDescription>
            </Alert>
          )}
          
          {remainingAnimals === 0 && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                ✅ تم توزيع جميع الحيوانات! يمكنك الحفظ الآن.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-600" />
                العدد الإجمالي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{reception.totalAnimals}</div>
              <p className="text-xs text-muted-foreground mt-1">
                تم إضافة: {animals.length} • متبقي: {remainingAnimals}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-600" />
                الوزن الإجمالي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{reception.totalWeight} كجم</div>
              <p className="text-xs text-muted-foreground mt-1">
                تم توزيع: {totalDistributedWeight.toFixed(2)} كجم
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                السعر الإجمالي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {parseFloat(reception.totalPrice).toLocaleString()} ج
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                متوسط السعر: {(parseFloat(reception.totalPrice) / parseFloat(reception.totalWeight)).toFixed(2)} ج/كجم
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-600" />
                متوسط الوزن
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">
                {(parseFloat(reception.totalWeight) / parseInt(reception.totalAnimals)).toFixed(2)} كجم
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                للحيوان الواحد
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Add Animal Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4" />
              إضافة حيوان جديد
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoIncrement}
                  onChange={(e) => setAutoIncrement(e.target.checked)}
                  className="rounded"
                />
                ترقيم تلقائي
              </label>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addAnimal)} className="space-y-4">
              {/* Row 1: Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="earTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        رقم الأذن *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="001" 
                          {...field}
                          className="font-mono"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">الجنس *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ذكر">🐂 ذكر</SelectItem>
                          <SelectItem value="أنثى">🐄 أنثى</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs flex items-center gap-1">
                        <Scale className="w-3 h-3" />
                        الوزن (كجم) *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="250.5" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">تاريخ الميلاد</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: Location & Health */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="penNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        العنبر *
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر العنبر" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {pens.length > 0 ? (
                            pens.map((pen: any) => (
                              <SelectItem key={pen.id} value={pen.penNumber}>
                                {pen.penNumber} - {pen.penName}
                              </SelectItem>
                            ))
                          ) : (
                            Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={i + 1} value={`عنبر ${i + 1}`}>
                                عنبر {i + 1}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="batchNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        الدفعة
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الدفعة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {batches.length > 0 ? (
                            batches.map((batch: any) => (
                              <SelectItem key={batch.id} value={batch.batchNumber}>
                                {batch.batchNumber} - {batch.batchName}
                              </SelectItem>
                            ))
                          ) : (
                            Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={i + 1} value={`دفعة-${i + 1}`}>
                                دفعة {i + 1}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        اختياري
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="healthStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">الحالة الصحية</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ممتاز">✅ ممتاز</SelectItem>
                          <SelectItem value="جيد">👍 جيد</SelectItem>
                          <SelectItem value="متوسط">⚠️ متوسط</SelectItem>
                          <SelectItem value="يحتاج فحص">🏥 يحتاج فحص</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">ملاحظات</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ملاحظات إضافية" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                size="sm" 
                className="w-full"
                disabled={remainingAnimals <= 0}
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة الحيوان ({remainingAnimals} متبقي)
              </Button>
            </form>
          </Form>
        </div>

        <Separator />

        {/* Animals List */}
        {animals.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                الحيوانات المضافة ({animals.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm('هل تريد حذف جميع الحيوانات المضافة؟')) {
                    setAnimals([]);
                  }
                }}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                حذف الكل
              </Button>
            </div>
            
            <div className="max-h-80 overflow-y-auto space-y-2 bg-muted/30 p-3 rounded-lg">
              {animals.map((animal, index) => {
                const calculatedCost =
                  (parseFloat(animal.weight) / parseFloat(reception.totalWeight)) *
                  parseFloat(reception.totalPrice);
                  
                const healthStatusColors: Record<string, string> = {
                  "ممتاز": "bg-green-100 text-green-700 border-green-200",
                  "جيد": "bg-blue-100 text-blue-700 border-blue-200",
                  "متوسط": "bg-yellow-100 text-yellow-700 border-yellow-200",
                  "يحتاج فحص": "bg-red-100 text-red-700 border-red-200",
                };
                
                return (
                  <Card key={index} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Column 1 */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="font-mono text-base">
                                {animal.earTag}
                              </Badge>
                              <Badge variant={animal.sex === "ذكر" ? "default" : "outline"}>
                                {animal.sex === "ذكر" ? "🐂" : "🐄"} {animal.sex}
                              </Badge>
                            </div>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-2">
                                <Scale className="w-3 h-3 text-muted-foreground" />
                                <span className="font-semibold text-purple-700">{animal.weight} كجم</span>
                              </div>
                              {animal.birthDate && (
                                <div className="text-xs text-muted-foreground">
                                  📅 {new Date(animal.birthDate).toLocaleDateString('ar-EG')}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Column 2 */}
                          <div className="space-y-2">
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-2">
                                <Layers className="w-3 h-3 text-muted-foreground" />
                                <span className="font-medium">{animal.penNumber}</span>
                              </div>
                              {animal.batchNumber && (
                                <div className="flex items-center gap-2">
                                  <Package className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs">{animal.batchNumber}</span>
                                </div>
                              )}
                            </div>
                            <Badge 
                              className={`text-xs ${healthStatusColors[animal.healthStatus || "جيد"]}`}
                              variant="outline"
                            >
                              {animal.healthStatus || "جيد"}
                            </Badge>
                          </div>
                          
                          {/* Column 3 */}
                          <div className="space-y-2">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                              <div className="text-xs text-muted-foreground mb-1">التكلفة المحسوبة</div>
                              <div className="text-lg font-bold text-green-700 flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {calculatedCost.toFixed(2)} ج
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {(calculatedCost / parseFloat(animal.weight)).toFixed(2)} ج/كجم
                              </div>
                            </div>
                            {animal.notes && (
                              <div className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded p-2">
                                💡 {animal.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAnimal(index)}
                          className="shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Summary Footer */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">إجمالي الحيوانات</div>
                    <div className="text-2xl font-bold text-blue-700">{animals.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">إجمالي الوزن</div>
                    <div className="text-2xl font-bold text-purple-700">{totalDistributedWeight.toFixed(2)} كجم</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">إجمالي التكلفة</div>
                    <div className="text-2xl font-bold text-green-700">
                      {animals.reduce((sum, a) => 
                        sum + (parseFloat(a.weight) / parseFloat(reception.totalWeight)) * parseFloat(reception.totalPrice), 0
                      ).toFixed(2)} ج
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">متوسط الوزن</div>
                    <div className="text-2xl font-bold text-orange-700">
                      {(totalDistributedWeight / animals.length).toFixed(2)} كجم
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSubmitDistribution}
            disabled={mutation.isPending || animals.length === 0}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            حفظ التوزيع ({animals.length} حيوان)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
