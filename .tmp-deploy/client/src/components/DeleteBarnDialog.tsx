import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Barn } from "@shared/schema";

interface DeleteBarnDialogProps {
  barn: Barn;
}

export function DeleteBarnDialog({ barn }: DeleteBarnDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/barns/${barn.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في حذف العنبر");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/barns"] });
      toast({
        title: "تم بنجاح",
        description: "تم حذف العنبر بنجاح",
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

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>حذف العنبر</p>
          </TooltipContent>
        </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-600">حذف العنبر</DialogTitle>
          <DialogDescription>
            هل أنت متأكد من حذف العنبر <strong>{barn.barnName}</strong>؟
            <br />
            <span className="text-red-600 font-medium">هذا الإجراء لا يمكن التراجع عنه!</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            إلغاء
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            حذف العنبر
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </TooltipProvider>
  );
}
