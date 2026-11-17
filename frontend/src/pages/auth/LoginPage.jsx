// import LoginForm from "../../components/ui/auth/LoginForm"
// const LoginPage = () => {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
//       <div className="absolute inset-0 opacity-70 -z-10" />

//       <div className="w-full max-w-md p-6 rounded-xl border shadow-sm z-10">
//         <div className="mb-6 text-center">
//           <h1 className="text-3xl font-bold tracking-tight mb-2">
//             Welcome Back 
//           </h1>
//           <p className="text-sm">
//             We're glad to see you again!
//           </p>
       
          
          
//         </div>

//         <LoginForm/>
//       </div>
      
//     </div>
//   )
// }

// export default LoginPage


import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">

      <div className="absolute inset-0 opacity-70 -z-10" />

      <div className="w-full max-w-md p-6 rounded-xl border shadow-sm z-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Welcome Back!
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Sign in to manage your finances and stay on top of your money.
          </p>
        </div>

        <LoginForm />
      </div>

    </div>
  );
};

export default LoginPage;



