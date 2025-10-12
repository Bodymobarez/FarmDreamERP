import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { insertReceptionSchema, type InsertReception, insertSupplierSchema, type InsertSupplier } from "@shared/schema";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Loader2, Calculator, TrendingUp, DollarSign, Weight, Package, User, Calendar, FileText, Check, ChevronsUpDown, UserPlus, AlertCircle, Info, Truck, Scale, Hash, Save, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Component for adding a new supplier
function AddSupplierDialog({ onSupplierAdded }: { onSupplierAdded: (supplier: any) => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertSupplier>({
    resolver: zodResolver(insertSupplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      taxNumber: "",
      balance: "0",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertSupplier) => {
      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إضافة المورد");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      toast({
        title: "تم بنجاح",
        description: "تم إضافة المورد بنجاح",
      });
      onSupplierAdded(data);
      form.reset();
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

  const onSubmit = (data: InsertSupplier) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <UserPlus className="w-4 h-4" />
          إضافة مورد جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            إضافة مورد جديد
          </DialogTitle>
          <DialogDescription>
            أدخل بيانات المورد الجديد
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المورد *</FormLabel>
                    <FormControl>
                      <Input placeholder="اسم المورد" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input placeholder="01xxxxxxxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرقم الضريبي</FormLabel>
                    <FormControl>
                      <Input placeholder="الرقم الضريبي" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Textarea placeholder="عنوان المورد" {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ملاحظات إضافية" {...field} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={mutation.isPending}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                حفظ المورد
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AddReceptionDialog() {
  const [open, setOpen] = useState(false);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [selectedAnimalType, setSelectedAnimalType] = useState<string>("");
  const [isNewborn, setIsNewborn] = useState(false); // للمواليد الجديدة
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // نظام تصنيف الحيوانات الشامل - النوع والسلالة
  const animalCategories = {
    "أبقار": {
      icon: "🐄",
      breeds: [
        "بقر بلدي",
        "بقر فريزيان",
        "بقر هولشتاين",
        "بقر سيمنتال",
        "بقر براون سويس",
        "بقر جيرسي",
        "بقر مونتبليارد",
        "بقر ليموزين",
        "بقر شارولية",
        "بقر أنجس",
        "بقر هيريفورد",
        "بقر خليط (هجين)"
      ]
    },
    "جواميس": {
      icon: "🐃",
      breeds: [
        "جاموس بلدي مصري",
        "جاموس مراح (هندي)",
        "جاموس نيلي رافي",
        "جاموس سورتي",
        "جاموس جافارابادي",
        "جاموس خليط"
      ]
    },
    "أغنام": {
      icon: "🐑",
      breeds: [
        "غنم برقي",
        "غنم أوسيمي",
        "غنم رحماني",
        "غنم نجدي",
        "غنم نعيمي",
        "غنم عواسي",
        "غنم بلدي",
        "غنم صعيدي",
        "غنم سوداني",
        "غنم فلاحي",
        "غنم أسترالي (ميرينو)",
        "غنم خليط"
      ]
    },
    "ماعز": {
      icon: "🐐",
      breeds: [
        "ماعز بلدي",
        "ماعز زرايبي",
        "ماعز برقي",
        "ماعز دمشقي (شامي)",
        "ماعز نجدي",
        "ماعز بور",
        "ماعز سانن",
        "ماعز ألباين",
        "ماعز نوبي",
        "ماعز خليط"
      ]
    },
    "جمال": {
      icon: "🐫",
      breeds: [
        "جمل مغربي",
        "جمل سوداني",
        "جمل سوري (شامي)",
        "جمل عربي",
        "جمل بختيان (سنامين)",
        "جمل بركاوي",
        "جمل مصري بلدي",
        "جمل خليط"
      ]
    }
  };

  // Fetch suppliers
  const { data: suppliers = [] } = useQuery({
    queryKey: ["/api/suppliers"],
    queryFn: async () => {
      const response = await fetch("/api/suppliers");
      if (!response.ok) throw new Error("فشل في جلب الموردين");
      return response.json();
    },
  });

  // Auto-generate reception number
  const generateReceptionNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    return `RCP-${year}${month}${day}-${timestamp}`;
  };

  const form = useForm<InsertReception>({
    resolver: zodResolver(insertReceptionSchema),
    defaultValues: {
      receptionNumber: generateReceptionNumber(),
      animalType: "",
      animalBreed: "",
      totalAnimals: "",
      totalWeight: "",
      totalPrice: "",
      supplier: "",
      status: "pending",
      notes: "",
    },
  });

  // Update supplier field when selected
  useEffect(() => {
    if (selectedSupplierId) {
      const supplier = suppliers.find((s: any) => s.id === selectedSupplierId);
      if (supplier) {
        form.setValue("supplier", supplier.name);
      }
    }
  }, [selectedSupplierId, suppliers, form]);

  // Reset and regenerate reception number when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedSupplierId("");
      setSelectedAnimalType("");
      setIsNewborn(false);
      form.reset({
        receptionNumber: generateReceptionNumber(),
        animalType: "",
        animalBreed: "",
        totalAnimals: "",
        totalWeight: "",
        totalPrice: "",
        supplier: "",
        status: "pending",
        notes: "",
      });
    }
  }, [open]);

  // Auto-set price to 0 for newborns
  useEffect(() => {
    if (isNewborn) {
      form.setValue("totalPrice", "0");
      form.setValue("supplier", "مواليد داخلية");
    } else if (form.getValues("supplier") === "مواليد داخلية") {
      form.setValue("supplier", "");
    }
  }, [isNewborn, form]);

  // Handle new supplier added
  const handleSupplierAdded = (newSupplier: any) => {
    setSelectedSupplierId(newSupplier.id);
    setSupplierOpen(false);
  };

  // Calculate derived values
  const totalAnimals = form.watch("totalAnimals");
  const totalWeight = form.watch("totalWeight");
  const totalPrice = form.watch("totalPrice");

  const avgWeightPerAnimal = totalAnimals && totalWeight 
    ? (parseFloat(totalWeight) / parseFloat(totalAnimals)).toFixed(2)
    : "0";

  const pricePerKg = totalWeight && totalPrice
    ? (parseFloat(totalPrice) / parseFloat(totalWeight)).toFixed(2)
    : "0";

  const pricePerAnimal = totalAnimals && totalPrice
    ? (parseFloat(totalPrice) / parseFloat(totalAnimals)).toFixed(2)
    : "0";

  const mutation = useMutation({
    mutationFn: async (data: InsertReception) => {
      const response = await fetch("/api/receptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إضافة الاستقبال");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/receptions"] });
      toast({
        title: "تم بنجاح",
        description: "تم إضافة دفعة الاستقبال بنجاح",
      });
      form.reset();
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

  const onSubmit = (data: InsertReception) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="w-5 h-5 ml-2" />
          إضافة دفعة استقبال
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            إضافة دفعة استقبال جديدة
          </DialogTitle>
          <DialogDescription className="text-base">
            سجل معلومات الدفعة المستلمة من الحيوانات مع البيانات التفصيلية والحسابات التلقائية
          </DialogDescription>
          
          {/* Info Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-700">
              💡 سيتم حساب متوسط الوزن والسعر تلقائياً بناءً على البيانات المدخلة
            </AlertDescription>
          </Alert>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">المعلومات الأساسية</h3>
              </div>
              <Separator />
              
              {/* نوع الاستقبال - شراء أو مواليد */}
              <div className="bg-muted/50 p-4 rounded-lg border-2 border-dashed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isNewborn ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {isNewborn ? '🍼' : '🛒'}
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {isNewborn ? 'مواليد جديدة' : 'شراء من مورد'}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {isNewborn 
                          ? 'المواليد الداخلية - بدون تكلفة شراء' 
                          : 'استقبال دفعة من مورد خارجي'}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={isNewborn ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsNewborn(!isNewborn)}
                    className="gap-2"
                  >
                    {isNewborn ? '✓ مواليد' : 'تحويل لمواليد'}
                  </Button>
                </div>
                {isNewborn && (
                  <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-200">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">ℹ️</span>
                      <p className="text-xs text-green-700">
                        <strong>ملاحظة:</strong> المواليد الجديدة لها تكلفة = 0 ولا تحتاج مورد. 
                        يتم احتساب تكاليف الإنتاج (الأعلاف والعلاج) على الدفعة الأم.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="receptionNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        رقم الاستقبال *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="تم التوليد تلقائياً" 
                          {...field} 
                          className="font-mono bg-muted"
                          readOnly
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        يتم توليد الرقم تلقائياً
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="animalType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        نوع الحيوان *
                      </FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedAnimalType(value);
                          // Reset breed when animal type changes
                          form.setValue("animalBreed", "");
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر نوع الحيوان" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(animalCategories).map(([type, data]) => (
                            <SelectItem key={type} value={type}>
                              <span className="flex items-center gap-2">
                                <span>{data.icon}</span>
                                <span>{type}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        اختر الفصيلة الرئيسية للحيوان
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="animalBreed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        السلالة/الفصيلة
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!selectedAnimalType}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              selectedAnimalType 
                                ? "اختر السلالة" 
                                : "اختر النوع أولاً"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedAnimalType && animalCategories[selectedAnimalType as keyof typeof animalCategories]?.breeds.map((breed) => (
                            <SelectItem key={breed} value={breed}>
                              {breed}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        {selectedAnimalType 
                          ? `اختر سلالة ${selectedAnimalType}` 
                          : "اختياري - حدد النوع أولاً"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {isNewborn ? 'المصدر' : 'المورد'}
                      </FormLabel>
                      {isNewborn ? (
                        <FormControl>
                          <Input 
                            value="مواليد داخلية 🍼"
                            readOnly
                            className="bg-green-50 border-green-200 text-green-700 font-semibold"
                          />
                        </FormControl>
                      ) : (
                        <div className="flex gap-2">
                          <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={supplierOpen}
                                  className={cn(
                                    "flex-1 justify-between",
                                    !selectedSupplierId && "text-muted-foreground"
                                  )}
                                >
                                  {selectedSupplierId
                                    ? suppliers.find((s: any) => s.id === selectedSupplierId)?.name
                                    : "اختر المورد"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                              <Command>
                                <CommandInput placeholder="ابحث عن مورد..." />
                                <CommandEmpty>لا يوجد موردين</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {suppliers.map((supplier: any) => (
                                    <CommandItem
                                      key={supplier.id}
                                      value={supplier.name}
                                      onSelect={() => {
                                        setSelectedSupplierId(supplier.id);
                                        setSupplierOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedSupplierId === supplier.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <div className="flex-1">
                                        <p className="font-medium">{supplier.name}</p>
                                        {supplier.phone && (
                                          <p className="text-xs text-muted-foreground">
                                            {supplier.phone}
                                          </p>
                                        )}
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <AddSupplierDialog onSupplierAdded={handleSupplierAdded} />
                        </div>
                      )}
                      <FormDescription className="text-xs">
                        {isNewborn 
                          ? 'المواليد من داخل المزرعة - لا يوجد مورد خارجي'
                          : 'اختر المورد من القائمة أو أضف مورد جديد'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 2: Quantities and Weights */}
            {/* Section 2: Quantities and Weights */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">الكميات والأوزان</h3>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalAnimals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-blue-600" />
                        إجمالي عدد الحيوانات *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="مثال: 50" 
                          min="1"
                          className="text-lg"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        عدد الحيوانات في هذه الدفعة
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-purple-600" />
                        الوزن الإجمالي (كجم) *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="مثال: 12500.50" 
                          min="0"
                          className="text-lg"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        الوزن الكلي للدفعة بالكيلوجرام
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Quick Stats Preview */}
              {totalAnimals && totalWeight && (
                <Alert className="bg-purple-50 border-purple-200">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-sm">
                    <strong>متوسط الوزن:</strong>{" "}
                    <span className="font-bold text-purple-700">
                      {avgWeightPerAnimal} كجم/حيوان
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Section 3: Pricing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">التسعير</h3>
              </div>
              <Separator />

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="totalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {isNewborn ? 'التكلفة الإجمالية (ج)' : 'السعر الإجمالي (ج) *'}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder={isNewborn ? "0" : "مثال: 250000"}
                          min="0"
                          className={cn(
                            "text-lg",
                            isNewborn && "bg-green-50 border-green-200 text-green-700 font-semibold"
                          )}
                          readOnly={isNewborn}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        {isNewborn 
                          ? '🍼 المواليد ليس لها تكلفة شراء - التكلفة = 0'
                          : 'إجمالي سعر الدفعة بالجنيه'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Automatic Calculations Card */}
            {(totalAnimals && totalWeight && totalPrice && !isNewborn) && (
              <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 border-2 border-primary/30 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calculator className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">الحسابات التلقائية</h3>
                      <p className="text-xs text-muted-foreground">معلومات محسوبة تلقائياً من البيانات المدخلة</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-white border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Scale className="w-4 h-4 text-purple-600" />
                          <p className="text-sm font-medium text-muted-foreground">متوسط الوزن للرأس</p>
                        </div>
                        <p className="text-3xl font-bold text-purple-700">{avgWeightPerAnimal}</p>
                        <p className="text-xs text-muted-foreground mt-1">كجم/حيوان</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white border-green-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <p className="text-sm font-medium text-muted-foreground">السعر للكيلو</p>
                        </div>
                        <p className="text-3xl font-bold text-green-700">{pricePerKg}</p>
                        <p className="text-xs text-muted-foreground mt-1">ج/كجم</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-white border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <p className="text-sm font-medium text-muted-foreground">السعر للرأس</p>
                        </div>
                        <p className="text-3xl font-bold text-blue-700">{pricePerAnimal}</p>
                        <p className="text-xs text-muted-foreground mt-1">ج/حيوان</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Summary Row */}
                  <div className="mt-4 p-3 bg-white/70 rounded-lg border border-dashed">
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="text-muted-foreground">إجمالي الحيوانات</p>
                        <p className="font-bold text-lg">{totalAnimals}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">إجمالي الوزن</p>
                        <p className="font-bold text-lg">{totalWeight} كجم</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">إجمالي السعر</p>
                        <p className="font-bold text-lg text-green-600">{parseFloat(totalPrice).toLocaleString()} ج</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Newborn Summary Card */}
            {(totalAnimals && totalWeight && isNewborn) && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-green-100">
                      <span className="text-2xl">🍼</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">ملخص المواليد الجديدة</h3>
                      <p className="text-xs text-green-600">مواليد داخلية بدون تكلفة شراء</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-muted-foreground mb-1">عدد المواليد</p>
                      <p className="text-3xl font-bold text-green-700">{totalAnimals}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-muted-foreground mb-1">الوزن الإجمالي</p>
                      <p className="text-3xl font-bold text-green-700">{totalWeight} كجم</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-muted-foreground mb-1">متوسط الوزن</p>
                      <p className="text-3xl font-bold text-green-700">{avgWeightPerAnimal} كجم</p>
                    </div>
                  </div>
                  
                  <Alert className="mt-4 bg-green-100 border-green-300">
                    <AlertCircle className="h-4 w-4 text-green-700" />
                    <AlertDescription className="text-sm text-green-800">
                      <strong>تذكير:</strong> تكاليف المواليد (الأعلاف والعلاج) ستُسجل على الدفعة الخاصة بها.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}

            {/* Section 4: Notes */}
            <Card className="border-amber-200 bg-amber-50/30">
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base">
                        <div className="p-1.5 rounded-md bg-amber-100">
                          <FileText className="w-4 h-4 text-amber-700" />
                        </div>
                        ملاحظات إضافية
                        <span className="text-xs text-muted-foreground font-normal">(اختياري)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="مثال: الحيوانات بحالة ممتازة، تم الفحص البيطري، ملاحظات عن النقل أو المورد..."
                          className="resize-none min-h-[100px] bg-white text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="flex items-center gap-1 text-xs">
                        <Info className="w-3 h-3" />
                        اكتب أي ملاحظات مهمة عن دفعة الاستقبال (الحالة الصحية، مشاكل النقل، تفاصيل إضافية)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Summary Before Save */}
            {totalAnimals && totalWeight && (
              <Alert className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CheckCircle className="h-5 w-5 text-primary" />
                <AlertDescription className="text-sm">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-semibold text-base">جاهز للحفظ:</span>
                    <span className="text-muted-foreground">
                      📦 {totalAnimals} حيوان
                    </span>
                    <span className="text-muted-foreground">
                      ⚖️ {totalWeight} كجم
                    </span>
                    {totalPrice && !isNewborn && (
                      <span className="text-green-600 font-medium">
                        💰 {parseFloat(totalPrice).toLocaleString()} ج
                      </span>
                    )}
                    {isNewborn && (
                      <span className="text-green-600 font-medium">
                        🍼 مواليد داخلية (بدون تكلفة)
                      </span>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            <div className="flex justify-between items-center gap-3 pt-4">
              <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span className="text-red-500">*</span> الحقول المطلوبة
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (form.formState.isDirty) {
                      if (confirm("هل تريد إغلاق النموذج؟ سيتم فقد البيانات المدخلة.")) {
                        setOpen(false);
                        form.reset();
                      }
                    } else {
                      setOpen(false);
                      form.reset();
                    }
                  }}
                  disabled={mutation.isPending}
                  size="lg"
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="ml-2 h-5 w-5" />
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={mutation.isPending || !form.formState.isValid}
                  size="lg"
                  className="min-w-[150px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="ml-2 h-5 w-5" />
                      حفظ الدفعة
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
