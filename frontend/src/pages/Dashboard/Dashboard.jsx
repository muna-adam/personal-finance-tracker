import DashboardHeader from "../../components/Dashboard/DashboardHeader"
import DashboardWelcome from "../../components/Dashboard/DashboardWelcome"
import Finance from "../../components/Finance/Finance"
import { useState } from "react"
import TransactionList from "../../components/Finance/TransactionList"
import { useQuery } from "@tanstack/react-query"
import api from "../../lib/api/apiClient"
import { Loader } from "lucide-react"



const Dashboard = () => {

  const HandleFormCLose =() => {
    setShowCreateForm(false)
    setEditingTransaction(null)
  }
 

    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)

    const handleCreateFinanceForm = () => {
        setShowCreateForm(true)
    }

    const transactionQuery = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => { const response = await api.get('/transactions'); 
        return response.data; },
        retry: 1,

    });

   if (transactionQuery.isLoading) {
    return <div className="flex items-center justify-center h-full">
    <Loader className="animate-spin h-8 w-8 text-primary" />
      
      </div>
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setShowCreateForm(true)
  }

  const handleDeleteTransaction = async (transaction) => {

  }

  const handleFinanceStats = (transactionId, newStatus) => {
    // Update the status of the transaction in the backend
    api.put(`/transactions/${transactionId}`, { status: newStatus })
  }

  return (
    // dashboard header
    <div className="min-h-screen bg-background">
      <DashboardHeader />

       {/* main content of dashboard  */}

    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
       {/* welcome section */}
        <DashboardWelcome
        showCreateForm={showCreateForm}
        onCreateForm={handleCreateFinanceForm}
        // editingTask={editingTask}
        // setEditingTask={setEditingTask}
        />

      {/* finance section */}
    <div>
      <TransactionList
        transactions={transactionQuery.data || [] }
        isLoading={transactionQuery.isLoading}
        onEdit={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
        onfinanceStats={handleFinanceStats}

      />
     </div> 
    </main>

     {/* task dialogue section */}
     <Finance
     key={editingTransaction?._id || "new"}
     open={showCreateForm || editingTransaction !== null}
     onOpenChange={HandleFormCLose}
     transaction={editingTransaction}
     />
    </div>
    
    
  )
}

export default Dashboard