import RegisterForm from "../../components/auth/Registerform";


const RegisterPage = () => {
    
  return (
     <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-70 -z-10" />

      <div className="w-full max-w-md p-6 rounded-xl border shadow-sm z-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
              Get Started Today!
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
             Create an account to manage your money, track expenses, and reach your financial goals
          </p>
       
          
          
        </div>

        <RegisterForm/>
      </div>
      
    </div>
  )
}

export default RegisterPage;