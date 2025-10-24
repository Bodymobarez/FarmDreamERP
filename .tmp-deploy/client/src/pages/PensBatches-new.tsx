import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Package, 
  TrendingUp, 
  Users, 
  Building2,
  Calendar,
  BarChart3,
  Target,
  Activity,
  Clock
} from "lucide-react";
import { AddPenDialog } from "@/components/AddPenDialog";
import { AddBatchDialog } from "@/components/AddBatchDialog";

export default function PensBatches() {
  // Fetch animals data for statistics
  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // بيانات العنابر ستأتي من API
  const pens: any[] = [];

  // بيانات الدفعات ستأتي من API
  const batches: any[] = [];

  // Calculate statistics
  const totalPens = pens.length;
  const activePens = pens.filter(p => p.current > 0).length;
  const totalCapacity = pens.reduce((sum, p) => sum + p.capacity, 0);
  const totalAnimals = pens.reduce((sum, p) => sum + p.current, 0);
  const occupancyRate = ((totalAnimals / totalCapacity) * 100).toFixed(1);
  const avgWeightAllPens = pens.filter(p => p.current > 0).reduce((sum, p, _, arr) => sum + p.avgWeight / arr.length, 0);

  const totalBatches = batches.length;
  const activeBatches = batches.filter(b => b.status === "نشط").length;
  const totalBatchAnimals = batches.filter(b => b.status === "نشط").reduce((sum, b) => sum + b.count, 0);
  const avgAdg = batches.filter(b => b.status === "نشط").reduce((sum, b, _, arr) => sum + b.avgAdg / arr.length, 0);
  const avgFcr = batches.filter(b => b.status === "نشط").reduce((sum, b, _, arr) => sum + b.fcr / arr.length, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-blue-100">
          <Building2 className="h-8 w-8 text-sky-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">العنابر والدفعات</h1>
          <p className="text-gray-600 mt-1">
            إدارة العنابر والدفعات مع متابعة معدلات الأداء
          </p>
        </div>
      </div>

      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-sky-200 bg-gradient-to-br from-sky-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sky-600 mb-1">إجمالي العنابر</p>
                <p className="text-3xl font-bold text-gray-900">{totalPens}</p>
                <p className="text-xs text-gray-600 mt-1">
                  نشط: {activePens}
                </p>
              </div>
              <div className="p-3 bg-sky-100 rounded-full">
                <Building2 className="h-6 w-6 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">معدل الإشغال</p>
                <p className="text-3xl font-bold text-gray-900">{occupancyRate}%</p>
                <p className="text-xs text-gray-600 mt-1">
                  {totalAnimals} من {totalCapacity}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-600 mb-1">إجمالي الدفعات</p>
                <p className="text-3xl font-bold text-gray-900">{totalBatches}</p>
                <p className="text-xs text-gray-600 mt-1">
                  نشط: {activeBatches}
                </p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-full">
                <Package className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-600 mb-1">متوسط ADG</p>
                <p className="text-3xl font-bold text-gray-900">{avgAdg.toFixed(2)}</p>
                <p className="text-xs text-gray-600 mt-1">
                  كجم/يوم
                </p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 mb-1">متوسط الوزن</p>
                <p className="text-3xl font-bold text-gray-900">{avgWeightAllPens.toFixed(1)}</p>
                <p className="text-xs text-gray-600 mt-1">
                  كجم
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">متوسط FCR</p>
                <p className="text-3xl font-bold text-gray-900">{avgFcr.toFixed(2)}</p>
                <p className="text-xs text-gray-600 mt-1">
                  معامل التحويل
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 mb-1">حيوانات الدفعات النشطة</p>
                <p className="text-3xl font-bold text-gray-900">{totalBatchAnimals}</p>
                <p className="text-xs text-gray-600 mt-1">
                  رأس
                </p>
              </div>
              <div className="p-3 bg-pink-100 rounded-full">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">أحدث دفعة</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-600 mt-1">
                  يوم مضى
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pens Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100">
              <Home className="h-6 w-6 text-sky-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">العنابر</h2>
          </div>
          <AddPenDialog />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pens.map((pen) => (
            <Card key={pen.id} className="border-2 border-sky-200 bg-gradient-to-br from-sky-50/30 to-transparent hover:shadow-lg transition-all duration-200" data-testid={`card-pen-${pen.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{pen.name}</h3>
                      <p className="text-sm text-gray-600">{pen.batch || "بدون دفعة"}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={pen.status === "نشط" ? "default" : "secondary"}
                    className={pen.status === "نشط" ? "bg-green-100 text-green-800 border-green-200" : ""}
                  >
                    {pen.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">الإشغال:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{pen.current}/{pen.capacity}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          pen.current >= pen.capacity ? "border-red-200 text-red-700 bg-red-50" : 
                          pen.current > pen.capacity * 0.8 ? "border-yellow-200 text-yellow-700 bg-yellow-50" :
                          "border-green-200 text-green-700 bg-green-50"
                        }`}
                      >
                        {((pen.current / pen.capacity) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                  
                  {pen.current > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">متوسط الوزن:</span>
                      <span className="font-bold text-sky-600">{pen.avgWeight} كجم</span>
                    </div>
                  )}
                  
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        pen.current >= pen.capacity ? "bg-red-500" : 
                        pen.current > pen.capacity * 0.8 ? "bg-yellow-500" :
                        "bg-sky-500"
                      }`}
                      style={{ width: `${Math.min((pen.current / pen.capacity) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Batches Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100">
              <Package className="h-6 w-6 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">الدفعات</h2>
          </div>
          <AddBatchDialog />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <Card key={batch.id} className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50/30 to-transparent hover:shadow-lg transition-all duration-200" data-testid={`card-batch-${batch.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{batch.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {batch.receivedDate}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={batch.status === "نشط" ? "default" : "secondary"}
                    className={batch.status === "نشط" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}
                  >
                    {batch.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">عدد الحيوانات:</span>
                    <span className="font-bold text-gray-900">{batch.count} رأس</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">المورد:</span>
                    <span className="font-medium text-gray-700 text-sm">{batch.supplier}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">متوسط ADG:</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="font-bold text-green-600">{batch.avgAdg} كجم/يوم</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">FCR:</span>
                    <span className={`font-bold ${batch.fcr <= 3.0 ? "text-green-600" : batch.fcr <= 3.5 ? "text-yellow-600" : "text-red-600"}`}>
                      {batch.fcr}
                    </span>
                  </div>
                  
                  {/* Performance indicator */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">الأداء:</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          batch.avgAdg >= 0.9 && batch.fcr <= 3.0 ? "border-green-200 text-green-700 bg-green-50" :
                          batch.avgAdg >= 0.8 && batch.fcr <= 3.2 ? "border-yellow-200 text-yellow-700 bg-yellow-50" :
                          "border-red-200 text-red-700 bg-red-50"
                        }`}
                      >
                        {batch.avgAdg >= 0.9 && batch.fcr <= 3.0 ? "ممتاز" :
                         batch.avgAdg >= 0.8 && batch.fcr <= 3.2 ? "جيد" : "يحتاج تحسين"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}