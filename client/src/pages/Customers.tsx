import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  ShoppingBag,
  Search,
  Plus
} from "lucide-react";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: customers = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/customers"],
  });

  const filteredCustomers = customers.filter((customer: any) =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const stats = {
    total: customers.length,
    active: customers.filter((c: any) => c.status === "active").length,
    totalBalance: customers.reduce((sum: number, c: any) => 
      sum + parseFloat(c.balance || "0"), 0
    ),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">العملاء</h1>
              <p className="text-gray-600 mt-1">إدارة عملاء المزرعة</p>
            </div>
          </div>
          <div>
            <AddCustomerDialog />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card className="border-2 border-cyan-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-3 shadow-md">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي العملاء</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">نشط</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3 shadow-md">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الرصيد</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalBalance.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-emerald-200 bg-white">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث بالاسم أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-lg border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا يوجد عملاء</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredCustomers.map((customer: any) => (
              <Card key={customer.id} className="border-2 border-cyan-200 bg-white hover:shadow-xl hover:border-cyan-400 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-900 line-clamp-1">{customer.name}</p>
                      {customer.status === "active" && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">نشط</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{customer.phone}</span>
                      </div>
                    )}
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 line-clamp-1">{customer.email}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 line-clamp-1">{customer.address}</span>
                      </div>
                    )}
                    {customer.balance && parseFloat(customer.balance) !== 0 && (
                      <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-emerald-700">الرصيد:</span>
                          <span className="font-bold text-emerald-700">{parseFloat(customer.balance).toFixed(0)} ج.م</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
