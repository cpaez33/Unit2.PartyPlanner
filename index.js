// == Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2504-FTB-ET-WEB-FT";
const RESOURCE = "/events";
const resourceRSVPS = "/rsvps";
const resourceGuests = "/guests";
const API = BASE + COHORT + RESOURCE;
const APIguests = BASE + COHORT + resourceGuests;
const APIrsvps = BASE + COHORT + resourceRSVPS;

// === State ===
let parties = [];
let selectedParty;
let guests = [];
let RSVPS = [];

async function getParties() {
  try {
    const res = await fetch(API);
    const json = await res.json();
    parties = json.data;
    // console.log(parties);
  } catch (error) {
    console.error(error);
  }
}

async function getParty(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    const json = await res.json();
    selectedParty = json.data;
    // console.log(selectedParty);
    render();
  } catch (error) {
    console.error(error);
  }
}

async function getGuests() {
  try {
    const res = await fetch(APIguests);
    const json = await res.json();
    guests = json.data;
    // console.log(guests);
  } catch (error) {
    console.error(error);
  }
}

async function getRSVPs() {
  try {
    const res = await fetch(APIrsvps);
    const json = await res.json();
    RSVPS = json.data;
    render();
    // console.log(RSVPS);
  } catch (error) {
    console.error(error);
  }
}

function getRsvpGuestsForSelectedParty() {
  if (!selectedParty) return [];

  const matchingRSVPS = RSVPS.filter(
    (rsvp) => rsvp.eventId === selectedParty.id
  );
  const guestsWhoRsvped = matchingRSVPS.map((rsvp) => {
    const guest = guests.find((guest) => guest.id === rsvp.guestId);
    return guest;
  });
  return guestsWhoRsvped;
}

// === Components ===
function PartyListItem(party) {
  const $li = document.createElement("li");
  $li.innerHTML = `
        <a href="#selected">${party.name}</a>
    `;
  $li.addEventListener("click", (e) => getParty(party.id));
  //   console.log($li);
  return $li;
}

function PartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("partylist");

  const $parties = parties.map(PartyListItem);
  $ul.replaceChildren(...$parties);
  return $ul;
}

function GuestListItem(guest) {
  const $li = document.createElement("li");
  $li.innerHTML = `
        <a href="#selected">${guest.name}</a>
    `;
  return $li;
}

function GuestList() {
  const $ul = document.createElement("ul");
  const guestsToShow = getRsvpGuestsForSelectedParty();
  // const test = guestsToShow.map((guest) => GuestListItem(guest));

  $ul.replaceChildren(...guestsToShow.map((guest) => GuestListItem(guest)));
  return $ul;
}

function PartyDetails() {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }

  const $party = document.createElement("section");
  $party.classList.add("party");
  $party.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>
    <div>
        <p>${selectedParty.date}</p>
        <p>${selectedParty.location}</p>
    </div>
    <p>${selectedParty.description}</p>
  `;
  return $party;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
      <h1>Party Planner</h1>
      <main>
        <section class="main-sections">
          <h2>Upcoming Parties</h2>
          <PartyList></PartyList>
        </section>
        <section class="main-sections">
          <h2>Party Details</h2>
          <PartyDetails></PartyDetails>
          <GuestList></GuestList>
        </section>
      </main>
    `;
  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("PartyDetails").replaceWith(PartyDetails());
  $app.querySelector("GuestList").replaceWith(GuestList());
}

async function init() {
  await getParties();
  await getGuests();
  await getRSVPs();

  render();
}

init();
