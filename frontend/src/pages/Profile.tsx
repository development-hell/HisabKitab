import { Check, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../lib/axios";

interface FieldErrors {
	[key: string]: string[];
}

export default function Profile() {
	const { user } = useAuth();
	const [profile, setProfile] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState(false);
	const [saving, setSaving] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
	const [message, setMessage] = useState("");

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await api.get(`users/${user?.user_id}/`);
				setProfile(res.data);
			} catch {
				setMessage("❌ Failed to load profile");
			} finally {
				setLoading(false);
			}
		};

		if (user) fetchProfile();
	}, [user]);

	/* =======================
       EDIT / CANCEL
  ========================= */
	const startEdit = () => {
		setEditMode(true);
		setFieldErrors({});
	};

	const cancelEdit = () => {
		setEditMode(false);
		setSelectedFile(null);
		setFieldErrors({});
		api.get(`users/${user?.user_id}/`).then((res) => setProfile(res.data));
	};

	/* =======================
       SAVE CHANGES
  ========================= */
	const saveChanges = async () => {
		setSaving(true);
		setFieldErrors({});
		setMessage("");

		try {
			const formData = new FormData();
			formData.append("first_name", profile.first_name || "");
			formData.append("last_name", profile.last_name || "");
			formData.append("phone_number", profile.phone_number || "");
			formData.append("username", profile.username || "");

			if (selectedFile) formData.append("profile_image", selectedFile);

			await api.patch(`users/${user?.user_id}/`, formData);

			setMessage("✅ Profile updated successfully!");
			setEditMode(false);
		} catch (e: any) {
			if (e.response?.data) {
				setFieldErrors(e.response.data);
			} else {
				setMessage("❌ Failed to update profile");
			}
		} finally {
			setSaving(false);
		}
	};

	/* =======================
       LOADING SPINNER
  ========================= */
	if (loading)
		return (
			<div className="flex items-center justify-center h-[70vh]">
				<div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
			</div>
		);

	return (
		<div className="max-w-2xl mx-auto space-y-6 p-6">
			{/* =======================
            PROFILE HEADER
        ========================= */}
			<div className="bg-surface text-surface-foreground rounded-xl p-8 shadow-smooth flex flex-col items-center gap-4">
				<img
					src={profile.profile_image ? profile.profile_image : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.first_name || profile.username)}`}
					alt="Profile"
					className="w-28 h-28 rounded-full object-cover shadow-lg"
				/>

				<div className="text-center">
					<h2 className="text-2xl font-semibold">{profile.first_name || profile.username}</h2>
					<p className="text-muted">{profile.email}</p>
				</div>

				{!editMode && (
					<button onClick={startEdit} className="btn btn-primary px-4 py-2 mt-2 flex items-center gap-2">
						<Pencil size={16} /> Edit Profile
					</button>
				)}
			</div>

			{/* =======================
            GENERAL INFORMATION
        ========================= */}
			<div className="bg-surface text-surface-foreground rounded-xl shadow-smooth p-6">
				<h3 className="font-semibold text-lg mb-4">General Information</h3>

				<div className="space-y-4">
					<ProfileRow
						label="First Name"
						editable={editMode}
						value={profile.first_name}
						onChange={(v) => setProfile({ ...profile, first_name: v })}
						error={fieldErrors.first_name}
					/>

					<ProfileRow
						label="Last Name"
						editable={editMode}
						value={profile.last_name}
						onChange={(v) => setProfile({ ...profile, last_name: v })}
						error={fieldErrors.last_name}
					/>

					<ProfileRow
						label="Phone Number"
						editable={editMode}
						value={profile.phone_number}
						onChange={(v) => setProfile({ ...profile, phone_number: v })}
						error={fieldErrors.phone_number}
					/>

					<ProfileRow
						label="Username"
						editable={editMode}
						value={profile.username}
						onChange={(v) => setProfile({ ...profile, username: v })}
						error={fieldErrors.username}
					/>

					{/* FILE UPLOAD */}
					{editMode && (
						<div className="flex flex-col gap-1 pt-2">
							<label className="text-sm text-muted">Change Profile Image</label>
							<input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
						</div>
					)}
				</div>

				{message && <p className={`text-sm mt-4 ${message.startsWith("❌") ? "text-danger" : "text-accent"}`}>{message}</p>}
			</div>

			{/* =======================
            ACTION BUTTONS
        ========================= */}
			{editMode && (
				<div className="flex gap-4 justify-end">
					<button onClick={cancelEdit} className="btn px-4 py-2 border border-base rounded-md flex items-center gap-2">
						<X size={16} /> Cancel
					</button>

					<button onClick={saveChanges} disabled={saving} className="btn btn-primary px-4 py-2 flex items-center gap-2">
						<Check size={16} />
						{saving ? "Saving..." : "Save"}
					</button>
				</div>
			)}
		</div>
	);
}

/* =========================================================
   REUSABLE PROFILE ROW COMPONENT (with error display)
========================================================= */
function ProfileRow({
	label,
	value,
	editable,
	error,
	onChange,
}: {
	label: string;
	value: string;
	editable: boolean;
	error?: string[];
	onChange?: (v: string) => void;
}) {
	return (
		<div className="flex flex-col">
			<div className="flex justify-between items-center py-2 border-b border-base">
				<span className="text-muted">{label}</span>

				{editable ? (
					<input
						value={value || ""}
						onChange={(e) => onChange?.(e.target.value)}
						className={`bg-surface border rounded-md px-3 py-1 w-48 ${error ? "border-danger" : "border-base"}`}
					/>
				) : (
					<span className="text-base font-medium">{value || "—"}</span>
				)}
			</div>

			{/* SHOW FIELD ERRORS */}
			{error && <p className="text-danger text-sm mt-1 text-right">{error.join(", ")}</p>}
		</div>
	);
}
