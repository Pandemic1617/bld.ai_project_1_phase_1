const courseView = document.querySelector("#course-view");

const courses = fetch("https://mocki.io/v1/edaa4897-5506-4a5d-8657-29be2470ae73")
    .then((v) => v.json())
    .then((v) => v.courses);

const searchForm = document.querySelector("#search-form");

const setItems = (items) => {
    while (courseView.firstChild) {
        courseView.removeChild(courseView.firstChild);
    }
    items.forEach((item) => {
        const img = document.createElement("img");
        img.src = item.img;

        const title = document.createElement("h3");
        title.innerText = item.title;
        title.className = "course-title";

        const subtitle = document.createElement("h5");
        subtitle.innerText = item.subtitle;
        subtitle.className = "course-subtitle";

        const div = document.createElement("div");
        div.className = "course";
        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(subtitle);
        courseView.appendChild(div);
    });
};

setItems([]);
// courses.then((v) => console.log("v", v));
courses.then((v) => setItems(v));

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const search = e.target[1].value;

    const filtered = courses.then((v) => v.filter((item) => item.title.includes(search) || item.subtitle.includes(search)));
    filtered.then((v) => setItems(v));
});
