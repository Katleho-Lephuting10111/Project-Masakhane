const profiles = [
    {
      name: 'Thabo Mafang',
      type: 'Farmer',
      location: 'Freestate, SA',
      experience: '3 years',
      pitch: 'I run a 3000 beef herd. I require R200k to improve our feeding facilities, in exchange for 5% stake in my company',
      img: 'https://cdn.24.co.za/files/Cms/General/d/8091/49b0bacacb834f6091080394f4adb931.jpg'
    },
    {
        name: 'Grace Musonda',
        type: 'Farmer',
        location: 'Chingola, Zambia',
        experience: '4 years',
        pitch: 'I run an Aquaculture farm where we sell 500 Catfish per week. I require an upwards of ZMW400k to expand our ponds, in exchange for a 25% stake in my business',
        img: 'https://aqua-spark.nl/app/uploads/2022/05/293-scaled-1.jpg'
      },
      {
        name: 'Kerwin de Saal',
        type: 'Investor',
        location: 'Mpumalanga, SA',
        experience: '5 years experience investing Livestock startups',
        pitch: 'Looking to invest in growing Dairy and Piggery farms',
        img: 'https://www.shutterstock.com/image-photo/middle-aged-handsome-man-standing-600nw-2260153771.jpg'
      },
      {
        name: 'Bontle Sefako',
        type: 'Investor',
        location: 'Gauteng, SA',
        experience: '12 years experience investing in Sustainable Agriculture and Green Energy',
        pitch: 'Looking to invest in a small-scale farm that specialises in a niche industry like rabbit farming and snail farming',
        img: 'https://img.freepik.com/free-photo/businesswoman-executive-professional-success-concept_53876-137644.jpg'
      },
      {
        name: 'Amanda Mafunda',
        type: 'Farmer',
        location: 'Eastern Cape, SA',
        experience: '5 years',
        pitch: 'I grow sustainable, organic vegetables with a passion for climate-smart agriculture. Looking for R500k to access more land and expand our operation, for a 15% stake in my company',
        img: 'https://media.istockphoto.com/id/1409903972/photo/african-woman-agriculture-farmer-examining-corn-plant-in-field-agricultural-activity-at.jpg?s=612x612&w=0&k=20&c=gyEhwye2NxBwmcp7Tul0oBQ4knchydqF5fcR_UwqppQ='
      },
    {
      name: 'Samuel Kilel',
      type: 'Investor',
      location: 'Nairobi County, Kenya',
      experience: '10 years investing in Agri-tech',
      pitch: 'Seeking to fund scalable, green agricultural ventures across Africa.',
      img: 'https://media.istockphoto.com/id/1296271163/photo/confident-businessman-with-arms-crossed.jpg?s=612x612&w=0&k=20&c=StyHxyC8uUIVVV4UFHb141gIahiNr0fKurV-fiNb2oU='
    }
  ];
  
  let currentIndex = 0;
  
  function showProfile() {
    const profile = profiles[currentIndex];
    const profileCard = document.getElementById('profile-card');
    profileCard.innerHTML = `
      <img src="${profile.img}" alt="${profile.name}">
      <h2>${profile.name}</h2>
      <p><strong>Role:</strong> ${profile.type}</p>
      <p><strong>Location:</strong> ${profile.location}</p>
      <p><strong>Experience:</strong> ${profile.experience}</p>
      <p><strong>Pitch:</strong> ${profile.pitch}</p>
    `;
  }
  
  document.getElementById('swipe-right').addEventListener('click', () => {
    const matchedProfile = profiles[currentIndex];
    alert(`🎉 You've matched with ${matchedProfile.name}!\nThey will be notified of your interest.`);
    currentIndex = (currentIndex + 1) % profiles.length;
    showProfile();
});
  
  document.getElementById('swipe-left').addEventListener('click', () => {
    currentIndex = (currentIndex + profiles.length - 1) % profiles.length;
    showProfile();
  });
  
  showProfile();