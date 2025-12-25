document.getElementById("search").addEventListener("keyup", function() {
  let filter = this.value.toLowerCase();
  let cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    let text = card.innerText.toLowerCase();
    if (text.includes(filter)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});

const search = document.getElementById('search');
const search_button = document.getElementById('search_button');
let button_clicked_checker = 0;

search_button.addEventListener('click', function() {
  // Check the current computed style of the search input
  const currentSearchDisplay = window.getComputedStyle(search).display;

  if (button_clicked_checker === 0) {
    search_button.style.backgroundColor = 'darkGrey';

    // If the input is currently hidden (e.g., by the media query), force it to display
    if (currentSearchDisplay === 'none') {
      search.style.display = 'block'; // Or 'flex', 'inline-block' as needed
      // You might need to adjust position and z-index specifically for small screens here
      search.style.position = 'absolute'; // Or 'fixed' if you want it to stay in view
      search.style.top = '100%'; // Adjust as needed
      search.style.left = '0';
      search.style.zIndex = '10';
      search.style.width = '100%';
      search.style.animationName = 'search';
      search.style.animationTimingFunction = 'ease-in';
      search.style.animationDuration = '0.7s';
    } else {
      // If it's already visible (e.g., on larger screens), apply the styles for when it's opened
      search.style.border = '3px solid lightBlue';
      search.style.boxShadow = '0 3px 10px grey';
      search.style.display = 'block'; // Ensure it's block
      search.style.position = 'fixed'; // Or adjust based on your header layout
      search.style.top = '100%';
      search.style.left = '0';
      search.style.zIndex = '10';
      search.style.width = '100%';
      search.style.animationName = 'search';
      search.style.animationTimingFunction = 'ease-in';
      search.style.animationDuration = '0.7s';
    }

    button_clicked_checker = 1;
  } else {
    search_button.style.backgroundColor = 'rgb(241, 239, 239)';
    search.style.display = 'none'; // Hide it when closing
    button_clicked_checker = 0;
  }
});

const card = document.getElementsByClassName('card');

function random_color() {
  return Math.floor(Math.random() * 256); // 0-255 ჩათვლით
}

for (let i = 0; i < card.length; i++) {
  const color1 = `rgba(${random_color()}, ${random_color()}, ${random_color()}, 0.5)`;
  const color2 = `rgba(${random_color()}, ${random_color()}, ${random_color()}, 0.5)`;

  card[i].style.background = `linear-gradient(-155deg, ${color1}, ${color2})`;
}

b_fortnite_battleroyal.addEventListener('click', () => {
    localStorage.setItem("tournamentData", JSON.stringify({
        img: './დდდ.jpg',
        sub_img: './დდდ.jpg',
        title: 'Fortnite',
        sub_title: 'Battle Royal',
        date: '31st Jul - 1st Aug 2021',
        entry_fee: 'Entry fee: 10',
        time: '07:00 PM (UTC)',
        place1: 300,
        place2: 100,
        place3: 50
    }));

    window.location.href = "card_info.html"; // გადახტეს მეორე გვერდზე
});