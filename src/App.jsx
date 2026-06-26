import { Routes, Route } from "react-router-dom";
import './assets/tailwind.css';
import React, { Suspense } from "react";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";

const Dashboard = React.lazy(() => import("./pages/Dashboard"))
const Orders = React.lazy(() => import("./pages/Orders"))
const Customers = React.lazy(() => import("./pages/Customers"))
const Products = React.lazy(() => import("./pages/Produk"))
const NotFound = React.lazy(() => import("./pages/NotFound"))
const Login = React.lazy(() => import("./pages/auth/Login"))
const Register = React.lazy(() => import("./pages/auth/Register"))
const Forgot = React.lazy(() => import("./pages/auth/Forgot"))
const ErrorPage = React.lazy(() => import("./components/ErrorPage"))
const MainLayout = React.lazy(() => import("./layouts/MainLayout"))
const AuthLayout = React.lazy(() => import("./layouts/AuthLayouts"))
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"))
const Components = React.lazy(() => import("./pages/Components"))
const FiturXyz = React.lazy(() => import("./pages/FiturXyz"))
const Notes = React.lazy(() => import("./pages/Note"))
const MemberDashboard = React.lazy(() => import("./pages/MemberDashboard"))

export default function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Admin Only Routes wrapped in MainLayout with Sidebar */}
                <Route element={<ProtectedRoute allowedRoles={['admin']}><MainLayout /></ProtectedRoute>}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/components" element={<Components />} />
                    <Route path="/fitur-xyz" element={<FiturXyz />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="*" element={<NotFound />} />
                </Route>

                {/* Member / Admin Dashboard Page (Single Page layout with Navbar, no Sidebar) */}
                <Route path="/member" element={
                    <ProtectedRoute allowedRoles={['member', 'admin']}>
                        <MemberDashboard />
                    </ProtectedRoute>
                } />

                {/* Authentication Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot" element={<Forgot />} />
                </Route>

                {/* Error Pages */}
                <Route path="/error/400" element={<ErrorPage errorCode="400" description="Bad Request. Permintaan tidak dapat diproses." image="/img/400.png" />} />
                <Route path="/error/401" element={<ErrorPage errorCode="401" description="Unauthorized. Anda tidak memiliki akses ke sini." image="/img/401.png" />} />
                <Route path="/error/403" element={<ErrorPage errorCode="403" description="Forbidden. Akses ditolak secara permanen." image="/img/403.png" />} />
                <Route path="*" element={<ErrorPage errorCode="404" description="Halaman tidak ditemukan." image="/img/error-404.svg" />} />
            </Routes>
        </Suspense>
    );
}