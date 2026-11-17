
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
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
import api from "../../lib/api/apiClient";
import { extractErrorMessage  } from '../../util/errorUtil'

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await api.post(
        "/auth/register",
        userData
      );
    console.log("response data", response);
      return response.data;
    },

    onSuccess: (data) => {
     navigate('/login')
      setSuccess(data.message || "Account created successfully!");
      setError(null);

      setFormValues({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
      });

      // U gudub login page-ga 2 ilbiriqsi kadib
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },

    onError: (err) => {
      console.log("error",err)
      setError(extractErrorMessage(err))

      setSuccess(null);
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    if (
      !formValues.name.trim() ||
      !formValues.email.trim() ||
      !formValues.password ||
      !formValues.confirmpassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (formValues.password !== formValues.confirmpassword) {
      setError("Passwords do not match.");
      return;
    }

   registerMutation.mutate({
  username: formValues.name,
  email: formValues.email,
  password: formValues.password,
});
  };

  return (
    <Card className="w-full border-border">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-center">
          Create an account
        </CardTitle>

        <CardDescription className="text-center">
          Enter your details here.
        </CardDescription>
      </CardHeader>

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

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Full Name
            </label>

            <Input
              id="name"
              name="name"
              placeholder="Jane Smith"
              required
              value={formValues.name}
              onChange={handleInputChange}
              disabled={registerMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jane.smith@example.com"
              required
              value={formValues.email}
              onChange={handleInputChange}
              disabled={registerMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              value={formValues.password}
              onChange={handleInputChange}
              disabled={registerMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              htmlFor="confirmpassword"
            >
              Confirm Password
            </label>

            <Input
              id="confirmpassword"
              name="confirmpassword"
              type="password"
              placeholder="Confirm your password"
              required
              value={formValues.confirmpassword}
              onChange={handleInputChange}
              disabled={registerMutation.isPending}
            />
          </div>

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full cursor-pointer"
          >
            {registerMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader className="animate-spin" size={18} />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center pt-0">
          <p className="text-center text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="cursor-pointer text-primary hover:underline"
            >
              Sign In
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
