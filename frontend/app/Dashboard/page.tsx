
"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/context/Authcontext";
import api from "@/app/lib/api";

type User = {
    id: number;
    username: string;
    email: string;
    is_staff: boolean;
};

export default function Dashboard() {
    const { user, logout, loading } = useContext(AuthContext);
    const router = useRouter();

    const [users, setUsers] = useState<User[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [ordering, setOrdering] = useState("");
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (!user || loading) return;

        const controller = new AbortController();
        const fetchUsers = async () => {
            try {
                setDataLoading(true);
                setError(null);
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (ordering) params.append("ordering", ordering);
                params.append("page", page.toString());

                const res = await api.get(`users/?${params.toString()}`, {
                    signal: controller.signal,
                });
                setUsers(res.data.results);
            } catch (err: any) {
                if (err.name !== "CanceledError") {
                    setError("Failed to load users.");
                }
            } finally {
                setDataLoading(false);
            }
        };

        fetchUsers();
        return () => controller.abort();
    }, [user, loading, search, ordering, page]);

    const handleCreate = async () => {
        if (!newUser.username || !newUser.email || !newUser.password) {
            alert("Please fill all fields");
            return;
        }
        try {
            const res = await api.post("users/", newUser);
            setUsers((prev) => [res.data, ...prev]);
            setNewUser({ username: "", email: "", password: "" });
            setPage(1);
        } catch {
            alert("Create failed");
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await api.delete(`users/${id}/`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (error: any) {
            const backendMessage = error.response?.data?.error;
            if (backendMessage) alert(backendMessage);
            else if (error.response?.status === 403) alert("Only admin can delete users");
            else alert("Delete failed");
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500 animate-pulse font-medium">
                Checking authentication...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <nav className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">U</div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">User Management</h2>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 leading-none">{user.username}</p>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">User</p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-all active:scale-95"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 mt-8 space-y-6">
                
                {/* Create User Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Quick Add
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                        <input
                            className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Email address"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                        <input
                            className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Password"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                        <button
                            onClick={handleCreate}
                            className="bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-[0.98]"
                        >
                            Add New User
                        </button>
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setOrdering("username")}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${ordering === 'username' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            A-Z
                        </button>
                        <button 
                            onClick={() => setOrdering("-username")}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${ordering === '-username' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Z-A
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {dataLoading ? (
                        <div className="p-20 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
                            <p className="text-gray-400 font-medium">Fetching records...</p>
                        </div>
                    ) : error ? (
                        <div className="p-20 text-center text-red-500 font-medium">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Profile</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Privileges</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Options</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-sm text-gray-400">#{u.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                        {u.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{u.username}</p>
                                                        <p className="text-sm text-gray-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {u.is_staff ? (
                                                    <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md text-[10px] font-black uppercase tracking-wider border border-purple-200">Staff</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-wider border border-slate-200">User</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <button 
                                                        onClick={() => router.push(`/Dashboard/viewuser/${u.id}`)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="View"
                                                    >
                                                        View
                                                    </button>
                                                    <button 
                                                        onClick={() => router.push(`/Dashboard/edituser/${u.id}`)}
                                                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                        title="Edit"
                                                    >
                                                        Edit
                                                    </button>
                                                    {user.id !== u.id && (
                                                        <button 
                                                            onClick={() => handleDelete(u.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                            title="Delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-2">
                    <p className="text-sm text-gray-500">Showing page <span className="font-bold text-gray-900">{page}</span></p>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-bold disabled:opacity-50 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}