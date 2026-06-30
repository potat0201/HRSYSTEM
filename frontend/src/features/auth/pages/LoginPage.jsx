import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { getErrorMessage } from "../../../services/httpClient.js";
import { getToken } from "../../../services/tokenStorage.js";
import { getDashboardPath } from "../auth.utils.js";
import { authApi } from "../api/auth.api.js";
import { useAuth } from "../hooks/useAuth.js";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { user, setSession } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess(response) {
      const loginData = response.data;
      setSession(loginData);
      enqueueSnackbar("Signed in successfully", { variant: "success" });
      navigate(location.state?.from?.pathname || getDashboardPath(loginData), { replace: true });
    },
    onError(error) {
      enqueueSnackbar(getErrorMessage(error, "Login failed"), { variant: "error" });
    },
  });

  if (getToken() && user) {
    return <Navigate to={getDashboardPath(user)} replace />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, border: "1px solid", borderColor: "divider" }}>
          <Stack spacing={3} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={900}>
                HR Attendance System
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Sign in to manage employees and daily attendance.
              </Typography>
            </Box>

            {loginMutation.isError ? (
              <Alert severity="error" sx={{ width: "100%" }}>
                {getErrorMessage(loginMutation.error, "Login failed")}
              </Alert>
            ) : null}

            <Box component="form" onSubmit={handleSubmit((values) => loginMutation.mutate(values))} sx={{ width: "100%" }}>
              <Stack spacing={2}>
                <TextField
                  label="Username"
                  autoComplete="username"
                  autoFocus
                  error={Boolean(errors.username)}
                  helperText={errors.username?.message}
                  {...register("username")}
                />
                <TextField
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  {...register("password")}
                />
                <Button type="submit" variant="contained" size="large" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
