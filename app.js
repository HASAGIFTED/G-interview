(() => {
  "use strict";

  const API_URL = "https://script.google.com/macros/s/AKfycbw6AOuvz1NSLk8rtQ3527FORblZI49LUaTy5AqNKL_0K-VjOwFDry1HUSoMqN1dW2YnHg/exec";

  const form = document.getElementById("lookupForm");
  const nationalIdInput = document.getElementById("nationalId");
  const submitButton = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");
  const resultSection = document.getElementById("resultSection");

  const fields = {
    studentName: document.getElementById("studentName"),
    studentGrade: document.getElementById("studentGrade"),
    guardianPhone: document.getElementById("guardianPhone"),
    interviewDay: document.getElementById("interviewDay"),
    interviewDate: document.getElementById("interviewDate"),
    interviewTime: document.getElementById("interviewTime")
  };

  nationalIdInput.addEventListener("input", () => {
    nationalIdInput.value = normalizeDigits(nationalIdInput.value).slice(0, 10);
    clearMessage();
    resultSection.hidden = true;
  });

  nationalIdInput.addEventListener("paste", (event) => {
    event.preventDefault();
    const pastedText = (event.clipboardData || window.clipboardData).getData("text");
    nationalIdInput.value = normalizeDigits(pastedText).slice(0, 10);
    clearMessage();
    resultSection.hidden = true;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nationalId = normalizeDigits(nationalIdInput.value.trim());
    resultSection.hidden = true;
    clearMessage();

    if (!/^\d{10}$/.test(nationalId)) {
      showMessage("يرجى إدخال رقم هوية صحيح مكوّن من 10 أرقام.", "error");
      nationalIdInput.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}?id=${encodeURIComponent(nationalId)}&t=${Date.now()}`, {
        method: "GET",
        cache: "no-store",
        redirect: "follow"
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.ok !== true) {
        throw new Error(data?.message || "Invalid API response");
      }

      if (!data.found || !data.candidate) {
        showMessage(data.message || "رقم الهوية غير موجود ضمن قائمة الطالبات المرشحات.", "error");
        return;
      }

      renderCandidate(data.candidate);
      showMessage("تم العثور على بيانات الترشيح بنجاح.", "success");
      resultSection.hidden = false;
      resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      console.error("Lookup error:", error);
      showMessage("تعذر الاتصال بقاعدة البيانات حاليًا. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.", "error");
    } finally {
      setLoading(false);
    }
  });

  function renderCandidate(candidate) {
    fields.studentName.textContent = safeText(candidate.name);
    fields.studentGrade.textContent = safeText(candidate.grade);
    fields.guardianPhone.textContent = safeText(candidate.guardianPhone);
    fields.interviewDay.textContent = safeText(candidate.day);
    fields.interviewDate.textContent = safeText(candidate.date);
    fields.interviewTime.textContent = safeText(candidate.time);
  }

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.classList.toggle("is-loading", isLoading);
    submitButton.setAttribute("aria-busy", String(isLoading));
    submitButton.querySelector(".btn-text").textContent = isLoading ? "جاري التحقق" : "دخول";
  }

  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
  }

  function clearMessage() {
    formMessage.textContent = "";
    formMessage.className = "form-message";
  }

  function safeText(value) {
    const text = String(value ?? "").trim();
    return text || "—";
  }

  function normalizeDigits(value) {
    const arabicIndic = "٠١٢٣٤٥٦٧٨٩";
    const easternArabic = "۰۱۲۳۴۵۶۷۸۹";

    return String(value || "")
      .replace(/[٠-٩]/g, (digit) => arabicIndic.indexOf(digit))
      .replace(/[۰-۹]/g, (digit) => easternArabic.indexOf(digit))
      .replace(/\D/g, "");
  }
})();
