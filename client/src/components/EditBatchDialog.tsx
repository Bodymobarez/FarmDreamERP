import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertBatchSchema, type InsertBatch, type Batch } from "@shared/schema";
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
import { Edit, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditBatchDialogProps {
  batch: Batch;
}

export function EditBatchDialog({ batch }: EditBatchDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertBatch>({
    resolver: zodResolver(insertBatchSchema),
    defaultValues: {
      batchNumber: batch.batchNumber,
      batchName: batch.batchName,
      barnNumber: batch.barnNumber || "",
      batchType: batch.batchType,
      capacity: batch.capacity || 50,
      totalAnimals: batch.totalAnimals || "0",
      startDate: batch.startDate ? new Date(batch.startDate) : new Date(),
      notes: batch.notes || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertBatch) => {
      const response = await fetch(`/api/batches/${batch.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في تحديث الدفعة");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/batches"] });
      toast({
        title: "تم بنجاح",
        description: "تم تحديث الدفعة بنجاح",
      });
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

  const onSubmit = (data: InsertBatch) => {
    mutation.mutate(data);
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>تعديل الدفعة</p>
          </TooltipContent>
        </Tooltip>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">تعديل الدفعة</DialogTitle>
          <DialogDescription>
            تعديل بيانات الدفعة: {batch.batchName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="batchNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الدفعة *</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: BATCH-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الدفعة *</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: دفعة يناير 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barnNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم العنبر</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: B001" {...field} value={field.value || ""} onChange={e => field.onChange(e.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batchType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الدفعة *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الدفعة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fattening">تسمين</SelectItem>
                        <SelectItem value="breeding">تربية</SelectItem>
                        <SelectItem value="mixed">مختلط</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>السعة *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="مثال: 50" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalAnimals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الحيوانات</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="مثال: 10" 
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>تاريخ البداية</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أي ملاحظات إضافية..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      value={field.value || ""}
                    />
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
                {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </TooltipProvider>
  );
}
