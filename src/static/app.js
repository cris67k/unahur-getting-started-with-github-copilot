document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Build participant list HTML
        let participantsHTML = "<p><strong>Participants:</strong> <em>None yet</em></p>";
        if (details.participants && details.participants.length) {
          // each list item has a delete icon
          const listItems = details.participants
            .map(
              (p) =>
                `<li>
                  <span class="participant-name">${p}</span>
                  <span class="delete-icon" data-email="${p}">&times;</span>
                </li>`
            )
            .join("");
          participantsHTML = `
            <p><strong>Participants:</strong></p>
            <ul class="participants-list">
              ${listItems}
            </ul>
          `;
        }

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          ${participantsHTML}
        `;

        activitiesList.appendChild(activityCard);

        // attach delete handlers for participants
        activityCard.querySelectorAll('.delete-icon').forEach((icon) => {
          icon.addEventListener('click', async () => {
            const email = icon.getAttribute('data-email');
            try {
              const resp = await fetch(
                `/activities/${encodeURIComponent(name)}/participants?email=${encodeURIComponent(email)}`,
                { method: 'DELETE' }
              );
              const resJson = await resp.json();
              if (resp.ok) {
                messageDiv.textContent = resJson.message;
                messageDiv.className = 'success';
                fetchActivities(); // refresh list
              } else {
                messageDiv.textContent = resJson.detail || 'Unable to remove participant';
                messageDiv.className = 'error';
              }
            } catch (err) {
              messageDiv.textContent = 'Network error removing participant';
              messageDiv.className = 'error';
              console.error('Error removing participant:', err);
            }
            messageDiv.classList.remove('hidden');
            setTimeout(() => messageDiv.classList.add('hidden'), 5000);
          });
        });

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
