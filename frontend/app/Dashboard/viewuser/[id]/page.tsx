
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/api";

export default function ViewUser() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await api.get(`users/${id}/`);
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
        <p className="text-red-500 font-medium mb-4">User not found.</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          Go back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <div className="relative px-8 pb-8">

            <div className="relative -top-12">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="-mt-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  User ID
                </label>
                <p className="mt-1 text-gray-900 font-medium">{user.id}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Account Type
                </label>
                <div className="mt-1">
                  {user.is_staff ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                      Staff Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                      Standard User
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => router.push(`/Dashboard/edituser/${user.id}`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm text-center"
              >
                Edit Profile
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}