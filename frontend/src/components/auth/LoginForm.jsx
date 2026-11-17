import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { extractErrorMessage } from "../../util/errorUtil";
import api from "../../lib/api/apiClient";
import useAuthStore from "../../lib/store/authStore";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full cursor-pointer">
      {pending ? (
        <span className="flex items-center gap-2">
          <Loader className="animate-spin" /> Creating account...
        </span>
      ) : (
        "Sing In"
      )}
    </Button>
  );
}

const LoginForm = () => {
  const navigate = useNavigate();

  const { setAuth } = useAuthStore();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loginMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post("/auth/login", userData);
      // console.log("response data", response);
      return response.data;
    },

    onSuccess: (data) => {
      // handle token si dashboard ka loo aado

      if (data.token) {
        const user = data.user;
        const token = data.token;

        setAuth(user, token);

        navigate("/dashboard");
      }

      // console.log("data recieved", data);

      setSuccess(data.message || "Account created successfully!");
      setError(null);

      setFormValues({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
      });
    },

    onError: (err) => {
      console.log("error", err);
      setError(extractErrorMessage(err));

      setSuccess(null);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (!formValues.email.trim() || !formValues.password) {
      setError("All fields are required.");
      return;
    }

    loginMutation.mutate({
      email: formValues.email,
      password: formValues.password,
    });
  };

  return (
    <Card w-full border-border>
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          Sign In
        </CardTitle>

        <CardDescription className="text-center text-sm leading-relaxed">
          Enter your account details to continue.
        </CardDescription>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-2">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-md bg-green-100 p-3 text-sm text-green-800">
                {success}
              </div>
            )}

            <div space-y-2>
              <div className="text-sm font-medium text-left">Email</div>
              <Input
                name="email"
                placeholder="jane.smith@example.com"
                required
                onChange={handleInputChange}
                value={formValues.email}
              />
            </div>
            <div space-y-2>
              <div className="text-sm font-medium text-left">Password</div>
              <Input
                name="password"
                placeholder="***********"
                type={"password"}
                required
                onChange={handleInputChange}
                value={formValues.password}
              />
            </div>

            <SubmitButton />
          </CardContent>
          <br />
          <CardFooter className="flex justify-center pt-0">
            <div className="text-center">
              Don't have an account ?{" "}
              <a
                onClick={() => navigate("/register")}
                className="text-primary hover:underline cursor-pointer"
              >
                Sign Up
              </a>
            </div>
          </CardFooter>
        </form>
      </CardHeader>
    </Card>
  );
};

export default LoginForm;
