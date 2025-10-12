import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Weight, 
  Plus, 
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Filter
} from "lucide-react";
import { AddReceptionDialog } from "../components/AddReceptionDialog";
import { DistributeAnimalsDialog } from "../components/DistributeAnimalsDialog";
import { useQuery } from "@tanstack/react-query";

export default function Receptions() {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // جلب البيانات الحقيقية من API
  const { data: receptions = [] } = useQuery<any[]>({
    queryKey: ["/api/receptions"],
  });

  const filteredReceptions = filterStatus === "all" 
    ? receptions 
    : receptions.filter(r => r.status === filterStatus);

  const stats = {
    totalReceptions: receptions.length,
    pendingDistribution: receptions.filter((r: any) => r.status === "pending").length,
    distributed: receptions.filter((r: any) => r.status === "distributed").length,
    completed: receptions.filter((r: any) => r.status === "completed").length,
    totalAnimalsReceived: receptions.reduce((sum: number, r: any) => sum + parseInt(r.totalAnimals || "0"), 0),
    totalValue: receptions.reduce((sum: number, r: any) => sum + parseFloat(r.totalPrice || "0"), 0),
    avgPricePerAnimal: receptions.length > 0 ? 
      receptions.reduce((sum: number, r: any) => sum + parseFloat(r.totalPrice || "0"), 0) / 
      receptions.reduce((sum: number, r: any) => sum + parseInt(r.totalAnimals || "0"), 0) : 0,
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { 
        label: "قيد الانتظار", 
        variant: "secondary" as const,
        icon: Clock,
        color: "text-yellow-600"
      },
      distributed: { 
        label: "تم التوزيع", 
        variant: "default" as const,
        icon: CheckCircle,
        color: "text-blue-600"
      },
      completed: { 
        label: "مكتمل", 
        variant: "outline" as const,
        icon: CheckCircle,
        color: "text-green-600"
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getAnimalIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      "بقر": "🐄",
      "جاموس": "🐃",
      "أغنام": "🐑",
      "ماعز": "🐐",
      "جمال": "🐫",
    };
    return icons[type] || "🐄";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            استقبال الدفعات
          </h1>
          <p className="text-muted-foreground mt-2">
            إدارة شاملة لاستقبال وتوزيع وتتبع دفعات الحيوانات الواردة
          </p>
        </div>
        <AddReceptionDialog />
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الدفعات</CardTitle>
            <Package className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{stats.totalReceptions}</div>
            <p className="text-xs text-muted-foreground mt-1">دفعة مستقبلة</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد التوزيع</CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700">{stats.pendingDistribution}</div>
            <p className="text-xs text-muted-foreground mt-1">بانتظار التوزيع</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحيوانات</CardTitle>
            <Weight className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{stats.totalAnimalsReceived}</div>
            <p className="text-xs text-muted-foreground mt-1">رأس حيوان</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">القيمة الإجمالية</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{stats.totalValue.toLocaleString()} ج</div>
            <p className="text-xs text-muted-foreground mt-1">متوسط: {stats.avgPricePerAnimal.toFixed(0)} ج/رأس</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">تم التوزيع</p>
                <p className="text-2xl font-bold text-blue-700">{stats.distributed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">مكتمل</p>
                <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">معدل النجاح</p>
                <p className="text-2xl font-bold text-purple-700">
                  {((stats.completed / stats.totalReceptions) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Receptions Table with Tabs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">قائمة الدفعات المستقبلة</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">فلترة حسب الحالة</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={setFilterStatus}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                الكل ({receptions.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                قيد الانتظار ({stats.pendingDistribution})
              </TabsTrigger>
              <TabsTrigger value="distributed" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                تم التوزيع ({stats.distributed})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                مكتمل ({stats.completed})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filterStatus} className="space-y-4">
            {filteredReceptions.map((reception) => {
              const statusInfo = getStatusBadge(reception.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div
                  key={reception.id}
                  className="border-2 rounded-xl p-5 hover:shadow-lg hover:border-primary/50 transition-all bg-gradient-to-r from-white to-gray-50"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Main Content */}
                    <div className="flex-1 space-y-4">
                      {/* Header Row */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-3xl">{getAnimalIcon(reception.animalType)}</span>
                        <h3 className="font-bold text-xl text-primary">{reception.receptionNumber}</h3>
                        <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {reception.receptionDate.toLocaleDateString('ar-EG', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">النوع</span>
                          </div>
                          <span className="font-bold text-blue-900">{reception.animalType}</span>
                        </div>

                        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="w-4 h-4 text-purple-600" />
                            <span className="text-xs text-purple-600 font-medium">العدد</span>
                          </div>
                          <span className="font-bold text-purple-900">{reception.totalAnimals} رأس</span>
                        </div>

                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                          <div className="flex items-center gap-2 mb-1">
                            <Weight className="w-4 h-4 text-orange-600" />
                            <span className="text-xs text-orange-600 font-medium">الوزن</span>
                          </div>
                          <span className="font-bold text-orange-900">{parseFloat(reception.totalWeight).toLocaleString()} كجم</span>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">السعر</span>
                          </div>
                          <span className="font-bold text-green-900">{parseFloat(reception.totalPrice).toLocaleString()} ج</span>
                        </div>
                      </div>

                      {/* Calculations */}
                      <div className="flex flex-wrap gap-4 text-sm bg-muted/50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">متوسط الوزن:</span>
                          <span className="font-bold">
                            {(parseFloat(reception.totalWeight) / parseFloat(reception.totalAnimals)).toFixed(2)} كجم/رأس
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">السعر للكيلو:</span>
                          <span className="font-bold text-green-700">
                            {(parseFloat(reception.totalPrice) / parseFloat(reception.totalWeight)).toFixed(2)} ج
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">السعر للرأس:</span>
                          <span className="font-bold text-blue-700">
                            {(parseFloat(reception.totalPrice) / parseFloat(reception.totalAnimals)).toFixed(2)} ج
                          </span>
                        </div>
                      </div>

                      {/* Supplier */}
                      {reception.supplier && (
                        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-muted-foreground">المورد:</span>
                          <span className="font-semibold text-blue-900">{reception.supplier}</span>
                        </div>
                      )}

                      {/* Notes */}
                      {reception.notes && (
                        <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-100">
                          <FileText className="w-4 h-4 text-amber-600 mt-0.5" />
                          <div>
                            <span className="text-xs text-amber-600 font-medium">ملاحظات:</span>
                            <p className="text-sm text-amber-900 mt-1">{reception.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="flex lg:flex-col gap-2">
                      {reception.status === "pending" && (
                        <DistributeAnimalsDialog reception={reception} />
                      )}
                      {reception.status === "distributed" && (
                        <Badge variant="default" className="text-sm py-2 px-4">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          تم التوزيع
                        </Badge>
                      )}
                      {reception.status === "completed" && (
                        <Badge variant="outline" className="text-sm py-2 px-4 bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          مكتمل
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredReceptions.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  لا توجد دفعات في هذا القسم
                </h3>
                <p className="text-sm text-muted-foreground">
                  {filterStatus === "all" 
                    ? "لم يتم استقبال أي دفعات بعد" 
                    : `لا توجد دفعات بحالة "${getStatusBadge(filterStatus).label}"`}
                </p>
              </div>
            )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
