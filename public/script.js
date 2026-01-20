// Current user ID - in production, this would come from authentication
const currentUserId = 'user-1'; // Example, replace with actual user ID

let profiles = [];
let currentIndex = 0;

async function fetchProfiles() {
  try {
    const response = await fetch(`/api/users/${currentUserId}/potential-matches`);
    if (!response.ok) {
      throw new Error('Failed to fetch profiles');
    }
    profiles = await response.json();
    if (profiles.length > 0) {
      showProfile();
    } else {
      document.getElementById('profile-card').innerHTML = '<p>No more profiles to show!</p>';
    }
  } catch (error) {
    console.error('Error fetching profiles:', error);
    document.getElementById('profile-card').innerHTML = '<p>Error loading profiles. Please try again.</p>';
  }
}

function showProfile() {
  if (currentIndex >= profiles.length) {
    document.getElementById('profile-card').innerHTML = '<p>No more profiles to show!</p>';
    return;
  }

  const profile = profiles[currentIndex];
  const profileCard = document.getElementById('profile-card');
  profileCard.innerHTML = `
    <img src="${profile.img}" alt="${profile.name}" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
    <h2>${profile.name}</h2>
    <p><strong>Role:</strong> ${profile.type}</p>
    <p><strong>Location:</strong> ${profile.location}</p>
    <p><strong>Experience:</strong> ${profile.experience}</p>
    <p><strong>Pitch:</strong> ${profile.pitch}</p>
  `;
}

async function handleSwipe(action) {
  if (currentIndex >= profiles.length) return;

  const targetUserId = profiles[currentIndex].id;

  try {
    const response = await fetch('/api/swipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: currentUserId,
        targetUserId: targetUserId,
        action: action
      })
    });

    if (!response.ok) {
      throw new Error('Failed to process swipe');
    }

    const result = await response.json();

    if (result.matched) {
      alert(`🎉 You've matched with ${profiles[currentIndex].name}!\nThey will be notified of your interest.`);
    }

    currentIndex++;
    showProfile();
  } catch (error) {
    console.error('Error processing swipe:', error);
    alert('Error processing your swipe. Please try again.');
  }
}

document.getElementById('swipe-right').addEventListener('click', () => handleSwipe('like'));
document.getElementById('swipe-left').addEventListener('click', () => handleSwipe('dislike'));

// Initialize
fetchProfiles();