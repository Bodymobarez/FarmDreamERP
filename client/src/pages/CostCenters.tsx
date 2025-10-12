import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Activity,
  FileText,
} from "lucide-react";
import { Link } from "wouter";

export default function CostCenters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock data - سيتم استبدالها بـ API calls
  const batches = [
    {
      id: "1",
      batchNumber: "",
      batchName: "دفعة يناير 2024",
      startDate: "2024-01-01",
      status: "active",
      totalAnimals: 50,
      soldAnimals: 10,
      deceasedAnimals: 2,
      activeAnimals: 38,
      purchaseCost: 250000,
      feedCost: 45000,
      treatmentCost: 12000,
      otherExpenses: 8000,
      totalCost: 315000,
      totalRevenue: 85000,
      profit: -230000,
      profitPercentage: -73.02,
    },
    {
      id: "2",
      batchNumber: "",
      batchName: "دفعة فبراير 2024",
      startDate: "2024-02-01",
      closeDate: "2024-06-15",
      status: "closed",
      totalAnimals: 40,
      soldAnimals: 38,
      deceasedAnimals: 2,
      activeAnimals: 0,
      purchaseCost: 200000,
      feedCost: 52000,
      treatmentCost: 15000,
      otherExpenses: 10000,
      totalCost: 277000,
      totalRevenue: 340000,
      profit: 63000,
      profitPercentage: 22.74,
    },
    {
      id: "3",
      batchNumber: "",
      batchName: "دفعة مارس 2024",
      startDate: "2024-03-01",
      status: "active",
      totalAnimals: 60,
      soldAnimals: 25,
      deceasedAnimals: 3,
      activeAnimals: 32,
      purchaseCost: 300000,
      feedCost: 68000,
      treatmentCost: 18000,
      otherExpenses: 12000,
      totalCost: 398000,
      totalRevenue: 225000,
      profit: -173000,
      profitPercentage: -43.47,
    },
  ];

  const statistics = [
    {
      title: "إجمالي الدفعات النشطة",
      value: batches.filter(b => b.status === "active").length,
      change: "+2",
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "إجمالي الحيوانات النشطة",
      value: batches.reduce((sum, b) => sum + b.activeAnimals, 0),
      change: "0 حيوان",
      icon: Activity,
      color: "text-green-500",
    },
    {
      title: "إجمالي التكاليف",
      value: `${batches.reduce((sum, b) => sum + b.totalCost, 0).toLocaleString()} جنيه مصري`,
      change: "جميع الدفعات",
      icon: DollarSign,
      color: "text-red-500",
    },
    {
      title: "إجمالي الأرباح",
      value: `${batches.reduce((sum, b) => sum + b.profit, 0).toLocaleString()} جنيه مصري`,
      change: batches.reduce((sum, b) => sum + b.profit, 0) > 0 ? "+ve" : "-ve",
      icon: batches.reduce((sum, b) => sum + b.profit, 0) > 0 ? TrendingUp : TrendingDown,
      color: batches.reduce((sum, b) => sum + b.profit, 0) > 0 ? "text-green-500" : "text-red-500",
    },
  ];

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.batchName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || batch.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مراكز التكلفة (الدفعات)
          </h1>
          <p className="text-gray-600">
            إدارة ومتابعة تكاليف وأرباح كل دفعة على حدة
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة دفعة جديدة
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statistics.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-2 ${stat.color}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث في الدفعات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="حالة الدفعة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الدفعات</SelectItem>
                <SelectItem value="active">نشطة</SelectItem>
                <SelectItem value="closed">مغلقة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الدفعات ومراكز التكلفة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الدفعة</TableHead>
                  <TableHead className="text-right">اسم الدفعة</TableHead>
                  <TableHead className="text-right">تاريخ البدء</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">الحيوانات</TableHead>
                  <TableHead className="text-right">التكاليف</TableHead>
                  <TableHead className="text-right">الإيرادات</TableHead>
                  <TableHead className="text-right">الربح/الخسارة</TableHead>
                  <TableHead className="text-right">نسبة الربح</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">
                      {batch.batchNumber}
                    </TableCell>
                    <TableCell>{batch.batchName}</TableCell>
                    <TableCell>
                      {new Date(batch.startDate).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          batch.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {batch.status === "active" ? "نشطة" : "مغلقة"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {batch.totalAnimals} إجمالي
                        </div>
                        <div className="text-gray-500">
                          نشط: {batch.activeAnimals} | مباع: {batch.soldAnimals}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-bold text-red-600">
                          {batch.totalCost.toLocaleString()} جنيه مصري
                        </div>
                        <div className="text-xs text-gray-500">
                          شراء: {batch.purchaseCost.toLocaleString()} ج.م
                        </div>
                        <div className="text-xs text-gray-500">
                          أعلاف: {batch.feedCost.toLocaleString()} ج.م
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {batch.totalRevenue.toLocaleString()} جنيه مصري
                    </TableCell>
                    <TableCell>
                      <div
                        className={`font-bold ${
                          batch.profit >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {batch.profit >= 0 ? "+" : ""}
                        {batch.profit.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          batch.profitPercentage >= 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {batch.profitPercentage >= 0 ? "+" : ""}
                        {batch.profitPercentage.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/cost-center/${batch.id}`}>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 ml-1" />
                            التفاصيل
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
