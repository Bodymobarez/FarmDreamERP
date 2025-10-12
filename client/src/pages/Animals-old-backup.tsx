import { AnimalCard } from "@/components/AnimalCard";
import { FilterBar } from "@/components/FilterBar";
import { AddAnimalDialog } from "@/components/AddAnimalDialog";
import { AddNewbornDialog } from "@/components/AddNewbornDialog";
import { SellAnimalDialog } from "../components/SellAnimalDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Beef, TrendingUp, Activity, Scale, FileText, Download, Eye, Edit, Trash2, Package, Baby, Heart } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF, exportToExcel, exportToCSV } from "@/lib/exportUtils";

export default function Animals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [penFilter, setPenFilter] = useState("all");
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch animals from API
  const { data: animals = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  const filteredAnimals = animals.filter((animal: any) => {
    const matchesSearch = animal.earTag?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      animal.penNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || animal.animalType === typeFilter;
    const matchesStatus = statusFilter === "all" || animal.status === statusFilter;
    const matchesPen = penFilter === "all" || animal.penNumber === penFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPen;
  });

  const animalTypeStats = animals.reduce((acc: any, animal: any) => {
    acc[animal.animalType] = (acc[animal.animalType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = {
    total: animals.length,
    active: animals.filter((a: any) => a.status === "active").length,
    sold: animals.filter((a: any) => a.status === "sold").length,
    newborns: animals.filter((a: any) => a.isNewborn === true).length,
    avgWeight: animals.length > 0 
      ? (animals.reduce((sum: number, a: any) => sum + (parseFloat(a.currentWeight || "0")), 0) / animals.length).toFixed(1)
      : "0",
    totalCost: animals.reduce((sum: number, a: any) => sum + (parseFloat(a.totalCost || "0")), 0),
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/animals/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete animal");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "تم بنجاح",
        description: "تم حذف الحيوان بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حذف الحيوان",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/animals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update animal");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات الحيوان بنجاح",
      });
      setIsEditDialogOpen(false);
      setEditFormData(null);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث بيانات الحيوان",
        variant: "destructive",
      });
    },
  });

  // Export handlers
  const handleExportPDF = () => {
    const headers = [
      "رقم الأذن",
      "النوع",
      "الجنس",
      "العنبر",
      "الدفعة",
      "الوزن الحالي",
      "وزن الدخول",
      "الزيادة",
      "الحالة",
    ];
    const data = filteredAnimals.map((animal: any) => [
      animal.earTag,
      animal.animalType,
      animal.sex,
      animal.penNumber || "-",
      animal.batchNumber || "-",
      `${parseFloat(animal.currentWeight || "0").toFixed(1)} كجم`,
      `${parseFloat(animal.entryWeight || "0").toFixed(1)} كجم`,
      `${(parseFloat(animal.currentWeight || "0") - parseFloat(animal.entryWeight || "0")).toFixed(1)} كجم`,
      animal.status === "active" ? "نشط" : animal.status === "sold" ? "مُباع" : "نافق",
    ]);
    exportToPDF("قائمة الحيوانات", headers, data, "animals-list.pdf");
  };

  const handleExportExcel = () => {
    const headers = [
      "رقم الأذن",
      "النوع",
      "الجنس",
      "العنبر",
      "الدفعة",
      "الوزن الحالي",
      "وزن الدخول",
      "الزيادة",
      "الحالة",
    ];
    const data = filteredAnimals.map((animal: any) => [
      animal.earTag,
      animal.animalType,
      animal.sex,
      animal.penNumber || "-",
      animal.batchNumber || "-",
      `${parseFloat(animal.currentWeight || "0").toFixed(1)} كجم`,
      `${parseFloat(animal.entryWeight || "0").toFixed(1)} كجم`,
      `${(parseFloat(animal.currentWeight || "0") - parseFloat(animal.entryWeight || "0")).toFixed(1)} كجم`,
      animal.status === "active" ? "نشط" : animal.status === "sold" ? "مُباع" : "نافق",
    ]);
    exportToExcel("قائمة الحيوانات", headers, data, "animals-list.xlsx");
  };

  const handleExportCSV = () => {
    const headers = [
      "رقم الأذن",
      "النوع",
      "الجنس",
      "العنبر",
      "الدفعة",
      "الوزن الحالي",
      "وزن الدخول",
      "الزيادة",
      "الحالة",
    ];
    const data = filteredAnimals.map((animal: any) => [
      animal.earTag,
      animal.animalType,
      animal.sex,
      animal.penNumber || "-",
      animal.batchNumber || "-",
      `${parseFloat(animal.currentWeight || "0").toFixed(1)} كجم`,
      `${parseFloat(animal.entryWeight || "0").toFixed(1)} كجم`,
      `${(parseFloat(animal.currentWeight || "0") - parseFloat(animal.entryWeight || "0")).toFixed(1)} كجم`,
      animal.status === "active" ? "نشط" : animal.status === "sold" ? "مُباع" : "نافق",
    ]);
    exportToCSV(headers, data, "animals-list.csv");
  };

  const handleViewDetails = (animal: any) => {
    setSelectedAnimal(animal);
    setIsDetailsDialogOpen(true);
  };

  const handleEdit = (animal: any) => {
    setEditFormData({
      id: animal.id,
      earTag: animal.earTag,
      animalType: animal.animalType,
      sex: animal.sex,
      entryWeight: animal.entryWeight,
      currentWeight: animal.currentWeight,
      penNumber: animal.penNumber,
      batchNumber: animal.batchNumber,
      purchaseCost: animal.purchaseCost,
      notes: animal.notes,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (animal: any) => {
    if (confirm(`هل أنت متأكد من حذف الحيوان برقم الأذن ${animal.earTag}؟`)) {
      deleteMutation.mutate(animal.id);
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData) {
      const { id, ...data } = editFormData;
      updateMutation.mutate({ id, data });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">إدارة الحيوانات</h1>
          <p className="text-muted-foreground">عرض وإدارة جميع الحيوانات في المزرعة</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <Package className="h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <AddNewbornDialog />
          <AddAnimalDialog />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Beef className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الحيوانات</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نشط</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50/50 to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المواليد 🐄</p>
                <p className="text-2xl font-bold text-pink-600">{stats.newborns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">مُباع</p>
                <p className="text-2xl font-bold text-orange-600">{stats.sold}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">متوسط الوزن</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgWeight} كجم</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي التكلفة</p>
                <p className="text-xl font-bold text-red-600">{stats.totalCost.toLocaleString()} ج</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Animal Types Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(animalTypeStats).map(([type, count]) => (
          <Card key={type} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <Beef className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{type}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>البحث</Label>
              <Input
                placeholder="ابحث برقم الأذن..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>نوع الحيوان</Label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">جميع الأنواع</option>
                <option value="بقر">بقر</option>
                <option value="جاموس">جاموس</option>
                <option value="أغنام">أغنام</option>
                <option value="ماعز">ماعز</option>
                <option value="جمال">جمال</option>
              </select>
            </div>
            <div>
              <Label>الحالة</Label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="sold">مُباع</option>
                <option value="dead">نافق</option>
              </select>
            </div>
            <div>
              <Label>العنبر</Label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={penFilter}
                onChange={(e) => setPenFilter(e.target.value)}
              >
                <option value="all">جميع العنابر</option>
                {Array.from(new Set(animals.map((a: any) => a.penNumber))).filter(Boolean).map((pen: any) => (
                  <option key={pen} value={pen}>{pen}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnimals.map((animal: any) => (
          <AnimalCard
            key={animal.id}
            id={animal.id}
            earTag={animal.earTag}
            pen={animal.penNumber || "-"}
            batch={animal.batchNumber || "-"}
            sex={animal.sex}
            animalType={animal.animalType}
            currentWeight={parseFloat(animal.currentWeight || "0")}
            entryWeight={parseFloat(animal.entryWeight || "0")}
            status={animal.status}
            onClick={() => handleViewDetails(animal)}
            onSell={() => {
              setSelectedAnimal({
                id: animal.id,
                earTag: animal.earTag,
                currentWeight: animal.currentWeight,
                totalCost: animal.totalCost,
                batchId: animal.batchId,
                batchNumber: animal.batchNumber,
              });
              setIsSellDialogOpen(true);
            }}
          />
        ))}
      </div>

      {filteredAnimals.length === 0 && (
        <div className="text-center py-12">
          <Beef className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">لم يتم العثور على حيوانات</p>
        </div>
      )}

      {/* Sell Animal Dialog */}
      <SellAnimalDialog
        open={isSellDialogOpen}
        onOpenChange={setIsSellDialogOpen}
        animal={selectedAnimal}
      />

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الحيوان - رقم الأذن: {selectedAnimal?.earTag}</DialogTitle>
          </DialogHeader>

          {selectedAnimal && (
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الأساسية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">رقم الأذن</p>
                      <p className="font-bold">{selectedAnimal.earTag}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">نوع الحيوان</p>
                      <p className="font-bold">{selectedAnimal.animalType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الجنس</p>
                      <p className="font-bold">{selectedAnimal.sex}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">العنبر</p>
                      <p className="font-bold">{selectedAnimal.penNumber || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الدفعة</p>
                      <p className="font-bold">{selectedAnimal.batchNumber || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الحالة</p>
                      <Badge variant={selectedAnimal.status === "active" ? "default" : "secondary"}>
                        {selectedAnimal.status === "active" ? "نشط" : selectedAnimal.status === "sold" ? "مُباع" : "نافق"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weight Info */}
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الوزن</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">وزن الدخول</p>
                      <p className="font-bold text-lg">{parseFloat(selectedAnimal.entryWeight || "0").toFixed(1)} كجم</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الوزن الحالي</p>
                      <p className="font-bold text-lg text-green-600">{parseFloat(selectedAnimal.currentWeight || "0").toFixed(1)} كجم</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الزيادة في الوزن</p>
                      <p className="font-bold text-lg text-blue-600">
                        {(parseFloat(selectedAnimal.currentWeight || "0") - parseFloat(selectedAnimal.entryWeight || "0")).toFixed(1)} كجم
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Info */}
              <Card>
                <CardHeader>
                  <CardTitle>معلومات التكلفة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">تكلفة الشراء</p>
                      <p className="font-bold">{parseFloat(selectedAnimal.purchaseCost || "0").toLocaleString()} ج</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تكلفة الأعلاف</p>
                      <p className="font-bold text-green-600">{parseFloat(selectedAnimal.accumulatedFeedCost || "0").toLocaleString()} ج</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">تكلفة العلاج</p>
                      <p className="font-bold text-red-600">{parseFloat(selectedAnimal.accumulatedTreatmentCost || "0").toLocaleString()} ج</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">الإجمالي</p>
                      <p className="font-bold text-blue-600">{parseFloat(selectedAnimal.totalCost || "0").toLocaleString()} ج</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {selectedAnimal.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>ملاحظات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedAnimal.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => handleEdit(selectedAnimal)}>
                  <Edit className="w-4 h-4 ml-2" />
                  تعديل
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setIsDetailsDialogOpen(false);
                    handleDelete(selectedAnimal);
                  }}
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الحيوان</DialogTitle>
          </DialogHeader>

          {editFormData && (
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>رقم الأذن *</Label>
                  <Input
                    value={editFormData.earTag}
                    onChange={(e) => setEditFormData({ ...editFormData, earTag: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>نوع الحيوان *</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editFormData.animalType}
                    onChange={(e) => setEditFormData({ ...editFormData, animalType: e.target.value })}
                    required
                  >
                    <option value="بقر">بقر</option>
                    <option value="جاموس">جاموس</option>
                    <option value="أغنام">أغنام</option>
                    <option value="ماعز">ماعز</option>
                    <option value="جمال">جمال</option>
                  </select>
                </div>
                <div>
                  <Label>الجنس *</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={editFormData.sex}
                    onChange={(e) => setEditFormData({ ...editFormData, sex: e.target.value })}
                    required
                  >
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
                <div>
                  <Label>وزن الدخول (كجم) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editFormData.entryWeight}
                    onChange={(e) => setEditFormData({ ...editFormData, entryWeight: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>الوزن الحالي (كجم)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editFormData.currentWeight}
                    onChange={(e) => setEditFormData({ ...editFormData, currentWeight: e.target.value })}
                  />
                </div>
                <div>
                  <Label>سعر الشراء (ج)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editFormData.purchaseCost}
                    onChange={(e) => setEditFormData({ ...editFormData, purchaseCost: e.target.value })}
                  />
                </div>
                <div>
                  <Label>العنبر</Label>
                  <Input
                    value={editFormData.penNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, penNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label>الدفعة</Label>
                  <Input
                    value={editFormData.batchNumber}
                    onChange={(e) => setEditFormData({ ...editFormData, batchNumber: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>ملاحظات</Label>
                <Textarea
                  value={editFormData.notes || ""}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={updateMutation.isPending}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
