import React, { FC, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { setPageTitle } from "../../features/ui/uiSlice";
import { useAppDispatch } from "../../app/hooks";
import { useSendSingleUserNoticeMutation } from "../../features/admin/management/mamagementApi";

interface FeedbackForm {
  subject: string;
  description: string;
}

const SendFeedback: FC = () => {
  const [form, setForm] = useState<FeedbackForm>({
    subject: "",
    description: "",
  });
  const dispatch = useAppDispatch();
  const [sendSingleUserNotice, { isLoading: isSubmitting }] =
    useSendSingleUserNoticeMutation();

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: "Feedback",
        subtitle: "Share your thoughts, suggestions, or report an issue.",
      }),
    );
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.description.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const result = await sendSingleUserNotice({
        subject: form.subject,
        description: form.description,
        recipientType: "A",
        sendEmail: true,
      }).unwrap();

      if (result?.success) {
        toast.success("Feedback sent successfully! 💜");
        setForm({ subject: "", description: "" });
      }
    } catch (err: any) {
      toast.error(err?.data?.description ?? "Something went wrong.");
    }
  };

  const styles: Record<string, React.CSSProperties> = {
    // page fills the parent container exactly without overflow
    page: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      padding: "0 24px 24px 24px", // Matches your screenshot spacing
      boxSizing: "border-box",
      overflow: "hidden",
    },
    // The card is now flexible to grow/shrink based on space
    card: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "16px",
      padding: "32px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      flex: 1, // This makes the card take up remaining vertical space
      minHeight: 0, // Critical for flex children to not overflow
    },
    noteBanner: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      background: "#eff6ff",
      border: "1px solid #bfdbfe",
      borderRadius: "10px",
      padding: "14px 16px",
      marginBottom: "24px",
    },
    noteTitle: {
      fontSize: "13px",
      fontWeight: 600,
      color: "#1d4ed8",
      margin: "0 0 3px 0",
    },
    noteText: {
      fontSize: "13px",
      color: "#3b82f6",
      margin: 0,
      lineHeight: 1.6,
    },
    field: { marginBottom: "20px" },
    // This wrapper allows the textarea to grow to the bottom of the card
    fieldGrow: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      marginBottom: "16px",
      minHeight: 0,
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: 500,
      color: "#374151",
      marginBottom: "6px",
    },
    input: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "10px 14px",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      padding: "10px 14px",
      fontSize: "14px",
      outline: "none",
      resize: "none",
      flex: 1, // Fills the middle section
      boxSizing: "border-box",
      lineHeight: 1.6,
    },
    charCount: {
      fontSize: "12px",
      color: "#9ca3af",
      textAlign: "right",
      marginTop: "5px",
    },
    submitBtn: {
      width: "100%",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "14px",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: "0 2px 12px rgba(99,102,241,0.3)",
    },
  };

  return (
    <div style={styles.page}>
      <Toaster position="top-right" />
      <div style={styles.card}>
        <div style={styles.noteBanner}>
          <span style={{ fontSize: "18px" }}>💬</span>
          <div>
            <p style={styles.noteTitle}>We value your feedback</p>
            <p style={styles.noteText}>
              Every description is read by our team. Your thoughts help us improve
              every day.
            </p>
            <p style={{ ...styles.noteText, marginTop: "4px" }}>
              📧 Admins will be notified via email.
            </p>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Subject</label>
          <input
            style={styles.input}
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="What is your feedback about?"
          />
        </div>

        <div style={styles.fieldGrow}>
          <label style={styles.label}>description</label>
          <textarea
            style={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Tell us what's on your mind..."
          />
          <p style={styles.charCount}>{form.description.length} characters</p>
        </div>

        <button
          style={{ ...styles.submitBtn, opacity: isSubmitting ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Feedback"}
        </button>
      </div>
    </div>
  );
};

export default SendFeedback;
