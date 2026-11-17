import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../lib/api/apiClient";
import { extractErrorMessage } from "../../util/errorUtil";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "lucide-react";

const Finance = ({ transaction, open = true, onOpenChange }) => {
  const queryClient = useQueryClient();

  const [formValues, setFormValues] = useState({
    title: transaction?.title || "",
    amount: transaction?.amount || "",
    type: transaction?.type || "income",
    category: transaction?.category || "",
  });

  const [validationErrors, setValidationErrors] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const items = [
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
    { label: "Savings", value: "savings" },
  ];

  const handleTypeChange = (value) => {
    setFormValues({
      ...formValues,
      type: value,
    });
  };

  const handleCancel = () => {
    onOpenChange?.(false);
  };

  const createTransactionMutation = useMutation({
    mutationFn: async (transactionData) => {
      const response = await api.post("/transactions", transactionData);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Transaction created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onOpenChange?.(false);
      formValues({
        title: "",
        amount: "",
        type: "income",
        category: "",
      });
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async (transactionData) => {
      const response = await api.put(
        `/transactions/${transaction._id}`,
        transactionData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Transaction updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      onOpenChange?.(false);
      formValues({
        title: "",
        amount: "",
        type: "income",
        category: "",
      });
    },
    onError: (error) => {
      console.error("Error updating transaction:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors(null);

    if (
      !formValues.title ||
      !formValues.amount ||
      !formValues.type ||
      !formValues.category
    ) {
      setValidationErrors("Please fill in all required fields.");
      return;
    }

    const transactionData = {
      title: formValues.title,
      amount: parseFloat(formValues.amount),
      type: formValues.type,
      category: formValues.category,
    };

    if (transaction) {
      updateTransactionMutation.mutate(transactionData);
    } else {
      createTransactionMutation.mutate(transactionData);
    }
  };

  const displayError =
    validationErrors ||
    extractErrorMessage(createTransactionMutation.error) ||
    extractErrorMessage(updateTransactionMutation.error);

  const isLoading =
    createTransactionMutation.isPending || updateTransactionMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>

          <DialogDescription>
            Manage your financial information and track your spending.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {displayError && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {displayError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Transaction Title</Label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g., Grocery Shopping"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              value={formValues.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="0.00"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              value={formValues.amount}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select value={formValues.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="category">Category</Label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="e.g., Food & Drinks"
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              value={formValues.category}
              onChange={handleInputChange}
            />
          </div>

          <DialogFooter className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader size="sm" />
                  {transaction ? "Updating..." : "Creating..."}
                </span>
              ) : transaction ? (
                "Update Transaction"
              ) : (
                "Add Transaction"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Finance;
