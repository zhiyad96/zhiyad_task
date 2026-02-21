// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import api from "@/app/lib/api";

// export default function EditUser() {
//   const { id } = useParams();
//   const router = useRouter();

//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     const fetchUser = async () => {
//       try {
//         const res = await api.get(`users/${id}/`);
//         setUser(res.data);
//       } catch {
//         alert("Failed to load user");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [id]);

//   const handleUpdate = async (e: any) => {
//     e.preventDefault();

//     try {
//       await api.put(`users/${id}/`, user);
//       alert("User updated successfully");
//       router.push("/Dashboard");
//     } catch {
//       alert("Update failed");
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Edit User</h2>

//       <form onSubmit={handleUpdate}>
//         <div>
//           <label>Username:</label>
//           <input
//             value={user.username}
//             onChange={(e) =>
//               setUser({ ...user, username: e.target.value })
//             }
//           />
//         </div>

//         <div>
//           <label>Email:</label>
//           <input
//             value={user.email}
//             onChange={(e) =>
//               setUser({ ...user, email: e.target.value })
//             }
//           />
//         </div>

        

//         <button type="submit">Save</button>
//       </form>
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/api";

export default function EditUser() {
    const { id } = useParams();
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            try {
                const res = await api.get(`users/${id}/`);
                setUser(res.data);
            } catch {
                alert("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.put(`users/${id}/`, user);
            // Optionally use a toast library here for a more professional feel
            alert("User updated successfully");
            router.push("/Dashboard");
        } catch {
            alert("Update failed. Please check the information and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <p className="text-gray-500 animate-pulse font-medium">Preparing editor...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Edit User </h2>
                        <p className="text-sm text-gray-500">Update account details of ID {id}</p>
                    </div>
                    <button 
                        onClick={() => router.back()}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Cancel"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Settings Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <form onSubmit={handleUpdate} className="p-8 space-y-6">
                        {/* Username Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                                placeholder="Enter username"
                                value={user.username}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                                required
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800"
                                placeholder="name@company.com"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                required
                            />
                        </div>


                        {/* Action Buttons */}
                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.push("/Dashboard")}
                                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center justify-center ${
                                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>

                
            </div>
        </div>
    );
}