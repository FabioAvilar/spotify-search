// helpful to use instead of a missing image
const DEFAULT_THUMBNAIL = "https://via.placeholder.com/150x150";
const api_spotify = "https://spicedify.herokuapp.com/spotify";

// form selectors
const $form = document.querySelector("form");
const $queryField = $form.querySelector(".query-field");
const $typeField = $form.querySelector(".type-field");

// result selectors
const $results = document.querySelector(".results");
const $resultTitle = $results.querySelector(".result-title");
const $resultList = $results.querySelector(".result-list");
// const $moreButton = $results.querySelector(".load-more-button");

// state variable
let nextUrl;

// scroll infinite
const SCROLL_THRESHOLD = 100;
const SCROLL_TIMEOUT = 500;

// $moreButton.addEventListener("click", () => {
//     console.log("click on more button", nextUrl);

//     getSpotifyData(nextUrl);
// });

$form.addEventListener("submit", (event) => {
    // preventDefault evita que a pagina se recarrega e entao eu vejo a tela com os dados
    event.preventDefault();
    const query = $queryField.value;
    const type = $typeField.value;
    // get data from spotify here

    //  call the function spotify data with url
    $resultList.innerHTML = "";
    $resultTitle.innerHTML = "";

    getSpotifyData(api_spotify + "?query=" + query + "&type=" + type);

    // here i'm make h2
    const title = `Your search for ${query} is from the ${type} category`;
    $resultTitle.innerHTML += title;

    // I wanted to see in the LOG if the names that are in the API appeared
    // console.log(event);

    scrollScreen();
});

function imgArtist(item) {
    let img;
    // console.log('item images:', item.images);

    if (item.images.length) {
        img = item.images[0].url;
    } else {
        img = DEFAULT_THUMBNAIL;
    }
    return img;
}

function renderItems(items) {
    // render the items on
    console.log("renderItems", items);

    items.forEach((item) => {
        const img = imgArtist(item);
        // console.log(img);
        const showPics = `
            <li class='result'>
                <img src="${img}">
                <a target='_blank' href='${item.external_urls.spotify}'>
                    ${item.name}
                </a>
            </li>`;

        $resultList.innerHTML += showPics;
    });
}

function getSpotifyData(url) {
    $.get(url, (data) => {
        // console.log("data information", data);
        let showDataOrArtist;
        // decide if you are interested in data.artists or data.albums
        console.log('teste do API', data.artists);
        if (data.artists) {
            showDataOrArtist = data.artists.items;
            nextUrl = data.artists.next;
        } else {
            showDataOrArtist = data.albums.items;
            nextUrl = data.albums.next;
        }
        // call renderItems with the right value
        // $moreButton.classList.add("visible");
        renderItems(showDataOrArtist);
    });
}

// Function ScrollScreen()

function scrollScreen() {
    const scrollTop = document.documentElement.scrollTop;
    const winHeight = window.innerHeight;
    const docHeight = document.body.scrollHeight;

    const hasScrolledToBottom =
        scrollTop >= docHeight - winHeight - SCROLL_THRESHOLD;

    // console.log({
    //     scrollTop,
    //     leftToScroll: docHeight - winHeight - SCROLL_THRESHOLD,
    //     hasScrolledToBottom,
    // });

    if (hasScrolledToBottom && nextUrl) {
        getSpotifyData(nextUrl);
    }
    setTimeout(scrollScreen, SCROLL_TIMEOUT);
    

    // if ($resultList.querySelectorAll("li").length < MAX_ITEMS) {
    //     setTimeout(scrollScreen, SCROLL_TIMEOUT);
    // }
}
