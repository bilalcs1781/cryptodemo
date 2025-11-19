import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import httpClient from "@/lib/http-client";
import { getErrorMessage, parseUserData } from "@/lib/api-utils";
import { AppDispatch } from "@/store/store";
import { setUser } from "@/store/reducers/userSlice";

export function useLogin() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await httpClient.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const responseData = response.data;

      // Parse user data and token from response
      const { user: userData, token } = parseUserData(responseData);

      if (responseData.success || token || userData) {
        // Store user data with token in Redux
        const userWithToken = {
          ...userData,
          token: token || userData.token,
        };
        dispatch(setUser(userWithToken));
        toast.success("Login successful! Redirecting...");
        router.push("/dashboard");
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

  const updateField = (field: "email" | "password", value: string) => {
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
