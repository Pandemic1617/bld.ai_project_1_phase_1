const env = import("./env.js");

const COURSES_PER_COLLECTION = 4;

const courses = env.then(({ COURSES_DATA_URL }) => fetch(COURSES_DATA_URL).then((v) => v.json()));

const carouselInner = document.querySelector("#carousel-inner");
const searchForm = document.querySelector("#search-form");
const searchFormInput = document.querySelector("#search-form-input");

let currentIndex = 0;

const getSearchValue = () => searchFormInput.value;

const courseToElement = (item) => {
    const img = document.createElement("img");
    img.src = item.image;

    const title = document.createElement("h3");
    title.innerText = item.title;
    title.className = "course-title";

    const subtitle = document.createElement("h5");
    subtitle.innerText = item.author;
    subtitle.className = "course-subtitle";

    const div = document.createElement("div");
    div.className = "course";
    div.appendChild(img);
    div.appendChild(title);
    div.appendChild(subtitle);
    return div;
};

const setItems = (items) => {
    const newChildren = items
        .map(courseToElement)
        .reduce(
            (prev, c) => {
                if (prev[prev.length - 1].length < COURSES_PER_COLLECTION) prev[prev.length - 1].push(c);
                else prev.push([c]);
                return prev;
            },
            [[]]
        )
        .map((collection, i) => {
            const item = document.createElement("div");
            item.className = "item";
            if (i == 0) item.className += " active";
            const container = document.createElement("div");
            container.className = "item-cont";

            collection.forEach((v) => container.appendChild(v));
            item.appendChild(container);
            return item;
        });

    carouselInner.replaceChildren(...newChildren);
};

setItems([]);

const update = () => {
    courses.then((courses) => {
        const course = courses[currentIndex];

        const search = getSearchValue();
        setItems(course.courses.filter((item) => item.title.includes(search) || item.author.includes(search)));

        document.querySelector("#courses-option-title").children[0].textContent = course.sectionTitle;
        document.querySelector("#courses-option-subtitle").children[1].textContent = course.courseDesc;
        document.querySelector("#courses-option-button").textContent = "Explore " + course.courseName;
    });
};

courses.then((v) => {
    const categories = document.querySelector("#categories");
    v.forEach((course, idx) => {
        const v = document.createElement("span");
        v.textContent = course.courseName;

        if (idx === 0) v.className = "selected-category";
        v.addEventListener("click", () => {
            currentIndex = idx;
            for (let i = 0; i < categories.children.length; i++) categories.children[i].className = idx === i ? "selected-category" : "";
            update();
        });
        categories.appendChild(v);
    });

    update();
});

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    update();
});

$(".carousel").carousel({
    interval: 10000,
});
