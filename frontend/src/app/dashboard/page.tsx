"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
}

interface UploadedManual {
  id?: string;
  title?: string;
  description?: string;
  tags?: string[];
  name?: string;
  date?: string;
  status?: string;
  created_at?: string;
}

interface CompanyInfo {
  id: string;
  name: string;
  slug: string;
  role: string;
  memberCount?: number;
}

interface CompanyMember {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading, role, getAccessToken, companies, isCompanyAdmin, refreshCompanies } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("My Manuals");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [productId, setProductId] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [dbProducts, setDbProducts] = useState<{ id: string; title?: string; description?: string; tags?: string[]; company_id?: string | null; created_at?: string }[]>([]);
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadTags, setUploadTags] = useState("");
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [manualList, setManualList] = useState<UploadedManual[]>([]);
  const [companyDetails, setCompanyDetails] = useState<CompanyInfo[]>([]);
  const [companyMembers, setCompanyMembers] = useState<Record<string, CompanyMember[]>>({});
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [inviteCompanyId, setInviteCompanyId] = useState<string | null>(null);
  const [removeStatus, setRemoveStatus] = useState<string | null>(null);
  const [addUserId, setAddUserId] = useState("");
  const [addUserRole, setAddUserRole] = useState("member");
  const [addUserStatus, setAddUserStatus] = useState<string | null>(null);
  const [addUserCompanyId, setAddUserCompanyId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState("");
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [links, setLinks] = useState<{ url: string; title: string }[]>([]);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const fetchManuals = async () => {
    try {
      const token = await getAccessToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const response = await fetch(`${API_BASE}/api/manuals`, { headers });
      if (response.ok) {
        setManualList(await response.json());
      }
    } catch (err) {
      console.error("Failed to fetch manuals:", err);
    }
  };

  const fetchDbProducts = async () => {
    try {
      const token = await getAccessToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/products`, { headers });
      if (res.ok) {
        setDbProducts(await res.json());
      }
    } catch {}
  };

  const fetchCompanyDetails = useCallback(async () => {
    const token = await getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}/api/companies/mine`, { headers });
      if (res.ok) {
        const data = await res.json();
        setCompanyDetails(data);

        const memberPromises = data.map(async (c: CompanyInfo) => {
          const mRes = await fetch(`${API_BASE}/api/companies/${c.id}/members`, { headers });
          if (mRes.ok) {
            const members = await mRes.json();
            return { id: c.id, members };
          }
          return { id: c.id, members: [] };
        });

        const results = await Promise.all(memberPromises);
        const memberMap: Record<string, CompanyMember[]> = {};
        results.forEach(r => { memberMap[r.id] = r.members; });
        setCompanyMembers(memberMap);
      }
    } catch (err) {
      console.error("Failed to fetch company details:", err);
    }
  }, [getAccessToken]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    requestAnimationFrame(() => {
      fetchManuals();
      fetchDbProducts();
    });
  }, [authLoading, user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchCompanyDetails();
    }
  }, [authLoading, user, fetchCompanyDetails, companies]);

  const sidebarItems: SidebarItem[] = [
    {
      name: "My Manuals",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: "My Products",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      name: "Companies",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: "Conversations",
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  const handleInvite = async (companyId: string) => {
    if (!inviteEmail.trim()) return;
    setInviteStatus("Sending...");
    const token = await getAccessToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}/api/companies/${companyId}/invitations`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });
      if (res.ok) {
        setInviteStatus("Invitation sent.");
        setInviteEmail("");
        setInviteCompanyId(null);
      } else {
        const err = await res.json();
        setInviteStatus(err.error || "Failed to send invitation.");
      }
    } catch {
      setInviteStatus("Network error.");
    }
  };

  const handleAddUser = async (companyId: string) => {
    if (!addUserId.trim()) return;
    setAddUserStatus("Adding...");
    const token = await getAccessToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}/api/companies/${companyId}/members`, {
        method: "POST",
        headers,
        body: JSON.stringify({ userId: addUserId.trim(), role: addUserRole }),
      });
      if (res.ok) {
        setAddUserStatus("Member added.");
        setAddUserId("");
        setAddUserCompanyId(null);
        await fetchCompanyDetails();
      } else {
        const err = await res.json();
        setAddUserStatus(err.error || "Failed to add member.");
      }
    } catch {
      setAddUserStatus("Network error.");
    }
  };

  const handleRemoveMember = async (companyId: string, userId: string) => {
    const token = await getAccessToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}/api/companies/${companyId}/members/${userId}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setRemoveStatus("Member removed.");
        await fetchCompanyDetails();
      } else {
        const err = await res.json();
        setRemoveStatus(err.error || "Failed to remove member.");
      }
    } catch {
      setRemoveStatus("Network error.");
    }
  };

  const handleDeleteProductFromDashboard = async (productId: string) => {
    const token = await getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        const err = await res.json();
        setDeleteError(err.error || "Failed to delete product");
        return;
      }
      setDeletingProductId(null);
      setDeleteError(null);
      fetchDbProducts();
      fetchManuals();
    } catch {
      setDeleteError("Network error while deleting product");
    }
  };

  const handleEditProduct = async (productId: string) => {
    const token = await getAccessToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          tags: editTags ? editTags.split(",").map(t => t.trim()) : [],
        }),
      });
      if (res.ok) {
        setEditingProductId(null);
        fetchDbProducts();
      } else {
        const err = await res.json();
        console.error("Edit failed:", err.error);
      }
    } catch {}
  };

  const canEdit = (product: { company_id?: string | null }): boolean => {
    if (role === "admin") return true;
    if (!product.company_id) return false;
    return companies.some(c => c.id === product.company_id);
  };

  const canUpload = role === "admin" || companies.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="pb-5">
        <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage product resources, upload instruction manuals, and monitor diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-sm">
          <div className="flex flex-col gap-1">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-mantis-green-light dark:bg-green-950/20 border border-mantis-green-border dark:border-green-900/50 text-green-800 dark:text-green-300"
                      : "bg-transparent border border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className={isActive ? "text-mantis-green" : "text-slate-400 dark:text-slate-500"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-6 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 md:p-8 shadow-sm">
          <h2 className="font-display font-bold text-[var(--foreground)] text-lg pb-4 mb-4 border-b border-[var(--card-border)]">
            {activeTab}
          </h2>

          {activeTab === "My Manuals" ? (
            canUpload ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Product ID <span className="text-red-500">*</span></label>
                  <input type="text" value={productId} onChange={(e) => { setProductId(e.target.value); if (!uploadTitle) setUploadTitle(e.target.value.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")); }}
                    placeholder="product-slug-id"
                    className="rounded-xl border border-[var(--card-border)] bg-[var(--section-bg)] px-3 py-2 text-xs font-semibold outline-none focus:border-mantis-green dark:text-white font-mono"
                    disabled={uploading} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Product Title <span className="text-red-500">*</span></label>
                  <input type="text" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Xiaomi Mi Electric Scooter 4 Pro"
                    className="rounded-xl border border-[var(--card-border)] bg-[var(--section-bg)] px-3 py-2 text-xs font-semibold outline-none focus:border-mantis-green dark:text-white"
                    disabled={uploading} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description <span className="text-red-500">*</span></label>
                  <textarea value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Brief product description..." rows={2}
                    className="rounded-xl border border-[var(--card-border)] bg-[var(--section-bg)] px-3 py-2 text-xs font-semibold outline-none focus:border-mantis-green dark:text-white resize-none"
                    disabled={uploading} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tags <span className="text-red-500">*</span></label>
                  <input type="text" value={uploadTags} onChange={(e) => setUploadTags(e.target.value)}
                    placeholder="e.g. scooter, electric, troubleshooting"
                    className="rounded-xl border border-[var(--card-border)] bg-[var(--section-bg)] px-3 py-2 text-xs font-semibold outline-none focus:border-mantis-green dark:text-white"
                    disabled={uploading} />
                </div>

                {/* Product Image */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Product Image (optional)</label>
                  <div onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-4 rounded-2xl border-2 border-dashed p-4 cursor-pointer transition-all border-[var(--card-border)] hover:border-mantis-green bg-[var(--section-bg)]/50">
                    <input type="file" accept="image/*" className="hidden" ref={imageInputRef}
                      onChange={(e) => setUploadImage(e.target.files?.[0] || null)} disabled={uploading} />
                    {uploadImage ? (
                      <>
                        <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden border border-[var(--card-border)]">
                          <img src={URL.createObjectURL(uploadImage)} alt={uploadImage.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{uploadImage.name}</p>
                          <p className="text-[10px] text-slate-400">Click to change</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setUploadImage(null); }}
                          className="shrink-0 rounded-full bg-red-100 dark:bg-red-950/40 text-red-500 hover:text-red-700 w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer">&times;</button>
                      </>
                    ) : (
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--section-bg)] text-slate-400 shrink-0">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Click to select product image</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Manual */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">PDF Manual <span className="text-red-500">*</span></label>
                  <div onClick={() => pdfInputRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all border-[var(--card-border)] hover:border-mantis-green bg-[var(--section-bg)]/50">
                    <input type="file" accept=".pdf" className="hidden" ref={pdfInputRef}
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)} disabled={uploading} />
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--section-bg)] text-slate-400 mb-3">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {pdfFile ? pdfFile.name : 'Click to select PDF manual'}
                    </p>
                  </div>
                </div>

                {/* Additional Images */}
                <div className="border-t border-[var(--card-border)] pt-4">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Additional Images (optional)</p>
                  <input type="file" accept="image/*" multiple
                    className="text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-mantis-green file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-mantis-green-dark cursor-pointer"
                    onChange={(e) => { const files = e.target.files; if (files) setAdditionalImages(prev => [...prev, ...Array.from(files!)]); }}
                    disabled={uploading} />
                </div>

                {/* Videos */}
                <div className="border-t border-[var(--card-border)] pt-4">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Videos (optional)</p>
                  <input type="file" accept="video/*" multiple
                    className="text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-mantis-green file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-mantis-green-dark cursor-pointer"
                    onChange={(e) => { const files = e.target.files; if (files) setVideos(prev => [...prev, ...Array.from(files!)]); }}
                    disabled={uploading} />
                </div>

                {/* Links */}
                <div className="border-t border-[var(--card-border)] pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">External Links (optional)</label>
                    <button type="button" onClick={() => setLinks(prev => [...prev, { url: '', title: '' }])}
                      className="rounded-lg border border-[var(--card-border)] px-2 py-1 text-[10px] font-semibold text-slate-500 hover:border-slate-300 transition-colors cursor-pointer" disabled={uploading}>
                      Add Link
                    </button>
                  </div>
                  {links.map((link, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="url" value={link.url} onChange={(e) => { const u = [...links]; u[i] = { ...u[i], url: e.target.value }; setLinks(u); }}
                        placeholder="https://example.com/guide"
                        className="flex-1 rounded-xl border border-[var(--card-border)] bg-[var(--section-bg)] px-3 py-2 text-xs font-semibold outline-none focus:border-mantis-green dark:text-white" disabled={uploading} />
                      <input type="text" value={link.title} onChange={(e) => { const u = [...links]; u[i] = { ...u[i], title: e.target.value }; setLinks(u); }}
                        placeholder="Title"
                        className="w-32 rounded-xl border border-[var(--card-border)] bg-[var(--section-bg)] px-3 py-2 text-xs font-semibold outline-none focus:border-mantis-green dark:text-white" disabled={uploading} />
                      <button onClick={() => setLinks(prev => prev.filter((_, j) => j !== i))}
                        className="text-red-400 hover:text-red-600 text-lg cursor-pointer px-1" disabled={uploading}>&times;</button>
                    </div>
                  ))}
                </div>

                <button onClick={async () => {
                  if (!productId.trim() || !uploadTitle.trim() || !uploadDescription.trim() || !uploadTags.trim() || !pdfFile) {
                    setUploadStatus("Please fill in all required fields.");
                    return;
                  }
                  setUploading(true);
                  setUploadStatus("Creating product...");
                  try {
                    const token = await getAccessToken();
                    const headers: Record<string, string> = { "Content-Type": "application/json" };
                    if (token) headers["Authorization"] = `Bearer ${token}`;
                    const createRes = await fetch(`${API_BASE}/api/products`, {
                      method: "POST", headers,
                      body: JSON.stringify({ id: productId.trim(), title: uploadTitle.trim(), description: uploadDescription.trim(), tags: uploadTags.split(",").map(t => t.trim()) }),
                    });
                    if (!createRes.ok) { const err = await createRes.json(); throw new Error(err.error || "Failed to create product"); }
                    setUploadStatus("Uploading manual...");
                    const pdfFormData = new FormData();
                    pdfFormData.append("productId", productId.trim());
                    pdfFormData.append("title", uploadTitle.trim());
                    pdfFormData.append("description", uploadDescription.trim());
                    pdfFormData.append("tags", uploadTags);
                    pdfFormData.append("file", pdfFile);
                    if (uploadImage) pdfFormData.append("image", uploadImage);
                    const pdfHeaders: Record<string, string> = {};
                    if (token) pdfHeaders["Authorization"] = `Bearer ${token}`;
                    const pdfRes = await fetch(`${API_BASE}/api/upload-manual`, { method: "POST", headers: pdfHeaders, body: pdfFormData });
                    if (!pdfRes.ok) { const err = await pdfRes.json(); throw new Error(err.error || "Manual upload failed"); }
                    for (const img of additionalImages) {
                      const fd = new FormData(); fd.append("type", "image"); fd.append("title", img.name); fd.append("file", img);
                      const h: Record<string, string> = {}; if (token) h["Authorization"] = `Bearer ${token}`;
                      await fetch(`${API_BASE}/api/products/${productId.trim()}/resources`, { method: "POST", headers: h, body: fd });
                    }
                    for (const vid of videos) {
                      const fd = new FormData(); fd.append("type", "video"); fd.append("title", vid.name); fd.append("file", vid);
                      const h: Record<string, string> = {}; if (token) h["Authorization"] = `Bearer ${token}`;
                      await fetch(`${API_BASE}/api/products/${productId.trim()}/resources`, { method: "POST", headers: h, body: fd });
                    }
                    for (const link of links) {
                      if (!link.url.trim()) continue;
                      const h: Record<string, string> = { "Content-Type": "application/json" }; if (token) h["Authorization"] = `Bearer ${token}`;
                      await fetch(`${API_BASE}/api/products/${productId.trim()}/resources`, { method: "POST", headers: h, body: JSON.stringify({ type: "link", url: link.url.trim(), title: link.title.trim() || link.url.trim() }) });
                    }
                    setUploadStatus("Successfully uploaded product and resources!");
                    setPdfFile(null); setAdditionalImages([]); setVideos([]); setLinks([]); setUploadImage(null);
                    await fetchManuals();
                  } catch (err) { setUploadStatus(`Failed: ${err instanceof Error ? err.message : String(err)}`); }
                  finally { setUploading(false); }
                }}
                  className="w-full rounded-xl bg-mantis-green py-3 text-sm font-bold text-white hover:bg-mantis-green-dark transition-colors cursor-pointer disabled:opacity-50"
                  disabled={uploading}>
                  {uploading ? 'Processing...' : 'Create Product'}
                </button>

                {uploadStatus && (
                  <div className={`rounded-xl px-4 py-3 text-xs font-semibold border ${
                    uploadStatus.startsWith("Failed") ? "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300"
                    : uploadStatus.startsWith("Successfully") ? "bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300"
                    : "bg-slate-50 dark:bg-slate-950 border-[var(--card-border)] text-slate-700 dark:text-slate-400"
                  }`}>{uploadStatus}</div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
                </svg>
                <h3 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">Limited Access</h3>
                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto">Join a company to upload manuals.</p>
              </div>
            )
          ) : activeTab === "Companies" ? (
            <div className="space-y-6">
              {companyDetails.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">No Memberships</h3>
                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">You are not a member of any company yet.</p>
                </div>
              ) : (
                companyDetails.map((c) => {
                  const isAdmin = c.role === 'admin' || role === 'admin';
                  const members = companyMembers[c.id] || [];
                  return (
                    <div key={c.id} className="rounded-2xl border border-[var(--card-border)] p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-display font-bold text-[var(--foreground)]">{c.name}</h3>
                          <p className="text-xs text-slate-400">{c.memberCount || members.length} member(s)</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          c.role === 'admin' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/10' : 'bg-slate-100 text-slate-600'
                        }`}>{c.role}</span>
                      </div>
                      <div className="space-y-1.5 mb-4">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Members</p>
                        {members.map((m) => (
                          <div key={m.id} className="flex items-center justify-between rounded-xl border border-[var(--card-border)] bg-slate-50/50 dark:bg-slate-900/30 px-3 py-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">{m.user_id.substring(0, 8)}...</span>
                              <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold ${m.role === 'admin' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{m.role}</span>
                            </div>
                            {isAdmin && m.user_id !== user?.id && (
                              <button onClick={() => handleRemoveMember(c.id, m.user_id)}
                                className="text-[10px] text-red-500 hover:underline cursor-pointer font-semibold">Remove</button>
                            )}
                          </div>
                        ))}
                        {members.length === 0 && <p className="text-xs text-slate-400">No members.</p>}
                      </div>
                      {isAdmin && (
                        <div className="border-t border-[var(--card-border)] pt-4 space-y-3">
                          <div>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Invite by Email</p>
                            <div className="flex gap-2">
                              <input type="email" value={inviteCompanyId === c.id ? inviteEmail : ""}
                                onChange={(e) => { setInviteEmail(e.target.value); setInviteCompanyId(c.id); }}
                                placeholder="email@example.com"
                                className="flex-1 rounded-xl border border-[var(--card-border)] bg-[var(--section-bg)] px-3 py-2 text-xs font-semibold outline-none focus:border-mantis-green dark:text-white" />
                              <select value={inviteCompanyId === c.id ? inviteRole : "member"}
                                onChange={(e) => setInviteRole(e.target.value)}
                                className="rounded-xl border border-[var(--card-border)] bg-[var(--section-bg)] px-2 py-2 text-xs font-semibold outline-none focus:border-mantis-green dark:text-white">
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button onClick={() => handleInvite(c.id)}
                                className="rounded-lg bg-mantis-green px-4 py-2 text-xs font-semibold text-white hover:bg-mantis-green-dark transition-colors cursor-pointer">Invite</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : activeTab === "My Products" ? (
            <div className="space-y-4">
              {dbProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-slate-400">No products yet. Upload a manual first.</p>
                </div>
              ) : (
                dbProducts.map((p) => {
                  const editable = canEdit(p);
                  const isEditing = editingProductId === p.id;
                  return (
                    <div key={p.id} className="rounded-2xl border border-[var(--card-border)] p-5 shadow-sm">
                      {isEditing ? (
                        <div className="space-y-3">
                          <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--section-bg)] px-3 py-2 text-xs font-semibold outline-none focus:border-mantis-green dark:text-white" />
                          <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2}
                            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--section-bg)] px-3 py-2 text-xs font-semibold outline-none focus:border-mantis-green dark:text-white resize-none" />
                          <input type="text" value={editTags} onChange={(e) => setEditTags(e.target.value)}
                            placeholder="Tags (comma-separated)"
                            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--section-bg)] px-3 py-2 text-xs font-semibold outline-none focus:border-mantis-green dark:text-white" />
                          <div className="flex gap-2">
                            <button onClick={() => handleEditProduct(p.id)}
                              className="rounded-lg bg-mantis-green px-4 py-2 text-xs font-semibold text-white hover:bg-mantis-green-dark transition-colors cursor-pointer">Save</button>
                            <button onClick={() => setEditingProductId(null)}
                              className="rounded-lg border border-[var(--card-border)] px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-display font-bold text-[var(--foreground)]">{p.title || p.id}</h3>
                            {p.description && <p className="mt-1 text-xs text-slate-400">{p.description}</p>}
                            {p.tags && p.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {p.tags.map((tag: string, i: number) => (
                                  <span key={i} className="rounded-full bg-[var(--section-bg)] px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {editable && (
                              <>
                                <button onClick={() => { setEditingProductId(p.id); setEditTitle(p.title || ""); setEditDescription(p.description || ""); setEditTags(p.tags?.join(", ") || ""); }}
                                  className="rounded-lg border border-[var(--card-border)] px-3 py-2 text-[10px] font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">Edit</button>
                                <button onClick={() => { setDeletingProductId(p.id); setDeleteError(null); }}
                                  className="rounded-lg border border-red-200 dark:border-red-900/30 px-3 py-2 text-[10px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer">Delete</button>
                              </>
                            )}
                            <Link href={`/diagnostics?product=${p.id}`}
                              className="rounded-lg bg-mantis-green px-4 py-2 text-xs font-semibold text-white hover:bg-mantis-green-dark transition-colors">Diagnose</Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300">Conversations</h3>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">
                View your conversation history in the <Link href="/diagnostics" className="text-mantis-green hover:underline font-semibold">Diagnostics</Link> section.
              </p>
            </div>
          )}
        </section>

        {/* Right Panel */}
        <aside className="lg:col-span-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 shadow-sm">
          <h3 className="font-display font-bold text-[var(--foreground)] text-sm pb-3 border-b border-[var(--card-border)]">
            Recent Manuals
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            {manualList.map((man, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 rounded-xl border border-[var(--card-border)] bg-slate-50/30 dark:bg-slate-900/30 p-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-[var(--foreground)] text-[11px] truncate flex-1">
                    {man.title || man.name || 'Untitled'}
                  </h4>
                  <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-950/40 px-1.5 py-0.5 text-[9px] font-bold text-green-700 dark:text-green-300">
                    {man.status || 'Processed'}
                  </span>
                </div>
                {man.description && <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2">{man.description}</p>}
                <div className="flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500 font-semibold">
                  <span>{man.created_at ? new Date(man.created_at).toLocaleDateString() : ''}</span>
                </div>
              </div>
            ))}
            {manualList.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No manuals uploaded yet</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
