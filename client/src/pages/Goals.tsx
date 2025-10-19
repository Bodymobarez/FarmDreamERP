import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  Search,
  Trophy,
  Zap,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Package,
  Filter,
  X,
  TrendingDown,
  AlertCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { AddGoalDialog } from "@/components/AddGoalDialog";
import { useToast } from "@/hooks/use-toast";

export default function Goals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/goals"],
  });

  const { data: batches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });

  // Delete goal mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("فشل في حذف الهدف");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "✅ تم الحذف",
        description: "تم حذف الهدف بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "❌ خطأ",
        description: "فشل في حذف الهدف",
        variant: "destructive",
      });
    },
  });

  const filteredGoals = goals.filter((goal: any) => {
    const matchesSearch = goal.goalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.goalType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const current = parseFloat(goal.currentValue || "0");
    const target = parseFloat(goal.targetValue || "1");
    const progress = (current / target) * 100;
    
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "achieved" && progress >= 100) ||
      (statusFilter === "in_progress" && progress > 0 && progress < 100) ||
      (statusFilter === "not_started" && progress === 0);
    
    const matchesType = typeFilter === "all" || goal.goalType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: goals.length,
    achieved: goals.filter((g: any) => {
      const current = parseFloat(g.currentValue || "0");
      const target = parseFloat(g.targetValue || "1");
      return current >= target;
    }).length,
    inProgress: goals.filter((g: any) => {
      const current = parseFloat(g.currentValue || "0");
      const target = parseFloat(g.targetValue || "1");
      return current > 0 && current < 100;
    }).length,
    notStarted: goals.filter((g: any) => parseFloat(g.currentValue || "0") === 0).length,
    avgProgress: goals.length > 0
      ? goals.reduce((sum: number, g: any) => {
          const current = parseFloat(g.currentValue || "0");
          const target = parseFloat(g.targetValue || "1");
          return sum + Math.min((current / target) * 100, 100);
        }, 0) / goals.length
      : 0,
  };

  const goalTypes = Array.from(new Set(goals.map((g: any) => g.goalType)));

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الهدف؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewDetails = (goal: any) => {
    setSelectedGoal(goal);
    setViewDetailsOpen(true);
  };

  const getBatch = (batchId: string) => {
    return batches.find((b: any) => b.id === batchId);
  };

  const getStatusColor = (progress: number) => {
    if (progress >= 100) return "from-green-500 to-green-600";
    if (progress >= 75) return "from-blue-500 to-blue-600";
    if (progress >= 50) return "from-yellow-500 to-yellow-600";
    if (progress > 0) return "from-orange-500 to-orange-600";
    return "from-gray-500 to-gray-600";
  };

  const getStatusIcon = (progress: number) => {
    if (progress >= 100) return <CheckCircle2 className="w-5 h-5" />;
    if (progress >= 50) return <TrendingUp className="w-5 h-5" />;
    if (progress > 0) return <Clock className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-xl">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🎯 الأهداف</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-0.5 sm:mt-1">تتبع وإدارة الأهداف</p>
            </div>
          </div>
          
          <div className="flex gap-2 sm:gap-3">
            <AddGoalDialog />
          </div>
        </div>

        {/* Stats Cards - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">إجمالي الأهداف</p>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50/30 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">محققة</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.achieved}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">قيد التنفيذ</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50/30 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                  <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">متوسط الإنجاز</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-600">{stats.avgProgress.toFixed(0)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-2 border-emerald-200 bg-white shadow-lg">
          <CardContent className="p-4 sm:p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث عن هدف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-11 sm:h-12 text-base sm:text-lg border-2 border-emerald-200 focus:border-emerald-500 rounded-xl"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className={`${statusFilter === "all" ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'border-2 border-emerald-200 hover:bg-emerald-50'}`}
                >
                  <Filter className="w-4 h-4 ml-1" />
                  الكل
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === "achieved" ? "default" : "outline"}
                  onClick={() => setStatusFilter("achieved")}
                  className={`${statusFilter === "achieved" ? 'bg-gradient-to-r from-green-500 to-green-600' : 'border-2 border-green-200 hover:bg-green-50'}`}
                >
                  <CheckCircle2 className="w-4 h-4 ml-1" />
                  محققة
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === "in_progress" ? "default" : "outline"}
                  onClick={() => setStatusFilter("in_progress")}
                  className={`${statusFilter === "in_progress" ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'border-2 border-blue-200 hover:bg-blue-50'}`}
                >
                  <Clock className="w-4 h-4 ml-1" />
                  قيد التنفيذ
                </Button>
                <Button
                  size="sm"
                  variant={statusFilter === "not_started" ? "default" : "outline"}
                  onClick={() => setStatusFilter("not_started")}
                  className={`${statusFilter === "not_started" ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'border-2 border-gray-300 hover:bg-gray-50'}`}
                >
                  <AlertCircle className="w-4 h-4 ml-1" />
                  لم تبدأ
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(statusFilter !== "all" || typeFilter !== "all") && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {statusFilter === "achieved" && "محققة"}
                    {statusFilter === "in_progress" && "قيد التنفيذ"}
                    {statusFilter === "not_started" && "لم تبدأ"}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setStatusFilter("all")}
                    />
                  </Badge>
                )}
                {typeFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {typeFilter}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setTypeFilter("all")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white shadow-lg">
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg font-medium">لا توجد أهداف</p>
                  <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة أهداف جديدة لتتبع التقدم</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredGoals.map((goal: any) => {
              const current = parseFloat(goal.currentValue || "0");
              const target = parseFloat(goal.targetValue || "1");
              const progress = Math.min((current / target) * 100, 100);
              const batch = goal.batchId ? getBatch(goal.batchId) : null;

              return (
                <Card
                  key={goal.id}
                  className="border-2 border-emerald-200 bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${getStatusColor(progress)} flex items-center justify-center shadow-lg flex-shrink-0`}>
                          {getStatusIcon(progress)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 mb-1">
                            {goal.goalName}
                          </CardTitle>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            <Badge variant="outline" className="text-xs">
                              {goal.goalType}
                            </Badge>
                            {batch && (
                              <Badge variant="secondary" className="text-xs">
                                <Package className="w-3 h-3 ml-1" />
                                {batch.batchName}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(goal)}>
                            <Eye className="w-4 h-4 ml-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(goal.id)}>
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 font-medium">التقدم</span>
                        <span className="font-bold text-emerald-600 text-lg">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-3 rounded-full" />
                    </div>

                    {/* Values */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t-2">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">القيمة الحالية</p>
                        <p className="text-lg font-bold text-blue-600">
                          {current.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">{goal.unit}</p>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">الهدف</p>
                        <p className="text-lg font-bold text-emerald-600">
                          {target.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">{goal.unit}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {progress >= 100 ? (
                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl flex items-center justify-center gap-2">
                        <Trophy className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-green-700 font-bold">🎉 تم تحقيق الهدف!</span>
                      </div>
                    ) : progress >= 75 ? (
                      <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700 font-medium">أداء ممتاز - قريب من الهدف</span>
                      </div>
                    ) : progress === 0 ? (
                      <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4 text-gray-600" />
                        <span className="text-xs text-gray-700 font-medium">لم يبدأ التنفيذ بعد</span>
                      </div>
                    ) : null}

                    {/* Dates */}
                    {(goal.startDate || goal.endDate) && (
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                        {goal.startDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(goal.startDate).toLocaleDateString("ar-EG")}</span>
                          </div>
                        )}
                        {goal.endDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(goal.endDate).toLocaleDateString("ar-EG")}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              تفاصيل الهدف
            </DialogTitle>
            <DialogDescription>
              معلومات كاملة عن الهدف والتقدم المحرز
            </DialogDescription>
          </DialogHeader>

          {selectedGoal && (
            <div className="space-y-6 py-4">
              {/* Goal Name */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedGoal.goalName}</h3>
                <Badge variant="outline" className="text-sm">{selectedGoal.goalType}</Badge>
              </div>

              {/* Progress */}
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">التقدم الحالي</span>
                      <span className="text-3xl font-bold text-purple-600">
                        {Math.min((parseFloat(selectedGoal.currentValue || "0") / parseFloat(selectedGoal.targetValue || "1")) * 100, 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((parseFloat(selectedGoal.currentValue || "0") / parseFloat(selectedGoal.targetValue || "1")) * 100, 100)} 
                      className="h-4"
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-2">القيمة الحالية</p>
                        <p className="text-2xl font-bold text-blue-600">{parseFloat(selectedGoal.currentValue || "0").toFixed(2)}</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedGoal.unit}</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <p className="text-sm text-gray-600 mb-2">القيمة المستهدفة</p>
                        <p className="text-2xl font-bold text-purple-600">{parseFloat(selectedGoal.targetValue || "0").toFixed(2)}</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedGoal.unit}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Details */}
              {selectedGoal.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">الملاحظات</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedGoal.notes}</p>
                </div>
              )}

              {/* Dates */}
              {(selectedGoal.startDate || selectedGoal.endDate) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedGoal.startDate && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">تاريخ البدء</h4>
                      <p className="text-gray-900 font-medium">{new Date(selectedGoal.startDate).toLocaleDateString("ar-EG")}</p>
                    </div>
                  )}
                  {selectedGoal.endDate && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">تاريخ الانتهاء</h4>
                      <p className="text-gray-900 font-medium">{new Date(selectedGoal.endDate).toLocaleDateString("ar-EG")}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Batch Info */}
              {selectedGoal.batchId && getBatch(selectedGoal.batchId) && (
                <Card className="border-2 border-amber-200 bg-amber-50/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-6 h-6 text-amber-600" />
                      <div>
                        <p className="text-sm text-gray-600">الدفعة المرتبطة</p>
                        <p className="font-bold text-gray-900">{getBatch(selectedGoal.batchId)?.batchName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
