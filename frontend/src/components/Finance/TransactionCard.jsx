import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "../ui/button";
import { Calendar, Edit2, MoreVertical, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api/apiClient";
import { toast } from "@/components/ui/toast";

const TRANSACTION_CONFIG = {
  income: {
    variant: "default",
    label: "Income",
    color: "text-green-600",
  },
  expense: {
    variant: "destructive",
    label: "Expense",
    color: "text-red-600",
  },
};

const TransactionCard = ({
  transaction,
  onEdit,
  isLoading = false,
}) => {
  const [showDeleteDialog, setshowDeleteDialog] = useState(false);

  const statusConfig =
    TRANSACTION_CONFIG[transaction?.type] || TRANSACTION_CONFIG.expense;

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`/transactions/${transaction._id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction Deleted Successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting transaction: ${error.message}`);
    },
  });

  const handleDeleteConfirm = async () => {
    try {
      await deleteMutation.mutateAsync();
      setshowDeleteDialog(false);
    } catch (error) {
      toast.error(`Error deleting transaction: ${error.message}`);
    }
  };

  return (
    <>
      <Card className="w-full transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg leading-tight">
              {transaction.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={statusConfig.variant} className="shrink-0">
                {statusConfig.label}
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">Open</span>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEdit(transaction)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setshowDeleteDialog(true)}
                    className="text-red-600"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {transaction.category && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {transaction.category}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {transaction?.date
                  ? new Date(transaction.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "No Date"}
              </span>
            </div>

            <span
              className={`text-lg font-bold ${
                transaction?.type === "income"
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {transaction?.type === "income" ? "+" : "-"}${transaction?.amount}
            </span>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setshowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "
              {transaction.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionCard;
