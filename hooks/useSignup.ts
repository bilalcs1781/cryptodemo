import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import httpClient from "@/lib/http-client";
import { getErrorMessage } from "@/lib/api-utils";

export function useSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      const errorMessage = "Passwords do not match";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      const errorMessage = "Password must be at least 6 characters";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    // Validate age
    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age) || age < 1 || age > 150) {
      const errorMessage = "Please enter a valid age";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    // Validate address
    if (!formData.address.trim()) {
      const errorMessage = "Please enter your address";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    try {
      const response = await httpClient.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: age,
        address: formData.address.trim(),
      });

      const responseData = response.data;

      if (responseData.success || responseData.message || responseData.user) {
        toast.success(
          "Account created successfully! Please login to continue."
        );
        router.push("/login");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (
    field:
      | "name"
      | "email"
      | "password"
      | "confirmPassword"
      | "age"
      | "address",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    error,
    loading,
    handleSubmit,
    updateField,
  };
}
