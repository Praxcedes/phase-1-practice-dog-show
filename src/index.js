document.addEventListener('DOMContentLoaded', () => {
  const DOGS_URL = 'http://localhost:3000/dogs';
  const tableBody = document.getElementById('table-body');
  const dogForm = document.getElementById('dog-form');

  let editingDogId = null;

  // Fetch and render all dogs
  function fetchDogs() {
    fetch(DOGS_URL)
      .then(resp => resp.json())
      .then(dogs => {
        tableBody.innerHTML = ''; // Clear previous rows
        dogs.forEach(renderDogRow);
      });
  }

  // Render a single dog row
  function renderDogRow(dog) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${dog.name}</td>
      <td>${dog.breed}</td>
      <td>${dog.sex}</td>
      <td><button data-id="${dog.id}">Edit</button></td>
    `;
    tableBody.appendChild(tr);
  }

  // Handle Edit button click
  tableBody.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const dogId = e.target.dataset.id;
      fetch(`${DOGS_URL}/${dogId}`)
        .then(resp => resp.json())
        .then(dog => {
          dogForm.name.value = dog.name;
          dogForm.breed.value = dog.breed;
          dogForm.sex.value = dog.sex;
          editingDogId = dog.id;
        });
    }
  });

  // Handle form submit
  dogForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updatedDog = {
      name: dogForm.name.value,
      breed: dogForm.breed.value,
      sex: dogForm.sex.value
    };

    fetch(`${DOGS_URL}/${editingDogId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedDog)
    })
    .then(resp => resp.json())
    .then(() => {
      fetchDogs(); // Refresh the table
      dogForm.reset(); // Clear the form
    });
  });

  fetchDogs();
});
