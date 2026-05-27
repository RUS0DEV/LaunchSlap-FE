import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useGetMeQuery } from '@/features/auth/api/authApi';
import { setInitialized, setUser } from '@/features/auth/model/authSlice';
import { AdminRoute } from '@/routes/AdminRoute';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { Spinner } from '@/shared/ui/Spinner';
import { Footer } from '@/widgets/Footer';
import { Header } from '@/widgets/Header';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ProjectPage = lazy(() => import('@/pages/ProjectPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ConfirmEmailPage = lazy(() => import('@/pages/ConfirmEmailPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProjectCreatePage = lazy(() => import('@/pages/ProjectCreatePage'));
const ProjectEditPage = lazy(() => import('@/pages/ProjectEditPage'));
const PaymentsPage = lazy(() => import('@/pages/PaymentsPage'));
const PromotionsPage = lazy(() => import('@/pages/PromotionsPage'));
const PaymentSuccessPage = lazy(() => import('@/pages/PaymentSuccessPage'));
const PaymentFailPage = lazy(() => import('@/pages/PaymentFailPage'));
const AdminProjectsPage = lazy(() => import('@/pages/AdminProjectsPage'));
const AdminPromotionsPage = lazy(() => import('@/pages/AdminPromotionsPage'));
const AdminSettingsPage = lazy(() => import('@/pages/AdminSettingsPage'));
const AdminStatsPage = lazy(() => import('@/pages/AdminStatsPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function AuthInitializer() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const { data, isError, isFetching } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (!token) {
      dispatch(setInitialized(true));
      return;
    }

    if (data) {
      dispatch(setUser(data));
      dispatch(setInitialized(true));
      return;
    }

    if (isError) {
      dispatch(setInitialized(true));
    }
  }, [data, dispatch, isError, token]);

  if (token && isFetching) {
    return null;
  }

  return null;
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  );
}

export function AppRouter() {
  return (
    <>
      <AuthInitializer />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route
            path="/"
            element={
              <PageShell>
                <HomePage />
              </PageShell>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PageShell>
                <ProjectPage />
              </PageShell>
            }
          />
          <Route
            path="/login"
            element={
              <PageShell>
                <LoginPage />
              </PageShell>
            }
          />
          <Route
            path="/register"
            element={
              <PageShell>
                <RegisterPage />
              </PageShell>
            }
          />
          <Route
            path="/confirm-email/:token"
            element={
              <PageShell>
                <ConfirmEmailPage />
              </PageShell>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageShell>
                <ForgotPasswordPage />
              </PageShell>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PageShell>
                <ResetPasswordPage />
              </PageShell>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <PageShell>
                <ResetPasswordPage />
              </PageShell>
            }
          />
          <Route
            path="/payment/success"
            element={
              <ProtectedRoute>
                <PageShell>
                  <PaymentSuccessPage />
                </PageShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/fail"
            element={
              <ProtectedRoute>
                <PageShell>
                  <PaymentFailPage />
                </PageShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageShell>
                  <DashboardPage />
                </PageShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/projects/new"
            element={
              <ProtectedRoute>
                <PageShell>
                  <ProjectCreatePage />
                </PageShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/projects/:id/edit"
            element={
              <ProtectedRoute>
                <PageShell>
                  <ProjectEditPage />
                </PageShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/payments"
            element={
              <ProtectedRoute>
                <PageShell>
                  <PaymentsPage />
                </PageShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/promotions"
            element={
              <ProtectedRoute>
                <PageShell>
                  <PromotionsPage />
                </PageShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Navigate to="/admin/projects" replace />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <AdminRoute>
                <PageShell>
                  <AdminProjectsPage />
                </PageShell>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/promotions"
            element={
              <AdminRoute>
                <PageShell>
                  <AdminPromotionsPage />
                </PageShell>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <PageShell>
                  <AdminSettingsPage />
                </PageShell>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <AdminRoute>
                <PageShell>
                  <AdminStatsPage />
                </PageShell>
              </AdminRoute>
            }
          />
          <Route
            path="/403"
            element={
              <PageShell>
                <ForbiddenPage />
              </PageShell>
            }
          />
          <Route
            path="*"
            element={
              <PageShell>
                <NotFoundPage />
              </PageShell>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}
