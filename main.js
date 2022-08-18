const courses = fetch("https://mocki.io/v1/59cfdf43-964f-42a5-88a3-a41175fc53f1").then((v) => v.json());

let currentIndex = 0;

const carouselInner = document.querySelector("#carousel-inner");

const searchForm = document.querySelector("#search-form");
const getSearchValue = () => searchForm.childNodes[3].value;

const setItems = (items) => {
    while (carouselInner.firstChild) {
        carouselInner.removeChild(carouselInner.firstChild);
    }
    items
        .map((item) => {
            const img = document.createElement("img");
            img.src = item.img;

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
        })
        .reduce(
            (prev, c) => {
                if (prev[prev.length - 1].length < 4) prev[prev.length - 1].push(c);
                else prev.push([c]);
                return prev;
            },
            [[]]
        )
        .forEach((collection, i) => {
            const item = document.createElement("div");
            item.className = "item";
            if (i == 0) item.className += " active";
            const container = document.createElement("div");
            container.className = "item-cont";

            collection.forEach((v) => container.appendChild(v));
            item.appendChild(container);
            carouselInner.appendChild(item);
        });
};

setItems([]);

const update = () => {
    courses.then((courses) => {
        const course = courses[currentIndex];

        const search = getSearchValue();
        setItems(course.courses.filter((item) => item.title.includes(search) || item.author.includes(search)));

        const category = document.querySelector("#category");

        category.children[0].textContent = course.sectionTitle;
        category.children[1].textContent = course.courseDesc;
        category.children[2].textContent = "Explore " + course.courseName;
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
