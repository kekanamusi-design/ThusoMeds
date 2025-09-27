document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("triageForm");
  const loading = document.getElementById("loading");
  const resultCard = document.getElementById("resultCard");
  const ticketNumber = document.getElementById("ticketNumber");
  const severityLevel = document.getElementById("severityLevel");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Hide previous results
    resultCard.style.display = "none";

    // Show loading and disable submit button
    loading.style.display = "block";
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      if (data[key]) {
        // Handle checkboxes
        if (!Array.isArray(data[key])) data[key] = [data[key]];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    try {
      const response = await fetch("/submit", { // relative URL for flexibility
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      // Hide loading, show result
      loading.style.display = "none";
      resultCard.style.display = "block";

      ticketNumber.textContent = `🎟️ Ticket Number: ${result.ticket}`;
      severityLevel.textContent = `⚠️ Severity: ${result.severity}`;

      // Optional: color code severity
      severityLevel.className = ""; // reset previous classes
      if (result.severity.toLowerCase() === "high") severityLevel.classList.add("text-red-600");
      else if (result.severity.toLowerCase() === "medium") severityLevel.classList.add("text-orange-500");
      else severityLevel.classList.add("text-green-600");

    } catch (error) {
      console.error("Error:", error);
      loading.style.display = "none";
      resultCard.style.display = "block";
      ticketNumber.textContent = "❌ Error submitting form. Try again.";
      severityLevel.textContent = "";
    } finally {
      submitBtn.disabled = false; // re-enable button
    }
  });
});
