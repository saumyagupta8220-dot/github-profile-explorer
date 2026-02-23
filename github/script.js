const searchBtn = document.getElementById("searchBtn");
const usernameInput = document.getElementById("username");
const profileDiv = document.getElementById("profile");
const reposDiv = document.getElementById("repos");
const loadingText = document.getElementById("loading");
const errorText = document.getElementById("error");
const repoTitle = document.getElementById("repoTitle");

// Function to fetch user profile
async function fetchProfile(username) {
  try {
    loadingText.classList.remove("hidden");
    errorText.classList.add("hidden");
    searchBtn.disabled = true;

    // Fetch user
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error("User not found");

    const data = await res.json();

    // Display profile
    profileDiv.innerHTML = `
      <img src="${data.avatar_url}" />
      <h2>${data.name || "No Name"}</h2>
      <p>${data.bio || "No bio available"}</p>
      <p>Followers: ${data.followers} | Following: ${data.following}</p>
      <p>Public Repos: ${data.public_repos}</p>
    `;
    profileDiv.classList.remove("hidden");

    fetchRepos(username);

  } catch (error) {
    errorText.textContent = error.message;
    errorText.classList.remove("hidden");
    profileDiv.classList.add("hidden");
    reposDiv.innerHTML = "";
  } finally {
    loadingText.classList.add("hidden");
    searchBtn.disabled = false;
  }
}

// Fetch repositories
async function fetchRepos(username) {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  const repos = await res.json();

  reposDiv.innerHTML = "";

  if (repos.length === 0) {
    reposDiv.innerHTML = "<p>No repositories found</p>";
    return;
  }

  repoTitle.classList.remove("hidden");

  repos.slice(0, 6).forEach(repo => {
    const card = document.createElement("div");
    card.className = "repo-card";
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>⭐ Stars: ${repo.stargazers_count}</p>
      <p>🍴 Forks: ${repo.forks_count}</p>
      <p>🧠 Language: ${repo.language || "N/A"}</p>
    `;

    // Click to open repo
    card.onclick = () => window.open(repo.html_url, "_blank");
    reposDiv.appendChild(card);
  });
}

// Button click
searchBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username) fetchProfile(username);
});