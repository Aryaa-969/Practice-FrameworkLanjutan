import { Routes, Route } from "react-router-dom";
import './assets/tailwind.css';
import React, { Suspense } from "react";
import Loading from "./components/Loading";
const Dashboard = React.lazy(() => import("./pages/Dashboard"))
const Orders = React.lazy(() => import("./pages/Orders"))
const Customers = React.lazy(() => import("./pages/Customers"))
const NotFound = React.lazy(() => import("./pages/NotFound"))
const Login = React.lazy(() => import("./pages/auth/Login"))
const Register = React.lazy(() => import("./pages/auth/Register"))
const Forgot = React.lazy(() => import("./pages/auth/Forgot"))
const ErrorPage = React.lazy(() => import("./components/ErrorPage"))
const MainLayout = React.lazy(() => import("./layouts/MainLayout"))
const AuthLayout = React.lazy(() => import("./layouts/AuthLayouts"))

export default function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/error/400" element={<ErrorPage errorCode="400" description="Bad Request. Permintaan tidak dapat diproses." image="/img/400.png" />} />
                    <Route path="/error/401" element={<ErrorPage errorCode="401" description="Unauthorized. Anda tidak memiliki akses ke sini." image="/img/401.png" />} />
                    <Route path="/error/403" element={<ErrorPage errorCode="403" description="Forbidden. Akses ditolak secara permanen." image="/img/403.png" />} />
                    <Route path="*" element={<ErrorPage errorCode="404" description="Halaman tidak ditemukan." image="/img/error-404.svg" />} />
                </Route>

                <Route element={<AuthLayout/>}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/forgot" element={<Forgot/>} />
                </Route>
            </Routes>
        </Suspense>           
    );
}