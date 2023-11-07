let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


const toyUrl = 'http://localhost:3000/toys';
const toyCollection = document.getElementById('toy-collection');
const submitToy = document.querySelector('.submit')


function renderCard(toys) {
  const toyCard = document.createElement('div');
  toyCard.className = "card";
  toyCard.id = `toy-${toys.id}`;
  const h2 = document.createElement('h2');
  h2.textContent = toys.name;
  const img = document.createElement('img');
  img.src = toys.image;
  img.alt = toys.name;
  img.className = "toy-avatar"
  const p = document.createElement('p');
  p.textContent = `${toys.likes} Likes`;
  const btn = document.createElement('button');
  btn.textContent = "Like ❤️"
  btn.className = "like-btn"
  btn.id = toys.id
  btn.addEventListener('click', (e) => {
    fetch(`${toyUrl}/${toys.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body : JSON.stringify({likes: ++toys.likes})
    })
    .then(resp => resp.json())
    .then(updateCard => {
      e.target.parentElement.querySelector('p').textContent = `${updateCard.likes} Likes`
    })
    .catch(err => alert(err))
  })
  toyCard.append(h2, img, p, btn);
  toyCollection.append(toyCard)
}

  fetch(toyUrl)
  .then(resp => resp.json())
  .then(toyArr => {
    toyArr.forEach(toyData => renderCard(toyData))
  }) 
  .catch(err => alert(err))

  const addToyForm = document.querySelector('.add-toy-form')

  addToyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;
    if (name.trim() && image.trim()) {
      fetch(toyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name, image, likes:0})
      })
      .then(resp => resp.json())
      .then(createToy => renderCard(createToy))
      .catch(err => alert(err))
      e.target.reset();
    } else {
      alert("Please fill the full form")
    }
  })
