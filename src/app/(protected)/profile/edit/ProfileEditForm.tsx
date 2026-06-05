"use client";

import { useRef, useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "../actions";
import styles from "./page.module.css";

interface Props {
  userId: string;
  email: string;
  initialDisplayName: string;
  initialUsername: string;
  initialAvatarUrl: string;
}

function SubmitButton({ uploading }: { uploading: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.saveBtn} disabled={pending || uploading}>
      {(pending || uploading) && <Loader2 size={15} strokeWidth={2} className={styles.spin} />}
      Зачувај
    </button>
  );
}

export default function ProfileEditForm({
  userId,
  email,
  initialDisplayName,
  initialUsername,
  initialAvatarUrl,
}: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl]         = useState(initialAvatarUrl);
  const [avatarPreview, setAvatarPreview] = useState(initialAvatarUrl);
  const [uploading, setUploading]         = useState(false);
  const [uploadError, setUploadError]     = useState("");

  const [state, formAction] = useFormState(updateProfile, {});

  const displayInitial = (initialDisplayName || email)[0]?.toUpperCase() ?? "?";

  useEffect(() => {
    if (state?.success) {
      router.push("/profile");
      router.refresh();
    }
  }, [state, router]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { setUploadError("Сликата мора да биде под 2 MB."); return; }
    if (!file.type.startsWith("image/")) { setUploadError("Само слики се дозволени."); return; }

    setUploadError("");
    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);

    const supabase = createClient();
    const ext  = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (error) {
      setUploadError("Грешка при прикачување. Обиди се повторно.");
      setAvatarPreview(avatarUrl);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(publicUrl);
    setUploading(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <button type="button" onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={16} strokeWidth={2} />
            Назад
          </button>
          <h1 className={styles.title}>Уреди профил</h1>
        </div>

        {/* Avatar */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrap}>
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar"
                width={96}
                height={96}
                className={styles.avatarImg}
                unoptimized
              />
            ) : (
              <div className={styles.avatarFallback}>{displayInitial}</div>
            )}
            <button
              type="button"
              className={styles.avatarEditBtn}
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label="Промени слика"
            >
              {uploading
                ? <Loader2 size={14} strokeWidth={2} className={styles.spin} />
                : <Camera size={14} strokeWidth={2} />
              }
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className={styles.fileInput} onChange={handleFileChange} />
          {uploadError && <p className={styles.fieldError}>{uploadError}</p>}
          <p className={styles.avatarHint}>JPG, PNG · макс. 2 MB</p>
        </div>

        {/* Form */}
        <form action={formAction} className={styles.form}>
          <input type="hidden" name="avatar_url" value={avatarUrl} />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="display_name">Прикажано име</label>
            <input
              id="display_name"
              name="display_name"
              className={styles.input}
              defaultValue={initialDisplayName}
              placeholder="Пример: Петар Т."
              maxLength={50}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">Корисничко име</label>
            <div className={styles.inputWrap}>
              <span className={styles.inputPrefix}>@</span>
              <input
                id="username"
                name="username"
                className={`${styles.input} ${styles.inputWithPrefix}`}
                defaultValue={initialUsername}
                placeholder="petar_t"
                maxLength={30}
              />
            </div>
            <p className={styles.hint}>Мали букви, бројки и _ · 3–30 знаци · опционално</p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Е-пошта</label>
            <input className={`${styles.input} ${styles.inputDisabled}`} value={email} disabled />
            <p className={styles.hint}>Е-поштата не може да се промени.</p>
          </div>

          {state?.error && <p className={styles.formError}>{state.error}</p>}

          {/* Success — redirect after save */}
          {state && !state.error && 'success' in state && (
            <p className={styles.formSuccess}>Промените се зачувани!</p>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>
              Откажи
            </button>
            <SubmitButton uploading={uploading} />
          </div>
        </form>
      </div>
    </div>
  );
}
